import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import Login from '../auth/Login';
import Error404 from '../Error404';
import { useEffect, useState } from 'react';
import RequireAuth from './RequireAuth';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../nav/Sidebar';
import UpdateInnProduc from '../innProduc/UpdateInnProduc';
import { obtenerToken } from '../../actions/loginActions';
import ProtectedWithIdle from './ProtectedWithIdle';
import TurnosMainLayout from '../TurnosApp/TurnosMainLayout';

export default function RutasConfig() {
    const state = useSelector(state => state.login);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Verificar si estamos en modo desarrollo
    const isDevMode = window.env?.VITE_DEV_MODE === "true";

    /* useEffect(() => {
        setLoading(true);
        dispatch(obtenerToken());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (state.token !== null) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [state]); */

    useEffect(() => {
        if (isDevMode) {
            // En modo desarrollo, simular login automático
            const fakeLoginState = {
                token: "dev-token",
                usuario: "dev-user",
                authorities: "ADMINISTRADOR",
                decodeToken: {
                    name_user: "Usuario Desarrollo",
                    authorities: "ADMINISTRADOR",
                    sub: "dev-user"
                }
            };

            // Solo simular login si no hay token
            if (!state.token) {
                dispatch({ type: 'INICIAR_SESION', payload: fakeLoginState });
            }

            setIsLogged(true);
            setLoading(false);
        } else {
            // Modo producción - lógica original
            setLoading(true);
            dispatch(obtenerToken());
            setLoading(false);
        }
    }, [dispatch, isDevMode, state.token]);

    useEffect(() => {
        if (isDevMode) {
            setIsLogged(true);
        } else {
            if (state.token !== null) {
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        }
    }, [state, isDevMode]);

    return (
        <Router>
            <Routes>
                {/* Login */}
                <Route path='/login' element={isLogged ? <Navigate to='/crear-turnos' /> : <Login />} />

                {/* Otras rutas existentes */}
                <Route path='/innProduc'>
                    <Route path='update' element={
                        <RequireAuth isLogged={isLogged} loading={loading}>
                            <ProtectedWithIdle>
                                <Sidebar componente={UpdateInnProduc} />
                            </ProtectedWithIdle>
                        </RequireAuth>
                    } />
                </Route>

                {/* Ruta principal con TurnosMainLayout */}
                {/* <Route path='*' element={
                    <RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={TurnosMainLayout} />
                        </ProtectedWithIdle>
                    </RequireAuth>
                } /> */}

                {/* Ruta principal con TurnosMainLayout */}
                <Route path='*' element={
                    isDevMode ? (
                        <Sidebar componente={TurnosMainLayout} />
                    ) : (
                        <RequireAuth isLogged={isLogged} loading={loading}>
                            <ProtectedWithIdle>
                                <Sidebar componente={TurnosMainLayout} />
                            </ProtectedWithIdle>
                        </RequireAuth>
                    )
                } />

                {/* Error 404 */}
                {/* <Route path='*' element={<Error404 />} /> */}
            </Routes>
        </Router>
    );
}