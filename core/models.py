from django.db import models
from django.db.models import Q
from django.utils import timezone



class Asset(models.Model):
    ASSET_TYPES = (
        ("LAPTOP", "Laptop"),
        ("MONITOR", "Monitor"),
        ("KEYBOARD", "Keyboard"),
        ("MOUSE", "Mouse"),
        ("OTHER", "Other"),
    )

    STATUS_CHOICES = (
        ("AVAILABLE","Available"),
        ("ASSIGNED","Assigned"),
        ("UNDER_REPAIR","Under Repair"),
        ("RETIRED","Retired"),
    )
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50,choices=ASSET_TYPES)
    serial_number = models.CharField(max_length=200,unique=True)
    status = models.CharField(max_length=50,choices=STATUS_CHOICES,default="AVAILABLE")
    purchase_date = models.DateField(null=True,blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"
    


class InventoryItem(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=0)
    threshold = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.name} - {self.quantity} in stock"




class Assignment(models.Model):
    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("RETURNED", "Returned"),
    )

    asset = models.ForeignKey(
        "Asset",
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    date_assigned = models.DateTimeField(auto_now_add=True)
    date_returned = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    def save(self, *args, **kwargs):
        old_status = None
        if self.pk:
            old_status = Assignment.objects.get(pk=self.pk).status

        #  set date_returned BEFORE save
        if old_status != "RETURNED" and self.status == "RETURNED":
            self.date_returned = timezone.now()

        super().save(*args, **kwargs)

        #  sync asset AFTER save
        if self.status == "ACTIVE":
            if self.asset.status != "ASSIGNED":
                self.asset.status = "ASSIGNED"
                self.asset.save(update_fields=["status"])

        elif self.status == "RETURNED":
            self.asset.status = "AVAILABLE"
            self.asset.save(update_fields=["status"])

    def __str__(self):
        return f"{self.asset.name} → {self.user.username}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["asset"],
                condition=models.Q(status="ACTIVE"),
                name="unique_active_assignment_per_asset"
            )
        ]

    



class RepairTicket(models.Model):
    STATUS_CHOICES = (
        ("OPEN", "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
    )

    ACTIVE_STATUSES = ["OPEN", "IN_PROGRESS"]

    asset = models.ForeignKey("Asset", on_delete=models.CASCADE)
    reported_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="reported_tickets"
    )
    issue_description = models.TextField()
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="OPEN"
    )
    assigned_technician = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_tickets"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        old_status = None
        if self.pk:
            old_status = RepairTicket.objects.get(pk=self.pk).status

        #  set resolved_at BEFORE saving
        if old_status != "RESOLVED" and self.status == "RESOLVED":
            self.resolved_at = timezone.now()

        super().save(*args, **kwargs)

        #  sync asset AFTER save
        if self.status in ["OPEN", "IN_PROGRESS"]:
            self.asset.status = "UNDER_REPAIR"
            self.asset.save(update_fields=["status"])
        elif self.status == "RESOLVED":
            self.asset.status = "AVAILABLE"
            self.asset.save(update_fields=["status"])

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["asset"],
                condition=Q(status__in=["OPEN", "IN_PROGRESS"]),
                name="one_active_ticket_per_asset"
            )
        ]

    def __str__(self):
        return f"Ticket for {self.asset.name} - {self.status}"