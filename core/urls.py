from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet,
    InventoryItemViewSet,
    AssignmentViewSet,
    RepairTicketViewSet,
    TechnicianDashboardView,
    AdminDashboardView,
    EmployeeDashboardView,
    MyAssetsView
)


router = DefaultRouter()
router.register(r'assets', AssetViewSet, basename='assets')
router.register(r'inventory', InventoryItemViewSet, basename='inventory')
router.register(r'assignments', AssignmentViewSet, basename='assignments')
router.register(r'tickets', RepairTicketViewSet, basename='tickets')

urlpatterns = [
    path('',include(router.urls)),
    path('technician-dashboard/',TechnicianDashboardView.as_view(),name='technician-dashboard'),
    path('admin-dashboard/',AdminDashboardView.as_view(),name='admin-dashboard'),
    path('employee-dashboard/',EmployeeDashboardView.as_view(),name='employee-dashboard'),
    path('my-assets/',MyAssetsView.as_view(),name='my-assets'),
]