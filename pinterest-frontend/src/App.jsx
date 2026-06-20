import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from "./components/ProtectedRoutes";
import Loader from "./components/Loader";

// Lazy Loading: cada página se carga en su propio chunk solo cuando se navega a ella.
const Feed = lazy(() => import('./pages/Feed'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PinDetail = lazy(() => import('./pages/PinDetails'));
const ProfileLayout = lazy(() => import('./pages/ProfileLayout'));
const ProfilePins = lazy(() => import('./pages/ProfilePins'));
const ProfileBoards = lazy(() => import('./pages/ProfileBoards'));
const BoardDetail = lazy(() => import('./pages/BoardDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <BrowserRouter>
      {/* Suspense muestra el Loader mientras se descarga el chunk de la página */}
      <Suspense fallback={<Loader message="Cargando..." />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta con parámetro dinámico (:id) para ver un pin a detalle */}
          <Route path="/pin/:id" element={<PinDetail />} />

          {/* Perfil con rutas anidadas (Outlet): /profile y /profile/boards */}
          <Route
            path="/profile"
            element={
              <ProtectedRoutes roles={["usuario", "admin"]}>
                <ProfileLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<ProfilePins />} />
            <Route path="boards" element={<ProfileBoards />} />
          </Route>

          {/* Detalle de un tablero: /boards/:boardId */}
          <Route
            path="/boards/:boardId"
            element={
              <ProtectedRoutes roles={["usuario", "admin"]}>
                <BoardDetail />
              </ProtectedRoutes>
            }
          />

          {/* Panel de administración (solo admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />

          {/* Manejo de error 404 por si escriben una URL rota */}
          <Route
            path="*"
            element={
              <div style={{ padding: '20px' }}>
                <h2>404 - Página No Encontrada </h2>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
