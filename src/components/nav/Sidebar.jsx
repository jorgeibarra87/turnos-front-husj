import { useEffect, useState } from 'react';
import imgLogo from '../../img/favicon.ico'
import Navbar from './Navbar'
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
        const usuario2 = jwtDecode(token);
        const combinedAuthorities = usuario.authorities.concat(usuario2.authorities); 
                
        setUsuario({
            ...usuario,
            authorities: combinedAuthorities
        })
    }, [])

    const opcionesMenu = [
        {
            nombre: 'InnoProduc',
            roles: ['ROLE_ADMINISTRADOR'], // Define los roles para esta opción
            submenu: [
                { nombre: 'Actualizar', ruta: '/innProduc/update', roles: ['ROLE_ADMINISTRADOR', 'ROLE_INNPRODUC'] }, // Roles permitidos para esta subopción
            ]
        },
    ];

    // Filtra las opciones del menú principal según los roles del usuario
    const opcionesFiltradas = opcionesMenu.filter(opcion => {
        if (!opcion.roles) return true; // Si no se especifican roles, mostrar la opción
        return opcion.roles.some(rol => usuario.authorities.includes(rol));
    });

    // Filtra las subopciones del menú según los roles del usuario
    const filtrarSubopciones = (subopciones) => {
        return subopciones.filter(subopcion => {
            if (!subopcion.roles) return true; // Si no se especifican roles, mostrar la subopción
            return subopcion.roles.some(rol => usuario.authorities.includes(rol));
        });
    };

    const filtrarSubmenuAdicional = (subopcionesadicionales) => {
        return subopcionesadicionales.filter(subopcionadicional => {
            if (!subopcionadicional.roles) return true;
            return subopcionadicional.roles.some(rol => usuario.authorities.includes(rol));
        });
    };

    return (
        <div className="wrapper">
      <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''} small`}>
        <div className="sidebar-header text-center">
          <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} />
          <Link to='/' className="sin-estilo">Soluciones HUSJP</Link>
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
                                <Link to={submenuadicional.ruta}>{submenuadicional.nombre}</Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link to={subopcion.ruta} className="block px-2 py-1 hover:bg-gray-300">{subopcion.nombre}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div id="content" className="flex flex-col h-screen"> {/* Usa flexbox para un layout de columna */}
          <div className="navbar-fixed">
              <Navbar />
          </div>
          <div className="flex-grow overflow-y-auto p-4"> {/* El contenido principal con scroll propio */}
              {Componente && <Componente />}
          </div>
          <footer className="footer-dinamico flex-shrink-0"> {/* El footer queda fijo en la parte inferior */}
              <p className="text-muted text-center">
                  <small>Soluciones HUSJP © 2024 Hospital Universitario San Jose. Ing. Julio Alvarez. Todos los derechos reservados. EXT. 134</small>
              </p>
          </footer>
      </div>
    </div>
    )
}

//agregamos para que se valinden errores de prop.types
// Sidebar.propTypes = {
//     componente: PropTypes.elementType.isRequired,
// }