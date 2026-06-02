import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import PinDetail from './pages/PinDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Aquí pueden colocar un componente <Navbar /> global si lo desean */}
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ruta con parámetros dinámicos (:id) para ver un pin a detalle */}
        <Route path="/pin/:id" element={<PinDetail />} />

        {/* Rutas Privadas/Protegidas (Por ahora accesibles) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Manejo de error 404 por si escriben una URL rota */}
        <Route path="*" element={<div style={{ padding: '20px' }}><h2>404 - Página No Encontrada 😢</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;