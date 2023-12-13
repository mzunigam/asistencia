const usuario = sessionStorage.getItem('userFullName');

class Nav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Marel Company</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                Mantenimiento
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="/vistas/alumnos.html">Alumnos</a></li>
                                <li><a class="dropdown-item" href="/vistas/profesores.html">Profesores</a></li>
                                <li><a class="dropdown-item" href="/vistas/cursos.html">Cursos</a></li>
                            </ul>
                        </li>
                        
                        <li class="nav-item active">
                            <a class="nav-link" href="/vistas/matricula.html">Matr&iacute;cula</a>
                         </li>
                         
                         <li class="nav-item active">
                            <a class="nav-link" href="/vistas/matricula.html">Asistencia</a>
                         </li>
                    </ul>
                    
                    <div class="form-inline mr-2 my-lg-0" style="margin-right: 4rem">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item dropdown">
                                <a class="nav-link" href="#" id="navUser" role="button" data-bs-toggle="dropdown"
                                   aria-haspopup="true" aria-expanded="false">${usuario}</a>
                                <div class="dropdown-menu" aria-labelledby="navUser">
                                    <a id="closeSesion" class="dropdown-item" href="../vistas/index.html">Cerrar sesión</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        `;

        document.getElementById('closeSesion').addEventListener('click', () => {
            sessionStorage.removeItem('userFullName')
        });

    }
}

customElements.define('nav-component', Nav);
