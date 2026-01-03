import React, { useState } from 'react';
import { Form, DatePicker, Input, Button, message, Card, Select, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const { Title, Text } = Typography;

function LeaveRequest() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    // Demo: Gán cứng mã NV. Thực tế bạn nên lấy từ localStorage
    const { error } = await supabase.from('don_nghi_phep').insert([{
      ...values,
      trang_thai: 'Cho_Duyet',
    }]);

    if (error) message.error('Lỗi: ' + error.message);
    else {
      message.success('Đã gửi đơn thành công!');
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={3} style={{ color: '#003eb3' }}>Đơn xin nghỉ phép</Title>
          <Text type="secondary">Vui lòng điền đầy đủ thông tin để trình Trưởng khoa duyệt</Text>
        </div>

        <Form form={form} onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="ma_nv" label="Mã Nhân viên" initialValue="NV03" rules={[{ required: true }]}>
             <Input placeholder="Nhập mã NV của bạn" />
          </Form.Item>
          
          <Form.Item name="loai_nghi" label="Loại nghỉ" initialValue="PhepNam">
            <Select>
              <Select.Option value="PhepNam">Nghỉ Phép năm</Select.Option>
              <Select.Option value="OmDau">Nghỉ Ốm</Select.Option>
              <Select.Option value="ViecRieng">Việc riêng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="tu_ngay" label="Ngày bắt đầu nghỉ" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
          </Form.Item>
          
          <Form.Item name="ly_do" label="Lý do chi tiết" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Ví dụ: Tôi bị sốt cao cần đi khám..." />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />} block>
            Gửi đơn ngay
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LeaveRequest;