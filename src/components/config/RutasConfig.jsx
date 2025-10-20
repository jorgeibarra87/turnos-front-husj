import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import Error404 from '../Error404'
import { useEffect, useState } from 'react';
import RequireAuth from './RequireAuth';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../nav/Sidebar';
import UpdateInnProduc from '../innProduc/UpdateInnProduc';
import { obtenerToken } from '../../actions/loginActions';
import ProtectedWithIdle from './ProtectedWithIdle';

export default function RutasConfig() {

    const state = useSelector(state => state.login);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        // Maneja la carga del token y actualiza el estado de carga
        setLoading(true);
        //dispatch({ type: 'OBTENER_TOKEN' }); // Acción síncrona
        dispatch(obtenerToken());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (state.token !== null) {
            setIsLogged(true);
        }
        else {
            setIsLogged(false);
        }
    }, [state])

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<RequireAuth isLogged={isLogged} loading={loading}>
                    <ProtectedWithIdle>
                        <Sidebar />
                    </ProtectedWithIdle>
                </RequireAuth>} />
                <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />
                <Route path='/innProduc'>
                    <Route path='update' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={UpdateInnProduc} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='*' element={<Error404 />} />
            </Routes>
        </HashRouter>
    )
}
