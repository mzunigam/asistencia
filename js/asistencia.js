// Peticiones
const HttpRequest = {
    execProcGestionAsistencia(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_ASISTENCIA(?,?,?,?)}',
                    params: [json['accion'],
                        json['id_curso'] ?? 0,
                        json['id_profesor'] ?? 0,
                        json['id_alumno'] ?? 0
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
        this.cargarCboCursos();
        this.cargarCboProfesores();
        this.btnBuscar();
        this.btnRegistrar();
    },
    cargarCboCursos() {
        HttpRequest.execProcGestionAsistencia({accion: 2}).then(response => {
            const data = response.data;
            let html = '<option value="0">Seleccione un curso</option>';
            data.forEach(element => {
                html += `<option value="${element.id_curso}">${element.descripcion}</option>`;
            });
            document.getElementById('cboCurso').innerHTML = html;
        });
    },
    cargarCboProfesores() {
        HttpRequest.execProcGestionAsistencia({accion: 3}).then(response => {
            const data = response.data;
            let html = '<option value="0">Seleccione un profesor</option>';
            data.forEach(element => {
                html += `<option value="${element.id_profesor}">${element.profesor}</option>`;
            });
            document.getElementById('cboProfesor').innerHTML = html;
        });
    },
    btnBuscar() {
        document.getElementById('btnBuscar').addEventListener('click', function () {
            realizarBusqueda();
        });
    },
    btnRegistrar() {
        document.getElementById('btnRegistrar').addEventListener('click', function () {
            registrarAsistencia();
        });
    }
}

function realizarBusqueda() {
    const curso = parseInt(document.getElementById('cboCurso').value);
    const profesor = document.getElementById('cboProfesor').value;

    if (curso === 0) {
        Swal.fire('Debe seleccionar un curso');
    } else if (profesor === 0) {
        Swal.fire('Debe seleccionar un profesor');
    } else {
        document.getElementById('btnRegistrar').style.display = 'block';
        HttpRequest.execProcGestionAsistencia({accion: 1, id_curso: curso, id_profesor: profesor}).then(response => {
            const data = response.data;
            let html = '';
            data.forEach(element => {
                html += `<tr>
                            <td class="text-center">${element.alumno}</td>
                            <td class="text-center">
                                <input type="checkbox" class="form-check-input" id="chkAsistencia_${element.id_alumno}">
                                <label class="form-check-label" for="chkAsistencia_${element.id_alumno}"></label>
                            </td>
                        </tr>`;
            });
            document.getElementById('bodyAsistencia').innerHTML = html;
        });
    }
}

function registrarAsistencia() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const idsAlumnos = Array.from(checkboxes).map(checkbox => {
        const idAlumno = checkbox.id.replace('chkAsistencia_', '');
        return parseInt(idAlumno);
    });

    if (idsAlumnos.length > 0) {

        idsAlumnos.forEach(idAlumno => {
            const json = {
                accion: 4,
                id_alumno: idAlumno
            }

            HttpRequest.execProcGestionAsistencia(json).then(response => {
                if (response.status) {
                    if (response.data[0].filas_afectadas !== -1) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Se registró la asistencia correctamente',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    } else {
                        Swal.fire('Error', 'No se pudo registrar la asistencia', 'error');
                    }
                } else {
                    Swal.fire('Error', 'No se pudo registrar la asistencia', 'error');
                }
            });
        });
    } else {
        Swal.fire('Debe marcar al menos un checkbox para registrar la asistencia');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});
