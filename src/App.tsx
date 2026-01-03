// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. Import các trang (Đường dẫn ./pages/...)
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeManager from "./pages/EmployeeManager";
import TeachingHours from "./pages/TeachingHours";
import AccountManager from "./pages/AccountManager";
import Timekeeping from "./pages/Timekeeping";
import LeaveRequest from "./pages/LeaveRequest";
import Reports from './pages/Reports';
import Profile from './pages/Profile';

// 2. Import Layout (Đường dẫn ./components/...)
import MainLayout from "./pages/MainLayout";
import ContractManager from "./pages/ContractManager";
import LeaveManagement from "./pages/LeaveManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Đăng nhập (Nằm ngoài Layout) */}
        <Route path="/login" element={<Login />} />

        {/* Các Route cần đăng nhập (Nằm trong MainLayout) */}
        <Route path="/" element={<MainLayout />}>
          {/* Mặc định vào trang Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Các trang con */}
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="teaching" element={<TeachingHours />} />
          <Route path="accounts" element={<AccountManager />} />
          <Route path="timekeeping" element={<Timekeeping />} />
          <Route path="leave" element={<LeaveRequest />} />
          <Route path="contracts" element={<ContractManager />} />
          <Route path="approve-leave" element={<LeaveManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Nếu nhập linh tinh thì chuyển về trang Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
