import React, { useEffect, useState } from 'react';
import { Table, message, Card, Button, Statistic, Row, Col } from 'antd';
import { CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

function Timekeeping() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: cc } = await supabase.from('cham_cong').select('*, nhan_vien(ho_ten)');
      setData(cc);
      setLoading(false);
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Mã NV', dataIndex: 'ma_nv', width: 100 },
    { title: 'Họ tên nhân viên', dataIndex: ['nhan_vien', 'ho_ten'], render: t => <b>{t}</b> },
    { title: 'Tháng', dataIndex: 'thang', align: 'center' },
    { title: 'Năm', dataIndex: 'nam', align: 'center' },
    { 
      title: 'Ngày công thực tế', 
      dataIndex: 'so_ngay_lam', 
      align: 'right',
      render: t => <b style={{ color: '#389e0d' }}>{t} ngày</b>
    },
    { 
      title: 'Nghỉ có phép', 
      dataIndex: 'so_ngay_nghi', 
      align: 'right',
      render: t => <span style={{ color: '#d46b08' }}>{t} ngày</span>
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ color: '#003eb3', margin: 0 }}>Dữ liệu Chấm công</h2>
        <Button icon={<UploadOutlined />}>Nhập từ Excel (Demo)</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
           <Card bordered={false} bodyStyle={{ padding: 16 }}>
             <Statistic title="Kỳ công hiện tại" value="Tháng 10/2024" prefix={<CalendarOutlined />} />
           </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <Table loading={loading} dataSource={data} columns={columns} rowKey="ma_cong" />
      </Card>
    </div>
  );
}

export default Timekeeping;