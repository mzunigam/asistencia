// Peticiones
const HttpRequest = {
    execProcGestionAlumnos(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_ALUMNOS(?,?,?,?,?,?,?,?,?)}',
                    params: [json['accion'],
                        json['id_alumno'] ?? 0,
                        json['dni'] ?? '',
                        json['nombre'] ?? '',
                        json['apellidoPaterno'] ?? '',
                        json['apellidoMaterno'] ?? '',
                        json['edad'] ?? 0,
                        json['genero'] ?? 0,
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
            document.getElementById('tituloModal').textContent = 'Registrar Alumno';
            document.getElementById('btnActualizarAlumno').style.display = 'none';
            document.getElementById('btnRegistrarAlumno').style.display = 'block';
            $('#modalAlumno').modal('show')
        });

        document.getElementById('btnRegistrarAlumno').addEventListener('click', function () {
            const json = {
                accion: 2,
                dni: document.getElementById('txtDni').value,
                nombre: document.getElementById('txtNombre').value,
                apellidoPaterno: document.getElementById('txtApellidoPaterno').value,
                apellidoMaterno: document.getElementById('txtApellidoMaterno').value,
                edad: parseInt(document.getElementById('txtEdad').value),
                genero: parseInt(document.getElementById('cboGenero').value),
                telefono: document.getElementById('txtTelefono').value
            }

            HttpRequest.execProcGestionAlumnos(json).then(response => {
                if (response.status) {
                    if (response.data[0].filas_afectadas !== -1) {
                        Swal.fire({
                            title: "Alumno registrado correctamente",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalAlumno').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error al registrar el alumno",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalAlumno').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    }
                }
            });
        });
    },
    btnEditar() {
        document.getElementById('btnActualizarAlumno').addEventListener('click', function () {
            actualizarAlumno();
        });
    },
    cargarListado() {
        const json = {
            accion: 1
        }

        HttpRequest.execProcGestionAlumnos(json).then(response => {
            if (response.status) {
                const data = response.data;
                const body = document.getElementById('bodyRegistrarAlumno');
                let html = '';
                data.forEach(response => {
                    html += `<tr>
                    <td class="text-center">${response.dni}</td>
                    <td class="text-center">${response.nombre}</td>
                    <td class="text-center">${response.apellidos}</td>
                    <td class="text-center">${response.edad}</td>
                    <td class="text-center">${response.telefono}</td>
                    <td>
                        <div class="text-center">
                            <a onclick="editarAlumno(${response.id_alumno})" href="#" class="btn btn-primary">Editar</a>
                            <a onclick="eliminarAlumno(${response.id_alumno})" class="btn btn-danger">Eliminar</a>
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
    document.getElementById('txtApellidoMaterno').value = '';
    document.getElementById('txtEdad').value = '';
    document.getElementById('cboGenero').value = 0;
    document.getElementById('txtTelefono').value = '';
}

function editarAlumno(id) {
    $('#modalAlumno').modal('show');
    document.getElementById('btnActualizarAlumno').style.display = 'block';
    document.getElementById('btnRegistrarAlumno').style.display = 'none';
    document.getElementById('tituloModal').textContent = 'Editar Alumno';

    const json = {
        accion: 3,
        id_alumno: id
    }

    HttpRequest.execProcGestionAlumnos(json).then(response => {
        document.getElementById('txtCodigo').value = id;
        document.getElementById('txtDni').value = response.data[0].dni;
        document.getElementById('txtNombre').value = response.data[0].nombre;
        document.getElementById('txtApellidoPaterno').value = response.data[0].apellido_paterno;
        document.getElementById('txtApellidoMaterno').value = response.data[0].apellido_materno;
        document.getElementById('txtEdad').value = response.data[0].edad;
        document.getElementById('cboGenero').value = response.data[0].genero;
        document.getElementById('txtTelefono').value = response.data[0].telefono;
    });
}

function actualizarAlumno() {
    const json = {
        accion: 4,
        id_alumno: document.getElementById('txtCodigo').value,
        dni: document.getElementById('txtDni').value,
        nombre: document.getElementById('txtNombre').value,
        apellidoPaterno: document.getElementById('txtApellidoPaterno').value,
        apellidoMaterno: document.getElementById('txtApellidoMaterno').value,
        edad: parseInt(document.getElementById('txtEdad').value),
        genero: parseInt(document.getElementById('cboGenero').value),
        telefono: document.getElementById('txtTelefono').value
    }

    HttpRequest.execProcGestionAlumnos(json).then(response => {
        if (response.status) {
            debugger;
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Alumno actualizado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalAlumno').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al actualizar el alumno",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalAlumno').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            }
        }
    });
}

function eliminarAlumno(id) {
    HttpRequest.execProcGestionAlumnos({accion: 5, id_alumno: id}).then(response => {
        if (response.status) {
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Alumno eliminado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al eliminar el alumno",
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