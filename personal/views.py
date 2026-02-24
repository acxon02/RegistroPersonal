# apps/personal/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Personal
from .serializers import PersonalSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    """
    ViewSet para realizar operaciones CRUD en el modelo Personal
    """
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener solo personal activo"""
        activos = Personal.objects.filter(activo=True)
        serializer = self.get_serializer(activos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_departamento(self, request):
        """Obtener personal filtrado por departamento"""
        departamento = request.query_params.get('departamento', None)
        if departamento:
            personal = Personal.objects.filter(departamento__icontains=departamento, activo=True)
            serializer = self.get_serializer(personal, many=True)
            return Response(serializer.data)
        return Response({"error": "Se requiere parámetro 'departamento'"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        """Desactivar un registro de personal"""
        personal = self.get_object()
        personal.activo = False
        personal.save()
        return Response({"status": "personal desactivado"})
    
    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        """Activar un registro de personal"""
        personal = self.get_object()
        personal.activo = True
        personal.save()
        return Response({"status": "personal activado"})