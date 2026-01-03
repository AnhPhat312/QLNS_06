import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Card, Popconfirm, Space } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

function LeaveManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách đơn nghỉ phép kèm tên nhân viên
  const fetchData = async () => {
    setLoading(true);
    const { data: list, error } = await supabase
      .from('don_nghi_phep')
      .select('*, nhan_vien(ho_ten)')
      .order('ma_don', { ascending: false }); // Đơn mới nhất lên đầu

    if (error) message.error('Lỗi tải dữ liệu');
    else setData(list);
    setLoading(false);
  };

  useEffect(() => { fetchData() }, []);

  // 2. Hàm xử lý Duyệt hoặc Từ chối
  const handleApprove = async (id, status) => {
    const { error } = await supabase
      .from('don_nghi_phep')
      .update({ trang_thai: status }) // status = 'Da_Duyet' hoặc 'Tu_Choi'
      .eq('ma_don', id);

    if (error) message.error('Có lỗi xảy ra!');
    else {
      message.success(status === 'Da_Duyet' ? 'Đã duyệt đơn!' : 'Đã từ chối đơn!');
      fetchData(); // Tải lại bảng
    }
  };

  const columns = [
    { title: 'Mã NV', dataIndex: 'ma_nv', width: 100 },
    { title: 'Họ tên', dataIndex: ['nhan_vien', 'ho_ten'], render: t => <b>{t}</b> },
    { 
      title: 'Loại nghỉ', 
      dataIndex: 'loai_nghi',
      render: t => t === 'PhepNam' ? 'Phép năm' : (t === 'OmDau' ? 'Ốm đau' : 'Việc riêng')
    },
    { title: 'Từ ngày', dataIndex: 'tu_ngay' },
    { title: 'Lý do', dataIndex: 'ly_do' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trang_thai',
      render: status => {
        let color = status === 'Cho_Duyet' ? 'orange' : (status === 'Da_Duyet' ? 'green' : 'red');
        let text = status === 'Cho_Duyet' ? 'Chờ duyệt' : (status === 'Da_Duyet' ? 'Đã duyệt' : 'Từ chối');
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        record.trang_thai === 'Cho_Duyet' && (
          <Space>
            <Popconfirm title="Duyệt đơn này?" onConfirm={() => handleApprove(record.ma_don, 'Da_Duyet')}>
              <Button type="primary" size="small" icon={<CheckOutlined />}>Duyệt</Button>
            </Popconfirm>
            <Popconfirm title="Từ chối đơn này?" onConfirm={() => handleApprove(record.ma_don, 'Tu_Choi')}>
               <Button type="dashed" danger size="small" icon={<CloseOutlined />}>Từ chối</Button>
            </Popconfirm>
          </Space>
        )
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ color: '#003eb3', margin: 0 }}>Quản lý Đơn nghỉ phép</h2>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>Tải lại</Button>
      </div>
      <Card bordered={false}>
        <Table loading={loading} dataSource={data} columns={columns} rowKey="ma_don" />
      </Card>
    </div>
  );
}

export default LeaveManagement;