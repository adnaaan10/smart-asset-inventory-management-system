from django.contrib import admin
from .models import Asset,InventoryItem,Assignment,RepairTicket

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "serial_number", "status", "purchase_date","warranty_expiry")
    search_fields = ("name", "serial_number")
    list_filter = ("type", "status")
    ordering = ("name",)


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("name", "quantity", "threshold")
    search_fields = ("name",)
    list_filter = ("name",)
    ordering = ("name",)


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("asset", "user", "date_assigned", "date_returned", "status")
    search_fields = ("asset__name", "user__username")
    list_filter = ("status", "date_assigned")
    ordering = ("-date_assigned",)


@admin.register(RepairTicket)
class RepairTicketAdmin(admin.ModelAdmin):
    list_display = ("asset","reported_by", "status", "assigned_technician", "created_at", "updated_at")
    search_fields = ("asset__name", "assigned_technician__username")
    list_filter = ("status", "created_at")
    ordering = ("-created_at",)
