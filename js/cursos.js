// Peticiones
const HttpRequest = {
    execProcGestionCursos(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_CURSOS(?,?,?,?)}',
                    params: [json['accion'],
                        json['id_curso'] ?? 0,
                        json['descripcion'] ?? '',
                        json['id_profesor'] ?? 0
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
        this.cargarCboProfesores();
    },
    btnRegistrar() {
        document.getElementById('btnModalRegistrar').addEventListener('click', function () {
            limpiarModal();
            document.getElementById('tituloModal').textContent = 'Registrar Curso';
            document.getElementById('btnActualizarCurso').style.display = 'none';
            document.getElementById('btnRegistrarCurso').style.display = 'block';
            $('#modalCurso').modal('show')
        });

        document.getElementById('btnRegistrarCurso').addEventListener('click', function () {
            const json = {
                accion: 2,
                descripcion: document.getElementById('txtDescripcion').value,
                id_profesor: parseInt(document.getElementById('cboProfesor').value)
            }

            HttpRequest.execProcGestionCursos(json).then(response => {
                if (response.status) {
                    if (response.data[0].filas_afectadas !== -1) {
                        Swal.fire({
                            title: "Curso registrado correctamente",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalCurso').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error al registrar el curso",
                            showDenyButton: false,
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#modalCurso').modal('hide');
                                DOMEvents.cargarListado();
                            }
                        });
                    }
                }
            });
        });
    },
    btnEditar() {
        document.getElementById('btnActualizarCurso').addEventListener('click', function () {
            actualizarCurso();
        });
    },
    cargarListado() {
        const json = {
            accion: 1
        }

        HttpRequest.execProcGestionCursos(json).then(response => {
            if (response.status) {
                const data = response.data;
                const body = document.getElementById('bodyRegistrarCurso');
                let html = '';
                data.forEach(response => {
                    const a = obtenerDiasSemana(response.horario);
                    console.log(a)

                    html += `<tr>
                    <td class="text-center">${response.descripcion}</td>
                    <td class="text-center">${response.profesor}</td>
                    <td class="text-center">${obtenerDiasSemana(response.horario).join(', ')}</td>
                    <td>
                        <div class="text-center">
                            <a onclick="editarCurso(${response.id_curso})" href="#" class="btn btn-primary">Editar</a>
                            <a onclick="eliminarCurso(${response.id_curso})" class="btn btn-danger">Eliminar</a>
                        </div>
                    </td>
                </tr>`;
                });

                body.innerHTML = html;
            }
        });
    },
    cargarCboProfesores() {
        const json = {
            accion: 6
        }

        HttpRequest.execProcGestionCursos(json).then(response => {
            if (response.status) {
                const data = response.data;
                const cboProfesor = document.getElementById('cboProfesor');
                let html = '<option value="0">Seleccione</option>';
                data.forEach(response => {
                    html += `<option value="${response.id_profesor}">${response.profesor}</option>`;
                });

                cboProfesor.innerHTML = html;
            }
        });
    }
}

function limpiarModal() {
    document.getElementById('txtDescripcion').value = '';
    document.getElementById('cboProfesor').value = 0;
}

function editarCurso(id) {
    $('#modalCurso').modal('show');
    document.getElementById('btnActualizarCurso').style.display = 'block';
    document.getElementById('btnRegistrarCurso').style.display = 'none';
    document.getElementById('tituloModal').textContent = 'Editar Curso';

    const json = {
        accion: 3,
        id_curso: id
    }

    HttpRequest.execProcGestionCursos(json).then(response => {
        document.getElementById('txtIdCurso').value = id;
        document.getElementById('txtDescripcion').value = response.data[0].descripcion;
        document.getElementById('cboProfesor').value = response.data[0].id_profesor;
    });
}

function actualizarCurso() {
    const json = {
        accion: 4,
        id_curso: document.getElementById('txtIdCurso').value,
        descripcion: document.getElementById('txtDescripcion').value,
        id_profesor: parseInt(document.getElementById('cboProfesor').value)
    }

    HttpRequest.execProcGestionCursos(json).then(response => {
        if (response.status) {
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Curso actualizado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalCurso').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al actualizar el curso",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#modalCurso').modal('hide');
                        DOMEvents.cargarListado();
                    }
                });
            }
        }
    });
}

function eliminarCurso(id) {
    HttpRequest.execProcGestionCursos({accion: 5, id_curso: id}).then(response => {
        if (response.status) {
            if (response.data[0].filas_afectadas !== -1) {
                Swal.fire({
                    title: "Curso eliminado correctamente",
                    showDenyButton: false,
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        DOMEvents.cargarListado();
                    }
                });
            } else {
                Swal.fire({
                    title: "Error al eliminar el curso",
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

function obtenerDiasSemana(input) {
    if (typeof input === 'number') {
        input = String(input);
    }
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return Array.from(input).map(d => daysOfWeek[parseInt(d, 10) - 1]);
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});
