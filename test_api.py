import requests
import json
from pprint import pprint

# Configuración
BASE_URL = "http://127.0.0.1:8000/api"
HEADERS = {
    "Content-Type": "application/json"
}

class PersonalAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
    
    def test_get_all(self):
        """1. GET - Obtener todos los registros"""
        print("\n" + "="*50)
        print("1. TESTING GET - Obtener todos los registros")
        print("="*50)
        
        response = requests.get(f"{self.base_url}/personal/", headers=self.headers)
        
        print(f"Status Code: {response.status_code}")
        print("Respuesta:")
        pprint(response.json())
        
        return response.status_code == 200
    
    def test_get_detail(self, id):
        """GET - Obtener un registro específico"""
        print(f"\nGET - Detalle del registro {id}")
        response = requests.get(f"{self.base_url}/personal/{id}/", headers=self.headers)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Registro encontrado:")
            pprint(response.json())
        else:
            print("Error:", response.json())
        
        return response
    
    def test_post(self):
        """2. POST - Crear un nuevo registro"""
        print("\n" + "="*50)
        print("2. TESTING POST - Crear nuevo registro")
        print("="*50)
        
        nuevo_personal = {
            "nombres": "María",
            "apellido_paterno": "González",
            "apellido_materno": "López",
            "fecha_nacimiento": "1992-03-20",
            "sexo": "F",
            "curp": "GOML920320MDFLRN09",  # 18 caracteres
            "rfc": "GOML9203201A2",         # 13 caracteres
            "nss": "98765432109",            # 11 caracteres
            "email": "maria.gonzalez@empresa.com",
            "telefono": "5555555557",
            "celular": "5555555558",
            "calle": "Av. Reforma",
            "numero_exterior": "456",
            "numero_interior": "",
            "colonia": "Juárez",
            "ciudad": "Ciudad de México",
            "estado": "CDMX",
            "codigo_postal": "67890",
            "fecha_ingreso": "2024-01-15",
            "puesto": "Gerente de Proyectos",
            "departamento": "Administración",
            "salario": "75000.00",
            "estado_civil": "C",
            "contacto_emergencia_nombre": "Carlos González",
            "contacto_emergencia_telefono": "5555555559",
            "contacto_emergencia_parentesco": "Hermano"
        }
        
        print("📝 Datos a enviar:")
        pprint(nuevo_personal)
        
        response = requests.post(
            f"{self.base_url}/personal/",
            headers=self.headers,
            data=json.dumps(nuevo_personal)
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print("Respuesta del servidor:")
        if response.status_code in [200, 201]:
            pprint(response.json())
            return response.json().get('id')
        else:
            pprint(response.json())
            return None
    
    def test_put(self, id):
        """3. PUT - Reemplazo total de un registro"""
        print("\n" + "="*50)
        print(f"3. TESTING PUT - Reemplazo total del registro {id}")
        print("="*50)
        
        # Datos completos actualizados
        datos_completos = {
            "nombres": "María Teresa",
            "apellido_paterno": "González",
            "apellido_materno": "López",
            "fecha_nacimiento": "1992-03-20",
            "sexo": "F",
            "curp": "GOML920320MDFLRN09",
            "rfc": "GOML9203201A2",
            "nss": "98765432109",
            "email": "maria.teresa@empresa.com",  # Cambiado
            "telefono": "5555555560",              # Cambiado
            "celular": "5555555561",                # Cambiado
            "calle": "Av. Reforma",
            "numero_exterior": "456",
            "numero_interior": "A",                  # Cambiado
            "colonia": "Juárez",
            "ciudad": "Ciudad de México",
            "estado": "CDMX",
            "codigo_postal": "67890",
            "fecha_ingreso": "2024-01-15",
            "puesto": "Gerente Senior",              # Cambiado
            "departamento": "Administración",
            "salario": "85000.00",                    # Cambiado
            "estado_civil": "C",
            "contacto_emergencia_nombre": "Carlos González",
            "contacto_emergencia_telefono": "5555555559",
            "contacto_emergencia_parentesco": "Hermano"
        }
        
        print("\n📝 PUT - Reemplaza TODOS los campos del registro")
        print("Si falta algún campo, se establecerá como null o valor por defecto")
        
        response = requests.put(
            f"{self.base_url}/personal/{id}/",
            headers=self.headers,
            data=json.dumps(datos_completos)
        )
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Registro actualizado completamente:")
            pprint(response.json())
        else:
            print("Error:", response.json())
        
        return response
    
    def test_patch(self, id):
        """3. PATCH - Actualización parcial de un registro"""
        print("\n" + "="*50)
        print(f"3. TESTING PATCH - Actualización parcial del registro {id}")
        print("="*50)
        
        # Solo los campos que queremos modificar
        datos_parciales = {
            "telefono": "5555555570",   # Nuevo teléfono
            "salario": "90000.00",       # Nuevo salario
            "puesto": "Director de Proyectos"  # Nuevo puesto
        }
        
        print("\n📝 PATCH - Actualiza SOLO los campos especificados")
        print("Los demás campos permanecen igual")
        
        response = requests.patch(
            f"{self.base_url}/personal/{id}/",
            headers=self.headers,
            data=json.dumps(datos_parciales)
        )
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Registro actualizado parcialmente:")
            pprint(response.json())
            
            # Verificar que solo cambiaron los campos especificados
            print("\n✅ Campos modificados:")
            for campo in datos_parciales:
                print(f"   - {campo}: {datos_parciales[campo]}")
        else:
            print("Error:", response.json())
        
        return response
    
    def test_delete(self, id):
        """4. DELETE - Eliminar un registro"""
        print("\n" + "="*50)
        print(f"4. TESTING DELETE - Eliminar registro {id}")
        print("="*50)
        
        response = requests.delete(
            f"{self.base_url}/personal/{id}/",
            headers=self.headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        # DELETE puede responder con 204 (No Content) o 200 (OK)
        if response.status_code == 204:
            print("✅ Registro eliminado correctamente (204 No Content)")
            # Verificar que ya no existe
            check_response = requests.get(f"{self.base_url}/personal/{id}/", headers=self.headers)
            if check_response.status_code == 404:
                print("✅ Verificación: El registro ya no existe (404 Not Found)")
        elif response.status_code == 200:
            print("✅ Registro eliminado correctamente (200 OK)")
            print("Respuesta:", response.json())
        else:
            print("❌ Error al eliminar:", response.json())
        
        return response
    
    def run_all_tests(self):
        """Ejecutar todas las pruebas en secuencia"""
        print("\n🚀 INICIANDO PRUEBAS DE INTEGRACIÓN API")
        print("="*50)
        
        # 1. GET inicial
        if not self.test_get_all():
            print("❌ Error al obtener datos iniciales")
            return
        
        # 2. POST - Crear registro
        print("\n📝 Creando nuevo registro...")
        nuevo_id = self.test_post()
        if not nuevo_id:
            print("❌ No se pudo crear el registro")
            return
        
        print(f"✅ Registro creado con ID: {nuevo_id}")
        
        # Verificar GET del nuevo registro
        self.test_get_detail(nuevo_id)
        
        # 3. PUT - Actualización total
        self.test_put(nuevo_id)
        
        # 4. PATCH - Actualización parcial
        self.test_patch(nuevo_id)
        
        # Verificar cambios finales
        self.test_get_detail(nuevo_id)
        
        # 5. DELETE - Eliminar registro
        self.test_delete(nuevo_id)
        
        print("\n" + "="*50)
        print("✅ PRUEBAS COMPLETADAS")
        print("="*50)

if __name__ == "__main__":
    # Crear instancia del tester
    tester = PersonalAPITester()
    
    # Ejecutar todas las pruebas
    tester.run_all_tests()