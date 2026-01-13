from django.db import models


class Product(models.Model):
    sku = models.CharField(max_length=60, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    # Automatically set on creation
    created_at = models.DateTimeField(auto_now_add=True)
    # Automatically updated on every save
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["price", "name"]

    def __str__(self):
        return f"{self.sku} - {self.name}"
