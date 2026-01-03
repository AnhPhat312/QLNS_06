// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Tag, Button, Input, Form, message, Spin } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Hàm Map tài khoản đăng nhập với Mã NV (Dùng cho Demo)
  const getCurrentMaNV = () => {
    const user = localStorage.getItem('user');
    switch (user) {
      case 'admin': return 'NV01';
      case 'hr': return 'NV02';
      case 'gv01': return 'NV03';
      case 'gv02': return 'NV04';
      default: return 'NV03'; // Mặc định
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    const maNV = getCurrentMaNV();
    
    // Lấy thông tin nhân viên + Phòng ban + Chức vụ
    const { data, error } = await supabase
      .from('nhan_vien')
      .select('*, phong_ban(ten_pb), chuc_vu(ten_cv)')
      .eq('ma_nv', maNV)
      .single();

    if (error) {
      message.error('Không tìm thấy thông tin nhân viên!');
    } else {
      setProfile(data);
      form.setFieldsValue({ sdt: data.sdt, dia_chi: data.dia_chi, email: data.email });
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfile() }, []);

  const handleUpdate = async (values) => {
    setLoading(true);
    const maNV = getCurrentMaNV();
    
    // Chỉ cho phép cập nhật SĐT, Địa chỉ, Email
    const { error } = await supabase
      .from('nhan_vien')
      .update({ 
        sdt: values.sdt, 
        dia_chi: values.dia_chi,
        email: values.email
      })
      .eq('ma_nv', maNV);

    if (error) message.error('Cập nhật thất bại: ' + error.message);
    else {
      message.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      fetchProfile(); // Tải lại dữ liệu mới
    }
    setLoading(false);
  };

  if (loading && !profile) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header Profile */}
      <Card bordered={false} style={{ marginBottom: 24, background: 'linear-gradient(to right, #003eb3, #54a0ff)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#fff', color: '#003eb3' }} />
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: 28 }}>{profile?.ho_ten}</h1>
            <p style={{ opacity: 0.9, fontSize: 16, marginTop: 5 }}>
              {profile?.chuc_vu?.ten_cv} - {profile?.phong_ban?.ten_pb}
            </p>
            <Tag color="gold">Mã NV: {profile?.ma_nv}</Tag>
          </div>
        </div>
      </Card>

      {/* Thông tin chi tiết */}
      <Card 
        title="Thông tin chi tiết" 
        extra={
          !isEditing ? 
            <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Chỉnh sửa</Button> 
            : 
            <div style={{ display: 'flex', gap: 10 }}>
              <Button icon={<RollbackOutlined />} onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>Lưu</Button>
            </div>
        }
      >
        {!isEditing ? (
          <Descriptions bordered column={1} labelStyle={{ width: '200px', fontWeight: 'bold' }}>
            <Descriptions.Item label="Ngày sinh">{profile?.ngay_sinh}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{profile?.gioi_tinh}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{profile?.sdt}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ thường trú">{profile?.dia_chi}</Descriptions.Item>
            <Descriptions.Item label="Ngày vào làm">{profile?.ngay_vao_lam}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
            <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="dia_chi" label="Địa chỉ" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default Profile;