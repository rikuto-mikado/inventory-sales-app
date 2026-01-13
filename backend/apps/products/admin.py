from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("sku", "name", "price", "is_active", "updated_at")
    search_fields = ("sku", "name")
    list_filter = ("is_active",)
    ordering = ("name",)
