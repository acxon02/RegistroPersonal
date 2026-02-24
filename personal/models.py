# apps/personal/models.py
from django.db import models

class Personal(models.Model):
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    ESTADO_CIVIL_CHOICES = [
        ('S', 'Soltero'),
        ('C', 'Casado'),
        ('D', 'Divorciado'),
        ('V', 'Viudo'),
        ('UL', 'Unión Libre'),
    ]
    
    # Datos personales
    nombres = models.CharField(max_length=100, verbose_name="Nombres")
    apellido_paterno = models.CharField(max_length=50, verbose_name="Apellido Paterno")
    apellido_materno = models.CharField(max_length=50, verbose_name="Apellido Materno", blank=True)
    fecha_nacimiento = models.DateField(verbose_name="Fecha de Nacimiento")
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, verbose_name="Sexo")
    curp = models.CharField(max_length=18, unique=True, verbose_name="CURP")
    rfc = models.CharField(max_length=13, unique=True, verbose_name="RFC")
    nss = models.CharField(max_length=11, unique=True, verbose_name="NSS")
    
    # Contacto
    email = models.EmailField(unique=True, verbose_name="Correo Electrónico")
    telefono = models.CharField(max_length=15, verbose_name="Teléfono")
    celular = models.CharField(max_length=15, verbose_name="Celular")
    
    # Dirección
    calle = models.CharField(max_length=100, verbose_name="Calle")
    numero_exterior = models.CharField(max_length=10, verbose_name="Número Exterior")
    numero_interior = models.CharField(max_length=10, blank=True, verbose_name="Número Interior")
    colonia = models.CharField(max_length=100, verbose_name="Colonia")
    ciudad = models.CharField(max_length=100, verbose_name="Ciudad")
    estado = models.CharField(max_length=50, verbose_name="Estado")
    codigo_postal = models.CharField(max_length=5, verbose_name="Código Postal")
    
    # Datos laborales
    fecha_ingreso = models.DateField(verbose_name="Fecha de Ingreso")
    puesto = models.CharField(max_length=100, verbose_name="Puesto")
    departamento = models.CharField(max_length=100, verbose_name="Departamento")
    salario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salario")
    estado_civil = models.CharField(max_length=2, choices=ESTADO_CIVIL_CHOICES, verbose_name="Estado Civil")
    
    # Datos de emergencia
    contacto_emergencia_nombre = models.CharField(max_length=100, verbose_name="Contacto de Emergencia")
    contacto_emergencia_telefono = models.CharField(max_length=15, verbose_name="Teléfono de Emergencia")
    contacto_emergencia_parentesco = models.CharField(max_length=50, verbose_name="Parentesco")
    
    # Metadata
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        verbose_name = "Personal"
        verbose_name_plural = "Personal"
        ordering = ['apellido_paterno', 'apellido_materno', 'nombres']
    
    def __str__(self):
        return f"{self.apellido_paterno} {self.apellido_materno} {self.nombres}".strip()
    
    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellido_paterno} {self.apellido_materno}".strip()