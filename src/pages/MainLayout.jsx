// src/components/MainLayout.jsx
import React, { useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, theme, Modal } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { CheckSquareOutlined } from "@ant-design/icons";
import { AreaChartOutlined } from '@ant-design/icons';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  LogoutOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  SolutionOutlined,
  SendOutlined,
  FileProtectOutlined, // Icon cho Hợp đồng
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy các biến màu sắc từ Theme config
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // --- 1. KIỂM TRA ĐĂNG NHẬP (BẢO MẬT) ---
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Lấy thông tin user từ LocalStorage
  const role = localStorage.getItem("role") || "user"; // admin, hr, user
  const username = localStorage.getItem("user") || "Người dùng";

  // Xử lý Đăng xuất
  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc muốn thoát khỏi hệ thống?",
      onOk: () => {
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  // --- 2. CẤU HÌNH MENU BÊN TRÁI ---
  const items = [
    // Ai cũng thấy
    { key: "/", icon: <BarChartOutlined />, label: "Tổng quan" },
    (role === 'admin' || role === 'hr') && { key: '/reports', icon: <AreaChartOutlined />, label: 'Báo cáo & Thống kê' },

    // Chỉ Admin và HR thấy
    (role === "admin" || role === "hr") && { type: "divider" },
    (role === "admin" || role === "hr") && {
      key: "/contracts",
      icon: <FileProtectOutlined />,
      label: "Hợp đồng LĐ",
    }, // Mới thêm
    (role === "admin" || role === "hr") && {
      key: "/employees",
      icon: <TeamOutlined />,
      label: "Hồ sơ Nhân sự",
    },

    // Chỉ Admin thấy
    role === "admin" && {
      key: "/accounts",
      icon: <SolutionOutlined />,
      label: "Quản lý Tài khoản",
    },
    (role === "admin" || role === "hr") && {
      key: "/approve-leave",
      icon: <CheckSquareOutlined />,
      label: "Duyệt đơn phép",
    },

    // Ai cũng thấy
    { type: "divider" },
    { key: "/teaching", icon: <BookOutlined />, label: "Giờ giảng dạy" },
    { key: "/timekeeping", icon: <ClockCircleOutlined />, label: "Chấm công" },
    { key: "/leave", icon: <SendOutlined />, label: "Nghỉ phép" },
  ];

  // Menu con khi bấm vào Avatar
  const userMenu = (
    <Menu
      items={[
        { key: "1", label: "Thông tin cá nhân" ,onClick: () => navigate('/profile')},
        { key: "2", label: "Đổi mật khẩu" },
        { type: "divider" },
        {
          key: "3",
          label: "Đăng xuất",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
          danger: true,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDER (Thanh bên trái) */}
      <Sider width={260} breakpoint="lg" collapsedWidth="0">
        <div
          className="logo-area"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            background: "rgba(255,255,255,0.1)",
            letterSpacing: 1,
          }}
        >
          HRM EDUCATION
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={(e) => navigate(e.key)}
          style={{ border: "none", padding: "10px 0" }}
        />
      </Sider>

      {/* LAYOUT CHÍNH (Bên phải) */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 999,
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#003eb3",
              textTransform: "uppercase",
              fontSize: 16,
            }}
          >
            Hệ thống Quản lý Nhân sự Khoa CNTT
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right", lineHeight: "1.2" }}>
              <div style={{ fontWeight: 600 }}>{username}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {role === "admin"
                  ? "Quản trị viên"
                  : role === "hr"
                  ? "Nhân sự"
                  : "Giảng viên"}
              </div>
            </div>
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar
                style={{
                  backgroundColor: "#003eb3",
                  cursor: "pointer",
                  verticalAlign: "middle",
                }}
                size="large"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        {/* CONTENT (Nội dung thay đổi) */}
        <Content style={{ margin: "24px 24px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: "80vh", // Chiều cao tối thiểu
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* FOOTER */}
        <Footer
          style={{ textAlign: "center", color: "#888", padding: "20px 0" }}
        >
          HRM System ©2025 Created by Group 06
        </Footer>
      </Layout>
    </Layout>
  );
}
