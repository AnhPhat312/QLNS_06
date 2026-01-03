import React, { useState, useEffect } from 'react';
import { Table, Form, InputNumber, Button, Select, message, Input, Card, Row, Col, Tag } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

function TeachingHours() {
  const [data, setData] = useState([]);
  const [nhanVien, setNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data: gio } = await supabase.from('gio_giang_day').select('*, nhan_vien(ho_ten)');
    const { data: nv } = await supabase.from('nhan_vien').select('ma_nv, ho_ten');
    setData(gio);
    setNhanVien(nv);
    setLoading(false);
  };

  useEffect(() => { loadData() }, []);

  const onFinish = async (values) => {
    const { error } = await supabase.from('gio_giang_day').insert([values]);
    if (error) message.error('Lỗi: ' + error.message);
    else {
      message.success('Cập nhật giờ giảng thành công!');
      form.resetFields();
      loadData();
    }
  };

  const columns = [
    { title: 'Giảng viên', dataIndex: ['nhan_vien', 'ho_ten'], key: 'gv', render: t => <b>{t}</b> },
    { title: 'Học kỳ', dataIndex: 'hoc_ky', key: 'hk', render: t => <Tag color="cyan">{t}</Tag> },
    { title: 'Lý thuyết', dataIndex: 'so_tiet_ly_thuyet', key: 'lt', align: 'right' },
    { title: 'Thực hành', dataIndex: 'so_tiet_thuc_hanh', key: 'th', align: 'right' },
    { title: 'Hệ số', dataIndex: 'he_so', key: 'hs', align: 'center' },
    { 
      title: 'Tổng quy đổi', 
      dataIndex: 'tong_quy_doi', 
      key: 'tong', 
      align: 'right',
      render: t => <b style={{ color: '#d4380d' }}>{t}</b> 
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16, color: '#003eb3' }}>Quản lý Giờ giảng dạy</h2>
      
      <Row gutter={24}>
        {/* Cột trái: Form nhập liệu */}
        <Col span={8}>
          <Card title="Cập nhật giờ giảng" bordered={false} style={{ height: '100%' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="ma_nv" label="Giảng viên" rules={[{ required: true }]}>
                <Select placeholder="Chọn giảng viên" showSearch optionFilterProp="children">
                  {nhanVien.map(nv => <Select.Option key={nv.ma_nv} value={nv.ma_nv}>{nv.ho_ten}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="hoc_ky" label="Học kỳ" initialValue="HK1-2024"><Input /></Form.Item>
              <Row gutter={16}>
                <Col span={12}><Form.Item name="so_tiet_ly_thuyet" label="Lý thuyết" initialValue={0}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={12}><Form.Item name="so_tiet_thuc_hanh" label="Thực hành" initialValue={0}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
              </Row>
              <Form.Item name="he_so" label="Hệ số quy đổi" initialValue={0.7}><InputNumber step={0.1} style={{ width: '100%' }} /></Form.Item>
              
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>Lưu dữ liệu</Button>
            </Form>
          </Card>
        </Col>

        {/* Cột phải: Bảng dữ liệu */}
        <Col span={16}>
          <Card bordered={false} title="Danh sách giờ giảng đã nhập" extra={<Button icon={<ReloadOutlined />} onClick={loadData}>Tải lại</Button>}>
            <Table loading={loading} dataSource={data} columns={columns} rowKey="ma_gio" pagination={{ pageSize: 5 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TeachingHours;