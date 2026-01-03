// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Skeleton } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

function Dashboard() {
  const [stats, setStats] = useState({ nv: 0, gio: 0, don: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      // Logic lấy dữ liệu như cũ...
      const { count: countNV } = await supabase.from('nhan_vien').select('*', { count: 'exact', head: true });
      const { count: countDon } = await supabase.from('don_nghi_phep').select('*', { count: 'exact', head: true });
      const { count: countGio } = await supabase.from('gio_giang_day').select('*', { count: 'exact', head: true });

      setStats({ nv: countNV || 0, gio: countGio || 0, don: countDon || 0 });
      setLoading(false);
    };
    getStats();
  }, []);

  // Component hiển thị thẻ thống kê đẹp
  const StatCard = ({ title, value, icon, color }) => (
    <Card bordered={false} hoverable style={{ height: '100%', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#8c8c8c', fontSize: 14 }}>{title}</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5 }}>{value}</div>
        </div>
        <div style={{ 
          backgroundColor: color, 
          width: 50, height: 50, 
          borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 20, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Tổng quan Hệ thống</h2>
      {loading ? <Skeleton active /> : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <StatCard title="Tổng Nhân sự" value={stats.nv} icon={<UserOutlined />} color="#1890ff" />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard title="Hồ sơ Giờ giảng" value={stats.gio} icon={<BookOutlined />} color="#52c41a" />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard title="Đơn Nghỉ phép" value={stats.don} icon={<FileTextOutlined />} color="#faad14" />
          </Col>
        </Row>
      )}
      
      {/* Khu vực biểu đồ hoặc thông báo thêm có thể để ở đây */}
      <div style={{ marginTop: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
        <h3>Thông báo mới</h3>
        <p>Chào mừng bạn đến với hệ thống quản lý nhân sự khoa CNTT...</p>
      </div>
    </div>
  );
}

export default Dashboard;