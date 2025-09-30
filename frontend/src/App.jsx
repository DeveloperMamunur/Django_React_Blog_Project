import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import FrontendLayouts from "./layouts/FrontendLayouts";
import DashboardLayout from "./layouts/DashboardLayouts";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/frontend/Home";
import About from "./pages/frontend/About";
import Contact from "./pages/frontend/Contact";
import Dashboard from "./pages/backend/Dashboard";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Public Frontend */}
            <Route path="/" element={<FrontendLayouts />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
            </Route>
            {/* Protected Dashboard */}
            <Route element={<ProtectedRoute roles={["ADMIN", "AUTHOR", "USER"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
