import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import GuestRoute from "./components/guard/GuestRoute";
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
import Category from "./pages/backend/Category";
import Tag from "./pages/backend/Tag";
import Blog from "./pages/backend/Blog";
import NotFound from "./pages/NotFound";
import User from "./pages/backend/User";
import Settings from "./pages/backend/Settings";
import Profile from "./pages/backend/Profile";


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
              <Route path="/login" element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }/>
              <Route path="/register" element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }/>
            </Route>
            {/* Protected Dashboard */}
            <Route element={<ProtectedRoute roles={["ADMIN", "AUTHOR", "USER"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* only admin */}
                <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                  <Route path="/category" element={<Category />} />
                  <Route path="/tags" element={<Tag />} />
                  <Route path="/users" element={<User />} />
                </Route>

                {/* Admin + Author own project */}
                <Route element={<ProtectedRoute roles={["ADMIN", "AUTHOR"]} />}>
                  <Route path="/blogs" element={<Blog />} />
                </Route>
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
