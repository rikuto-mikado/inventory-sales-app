from django.shortcuts import render
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer


# ViewSet for Product CRUD operations - provides list, create, retrieve, update, delete endpoints
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
