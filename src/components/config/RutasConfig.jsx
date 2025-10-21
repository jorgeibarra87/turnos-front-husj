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

    useEffect(() => {
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
    }, [state]);

    return (
        <Router>
            <Routes>
                {/* Login */}
                <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />

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
                <Route path='*' element={
                    <RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={TurnosMainLayout} />
                        </ProtectedWithIdle>
                    </RequireAuth>
                } />

                {/* Error 404 */}
                {/* <Route path='*' element={<Error404 />} /> */}
            </Routes>
        </Router>
    );
}