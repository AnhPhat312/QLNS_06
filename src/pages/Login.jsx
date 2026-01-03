// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tai_khoan')
      .select('*')
      .eq('ten_dang_nhap', values.username)
      .eq('mat_khau', values.password)
      .single();

    if (error || !data) {
      message.error('Sai tài khoản hoặc mật khẩu!');
    } else {
      message.success('Đăng nhập thành công!');
      localStorage.setItem('role', data.quyen_han);
      localStorage.setItem('user', data.ten_dang_nhap);
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Màu nền Gradient
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card 
        style={{ 
          width: 420, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // Đổ bóng đẹp
          borderRadius: 12,
          padding: 20
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: '#003eb3' }} />
          <Title level={2} style={{ color: '#003eb3', marginTop: 10, marginBottom: 5 }}>HRM EDU</Title>
          <Text type="secondary">Đăng nhập hệ thống quản lý nhân sự</Text>
        </div>

        <Form
          name="login_form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 45, fontWeight: 600 }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;