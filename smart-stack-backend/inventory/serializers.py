from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Store, Product, Stock, Transaction

User = get_user_model()

# =========================
# JWT LOGIN (Email as Username)
# =========================
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()

from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()




from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise AuthenticationFailed("Email and password are required")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid credentials")

        user = authenticate(username=user.username, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials")

        # ✅ MANUAL TOKEN CREATION (this is the fix)
        refresh = RefreshToken.for_user(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        if hasattr(user, "role"):
            data["role"] = user.role

        return data

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"

# =========================
# PRODUCT
# =========================
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

# =========================
# STOCK
# =========================
class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    sku = serializers.CharField(source="product.sku", read_only=True)
    store_name = serializers.CharField(source="store.name", read_only=True)

    class Meta:
        model = Stock
        fields = [
            "id",
            "store",
            "store_name",
            "product",
            "product_name",
            "sku",
            "quantity",
            "last_updated",
        ]

# =========================
# TRANSACTION
# =========================
class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    store_name = serializers.CharField(source="store.name", read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"

# =========================
# REORDER SUGGESTION (ML OUTPUT)
# =========================
class ReorderSuggestionSerializer(serializers.Serializer):
    sku = serializers.CharField()
    predicted_daily_demand = serializers.FloatField()
    current_stock = serializers.IntegerField()
    recommended_reorder_qty = serializers.IntegerField()

    def validate(self, data):
        if data["predicted_daily_demand"] < 0:
            raise serializers.ValidationError("Predicted demand cannot be negative")
        if data["current_stock"] < 0:
            raise serializers.ValidationError("Current stock cannot be negative")
        if data["recommended_reorder_qty"] < 0:
            raise serializers.ValidationError("Reorder quantity cannot be negative")
        return data
