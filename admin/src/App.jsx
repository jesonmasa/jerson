import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterV2 from './pages/RegisterV2';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';

import Categories from './pages/Categories';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components
const Builder = lazy(() => import('./pages/Builder'));
const DataSheet = lazy(() => import('./pages/DataSheet'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Billing = lazy(() => import('./pages/Billing'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdmin/Dashboard'));
import TestAuth from './pages/TestAuth';

// Componente para manejar la autenticación desde URL
const UrlAuthHandler = () => {
    const { setAuth } = useAuthStore();
    const location = useLocation();
    
    useEffect(() => {
        // Verificar si hay parámetros de autenticación en la URL
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const tenantId = urlParams.get('tenantId');
        const userName = urlParams.get('userName');
        
        if (token && tenantId) {
            // Establecer la autenticación con el token proporcionado
            const user = {
                id: `temp-${tenantId}`,
                email: `admin-access@${tenantId}.test`,
                name: userName || 'Acceso Admin',
                tenantId: tenantId,
                role: 'owner'
            };
            
            setAuth(token, user);
        }
    }, [location, setAuth]);
    
    return null;
};

function App() {
    const { token, logout } = useAuthStore();

    // Fix: Validate token format on load to clear legacy mock tokens
    // JWT tokens must have 3 parts separated by dots
    // Mock tokens like 'demo-admin-token' will fail this check
    if (token && (typeof token !== 'string' || token.split('.').length !== 3)) {
        console.warn('⚠️ Token inválido o corrupto detectado. Forzando logout para limpiar estado.');
        logout();
    }

    return (
        <BrowserRouter>
            <UrlAuthHandler />
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!token ? <RegisterV2 /> : <Navigate to="/" />} />
                <Route path="/register-old" element={!token ? <Register /> : <Navigate to="/" />} />

                {/* Protected Routes */}
                <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="datasheet" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando hoja de datos..." />}>
                            <DataSheet />
                        </Suspense>
                    } />
                    <Route path="gallery" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando galería..." />}>
                            <Gallery />
                        </Suspense>
                    } />
                    <Route path="builder" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando editor visual..." />}>
                            <Builder />
                        </Suspense>
                    } />
                    <Route path="builder/:pageId" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando editor visual..." />}>
                            <Builder />
                        </Suspense>
                    } />
                    <Route path="billing" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando planes..." />}>
                            <Billing />
                        </Suspense>
                    } />
                    <Route path="super-admin" element={
                        <Suspense fallback={<LoadingSpinner size="lg" message="Cargando Super Admin..." />}>
                            <SuperAdminDashboard />
                        </Suspense>
                    } />
                    <Route path="test-auth" element={<TestAuth />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;