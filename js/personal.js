const DOMEvents = {
    init: function () {
        this.btnAbrirModalRegistrar();
        this.cargarListado();
    },
    btnAbrirModalRegistrar() {
        document.getElementById('btnModalRegistrar').addEventListener('click', function () {
            $('#modalRegistrar').modal('show')
        });
    },
    cargarListado() {
        const body = document.getElementById('bodyPersonal');
        let html = '';
        data.personal.forEach(response => {
            html += `<tr>
                    <td class="text-center">${response.nombre}</td>
                    <td class="text-center">${response.apellidoPaterno}</td>
                    <td class="text-center">${response.apellidoMaterno}</td>
                    <td class="text-center">${response.telefono}</td>
                    <td class="text-center">${response.dni}</td>
                    <td>
                        <div class="text-center">
                            <a onclick="editarPersonal(${response.id})" href="#" class="btn btn-primary">Editar</a>
                            <a onclick="eliminarPersonal(${response.id})" class="btn btn-danger">Eliminar</a>
                        </div>
                    </td>
                </tr>`;
        });

        body.innerHTML = html;
    }
}

function editarPersonal(id) {
    $('#modalEditar').modal('show');
}

function eliminarPersonal(id) {
    Swal.fire({
        title: "Deseas eliminar el personal?",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire("Eliminado!", "", "success");
        }
    });
}


const data = {
    personal: [
        {
            id: 1,
            nombre: "Juan",
            apellidoPaterno: "Perez",
            apellidoMaterno: "Perez",
            telefono: "12345678",
            dni: "12345678"
        },
        {
            id: 2,
            nombre: "Juan",
            apellidoPaterno: "Perez",
            apellidoMaterno: "Perez",
            telefono: "12345678",
            dni: "12345678"
        },
        {
            id: 3,
            nombre: "Juan",
            apellidoPaterno: "Perez",
            apellidoMaterno: "Perez",
            telefono: "12345678",
            dni: "12345678"
        }
    ],
    status: true
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});