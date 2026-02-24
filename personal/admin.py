# apps/personal/admin.py
from django.contrib import admin
from .models import Personal

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'curp', 'rfc', 'puesto', 'departamento', 'activo')
    list_filter = ('activo', 'departamento', 'puesto', 'sexo')
    search_fields = ('nombres', 'apellido_paterno', 'apellido_materno', 'curp', 'rfc')
    ordering = ('apellido_paterno', 'apellido_materno', 'nombres')
    
    fieldsets = (
        ('Datos Personales', {
            'fields': ('nombres', 'apellido_paterno', 'apellido_materno', 
                      'fecha_nacimiento', 'sexo', 'estado_civil')
        }),
        ('Documentos', {
            'fields': ('curp', 'rfc', 'nss')
        }),
        ('Contacto', {
            'fields': ('email', 'telefono', 'celular')
        }),
        ('Dirección', {
            'fields': ('calle', 'numero_exterior', 'numero_interior', 
                      'colonia', 'ciudad', 'estado', 'codigo_postal')
        }),
        ('Datos Laborales', {
            'fields': ('fecha_ingreso', 'puesto', 'departamento', 'salario')
        }),
        ('Contacto de Emergencia', {
            'fields': ('contacto_emergencia_nombre', 'contacto_emergencia_telefono', 
                      'contacto_emergencia_parentesco')
        }),
        ('Estado', {
            'fields': ('activo',)
        }),
    )