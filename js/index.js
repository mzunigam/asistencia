const DOMEvents = {
    init: function () {
        this.cargarLogueo();
    },
    cargarLogueo() {
        document.getElementById('btnIngresar').addEventListener('click', function () {
            logueo();
        });
    }
}

// Peticiones
const HttpRequest = {
    execProcGestionMarcas(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL MC_SP_GESTION_USUARIO(?,?,?)}',
                    params: [json['accion'],
                        json['dni'] ?? '',
                        json['clave'] ?? ''
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

// Funciones

function logueo() {
    let dni = document.getElementById('txtUsuario').value;
    let clave = document.getElementById('txtClave').value;

    HttpRequest.execProcGestionMarcas({
        accion: 1,
        dni: dni,
        clave: clave
    })
        .then(response => {
            if (response.status) {
                if (response.data.length > 0) {
                    window.location.href = 'main.html';
                    sessionStorage.setItem('userFullName', response.data[0].first_name + ' ' + response.data[0].last_name);
                } else {
                    Swal.fire("Usuario y/o contraseña incorrectos!", "", "error");
                }
            }
        })
        .catch(error => {
            alert('Error en la petición');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init();
});