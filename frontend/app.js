// Configuración
const API_URL = 'http://127.0.0.1:8000/api/personal/';
console.log('🚀 API URL configurada:', API_URL);
console.log('🌐 Protocolo:', window.location.protocol);
console.log('📡 Hostname:', window.location.hostname);

let personalData = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentEditId = null;
let currentDeleteId = null;
let currentViewId = null;
let confirmCallback = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 DOM cargado completamente');
    console.log('🔍 Buscando elementos del DOM...');
    
    // Verificar que los elementos existen
    const fechaElement = document.getElementById('fechaActual');
    console.log('📅 Elemento fechaActual:', fechaElement ? '✅ Encontrado' : '❌ No encontrado');
    
    const formElement = document.getElementById('personalForm');
    console.log('📝 Elemento personalForm:', formElement ? '✅ Encontrado' : '❌ No encontrado');
    
    const searchElement = document.getElementById('searchInput');
    console.log('🔎 Elemento searchInput:', searchElement ? '✅ Encontrado' : '❌ No encontrado');
    
    const filterStatusElement = document.getElementById('filterStatus');
    console.log('🏷️ Elemento filterStatus:', filterStatusElement ? '✅ Encontrado' : '❌ No encontrado');
    
    const filterDeptoElement = document.getElementById('filterDepartamento');
    console.log('🏢 Elemento filterDepartamento:', filterDeptoElement ? '✅ Encontrado' : '❌ No encontrado');
    
    const tableBodyElement = document.getElementById('personalTableBody');
    console.log('📊 Elemento personalTableBody:', tableBodyElement ? '✅ Encontrado' : '❌ No encontrado');
    
    // Inicializar funciones
    cargarPersonal();
    mostrarFechaActual();
    inicializarEventos();
});

// Mostrar fecha actual
function mostrarFechaActual() {
    console.log('📅 Ejecutando mostrarFechaActual()');
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaElement = document.getElementById('fechaActual');
    
    if (fechaElement) {
        fechaElement.textContent = fecha.toLocaleDateString('es-ES', opciones);
        console.log('✅ Fecha actualizada:', fechaElement.textContent);
    } else {
        console.error('❌ No se encontró el elemento fechaActual');
    }
}

// Inicializar eventos
function inicializarEventos() {
    console.log('🎯 Inicializando eventos...');
    
    // Formulario de registro
    const form = document.getElementById('personalForm');
    if (form) {
        form.addEventListener('submit', guardarPersonal);
        console.log('✅ Evento submit agregado al formulario');
    } else {
        console.error('❌ No se encontró el formulario');
    }
    
    // Filtros
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', buscarPersonal);
        console.log('✅ Evento keyup agregado a búsqueda');
    }
    
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', filtrarPersonal);
        console.log('✅ Evento change agregado a filtro de estado');
    }
    
    const filterDepto = document.getElementById('filterDepartamento');
    if (filterDepto) {
        filterDepto.addEventListener('change', filtrarPersonal);
        console.log('✅ Evento change agregado a filtro de departamento');
    }
}

// Cambiar entre secciones
function mostrarSeccion(seccion) {
    console.log('🔄 Cambiando a sección:', seccion);
    
    // Actualizar clases active en el menú
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (event && event.target) {
        event.target.closest('.nav-item').classList.add('active');
    }
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const seccionElement = document.getElementById(seccion);
    if (seccionElement) {
        seccionElement.classList.add('active');
        console.log('✅ Sección activada:', seccion);
    } else {
        console.error('❌ No se encontró la sección:', seccion);
    }
    
    // Actualizar título
    const titulos = {
        'dashboard': 'Dashboard',
        'registro': 'Registrar Personal',
        'lista': 'Lista de Personal',
        'estadisticas': 'Estadísticas'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titulos[seccion];
    }
    
    // Cargar datos según sección
    if (seccion === 'dashboard') {
        cargarDashboard();
    } else if (seccion === 'lista') {
        cargarPersonal();
    } else if (seccion === 'estadisticas') {
        cargarEstadisticas();
    }
}

// Cambiar tabs del formulario
function cambiarTab(tabId) {
    console.log('📑 Cambiando a tab:', tabId);
    
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Mostrar contenido del tab
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        tabElement.classList.add('active');
        console.log('✅ Tab activado:', tabId);
    }
}

// ==================== FUNCIONES CRUD ====================

// Cargar todo el personal
async function cargarPersonal() {
    console.log('📥 Ejecutando cargarPersonal()');
    console.log('🌐 URL de la API:', API_URL);
    
    const tbody = document.getElementById('personalTableBody');
    if (!tbody) {
        console.error('❌ No se encontró el elemento personalTableBody');
        return;
    }
    
    try {
        mostrarLoading(true);
        
        console.log('🔍 Haciendo petición fetch a:', API_URL);
        const response = await fetch(API_URL);
        console.log('📡 Respuesta recibida - Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en respuesta:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos recibidos (tipo):', typeof data);
        console.log('✅ ¿Es array?:', Array.isArray(data));
        console.log('✅ Datos completos:', data);
        
        // VERIFICACIÓN IMPORTANTE: Asegurar que sea un array
        if (data && Array.isArray(data)) {
            personalData = data;
            console.log('✅ Datos asignados correctamente como array');
        } else if (data && data.results) {
            // Si la API usa paginación con "results"
            personalData = data.results;
            console.log('✅ Datos extraídos de results');
        } else if (data && typeof data === 'object') {
            // Si es un objeto pero no array, convertirlo a array
            console.log('⚠️ Los datos son un objeto, convirtiendo a array');
            personalData = [data];
        } else {
            // Si no hay datos o son inválidos
            console.log('⚠️ No hay datos válidos');
            personalData = [];
        }
        
        console.log('📊 Total de registros:', personalData.length);
        
        if (personalData.length > 0) {
            console.log('📋 Primer registro:', personalData[0]);
        } else {
            console.log('⚠️ No hay registros en la base de datos');
        }
        
        // Actualizar tabla
        actualizarTablaPersonal();
        
        // Actualizar filtros de departamento
        actualizarFiltrosDepartamento();
        
        // Actualizar dashboard
        actualizarDashboard();
        
        mostrarToast('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('❌ Error en cargarPersonal:', error);
        mostrarToast(`Error al cargar los datos: ${error.message}`, 'error');
        
        // Mostrar error en la tabla
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px;">
                    <div style="color: #f44336; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 48px;"></i>
                    </div>
                    <p style="color: #f44336; font-weight: 500; margin-bottom: 10px;">Error al cargar los datos</p>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">${error.message}</p>
                    <p style="color: #666; font-size: 12px; margin-bottom: 20px;">URL: ${API_URL}</p>
                    <button onclick="cargarPersonal()" style="padding: 10px 25px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        <i class="fas fa-sync-alt"></i> Reintentar
                    </button>
                </td>
            </tr>
        `;
    } finally {
        mostrarLoading(false);
    }
}

// Guardar nuevo personal
async function guardarPersonal(e) {
    e.preventDefault();
    console.log('💾 Ejecutando guardarPersonal()');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log('📝 Datos del formulario:', data);
    
    // Validar campos requeridos
    if (!validarFormulario(data)) {
        console.log('❌ Validación fallida');
        return;
    }
    
    // Convertir tipos
    data.salario = parseFloat(data.salario);
    data.activo = true;
    
    try {
        console.log('📤 Enviando datos a la API:', data);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('📥 Respuesta recibida - Status:', response.status);
        const result = await response.json();
        console.log('📦 Resultado:', result);
        
        if (response.ok) {
            mostrarToast('✅ Personal registrado exitosamente', 'success');
            limpiarFormulario();
            cargarPersonal();
            cambiarTab('datos-personales');
            
            // Cambiar a la sección de lista después de 1.5 segundos
            setTimeout(() => {
                mostrarSeccion('lista');
            }, 1500);
        } else {
            mostrarErroresValidacion(result);
        }
    } catch (error) {
        console.error('❌ Error en guardarPersonal:', error);
        mostrarToast('Error de conexión con el servidor', 'error');
    }
}

// Actualizar personal (PUT)
async function actualizarPersonal(e) {
    e.preventDefault();
    console.log('✏️ Ejecutando actualizarPersonal() para ID:', currentEditId);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validar campos requeridos
    if (!validarFormulario(data)) return;
    
    // Convertir tipos
    data.salario = parseFloat(data.salario);
    
    try {
        const response = await fetch(`${API_URL}${currentEditId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            mostrarToast('✅ Personal actualizado exitosamente', 'success');
            cerrarModal('editModal');
            cargarPersonal();
        } else {
            const error = await response.json();
            mostrarErroresValidacion(error);
        }
    } catch (error) {
        console.error('❌ Error en actualizarPersonal:', error);
        mostrarToast('Error al actualizar', 'error');
    }
}

// Eliminar personal
async function eliminarPersonal(id) {
    console.log('🗑️ Ejecutando eliminarPersonal() para ID:', id);
    
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'DELETE'
        });
        
        console.log('📥 Respuesta DELETE - Status:', response.status);
        
        if (response.ok) {
            mostrarToast('✅ Personal eliminado correctamente', 'success');
            cargarPersonal();
        } else {
            const error = await response.text();
            console.error('❌ Error en DELETE:', error);
            mostrarToast('Error al eliminar', 'error');
        }
    } catch (error) {
        console.error('❌ Error en eliminarPersonal:', error);
        mostrarToast('Error de conexión', 'error');
    }
}

// Activar/Desactivar personal
async function toggleActivo(id, activo) {
    console.log('🔄 Ejecutando toggleActivo() para ID:', id, 'Activo:', activo);
    
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: activo })
        });
        
        if (response.ok) {
            mostrarToast(`✅ Personal ${activo ? 'activado' : 'desactivado'} correctamente`, 'success');
            cargarPersonal();
        } else {
            const error = await response.json();
            console.error('❌ Error en toggleActivo:', error);
            mostrarToast('Error al cambiar estado', 'error');
        }
    } catch (error) {
        console.error('❌ Error en toggleActivo:', error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ==================== FUNCIONES DE LA TABLA ====================

// Actualizar tabla de personal
function actualizarTablaPersonal() {
    console.log('📊 Ejecutando actualizarTablaPersonal()');
    
    const tbody = document.getElementById('personalTableBody');
    if (!tbody) {
        console.error('❌ No se encontró personalTableBody');
        return;
    }
    
    console.log('📦 Datos a mostrar:', personalData);
    
    if (!personalData || personalData.length === 0) {
        console.log('⚠️ No hay datos para mostrar');
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 50px;">
                    <i class="fas fa-users" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <p style="color: #666;">No hay personal registrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Filtrar datos según búsqueda y filtros
    let datosFiltrados = filtrarDatos(personalData);
    console.log('🔍 Datos filtrados:', datosFiltrados.length, 'registros');
    
    // Paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const datosPagina = datosFiltrados.slice(startIndex, endIndex);
    console.log('📄 Datos página actual:', datosPagina.length, 'registros');
    
    // Generar filas
    tbody.innerHTML = datosPagina.map(p => {
        console.log('🆔 Procesando ID:', p.id, '-', p.nombres);
        return `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.nombres || ''} ${p.apellido_paterno || ''} ${p.apellido_materno || ''}</strong></td>
            <td>${p.curp || ''}</td>
            <td>${p.rfc || ''}</td>
            <td>${p.email || ''}</td>
            <td>${p.telefono || ''}</td>
            <td>${p.puesto || ''}</td>
            <td>${p.departamento || ''}</td>
            <td>
                <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; background: ${p.activo ? '#e8f5e9' : '#ffebee'}; color: ${p.activo ? '#4CAF50' : '#f44336'};">
                    ${p.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button onclick="verDetalles(${p.id})" style="padding: 5px 10px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer;" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editarPersonal(${p.id})" style="padding: 5px 10px; background: #f57c00; color: white; border: none; border-radius: 5px; cursor: pointer;" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmarEliminar(${p.id})" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${p.activo ? 
                        `<button onclick="toggleActivo(${p.id}, false)" style="padding: 5px 10px; background: #ffebee; color: #f44336; border: none; border-radius: 5px; cursor: pointer;" title="Desactivar">
                            <i class="fas fa-ban"></i>
                        </button>` :
                        `<button onclick="toggleActivo(${p.id}, true)" style="padding: 5px 10px; background: #e8f5e9; color: #4CAF50; border: none; border-radius: 5px; cursor: pointer;" title="Activar">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                </div>
            </td>
        </tr>
    `}).join('');
    
    console.log('✅ Tabla actualizada con', datosPagina.length, 'registros');
    
    // Actualizar información de paginación
    actualizarPaginacion(datosFiltrados.length);
}

// Filtrar datos
function filtrarDatos(datos) {
    let filtrados = [...datos];
    
    // Filtro por búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    if (searchTerm) {
        console.log('🔍 Aplicando filtro de búsqueda:', searchTerm);
        filtrados = filtrados.filter(p => 
            (p.nombres && p.nombres.toLowerCase().includes(searchTerm)) ||
            (p.apellido_paterno && p.apellido_paterno.toLowerCase().includes(searchTerm)) ||
            (p.apellido_materno && p.apellido_materno.toLowerCase().includes(searchTerm)) ||
            (p.curp && p.curp.toLowerCase().includes(searchTerm)) ||
            (p.rfc && p.rfc.toLowerCase().includes(searchTerm)) ||
            (p.email && p.email.toLowerCase().includes(searchTerm)) ||
            (p.puesto && p.puesto.toLowerCase().includes(searchTerm)) ||
            (p.departamento && p.departamento.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filtro por estado
    const statusFilter = document.getElementById('filterStatus');
    const statusValue = statusFilter ? statusFilter.value : 'todos';
    
    if (statusValue === 'activos') {
        filtrados = filtrados.filter(p => p.activo === true);
    } else if (statusValue === 'inactivos') {
        filtrados = filtrados.filter(p => p.activo === false);
    }
    
    // Filtro por departamento
    const deptoFilter = document.getElementById('filterDepartamento');
    const deptoValue = deptoFilter ? deptoFilter.value : '';
    
    if (deptoValue) {
        filtrados = filtrados.filter(p => p.departamento === deptoValue);
    }
    
    return filtrados;
}

// Actualizar filtros de departamento
function actualizarFiltrosDepartamento() {
    console.log('🏢 Actualizando filtros de departamento');
    
    const select = document.getElementById('filterDepartamento');
    if (!select) {
        console.error('❌ No se encontró el elemento filterDepartamento');
        return;
    }
    
    if (!personalData || personalData.length === 0) {
        console.log('⚠️ No hay datos para generar filtros');
        select.innerHTML = '<option value="">Todos los departamentos</option>';
        return;
    }
    
    const departamentos = [...new Set(personalData.map(p => p.departamento))].sort();
    console.log('📋 Departamentos encontrados:', departamentos);
    
    select.innerHTML = '<option value="">Todos los departamentos</option>' +
        departamentos.map(d => `<option value="${d}">${d}</option>`).join('');
}

// Buscar personal
function buscarPersonal() {
    console.log('🔎 Ejecutando buscarPersonal()');
    currentPage = 1;
    actualizarTablaPersonal();
}

// Filtrar personal
function filtrarPersonal() {
    console.log('🔍 Ejecutando filtrarPersonal()');
    currentPage = 1;
    actualizarTablaPersonal();
}

// Paginación
function cambiarPagina(direccion) {
    console.log('📄 Cambiando página:', direccion);
    
    if (direccion === 'anterior' && currentPage > 1) {
        currentPage--;
    } else if (direccion === 'siguiente') {
        const datosFiltrados = filtrarDatos(personalData);
        if (currentPage < Math.ceil(datosFiltrados.length / itemsPerPage)) {
            currentPage++;
        }
    }
    console.log('📄 Página actual:', currentPage);
    actualizarTablaPersonal();
}

function actualizarPaginacion(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    console.log('📄 Paginación - Total:', totalItems, 'Páginas:', totalPages, 'Actual:', currentPage);
    
    const pageInfo = document.getElementById('pageInfo');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    
    if (pageInfo) {
        pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    }
    
    if (btnAnterior) {
        btnAnterior.disabled = currentPage === 1;
    }
    
    if (btnSiguiente) {
        btnSiguiente.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// ==================== FUNCIONES DE MODALES ====================

// Ver detalles
async function verDetalles(id) {
    console.log('👁️ Ver detalles del ID:', id);
    
    try {
        const response = await fetch(`${API_URL}${id}/`);
        const p = await response.json();
        console.log('📦 Datos obtenidos:', p);
        
        const container = document.getElementById('viewDetailsContainer');
        container.innerHTML = `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 20px; color: #333;">Datos del Personal</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Nombre:</strong> ${p.nombres} ${p.apellido_paterno} ${p.apellido_materno || ''}</p>
                        <p><strong>Fecha Nacimiento:</strong> ${formatDate(p.fecha_nacimiento)}</p>
                        <p><strong>Sexo:</strong> ${p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Femenino' : 'Otro'}</p>
                        <p><strong>Estado Civil:</strong> ${p.estado_civil}</p>
                        <p><strong>CURP:</strong> ${p.curp}</p>
                        <p><strong>RFC:</strong> ${p.rfc}</p>
                        <p><strong>NSS:</strong> ${p.nss}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong> ${p.email}</p>
                        <p><strong>Teléfono:</strong> ${p.telefono}</p>
                        <p><strong>Celular:</strong> ${p.celular}</p>
                        <p><strong>Dirección:</strong> ${p.calle} #${p.numero_exterior} ${p.numero_interior ? 'Int ' + p.numero_interior : ''}</p>
                        <p><strong>Colonia:</strong> ${p.colonia}</p>
                        <p><strong>Ciudad:</strong> ${p.ciudad}, ${p.estado}</p>
                        <p><strong>C.P.:</strong> ${p.codigo_postal}</p>
                    </div>
                    <div>
                        <p><strong>Fecha Ingreso:</strong> ${formatDate(p.fecha_ingreso)}</p>
                        <p><strong>Puesto:</strong> ${p.puesto}</p>
                        <p><strong>Departamento:</strong> ${p.departamento}</p>
                        <p><strong>Salario:</strong> $${formatNumber(p.salario)}</p>
                    </div>
                    <div>
                        <p><strong>Contacto Emergencia:</strong> ${p.contacto_emergencia_nombre}</p>
                        <p><strong>Tel. Emergencia:</strong> ${p.contacto_emergencia_telefono}</p>
                        <p><strong>Parentesco:</strong> ${p.contacto_emergencia_parentesco}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('viewModal').style.display = 'block';
    } catch (error) {
        console.error('❌ Error en verDetalles:', error);
        mostrarToast('Error al cargar detalles', 'error');
    }
}

// Editar personal
async function editarPersonal(id) {
    console.log('✏️ Editando ID:', id);
    
    try {
        const response = await fetch(`${API_URL}${id}/`);
        const data = await response.json();
        console.log('📦 Datos obtenidos para edición:', data);
        
        currentEditId = id;
        mostrarFormularioEdicion(data);
    } catch (error) {
        console.error('❌ Error en editarPersonal:', error);
        mostrarToast('Error al cargar datos para edición', 'error');
    }
}

// Mostrar formulario de edición
function mostrarFormularioEdicion(data) {
    const container = document.getElementById('editFormContainer');
    
    container.innerHTML = `
        <form id="editForm" onsubmit="actualizarPersonal(event)">
            <div style="margin-bottom: 20px;">
                <h3>Editando ID: ${data.id}</h3>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                ${createInput('nombres', 'text', 'Nombres', data.nombres, true)}
                ${createInput('apellido_paterno', 'text', 'Apellido Paterno', data.apellido_paterno, true)}
                ${createInput('apellido_materno', 'text', 'Apellido Materno', data.apellido_materno || '')}
                ${createInput('fecha_nacimiento', 'date', 'Fecha Nacimiento', data.fecha_nacimiento, true)}
                ${createSelect('sexo', 'Sexo', 
                    ['M', 'F', 'O'], 
                    ['Masculino', 'Femenino', 'Otro'], 
                    data.sexo, true)}
                ${createSelect('estado_civil', 'Estado Civil',
                    ['S', 'C', 'D', 'V', 'UL'],
                    ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'],
                    data.estado_civil, true)}
                ${createInput('curp', 'text', 'CURP', data.curp, true, 18)}
                ${createInput('rfc', 'text', 'RFC', data.rfc, true, 13)}
                ${createInput('nss', 'text', 'NSS', data.nss, true, 11)}
                ${createInput('email', 'email', 'Email', data.email, true)}
                ${createInput('telefono', 'text', 'Teléfono', data.telefono, true)}
                ${createInput('celular', 'text', 'Celular', data.celular, true)}
                ${createInput('calle', 'text', 'Calle', data.calle, true)}
                ${createInput('numero_exterior', 'text', 'N° Exterior', data.numero_exterior, true)}
                ${createInput('numero_interior', 'text', 'N° Interior', data.numero_interior || '')}
                ${createInput('colonia', 'text', 'Colonia', data.colonia, true)}
                ${createInput('ciudad', 'text', 'Ciudad', data.ciudad, true)}
                ${createInput('estado', 'text', 'Estado', data.estado, true)}
                ${createInput('codigo_postal', 'text', 'C.P.', data.codigo_postal, true, 5)}
                ${createInput('fecha_ingreso', 'date', 'Fecha Ingreso', data.fecha_ingreso, true)}
                ${createInput('puesto', 'text', 'Puesto', data.puesto, true)}
                ${createInput('departamento', 'text', 'Departamento', data.departamento, true)}
                ${createInput('salario', 'number', 'Salario', data.salario, true, null, 0.01)}
                ${createInput('contacto_emergencia_nombre', 'text', 'Contacto Emergencia', data.contacto_emergencia_nombre, true)}
                ${createInput('contacto_emergencia_telefono', 'text', 'Tel. Emergencia', data.contacto_emergencia_telefono, true)}
                ${createInput('contacto_emergencia_parentesco', 'text', 'Parentesco', data.contacto_emergencia_parentesco, true)}
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button type="submit" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-save"></i> Actualizar
                </button>
                <button type="button" onclick="cerrarModal('editModal')" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('editModal').style.display = 'block';
}

// Función auxiliar para crear inputs
function createInput(name, type, label, value, required = false, maxlength = null, step = null) {
    return `
        <div style="display: flex; flex-direction: column;">
            <label style="font-size: 12px; color: #666; margin-bottom: 3px;">${label}</label>
            <input type="${type}" name="${name}" value="${value || ''}" 
                ${required ? 'required' : ''} ${maxlength ? `maxlength="${maxlength}"` : ''}
                ${step ? `step="${step}"` : ''}
                style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
    `;
}

// Función auxiliar para crear selects
function createSelect(name, label, values, texts, selected, required = false) {
    const options = values.map((v, i) => 
        `<option value="${v}" ${selected == v ? 'selected' : ''}>${texts[i]}</option>`
    ).join('');
    
    return `
        <div style="display: flex; flex-direction: column;">
            <label style="font-size: 12px; color: #666; margin-bottom: 3px;">${label}</label>
            <select name="${name}" ${required ? 'required' : ''} style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${options}
            </select>
        </div>
    `;
}

// Confirmar eliminación
function confirmarEliminar(id) {
    console.log('⚠️ Confirmar eliminación ID:', id);
    
    currentDeleteId = id;
    if (confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
        eliminarPersonal(currentDeleteId);
    }
}

// Cerrar modal
function cerrarModal(modalId) {
    console.log('❌ Cerrando modal:', modalId);
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'editModal') currentEditId = null;
    if (modalId === 'confirmModal') currentDeleteId = null;
}

// ==================== FUNCIONES DEL DASHBOARD ====================

// Cargar dashboard
function cargarDashboard() {
    console.log('📊 Cargando dashboard');
    actualizarDashboard();
    cargarUltimosRegistros();
    generarGraficos();
}

// Actualizar dashboard con datos
function actualizarDashboard() {
    console.log('📈 Actualizando dashboard');
    
    if (!personalData || personalData.length === 0) {
        console.log('⚠️ No hay datos para el dashboard');
        return;
    }
    
    const total = personalData.length;
    const activos = personalData.filter(p => p.activo).length;
    const inactivos = total - activos;
    const departamentos = [...new Set(personalData.map(p => p.departamento))].length;
    
    console.log('📊 Estadísticas:', { total, activos, inactivos, departamentos });
    
    const totalElement = document.getElementById('totalPersonal');
    const activosElement = document.getElementById('totalActivos');
    const inactivosElement = document.getElementById('totalInactivos');
    const deptosElement = document.getElementById('totalDepartamentos');
    
    if (totalElement) totalElement.textContent = total;
    if (activosElement) activosElement.textContent = activos;
    if (inactivosElement) inactivosElement.textContent = inactivos;
    if (deptosElement) deptosElement.textContent = departamentos;
}

// Cargar últimos registros
function cargarUltimosRegistros() {
    const container = document.getElementById('recentPersonal');
    if (!container) return;
    
    if (!personalData || personalData.length === 0) {
        container.innerHTML = '<p>No hay registros recientes</p>';
        return;
    }
    
    const ultimos = [...personalData]
        .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
        .slice(0, 5);
    
    container.innerHTML = ultimos.map(p => `
        <div onclick="verDetalles(${p.id})" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;">
            <div><strong>${p.nombres} ${p.apellido_paterno}</strong></div>
            <div style="font-size: 12px; color: #666;">${p.puesto} - ${p.departamento}</div>
        </div>
    `).join('');
}

// Generar gráficos
function generarGraficos() {
    if (!personalData || personalData.length === 0) return;
    
    // Gráfico por departamento
    const deptoCount = {};
    personalData.forEach(p => {
        deptoCount[p.departamento] = (deptoCount[p.departamento] || 0) + 1;
    });
    
    const deptoContainer = document.getElementById('departamentoChart');
    if (deptoContainer) {
        deptoContainer.innerHTML = generarBarrasGrafico(deptoCount);
    }
    
    // Gráfico por sexo
    const sexoCount = {
        'M': personalData.filter(p => p.sexo === 'M').length,
        'F': personalData.filter(p => p.sexo === 'F').length,
        'O': personalData.filter(p => p.sexo === 'O').length
    };
    
    const sexoContainer = document.getElementById('sexoChart');
    if (sexoContainer) {
        sexoContainer.innerHTML = generarBarrasGrafico(sexoCount, ['#4CAF50', '#2196f3', '#9c27b0']);
    }
}

// Generar gráfico de barras simple
function generarBarrasGrafico(data, colores = ['#4CAF50', '#2196f3', '#f57c00', '#9c27b0', '#e91e63']) {
    const valores = Object.values(data);
    const maxValor = Math.max(...valores);
    
    return Object.entries(data).map(([key, value], index) => `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div style="height: ${(value / maxValor) * 150}px; width: 40px; background: ${colores[index % colores.length]}; border-radius: 5px 5px 0 0;"></div>
            <div style="margin-top: 5px; font-weight: 600;">${value}</div>
            <div style="font-size: 11px; color: #666;">${key}</div>
        </div>
    `).join('');
}

// Cargar estadísticas detalladas
function cargarEstadisticas() {
    console.log('📊 Cargando estadísticas detalladas');
    
    if (!personalData || personalData.length === 0) {
        console.log('⚠️ No hay datos para estadísticas');
        return;
    }
    
    const container = document.getElementById('statsDetailed');
    if (!container) return;
    
    const estadisticas = {
        'Total de Personal': personalData.length,
        'Personal Activo': personalData.filter(p => p.activo).length,
        'Personal Inactivo': personalData.filter(p => !p.activo).length,
        'Hombres': personalData.filter(p => p.sexo === 'M').length,
        'Mujeres': personalData.filter(p => p.sexo === 'F').length,
        'Salario Promedio': '$' + formatNumber(personalData.reduce((sum, p) => sum + p.salario, 0) / personalData.length),
        'Salario Mínimo': '$' + formatNumber(Math.min(...personalData.map(p => p.salario))),
        'Salario Máximo': '$' + formatNumber(Math.max(...personalData.map(p => p.salario))),
        'Departamentos': [...new Set(personalData.map(p => p.departamento))].length,
        'Puestos': [...new Set(personalData.map(p => p.puesto))].length,
    };
    
    container.innerHTML = Object.entries(estadisticas).map(([key, value]) => `
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div style="font-size: 24px; font-weight: 600; color: #4CAF50;">${value}</div>
            <div style="color: #666; font-size: 14px;">${key}</div>
        </div>
    `).join('');
}

// ==================== FUNCIONES UTILITARIAS ====================

// Validar formulario
function validarFormulario(data) {
    console.log('✅ Validando formulario');
    
    // Validar CURP
    if (data.curp && data.curp.length !== 18) {
        mostrarToast('El CURP debe tener 18 caracteres', 'error');
        return false;
    }
    
    // Validar RFC
    if (data.rfc && (data.rfc.length < 12 || data.rfc.length > 13)) {
        mostrarToast('El RFC debe tener 12 o 13 caracteres', 'error');
        return false;
    }
    
    // Validar NSS
    if (data.nss && data.nss.length !== 11) {
        mostrarToast('El NSS debe tener 11 dígitos', 'error');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        mostrarToast('Email no válido', 'error');
        return false;
    }
    
    console.log('✅ Validación exitosa');
    return true;
}

// Mostrar errores de validación
function mostrarErroresValidacion(errores) {
    console.log('❌ Errores de validación:', errores);
    
    let mensaje = 'Errores de validación:\n';
    for (let campo in errores) {
        mensaje += `- ${campo}: ${errores[campo]}\n`;
    }
    mostrarToast(mensaje, 'error');
}

// Limpiar formulario
function limpiarFormulario() {
    console.log('🧹 Limpiando formulario');
    document.getElementById('personalForm').reset();
}

// Mostrar loading
function mostrarLoading(mostrar) {
    console.log('🔄 Loading:', mostrar);
    // No hacemos nada aquí porque ya mostramos el loading en la tabla
}

// Mostrar toast
function mostrarToast(mensaje, tipo = 'info') {
    console.log(`🍞 Toast [${tipo}]:`, mensaje);
    
    const container = document.getElementById('toastContainer');
    if (!container) {
        alert(mensaje);
        return;
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideIn 0.3s;
    `;
    
    toast.innerHTML = mensaje;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Formatear fecha y hora
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatear número
function formatNumber(num) {
    if (!num) return '0.00';
    return parseFloat(num).toFixed(2);
}

// Función de prueba manual
function probarConexion() {
    console.log('🧪 Probando conexión manual...');
    fetch(API_URL)
        .then(response => {
            console.log('📡 Respuesta:', response);
            return response.json();
        })
        .then(data => {
            console.log('✅ Datos:', data);
            alert(`Conexión exitosa! ${data.length} registros encontrados`);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            alert('Error de conexión: ' + error.message);
        });
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Llamar a prueba de conexión después de 2 segundos si no hay datos
setTimeout(() => {
    if (!personalData || personalData.length === 0) {
        console.log('⚠️ No hay datos después de 2 segundos, ejecutando prueba...');
        probarConexion();
    }
}, 2000);