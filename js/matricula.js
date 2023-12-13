let jsonCursosAgregados = [];

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
    },
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
    },
    execProcGestionMatricula(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_MATRICULA(?,?,?,?,?)}',
                    params: [json['accion'],
                        json['id_alumno'] ?? 0,
                        json['id_turno'] ?? 0,
                        json['id_curso'] ?? 0,
                        json['id_matricula'] ?? 0
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
        this.cargarCboAlumno();
        this.changeCboAlumno();
        this.cargarCboCursos();
        this.btnAgregarCurso();
        this.btnRegistrar();
    },
    cargarCboAlumno() {
        const cboAlumno = document.getElementById('cboAlumno');
        let html = '<option value="0">Seleccione</option>';
        HttpRequest.execProcGestionAlumnos({accion: 1}).then(response => {
            if (response.status) {
                response.data.forEach(alumno => {
                    html += `<option value="${alumno.id_alumno}">${alumno.nombre} ${alumno.apellidos}</option>`;
                });
                cboAlumno.innerHTML = html;
            }
        });
    },
    changeCboAlumno() {
        document.getElementById('cboAlumno').addEventListener('change', function () {
            const idAlumno = this.value;
            if (idAlumno != 0) {
                HttpRequest.execProcGestionAlumnos({accion: 3, id_alumno: idAlumno}).then(response => {
                    if (response.status) {
                        document.getElementById('txtDniAlumno').value = response.data[0].dni;
                        document.getElementById('txtTelefonoAlumno').value = response.data[0].telefono;
                    }
                });
            }
        });
    },
    cargarCboCursos() {
        const cboCurso = document.getElementById('cboCurso');
        let html = '<option value="0">Seleccione</option>';
        HttpRequest.execProcGestionCursos({accion: 1}).then(response => {
            if (response.status) {
                response.data.forEach(curso => {
                    html += `<option value="${curso.id_curso}">${curso.descripcion} - ${curso.profesor}</option>`;
                });
                cboCurso.innerHTML = html;
            }
        });
    },
    btnAgregarCurso() {
        document.getElementById('btnAgregarCurso').addEventListener('click', function () {
            agregarCurso();
        });
    },
    btnRegistrar() {
        document.getElementById('btnRegistrar').addEventListener('click', function () {
            registrarMatricula();
        });
    }
}

function agregarCurso() {
    const cboCurso = document.getElementById('cboCurso');
    const idCurso = cboCurso.value;
    const [descripcionCurso, profesor] = cboCurso.options[cboCurso.selectedIndex].text.split('-');
    const cboTurno = document.getElementById('cboTurno');
    const idTurno = cboTurno.value;
    const descripcionTurno = cboTurno.options[cboTurno.selectedIndex].text;
    if (idCurso != 0) {
        if (jsonCursosAgregados.findIndex(curso => curso.id_curso == idCurso) === -1) {
            jsonCursosAgregados.push({
                id_curso: idCurso,
                descripcionCurso: descripcionCurso.trim(),
                profesor: profesor.trim(),
                id_turno: idTurno,
                descripcionTurno: descripcionTurno.trim()
            });
            cargarTablaCursos();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Curso ya agregado',
                text: 'El curso seleccionado ya se encuentra agregado'
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Seleccione un curso',
            text: 'Debe seleccionar un curso'
        });
    }
}

function cargarTablaCursos() {
    const body = document.getElementById('bodyCursos');
    let html = '';
    jsonCursosAgregados.forEach(response => {
        html += `<tr>
                    <td class="text-center">${response.descripcionCurso}</td>
                    <td class="text-center">${response.profesor}</td>
                    <td class="text-center">${response.descripcionTurno}</td>
                    <td>
                        <div class="text-center">
                            <a style="cursor: pointer" onclick="eliminarCurso(${response.id_curso})"><i class="fa fa-trash" aria-hidden="true"></i></a>
                        </div>
                    </td>
                </tr>`;
    });

    body.innerHTML = html;
}

function eliminarCurso(idCurso) {
    const index = jsonCursosAgregados.findIndex(curso => curso.id_curso == idCurso);
    jsonCursosAgregados.splice(index, 1);
    cargarTablaCursos();
}

function registrarMatricula() {
    Swal.fire({
        title: "Desea registrar la matricula?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Registrar",
    }).then((result) => {
        if (result.isConfirmed) {
            const jsonMatricula = {
                accion: 1,
                id_alumno: document.getElementById('cboAlumno').value,
            }

            HttpRequest.execProcGestionMatricula(jsonMatricula).then(response => {
                const id_matricula = response.data[0].id_registrado;

                jsonCursosAgregados.forEach(curso => {
                    const jsonDetalleMatricula = {
                        accion: 2,
                        id_turno: parseInt(curso.id_turno),
                        id_curso: parseInt(curso.id_curso),
                        id_matricula: parseInt(id_matricula)
                    }

                    console.log(jsonDetalleMatricula);
                    HttpRequest.execProcGestionMatricula(jsonDetalleMatricula).then(response => {
                        if (response.status) {
                            Swal.fire({
                                title: "Matricula registrada correctamente",
                                showDenyButton: false,
                                confirmButtonText: "Aceptar",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                title: "Error al registrar la matricula",
                                showDenyButton: false,
                                confirmButtonText: "Aceptar",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        }
                    });
                });
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});


