import { useEffect, useState } from 'react';
import imgLogo from '../../img/favicon.ico';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Sidebar({ componente: Componente }) {
  const stateSidebar = useSelector(state => state.sidebar);
  const statelogin = useSelector(state => state.login);
  const [usuario, setUsuario] = useState(statelogin.decodeToken);
  const [submenuAbierto, setSubmenuAbierto] = useState(null);


  const toggleSubmenu = (nombre) => {
    setSubmenuAbierto(prev => prev === nombre ? null : nombre);
  };

  useEffect(() => {
    const token = localStorage.getItem('tokenhusjp');
    if (token) {
      const usuario2 = jwtDecode(token);
      const combinedAuthorities = usuario.authorities.concat(usuario2.authorities);

      setUsuario({
        ...usuario,
        authorities: combinedAuthorities
      });
    }
  }, []);

  const opcionesMenu = [
    {
      nombre: 'Aplicación Turnos',
      submenu: [
        {
          nombre: 'Supervisión',
          submenuAdicional: [
            { nombre: 'Gestionar Contrato', ruta: '/contratos' },
            { nombre: 'Gestionar Reportes', ruta: '/reportesfiltro' }
          ]
        },
        {
          nombre: 'Gestores',
          submenuAdicional: [
            { nombre: 'Equipo Talento Humano', ruta: '/equipos' },
            { nombre: 'Cuadros de Turno', ruta: '/cuadro-turnos' },
            { nombre: 'Turnos', ruta: '/selector-cuadro-turno' },
            { nombre: 'Calendario de Turno', ruta: '/calendarioturnos' }
          ]
        },
        {
          nombre: 'Ajustes',
          submenuAdicional: [
            { nombre: 'Personas', ruta: '/personas' },
            { nombre: 'Personas Títulos', ruta: '/personastitulos' },
            { nombre: 'Personas Roles', ruta: '/personasroles' },
            { nombre: 'Personas Equipos', ruta: '/personasequipos' },
            { nombre: 'Macroprocesos', ruta: '/macroprocesos' },
            { nombre: 'Procesos', ruta: '/procesos' },
            { nombre: 'Servicios', ruta: '/servicios' },
            { nombre: 'Procesos Atención', ruta: '/procesosatencion' },
            { nombre: 'Secciones', ruta: '/secciones' },
            { nombre: 'Subsecciones', ruta: '/subsecciones' },
            { nombre: 'Contratos', ruta: '/contratos' },
            { nombre: 'Títulos', ruta: '/titulos' },
            { nombre: 'Tipo Formación', ruta: '/tipoformacion' },
            { nombre: 'Turnos', ruta: '/selector-cuadro-turno' },
            { nombre: 'Cuadros Turno', ruta: '/cuadro-turnos' },
            { nombre: 'Historial Cuadro', ruta: '/selectorCuadroHistorial' },
            { nombre: 'Equipos', ruta: '/equipos' },
            { nombre: 'Bloque Servicio', ruta: '/bloqueservicio' },
            { nombre: 'Reportes', ruta: '/reportesfiltro' },
            { nombre: 'Notificacion Correo', ruta: '/notificacionCorreo' },
            { nombre: 'Notificacion Automática', ruta: '/notificacionAutomatica' }
          ]
        }
      ]
    },
  ];

  // SIN FILTRO - Mostrar todas las opciones
  const opcionesFiltradas = opcionesMenu;

  // SIN FILTRO - Mostrar todas las subopciones
  const filtrarSubopciones = (subopciones) => {
    return subopciones;
  };

  const filtrarSubmenuAdicional = (subopcionesadicionales) => {
    return subopcionesadicionales;
  };

  return (
    <div className="wrapper">
      <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''} small`}>
        <div className="sidebar-header text-center">
          <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} />
          <Link to="/" className="sin-estilo">Soluciones HUSJP</Link>
        </div>
        <ul className="list-unstyled components">
          {opcionesFiltradas.map((opcion, index) => (
            <li key={index}>
              <button
                className="dropdown-toggle w-full text-left px-3 py-2 text-white hover:bg-gray-200"
                onClick={() => toggleSubmenu(opcion.nombre)}
              >
                {opcion.nombre}
              </button>
              {submenuAbierto === opcion.nombre && (
                <ul className="list-unstyled pl-4">
                  {filtrarSubopciones(opcion.submenu).map((subopcion, subindex) => (
                    <li key={subindex}>
                      {subopcion.submenuAdicional ? (
                        <details className="pl-2">
                          <summary className="cursor-pointer">{subopcion.nombre}</summary>
                          <ul className="pl-4">
                            {filtrarSubmenuAdicional(subopcion.submenuAdicional).map((submenuadicional, subadcionalindex) => (
                              <li key={subadcionalindex}>
                                <Link
                                  to={submenuadicional.ruta}
                                >
                                  {submenuadicional.nombre}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link
                          to={subopcion.ruta}
                          className="block px-2 py-1 hover:bg-gray-300"
                        >
                          {subopcion.nombre}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div id="content" className="flex flex-col h-screen">
        <div className="navbar-fixed">
          <Navbar />
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {Componente && <Componente />}
        </div>
        <footer className="footer-dinamico flex-shrink-0">
          <p className="text-muted text-center">
            <small>Soluciones HUSJP © 2024 Hospital Universitario San Jose. Ing. Julio Alvarez. Todos los derechos reservados. EXT. 134</small>
          </p>
        </footer>
      </div>
    </div>
  );
}
