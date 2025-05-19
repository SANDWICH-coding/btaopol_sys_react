
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Register from "./components/pages/Register";
import Login from "./components/pages/Login";

import DashboardLayout from "./components/layout/DashboardLayout";
import SchoolSection from "./components/sections/SchoolSection";
import StudentSection from './components/sections/StudentSection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/school"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SchoolSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/register-user" element={<Register />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>

  );
}

export default App;
