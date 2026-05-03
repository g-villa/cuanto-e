import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import Register from "./pages/Register";
import Login from "./pages/Login";
import History from "./pages/History";
import ComoFunciona from "./pages/ComoFunciona";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/historial" element={<History />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
