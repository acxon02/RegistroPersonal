# apps/personal/serializers.py
from rest_framework import serializers
from .models import Personal

class PersonalSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Personal
        fields = '__all__'
    
    def validate_curp(self, value):
        # Validación básica de CURP (18 caracteres)
        if len(value) != 18:
            raise serializers.ValidationError("El CURP debe tener 18 caracteres")
        return value.upper()
    
    def validate_rfc(self, value):
        # Validación básica de RFC (12 o 13 caracteres)
        if len(value) not in [12, 13]:
            raise serializers.ValidationError("El RFC debe tener 12 o 13 caracteres")
        return value.upper()
    
    def validate_nss(self, value):
        # Validación básica de NSS (11 caracteres)
        if len(value) != 11:
            raise serializers.ValidationError("El NSS debe tener 11 caracteres")
        if not value.isdigit():
            raise serializers.ValidationError("El NSS debe contener solo números")
        return value