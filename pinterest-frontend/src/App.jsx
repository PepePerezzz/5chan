import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import PinDetail from './pages/PinDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        //Rutas Públicas
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id_usuario" element={<Profile />} />
        
        //Ruta con parámetros dinamicos (:id) para ver un pin a detalle
        <Route path="/pin/:id" element={<PinDetail />} />

        //Rutas Privadas/Protegidas 
        <Route
        path="/profile"
        element={
          <ProtectedRoutes roles={["usuario", "admin"]}>
            <Profile />
          </ProtectedRoutes>
        }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoutes roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        //Manejo de error 404 por si escriben una URL rota
        <Route path="*" element={<div style={{ padding: '20px' }}><h2>404 - Página No Encontrada </h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;