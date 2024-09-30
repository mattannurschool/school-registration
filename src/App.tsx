import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/Home";
import ShowStudentsPage from "./pages/showStudent/ShowStudent";
import CreateEditStudentPage from "./pages/createEditStudent/CreateEditStudent";
import ProtectedRoute from "./components/HOC/ProtectedRoute";
import LoginPage from "./pages/login/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App ">
      <Router>
        <Navbar />
        <div className="min-h-[100vh]">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <ShowStudentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-edit-student/:id?"
              element={
                <ProtectedRoute>
                  <CreateEditStudentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
