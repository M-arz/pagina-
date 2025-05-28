document.addEventListener('DOMContentLoaded', function() {

    if (typeof Swal === 'undefined') {
        loadSweetAlert();
    }
    
  
    setupScrollAnimations();
    setupSmoothScroll();
    
   
    if (document.getElementById('buscar-vuelos')) {
        setupReservaForm();
    }
    
    if (document.querySelector('.filtros-ofertas')) {
        setupFiltrosOfertas();
    }
    
    if (document.querySelector('.tabs')) {
        setupTabs();
    }
    
    if (document.getElementById('formulario-contacto')) {
        setupContactForm();
    }
    
    if (document.getElementById('checkin-form')) {
        setupCheckinForm();
    }
});

function loadSweetAlert() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);
}

function setupScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.oferta-card, .vuelo-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    document.querySelectorAll('.oferta-card, .vuelo-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function setupReservaForm() {
    const tipoIdaVuelta = document.getElementById('ida-vuelta');
    const tipoSoloIda = document.getElementById('solo-ida');
    const fechaVueltaGroup = document.getElementById('fecha-vuelta-group');
    
   
    tipoIdaVuelta.addEventListener('click', function() {
        this.classList.add('active');
        tipoSoloIda.classList.remove('active');
        fechaVueltaGroup.style.display = 'block';
    });
    
    tipoSoloIda.addEventListener('click', function() {
        this.classList.add('active');
        tipoIdaVuelta.classList.remove('active');
        fechaVueltaGroup.style.display = 'none';
    });
    
   
    const pasajerosTrigger = document.getElementById('pasajeros-trigger');
    const pasajerosDropdown = document.getElementById('pasajeros-dropdown');
    
    pasajerosTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        pasajerosDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function() {
        pasajerosDropdown.classList.remove('show');
    });
    
    
    const pasajeros = {
        adultos: 1,
        jovenes: 0,
        ninos: 0,
        bebes: 0
    };
    
    document.querySelectorAll('.contador-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tipo = this.dataset.tipo;
            const operacion = this.dataset.op;
            
            if (operacion === '+' && pasajeros[tipo] < 9) {
                pasajeros[tipo]++;
            } else if (operacion === '-' && pasajeros[tipo] > 0) {
                pasajeros[tipo]--;
            }
            
            document.getElementById(`${tipo}-count`).textContent = pasajeros[tipo];
            actualizarResumenPasajeros();
        });
    });
    
    function actualizarResumenPasajeros() {
        let resumen = [];
        if (pasajeros.adultos > 0) resumen.push(`${pasajeros.adultos} Adulto${pasajeros.adultos > 1 ? 's' : ''}`);
        if (pasajeros.jovenes > 0) resumen.push(`${pasajeros.jovenes} Joven${pasajeros.jovenes > 1 ? 'es' : ''}`);
        if (pasajeros.ninos > 0) resumen.push(`${pasajeros.ninos} Niño${pasajeros.ninos > 1 ? 's' : ''}`);
        if (pasajeros.bebes > 0) resumen.push(`${pasajeros.bebes} Bebé${pasajeros.bebes > 1 ? 's' : ''}`);
        
        pasajerosTrigger.querySelector('span').textContent = resumen.join(', ');
    }
    
   
    const buscarBtn = document.getElementById('buscar-vuelos');
    
    buscarBtn.addEventListener('click', function() {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        const fechaIda = document.getElementById('fecha-ida').value;
        const fechaVuelta = document.getElementById('fecha-vuelta').value;
        const esIdaVuelta = tipoIdaVuelta.classList.contains('active');
        
        if (!origen || !destino || !fechaIda || (esIdaVuelta && !fechaVuelta)) {
            Swal.fire({
                title: 'Datos incompletos',
                text: 'Por favor completa todos los campos requeridos',
                icon: 'error'
            });
            return;
        }
        
        const vuelosEncontrados = simularBusquedaVuelos(origen, destino, fechaIda, esIdaVuelta ? fechaVuelta : null);
        
        if (vuelosEncontrados.length === 0) {
            Swal.fire({
                title: 'No hay vuelos disponibles',
                text: 'No encontramos vuelos que coincidan con tu búsqueda',
                icon: 'info'
            });
        } else {
            mostrarResultadosVuelos(vuelosEncontrados);
        }
    });
    
    function simularBusquedaVuelos(origen, destino, fechaIda, fechaVuelta) {
        const vuelos = [];
        
        const vuelo = {
            id: 'AV' + Math.floor(1000 + Math.random() * 9000),
            origen: origen,
            destino: destino,
            fechaIda: fechaIda,
            fechaVuelta: fechaVuelta,
            salida: '08:00',
            llegada: '09:30',
            precio: 250000 + Math.floor(Math.random() * 500000),
            aerolinea: 'AeroVuelo',
            pasajeros: {
                adultos: pasajeros.adultos,
                jovenes: pasajeros.jovenes,
                ninos: pasajeros.ninos,
                bebes: pasajeros.bebes
            },
            estado: 'Reservado',
            checkin: false,
            fechaReserva: new Date().toISOString()
        };
        
        vuelos.push(vuelo);
        
       
        if (Math.random() > 0.3) {
            const vuelo2 = {
                id: 'AV' + Math.floor(1000 + Math.random() * 9000),
                origen: origen,
                destino: destino,
                fechaIda: fechaIda,
                fechaVuelta: fechaVuelta,
                salida: '14:30',
                llegada: '16:00',
                precio: 300000 + Math.floor(Math.random() * 600000),
                aerolinea: 'AeroVuelo',
                pasajeros: {
                    adultos: pasajeros.adultos,
                    jovenes: pasajeros.jovenes,
                    ninos: pasajeros.ninos,
                    bebes: pasajeros.bebes
                },
                estado: 'Reservado',
                checkin: false,
                fechaReserva: new Date().toISOString()
            };
            vuelos.push(vuelo2);
        }
        
        return vuelos;
    }
    
    function mostrarResultadosVuelos(vuelos) {
        let html = '<h3>Vuelos encontrados</h3><div class="resultados-vuelos">';
        
        vuelos.forEach(vuelo => {
            html += `
                <div class="vuelo-resultado">
                    <div class="vuelo-info">
                        <div class="vuelo-aerolinea">${vuelo.aerolinea} ${vuelo.id}</div>
                        <div class="vuelo-horario">
                            <span class="hora">${vuelo.salida}</span>
                            <i class="fas fa-plane"></i>
                            <span class="hora">${vuelo.llegada}</span>
                        </div>
                        <div class="vuelo-fecha">${formatFecha(vuelo.fechaIda)}</div>
                    </div>
                    <div class="vuelo-precio">
                        $${vuelo.precio.toLocaleString()}
                    </div>
                    <button class="seleccionar-vuelo" data-id="${vuelo.id}">
                        Seleccionar
                    </button>
                </div>`;
        });
        
        html += '</div>';
        
        Swal.fire({
            title: 'Resultados de tu búsqueda',
            html: html,
            width: '800px',
            showConfirmButton: false,
            showCloseButton: true
        });
        
        
        document.querySelectorAll('.seleccionar-vuelo').forEach(btn => {
            btn.addEventListener('click', function() {
                const vueloId = this.dataset.id;
                const vueloSeleccionado = vuelos.find(v => v.id === vueloId);
                
                guardarVuelo(vueloSeleccionado);
                
                Swal.fire({
                    title: 'Vuelo seleccionado',
                    html: `Has seleccionado el vuelo <strong>${vueloId}</strong><br>
                           ¿Deseas continuar con el pago?`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Pagar ahora',
                    cancelButtonText: 'Seguir buscando'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'mis-vuelos.html';
                    }
                });
            });
        });
    }
    
    function guardarVuelo(vuelo) {
        let misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
        
        // Evitar duplicados
        const vueloExistente = misVuelos.find(v => v.id === vuelo.id);
        if (!vueloExistente) {
            misVuelos.push(vuelo);
            localStorage.setItem('misVuelos', JSON.stringify(misVuelos));
        }
    }
}

function setupFiltrosOfertas() {
    const filtros = document.querySelectorAll('.filtro-btn');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            document.querySelector('.filtro-btn.active').classList.remove('active');
            this.classList.add('active');
            
            const tipo = this.textContent.trim().toLowerCase();
            filtrarOfertas(tipo);
        });
    });
    
    function filtrarOfertas(tipo) {
        setTimeout(() => {
            document.querySelectorAll('.oferta-card').forEach(card => {
                card.style.display = 'block';
                
                if (tipo === 'nacionales' && !card.querySelector('h3').textContent.includes('Colombia')) {
                    card.style.display = 'none';
                } else if (tipo === 'internacionales' && !card.querySelector('h3').textContent.includes('Europa') && 
                          !card.querySelector('h3').textContent.includes('USA')) {
                    card.style.display = 'none';
                } else if (tipo === 'última hora' && !card.querySelector('.oferta-tag').textContent.includes('%')) {
                    card.style.display = 'none';
                }
            });
        }, 300);
    }
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            if (tabId === 'proximos') {
                cargarVuelosProximos();
            } else if (tabId === 'pasados') {
                cargarVuelosPasados();
            } else if (tabId === 'guardados') {
                cargarVuelosGuardados();
            }
        });
    });
    
    cargarVuelosProximos();
    
    document.querySelector('.contactar-btn').addEventListener('click', function() {
        window.location.href = 'contacto.html';
    });
}

function cargarVuelosProximos() {
    const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
    const tabContent = document.getElementById('proximos');
    
    if (misVuelos.length === 0) {
        tabContent.innerHTML = '<p class="no-vuelos">No tienes vuelos próximos registrados</p>';
        return;
    }
    
    let html = '';
    const hoy = new Date();
    
    misVuelos.forEach(vuelo => {
        const fechaIda = new Date(vuelo.fechaIda);
        
        if (fechaIda >= hoy && !vuelo.checkin) {
            const pasajerosText = [];
            if (vuelo.pasajeros.adultos > 0) pasajerosText.push(`${vuelo.pasajeros.adultos} Adulto${vuelo.pasajeros.adultos > 1 ? 's' : ''}`);
            if (vuelo.pasajeros.ninos > 0) pasajerosText.push(`${vuelo.pasajeros.ninos} Niño${vuelo.pasajeros.ninos > 1 ? 's' : ''}`);
            
            html += `
                <div class="vuelo-card" data-id="${vuelo.id}">
                    <div class="vuelo-info">
                        <div class="vuelo-ruta">
                            <span class="ciudad">${vuelo.origen}</span>
                            <i class="fas fa-plane"></i>
                            <span class="ciudad">${vuelo.destino}</span>
                        </div>
                        <div class="vuelo-fecha">
                            <span class="fecha">${formatFecha(vuelo.fechaIda)}</span>
                            <span class="hora">${vuelo.salida} - ${vuelo.llegada}</span>
                        </div>
                        <div class="vuelo-pasajeros">
                            ${pasajerosText.map(text => `<span><i class="fas fa-user"></i> ${text}</span>`).join('')}
                        </div>
                    </div>
                    <div class="vuelo-acciones">
                        <button class="accion-btn checkin">
                            <i class="fas fa-ticket-alt"></i> Check-in
                        </button>
                        <button class="accion-btn detalles"><i class="fas fa-info-circle"></i> Detalles</button>
                        <button class="accion-btn cancelar"><i class="fas fa-times"></i> Cancelar</button>
                    </div>
                </div>
            `;
        }
    });
    
    tabContent.innerHTML = html || '<p class="no-vuelos">No tienes vuelos próximos registrados</p>';
    setupAccionesVuelos();
}

function cargarVuelosPasados() {
    const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
    const tabContent = document.getElementById('pasados');
    
    let html = '';
    const hoy = new Date();
    
    misVuelos.forEach(vuelo => {
        const fechaIda = new Date(vuelo.fechaIda);
        
        if (fechaIda < hoy) {
            html += `
                <div class="vuelo-card">
                    <div class="vuelo-info">
                        <div class="vuelo-ruta">
                            <span class="ciudad">${vuelo.origen}</span>
                            <i class="fas fa-plane"></i>
                            <span class="ciudad">${vuelo.destino}</span>
                        </div>
                        <div class="vuelo-fecha">
                            <span class="fecha">${formatFecha(vuelo.fechaIda)}</span>
                            <span class="hora">${vuelo.salida} - ${vuelo.llegada}</span>
                        </div>
                        <div class="vuelo-estado">
                            <span class="estado completado">Completado</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    tabContent.innerHTML = html || '<p class="no-vuelos">No tienes vuelos pasados registrados</p>';
}

function cargarVuelosGuardados() {
    const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
    const tabContent = document.getElementById('guardados');
    
    let html = '';
    
    misVuelos.forEach(vuelo => {
        if (vuelo.checkin) {
            html += `
                <div class="vuelo-card">
                    <div class="vuelo-info">
                        <div class="vuelo-ruta">
                            <span class="ciudad">${vuelo.origen}</span>
                            <i class="fas fa-plane"></i>
                            <span class="ciudad">${vuelo.destino}</span>
                        </div>
                        <div class="vuelo-fecha">
                            <span class="fecha">${formatFecha(vuelo.fechaIda)}</span>
                            <span class="hora">${vuelo.salida} - ${vuelo.llegada}</span>
                        </div>
                        <div class="vuelo-estado">
                            <span class="estado checkin">Check-in completado</span>
                        </div>
                    </div>
                    <div class="vuelo-acciones">
                        <button class="accion-btn detalles"><i class="fas fa-info-circle"></i> Detalles</button>
                    </div>
                </div>
            `;
        }
    });
    
    tabContent.innerHTML = html || '<p class="no-vuelos">No tienes vuelos con check-in completado</p>';
    setupAccionesVuelos();
}

function setupAccionesVuelos() {

    document.querySelectorAll('.accion-btn.checkin').forEach(btn => {
        btn.addEventListener('click', function() {
            const vueloCard = this.closest('.vuelo-card');
            const vueloId = vueloCard.dataset.id;
            
            Swal.fire({
                title: 'Realizar Check-in',
                html: `
                    <form id="checkin-form-modal">
                        <div class="form-group">
                            <label for="nombre-pasajero">Nombre completo</label>
                            <input type="text" id="nombre-pasajero" required>
                        </div>
                        <div class="form-group">
                            <label for="pasaporte">Número de pasaporte</label>
                            <input type="text" id="pasaporte" required>
                        </div>
                        <div class="form-group">
                            <label for="asiento">Preferencia de asiento</label>
                            <select id="asiento" required>
                                <option value="">Seleccionar</option>
                                <option value="ventana">Ventana</option>
                                <option value="pasillo">Pasillo</option>
                                <option value="centro">Centro</option>
                            </select>
                        </div>
                    </form>
                `,
                showCancelButton: true,
                confirmButtonText: 'Confirmar Check-in',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nombre = document.getElementById('nombre-pasajero').value;
                    const pasaporte = document.getElementById('pasaporte').value;
                    const asiento = document.getElementById('asiento').value;
                    
                    if (!nombre || !pasaporte || !asiento) {
                        Swal.showValidationMessage('Por favor completa todos los campos');
                        return false;
                    }
                    
                    return { nombre, pasaporte, asiento };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
                    const vueloIndex = misVuelos.findIndex(v => v.id === vueloId);
                    
                    if (vueloIndex !== -1) {
                        misVuelos[vueloIndex].checkin = true;
                        misVuelos[vueloIndex].datosCheckin = result.value;
                        localStorage.setItem('misVuelos', JSON.stringify(misVuelos));
                        
                        Swal.fire(
                            'Check-in completado',
                            'Tu check-in se ha realizado con éxito. Hemos enviado tu tarjeta de embarque a tu correo electrónico.',
                            'success'
                        ).then(() => {
                            cargarVuelosProximos();
                            cargarVuelosGuardados();
                        });
                    }
                }
            });
        });
    });
    
    
    document.querySelectorAll('.accion-btn.detalles').forEach(btn => {
        btn.addEventListener('click', function() {
            const vueloCard = this.closest('.vuelo-card');
            const vueloId = vueloCard.dataset.id;
            const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
            const vuelo = misVuelos.find(v => v.id === vueloId);
            
            if (vuelo) {
                mostrarDetallesVuelo(vuelo);
            }
        });
    });
    
  
    document.querySelectorAll('.accion-btn.cancelar').forEach(btn => {
        btn.addEventListener('click', function() {
            const vueloCard = this.closest('.vuelo-card');
            const vueloId = vueloCard.dataset.id;
            
            Swal.fire({
                title: '¿Cancelar vuelo?',
                text: '¿Estás seguro que deseas cancelar este vuelo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cancelar',
                cancelButtonText: 'No, mantener'
            }).then((result) => {
                if (result.isConfirmed) {
                    const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
                    const nuevosVuelos = misVuelos.filter(v => v.id !== vueloId);
                    localStorage.setItem('misVuelos', JSON.stringify(nuevosVuelos));
                    
                    vueloCard.remove();
                    
                    Swal.fire(
                        'Vuelo cancelado',
                        'Tu vuelo ha sido cancelado. Se ha iniciado el proceso de reembolso.',
                        'success'
                    );
                }
            });
        });
    });
}

function mostrarDetallesVuelo(vuelo) {
    const pasajerosText = [];
    if (vuelo.pasajeros.adultos > 0) pasajerosText.push(`${vuelo.pasajeros.adultos} Adulto${vuelo.pasajeros.adultos > 1 ? 's' : ''}`);
    if (vuelo.pasajeros.jovenes > 0) pasajerosText.push(`${vuelo.pasajeros.jovenes} Joven${vuelo.pasajeros.jovenes > 1 ? 'es' : ''}`);
    if (vuelo.pasajeros.ninos > 0) pasajerosText.push(`${vuelo.pasajeros.ninos} Niño${vuelo.pasajeros.ninos > 1 ? 's' : ''}`);
    if (vuelo.pasajeros.bebes > 0) pasajerosText.push(`${vuelo.pasajeros.bebes} Bebé${vuelo.pasajeros.bebes > 1 ? 's' : ''}`);
    
    let checkinInfo = '';
    if (vuelo.checkin && vuelo.datosCheckin) {
        checkinInfo = `
            <div class="detalle-item">
                <span class="detalle-label">Check-in:</span>
                <span class="detalle-valor">Completado</span>
            </div>
            <div class="detalle-item">
                <span class="detalle-label">Pasajero:</span>
                <span class="detalle-valor">${vuelo.datosCheckin.nombre}</span>
            </div>
            <div class="detalle-item">
                <span class="detalle-label">Pasaporte:</span>
                <span class="detalle-valor">${vuelo.datosCheckin.pasaporte}</span>
            </div>
            <div class="detalle-item">
                <span class="detalle-label">Asiento:</span>
                <span class="detalle-valor">${vuelo.datosCheckin.asiento}</span>
            </div>
        `;
    }
    
    Swal.fire({
        title: 'Detalles del vuelo',
        html: `
            <div class="detalles-vuelo">
                <div class="detalle-item">
                    <span class="detalle-label">Vuelo:</span>
                    <span class="detalle-valor">${vuelo.aerolinea} ${vuelo.id}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Ruta:</span>
                    <span class="detalle-valor">${vuelo.origen} → ${vuelo.destino}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Fecha:</span>
                    <span class="detalle-valor">${formatFecha(vuelo.fechaIda)}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Hora:</span>
                    <span class="detalle-valor">${vuelo.salida} - ${vuelo.llegada}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Pasajeros:</span>
                    <span class="detalle-valor">${pasajerosText.join(', ')}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Estado:</span>
                    <span class="detalle-valor">${vuelo.estado}</span>
                </div>
                ${checkinInfo}
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '600px'
    });
}

function setupCheckinForm() {
    const checkinForm = document.getElementById('checkin-form');
    const urlParams = new URLSearchParams(window.location.search);
    const vueloId = urlParams.get('vuelo');
    
    if (vueloId) {
        document.getElementById('vuelo-id').value = vueloId;
    }
    
    checkinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const vueloId = document.getElementById('vuelo-id').value;
        const nombre = document.getElementById('nombre-pasajero').value;
        const pasaporte = document.getElementById('pasaporte').value;
        const asiento = document.getElementById('asiento').value;
        const equipaje = document.getElementById('equipaje').value;
        
        const misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];
        const vueloIndex = misVuelos.findIndex(v => v.id === vueloId);
        
        if (vueloIndex !== -1) {
            misVuelos[vueloIndex].checkin = true;
            misVuelos[vueloIndex].datosCheckin = {
                nombre,
                pasaporte,
                asiento,
                equipaje
            };
            localStorage.setItem('misVuelos', JSON.stringify(misVuelos));
            
            Swal.fire({
                title: 'Check-in completado',
                text: 'Tu check-in se ha realizado con éxito. Hemos enviado tu tarjeta de embarque a tu correo electrónico.',
                icon: 'success'
            }).then(() => {
                window.location.href = 'mis-vuelos.html';
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se encontró el vuelo especificado',
                icon: 'error'
            });
        }
    });
}

function setupContactForm() {
    const contactoForm = document.getElementById('formulario-contacto');
    
    contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        Swal.fire({
            title: 'Mensaje enviado',
            text: 'Gracias por contactarnos. Te responderemos en breve.',
            icon: 'success'
        });
        
        this.reset();
    });
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const pregunta = item.querySelector('.faq-pregunta');
        
        pregunta.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });
}

function formatFecha(fechaStr) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}