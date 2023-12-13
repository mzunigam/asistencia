// Peticiones
const HttpRequest = {
    execProcGestionProfesores(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_PROFESORES(?,?,?,?,?,?,?)}',
                    params: [json['accion'],
                        json['id_profesor'] ?? 0,
                        json['dni'] ?? '',
                        json['nombre'] ?? '',
                        json['apellidoPaterno'] ?? '',
                        json['apellidoMaterno'] ?? '',
                        json['telefono'] ?? ''
                    ]
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject('Error en la petición');
                    }
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject('Error en la petición');
                });
        });
    }
}

const DOMEvents = {
    init: function () {
        this.btnRegistrar();
        this.btnEditar();
        this.cargarListado();
    },
    btnRegistrar() {
        document.getElementById('btnModalRegistrar').addEventListener('click', function () {
            limpiarModal();
            document.getElementById('tituloModal').textContent = 'Registrar Profesor';
            document.getElementById('btnActualizarProfesor').style.display = 'none';
            document.getElementById('btnRegistrarProfesor').style.display = 'block';
            $('#modalProfesor').modal('show')
        });

        document.getElementById('btnRegistrarProfesor').addEventListener('click', function () {
            const json = {
                accion: 2,
                dni: document.getElementById('txtDni').value,
                nombre: document.getElementById('txtNombre').value,
                apellidoPaterno: document.getElementById('txtApellidoPaterno').value,
                apellidoMaterno: document.getElementById('txtApellidoMaterno').value,
                telefono: document.getElementById('txtTelefono').value
            }

            HttpRequest.execProcGestionProfesores(json).then(response => {
                if (response.status) {
                    if (response.data[0].filas_afectadas !== -1) {
                        Swal.fire({
                            title: "Profesor registrado correctamente",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalProfesor').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error al registrar al profesor",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalProfesor').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    }
                }
            });
        });
    },
    btnEditar() {
        document.getElementById('btnActualizarProfesor').addEventListener('click', function () {
            actualizarProfesor();
        });
    },
    cargarListado() {
        const json = {
            accion: 1
        }

        HttpRequest.execProcGestionProfesores(json).then(response => {
            if (response.status) {
                const data = response.data;
                const body = document.getElementById('bodyRegistrarProfesor');
                let html = '';
                data.forEach(response => {
                    html += `<tr>
                    <td class="text-center">${response.dni}</td>
                    <td class="text-center">${response.nombre}</td>
                    <td class="text-center">${response.apellidos}</td>
                    <td class="text-center">${response.telefono}</td>
                    <td>
                        <div class="text-center">
                            <a onclick="editarProfesor(${response.id_profesor})" href="#" class="btn btn-primary">Editar</a>
                            <a onclick="eliminarProfesor(${response.id_profesor})" class="btn btn-danger">Eliminar</a>
                        </div>
                    </td>
                </tr>`;
                });

                body.innerHTML = html;
            }
        });
    }
}

function limpiarModal() {
    document.getElementById('txtDni').value = '';
    document.getElementById('txtNombre').value = '';
    document.getElementById('txtApellidoPaterno').value = '';
    document.getElementById('txtTelefono').value = '';
}

function editarProfesor(id) {
    $('#modalProfesor').modal('show');
    document.getElementById('btnActualizarProfesor').style.display = 'block';
    document.getElementById('btnRegistrarProfesor').style.display = 'none';
    document.getElementById('tituloModal').textContent = 'Editar Profesor';

    const json = {
        accion: 3,
        id_profesor: id
    }

    HttpRequest.execProcGestionProfesores(json).then(response => {
        document.getElementById('txtCodigo').value = id;
        document.getElementById('txtDni').value = response.data[0].dni;
        document.getElementById('txtNombre').value = response.data[0].nombre;
        document.getElementById('txtApellidoPaterno').value = response.data[0].apellido_paterno;
        document.getElementById('txtApellidoMaterno').value = response.data[0].apellido_materno;
        document.getElementById('txtTelefono').value = response.data[0].telefono;
    });
}

function actualizarProfesor() {
    const json = {
        accion: 4,
        id_profesor: document.getElementById('txtCodigo').value,
        dni: document.getElementById('txtDni').value,
        nombre: document.getElementById('txtNombre').value,
        apellidoPaterno: document.getElementById('txtApellidoPaterno').value,
        apellidoMaterno: document.getElementById('txtApellidoMaterno').value,
        telefono: document.getElementById('txtTelefono').value
    }

    HttpRequest.execProcGestionProfesores(json).then(response => {
        if (response.status) {
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Profesor actualizado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalProfesor').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al actualizar al profesor",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalProfesor').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            }
        }
    });
}

function eliminarProfesor(id) {
    HttpRequest.execProcGestionProfesores({accion: 5, id_profesor: id}).then(response => {
        if (response.status) {
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Profesor eliminado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al eliminar al profesor",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        DOMEvents.cargarListado();
                    }
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});
