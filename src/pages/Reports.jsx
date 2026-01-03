import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Progress, Statistic, Table, Button, Divider, Typography } from 'antd';
import { PieChartOutlined, BarChartOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const { Title } = Typography;

function Reports() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalNV: 0,
    byDept: {}, // Thống kê theo phòng ban
    byGender: { Nam: 0, Nu: 0 }, // Thống kê giới tính
    salaryFund: 0 // Quỹ phụ cấp (Demo)
  });

  useEffect(() => {
    const calcStats = async () => {
      setLoading(true);
      
      // 1. Lấy toàn bộ nhân viên kèm Phòng ban và Chức vụ
      const { data: nv } = await supabase
        .from('nhan_vien')
        .select('*, phong_ban(ten_pb), chuc_vu(phu_cap)');

      if (nv) {
        let deptCount = {};
        let genderCount = { Nam: 0, Nu: 0 };
        let totalFund = 0;

        nv.forEach(person => {
          // Tính theo phòng ban
          const deptName = person.phong_ban?.ten_pb || 'Khác';
          deptCount[deptName] = (deptCount[deptName] || 0) + 1;

          // Tính theo giới tính
          if (person.gioi_tinh === 'Nam') genderCount.Nam++;
          else genderCount.Nu++;

          // Tính quỹ phụ cấp (Demo lương)
          totalFund += (person.chuc_vu?.phu_cap || 0);
        });

        setData({
          totalNV: nv.length,
          byDept: deptCount,
          byGender: genderCount,
          salaryFund: totalFund
        });
      }
      setLoading(false);
    };

    calcStats();
  }, []);

  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ color: '#003eb3', margin: 0 }}>Báo cáo & Thống kê</h2>
        <Button icon={<DownloadOutlined />} type="primary">Xuất báo cáo Excel</Button>
      </div>

      <Row gutter={[16, 16]}>
        {/* 1. Biểu đồ Nhân sự theo Phòng ban */}
        <Col span={12}>
          <Card title={<><BarChartOutlined /> Nhân sự theo Phòng ban</>} bordered={false}>
            {Object.keys(data.byDept).map(dept => {
              const count = data.byDept[dept];
              const percent = ((count / data.totalNV) * 100).toFixed(1);
              return (
                <div key={dept} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{dept}</span>
                    <b>{count} người</b>
                  </div>
                  <Progress percent={percent} status="active" strokeColor="#1890ff" />
                </div>
              );
            })}
          </Card>
        </Col>

        {/* 2. Biểu đồ Giới tính & Quỹ lương */}
        <Col span={12}>
          <Card title={<><PieChartOutlined /> Cơ cấu & Quỹ lương</>} bordered={false} style={{ height: '100%' }}>
            <Row gutter={16} style={{ textAlign: 'center', marginBottom: 20 }}>
              <Col span={12}>
                <Progress type="circle" percent={((data.byGender.Nam / data.totalNV) * 100).toFixed(0)} format={() => `${data.byGender.Nam} Nam`} strokeColor="#003eb3" />
              </Col>
              <Col span={12}>
                <Progress type="circle" percent={((data.byGender.Nu / data.totalNV) * 100).toFixed(0)} format={() => `${data.byGender.Nu} Nữ`} strokeColor="#eb2f96" />
              </Col>
            </Row>
            
            <Divider />
            
            <Statistic 
              title="Tổng quỹ phụ cấp chức vụ (Tháng)" 
              value={data.salaryFund} 
              formatter={formatCurrency}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>

        {/* 3. Bảng tóm tắt nhanh */}
        <Col span={24}>
          <Card title="Chi tiết biến động nhân sự (Tháng 10/2024)" bordered={false}>
             <Table 
               pagination={false}
               dataSource={[
                 { key: 1, hang_muc: 'Tuyển dụng mới', so_luong: 2, ghi_chu: 'Giảng viên khoa CNTT' },
                 { key: 2, hang_muc: 'Nghỉ việc / Thôi việc', so_luong: 0, ghi_chu: '-' },
                 { key: 3, hang_muc: 'Nghỉ thai sản', so_luong: 1, ghi_chu: 'Cô Nguyễn Thị A' },
               ]} 
               columns={[
                 { title: 'Hạng mục', dataIndex: 'hang_muc', render: t => <b>{t}</b> },
                 { title: 'Số lượng', dataIndex: 'so_luong', align: 'center' },
                 { title: 'Ghi chú', dataIndex: 'ghi_chu' }
               ]}
             />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Reports;