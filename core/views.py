from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter

from django.db.models import Count, F
from django.utils import timezone

from .models import Asset, InventoryItem, Assignment, RepairTicket
from .serializers import (
    AssetSerializer,
    InventoryItemSerializer,
    AssignmentSerializer,
    RepairTicketSerializer,
    TechnicianTicketSerializer,
)
from .permissions import (
    IsAdminOrReadOnly,
    AssignmentPermission,
    RepairTicketPermission,
)

# ==========================
# ASSETS
# ==========================
class AssetViewSet(ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "serial_number"]
    ordering_fields = ["name", "type", "status"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = Asset.objects.all()

        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

# ==========================
# INVENTORY
# ==========================
class InventoryItemViewSet(ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "quantity"]
    ordering = ["name"]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("low_stock") == "true":
            qs = qs.filter(quantity__lt=F("threshold"))
        return qs

    @action(detail=False, methods=["get"], url_path="low-stock")
    def low_stock(self, request):
        items = InventoryItem.objects.filter(quantity__lt=F("threshold"))
        return Response(self.get_serializer(items, many=True).data)


# ==========================
# ASSIGNMENTS
# ==========================
class AssignmentViewSet(ModelViewSet):
    queryset = Assignment.objects.select_related("asset", "user")
    serializer_class = AssignmentSerializer
    permission_classes = [AssignmentPermission]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["asset__name", "user__username"]
    ordering_fields = ["date_assigned", "status", "asset__name", "user__username"]
    ordering = ["-date_assigned"]

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            return self.queryset

        if user.role == "EMPLOYEE":
            return self.queryset.filter(user=user, status="ACTIVE")

        return Assignment.objects.none()

    def perform_create(self, serializer):
        asset = serializer.validated_data["asset"]

        if asset.status != "AVAILABLE":
            raise ValidationError({
                "asset": "Only AVAILABLE assets can be assigned"
            })

        serializer.save()


    @action(detail=True, methods=["post"])
    def return_asset(self, request, pk=None):
        assignment = self.get_object()

        if assignment.status == "RETURNED":
            return Response(
                {"detail": "Asset already returned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.role == "EMPLOYEE" and assignment.user != request.user:
            return Response(
                {"detail": "You cannot return this asset"},
                status=status.HTTP_403_FORBIDDEN
            )

        assignment.status = "RETURNED"
        assignment.save()

        return Response(self.get_serializer(assignment).data)


# ==========================
# REPAIR TICKETS
# ==========================
class RepairTicketViewSet(ModelViewSet):
    queryset = RepairTicket.objects.select_related("asset", "reported_by", "assigned_technician")
    serializer_class = RepairTicketSerializer
    permission_classes = [RepairTicketPermission]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["issue_description", "asset__name"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        show_all = self.request.query_params.get("all") == "true"

        if user.role == "ADMIN":
            qs = self.queryset
            return qs if show_all else qs.filter(status__in=RepairTicket.ACTIVE_STATUSES)

        if user.role == "EMPLOYEE":
            return self.queryset.filter(
                reported_by=user,
                status__in=RepairTicket.ACTIVE_STATUSES
            )

        if user.role == "TECHNICIAN":
            return self.queryset.filter(
                assigned_technician=user,
                status__in=RepairTicket.ACTIVE_STATUSES
            )

        return RepairTicket.objects.none()

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=True, methods=["post"])
    def assign_technician(self, request, pk=None):
        ticket = self.get_object()

        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only admin can assign technician"},
                status=status.HTTP_403_FORBIDDEN
            )

        technician_id = request.data.get("technician")
        if not technician_id:
            return Response(
                {"error": "Technician is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.assigned_technician_id = technician_id
        ticket.status = "IN_PROGRESS"
        ticket.assigned_at = timezone.now()
        ticket.save()

        return Response(self.get_serializer(ticket).data)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        ticket = self.get_object()

        if request.user.role != "TECHNICIAN":
            return Response(
                {"error": "Only technician can update status"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")
        if new_status not in ["IN_PROGRESS", "RESOLVED"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.status = new_status
        ticket.save()

        return Response(self.get_serializer(ticket).data)


# ==========================
# TECHNICIAN DASHBOARD
# ==========================
class TechnicianDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "TECHNICIAN":
            return Response({"error": "Forbidden"}, status=403)

        tickets_qs = RepairTicket.objects.filter(
            assigned_technician=request.user
        ).select_related("asset")

        recent_activity = []

        tickets = RepairTicket.objects.filter(
            assigned_technician=request.user
        ).select_related("asset").order_by("-updated_at")[:5]

        for t in tickets:
            recent_activity.append({
                "asset": t.asset.name,
                "status": t.status,
                "updated_at": t.updated_at,
            })
        
        recent_activity = sorted(
            recent_activity,
            key=lambda x: x["updated_at"],
            reverse=True
        )[:5]

        return Response({
            "counts": {
                "in_progress": tickets_qs.filter(status="IN_PROGRESS").count(),
                "resolved": tickets_qs.filter(status="RESOLVED").count(),
            },
            "active_tickets": TechnicianTicketSerializer(
                tickets_qs.filter(status__in=["IN_PROGRESS"]),
                many=True
            ).data,
            "resolved_tickets": TechnicianTicketSerializer(
                tickets_qs.filter(status="RESOLVED"),
                many=True
            ).data,
            "recent_activity": recent_activity,
        })


# ==========================
# ADMIN DASHBOARD
# ==========================
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "ADMIN":
            return Response({"error": "Forbidden"}, status=403)

        ALL_STATUSES = ["AVAILABLE", "ASSIGNED", "UNDER_REPAIR", "RETIRED"]

        raw_asset_data = Asset.objects.values("status").annotate(count=Count("id"))
        asset_map = {x["status"]: x["count"] for x in raw_asset_data}

        asset_status = [
            {"status": s, "count": asset_map.get(s, 0)}
            for s in ALL_STATUSES
        ]

        recent_activity = []

        # Latest assignments
        assignments = Assignment.objects.select_related("asset", "user") \
            .order_by("-date_assigned")[:5]

        for a in assignments:
            recent_activity.append({
                "message": f"{a.asset.name} assigned to {a.user.username}",
                "time": a.date_assigned,
            })

        # Latest ticket updates
        tickets = RepairTicket.objects.select_related("asset") \
            .order_by("-updated_at")[:5]

        for t in tickets:
            recent_activity.append({
                "message": f"Ticket for {t.asset.name} marked {t.status}",
                "time": t.updated_at,
            })

        # Sort and limit
        recent_activity = sorted(
            recent_activity,
            key=lambda x: x["time"],
            reverse=True
        )[:5]

        return Response({
            "kpis": {
                "total_assets": Asset.objects.count(),
                "total_inventory": InventoryItem.objects.count(),
                "assigned_assets": Assignment.objects.filter(status="ACTIVE").count(),
                "low_stock_items": InventoryItem.objects.filter(quantity__lt=F("threshold")).count(),
                "open_tickets": RepairTicket.objects.filter(
                    status__in=["OPEN", "IN_PROGRESS"]
                ).count(),
            },
            "asset_overview": asset_status,
            "ticket_status": RepairTicket.objects.values("status").annotate(count=Count("id")),
            "recent_activity": recent_activity,
        })


# ==========================
# EMPLOYEE DASHBOARD
# ==========================
class EmployeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "EMPLOYEE":
            return Response({"error": "Forbidden"}, status=403)

        assignments = Assignment.objects.filter(
            user=request.user,
            status="ACTIVE"
        ).select_related("asset")

        recent_activity = []

        # Asset assignments
        assignments = Assignment.objects.filter(
            user=request.user
        ).order_by("-date_assigned")[:5]

        for a in assignments:
            recent_activity.append({
                "message": f"{a.asset.name} assigned to you",
                "time": a.date_assigned
            })

        # Ticket updates
        tickets = RepairTicket.objects.filter(
            reported_by=request.user
        ).order_by("-updated_at")[:5]

        for t in tickets:
            recent_activity.append({
                "message": f"Ticket for {t.asset.name} marked {t.status}",
                "time": t.updated_at
            })
        
        recent_activity = sorted(
            recent_activity,
            key=lambda x: x["time"],
            reverse=True
        )[:5]

        return Response({
            "kpis": {
                "my_assets": assignments.count(),
                "active_tickets": RepairTicket.objects.filter(
                    reported_by=request.user,
                    status__in=["OPEN", "IN_PROGRESS"]
                ).count(),
                "resolved_tickets": RepairTicket.objects.filter(
                    reported_by=request.user,
                    status="RESOLVED"
                ).count(),
            },
            "assets": [
                {"asset_name": a.asset.name, "assigned_at": a.date_assigned}
                for a in assignments
            ],
            "recent_activity": recent_activity,
        })


# ==========================
# MY ASSETS
# ==========================
class MyAssetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "EMPLOYEE":
            return Response([], status=200)

        # Assets assigned to employee
        assigned_assets = Asset.objects.filter(
            assignments__user=request.user,
            assignments__status="ACTIVE"
        )

        # Assets that already have active tickets
        assets_with_active_tickets = RepairTicket.objects.filter(
            status__in=RepairTicket.ACTIVE_STATUSES
        ).values_list("asset_id", flat=True)

        # Exclude them
        assets = assigned_assets.exclude(
            id__in=assets_with_active_tickets
        ).distinct()

        return Response(AssetSerializer(assets, many=True).data)
