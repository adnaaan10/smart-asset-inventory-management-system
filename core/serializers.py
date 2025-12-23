from rest_framework import serializers
from .models import Asset
from .models import InventoryItem
from .models import Assignment
from .models import RepairTicket



class AssetSerializer(serializers.ModelSerializer):
    purchase_date = serializers.DateField(required=False, allow_null=True)
    warranty_expiry = serializers.DateField(required=False, allow_null=True)
    class Meta:
        model = Asset
        fields = "__all__"


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = "__all__"


class AssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.ReadOnlyField(source="asset.name")
    user_username  = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Assignment
        fields = [
            "id",
            "asset",
            "asset_name",
            "user",
            "user_username",
            "date_assigned",
            "date_returned",
            "status",
        ]
        read_only_fields = [
            "date_assigned",
            "date_returned",
            "status",
        ]


class RepairTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.ReadOnlyField(source="asset.name")
    reported_by_username = serializers.ReadOnlyField(source="reported_by.username")
    technician_username = serializers.ReadOnlyField(
        source="assigned_technician.username"
    )

    class Meta:
        model = RepairTicket
        fields = [
            "id",
            "asset",
            "asset_name",
            "reported_by",
            "reported_by_username",
            "issue_description",
            "status",
            "assigned_technician",
            "technician_username",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "reported_by",
            "status",
            "created_at",
            "updated_at",
        ]

    
class RepairTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.ReadOnlyField(source="asset.name")
    reported_by_username = serializers.ReadOnlyField(source="reported_by.username")
    technician_username = serializers.ReadOnlyField(
        source="assigned_technician.username"
    )

    class Meta:
        model = RepairTicket
        fields = [
            "id",
            "asset",
            "asset_name",
            "reported_by",
            "reported_by_username",
            "issue_description",
            "status",
            "assigned_technician",
            "technician_username",
            "created_at",
            "assigned_at",
            "updated_at",
            "resolved_at",
        ]

        read_only_fields = [
            "reported_by",
            "status",
            "created_at",
            "updated_at",
            "assigned_at",
            "resolved_at",
        ]

    def validate(self, data):
        asset = data.get("asset")

        # Block if ANY active ticket exists for this asset
        exists = RepairTicket.objects.filter(
            asset=asset,
            status__in=["OPEN", "IN_PROGRESS"]
        ).exists()

        if exists:
            raise serializers.ValidationError(
                "This asset already has an active repair ticket."
            )

        return data
    
class TechnicianTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.ReadOnlyField(source="asset.name")

    class Meta:
        model = RepairTicket
        fields = [
            "id",
            "asset_name",
            "issue_description",
            "status",
            "assigned_at",
        ]
