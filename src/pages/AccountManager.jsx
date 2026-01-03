import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Select, message, Card, Badge } from 'antd';
import { UserAddOutlined, KeyOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchAcc = async () => {
    const { data } = await supabase.from('tai_khoan').select('*');
    setAccounts(data);
  };
  useEffect(() => { fetchAcc() }, []);

  const handleCreate = async (values) => {
    const { error } = await supabase.from('tai_khoan').insert([values]);
    if(error) message.error('Tên đăng nhập đã tồn tại!');
    else {
      message.success('Cấp tài khoản thành công');
      setIsModalOpen(false);
      form.resetFields();
      fetchAcc();
    }
  };

  const columns = [
    { 
      title: 'Tên đăng nhập', 
      dataIndex: 'ten_dang_nhap', 
      render: t => <span style={{ fontWeight: 'bold', color: '#003eb3' }}>{t}</span> 
    },
    { 
      title: 'Vai trò (Quyền)', 
      dataIndex: 'quyen_han', 
      render: r => {
        let color = r === 'admin' ? 'red' : (r === 'hr' ? 'orange' : 'green');
        return <Tag color={color} key={r}>{r.toUpperCase()}</Tag>;
      } 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trang_thai', 
      render: s => s ? <Badge status="success" text="Đang hoạt động" /> : <Badge status="error" text="Đã khóa" /> 
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ color: '#003eb3', margin: 0 }}>Quản trị Tài khoản</h2>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>Cấp tài khoản mới</Button>
      </div>

      <Card bordered={false}>
        <Table dataSource={accounts} rowKey="ten_dang_nhap" columns={columns} />
      </Card>

      <Modal 
        title="Cấp tài khoản mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item name="ten_dang_nhap" label="Tên đăng nhập" rules={[{ required: true }]}><Input prefix={<UserAddOutlined />} /></Form.Item>
          <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true }]}><Input.Password prefix={<KeyOutlined />} /></Form.Item>
          <Form.Item name="quyen_han" label="Vai trò" initialValue="user">
            <Select>
              <Select.Option value="admin">Quản trị viên (Admin)</Select.Option>
              <Select.Option value="hr">Nhân sự (HR)</Select.Option>
              <Select.Option value="user">Giảng viên (User)</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Xác nhận tạo</Button>
        </Form>
      </Modal>
    </div>
  );
}

export default AccountManager;