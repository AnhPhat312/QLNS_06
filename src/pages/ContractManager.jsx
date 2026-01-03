// src/pages/ContractManager.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Card,
} from "antd";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import { supabase } from "../supabaseClient";
// import dayjs from 'dayjs'; // Nếu muốn format ngày đẹp hơn

function ContractManager() {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách hợp đồng và nhân viên
  const fetchData = async () => {
    setLoading(true);
    const { data: hd } = await supabase
      .from("hop_dong")
      .select("*, nhan_vien(ho_ten)");
    const { data: nv } = await supabase
      .from("nhan_vien")
      .select("ma_nv, ho_ten");
    setContracts(hd);
    setEmployees(nv);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values) => {
    // Xử lý dữ liệu ngày tháng từ DatePicker
    const payload = {
      so_hd: values.so_hd,
      ma_nv: values.ma_nv,
      loai_hd: values.loai_hd,
      ngay_ky: values.ngay_ky ? values.ngay_ky.format("YYYY-MM-DD") : null,
      ngay_het_han: values.ngay_het_han
        ? values.ngay_het_han.format("YYYY-MM-DD")
        : null,
    };

    const { error } = await supabase.from("hop_dong").insert([payload]);

    if (error) message.error("Lỗi: " + error.message);
    else {
      message.success("Tạo hợp đồng thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    }
  };

  const columns = [
    {
      title: "Số HĐ",
      dataIndex: "so_hd",
      key: "so_hd",
      render: (t) => <b>{t}</b>,
    },
    { title: "Nhân viên", dataIndex: ["nhan_vien", "ho_ten"], key: "nv" },
    {
      title: "Loại HĐ",
      dataIndex: "loai_hd",
      key: "loai",
      render: (t) => (
        <Tag color={t === "DaiHan" ? "blue" : "orange"}>
          {t === "DaiHan" ? "Dài hạn" : "Ngắn hạn/Thử việc"}
        </Tag>
      ),
    },
    { title: "Ngày ký", dataIndex: "ngay_ky", key: "ky" },
    { title: "Ngày hết hạn", dataIndex: "ngay_het_han", key: "hethan" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ color: "#003eb3", margin: 0 }}>
          Quản lý Hợp đồng Lao động
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Tạo Hợp đồng
        </Button>
      </div>

      <Card
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Table
          loading={loading}
          dataSource={contracts}
          columns={columns}
          rowKey="so_hd"
        />
      </Card>

      <Modal
        title="Tạo Hợp đồng mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="so_hd"
            label="Số Hợp đồng"
            rules={[{ required: true }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="VD: HD-2024-001"
            />
          </Form.Item>

          <Form.Item
            name="ma_nv"
            label="Nhân viên"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((nv) => (
                <Select.Option key={nv.ma_nv} value={nv.ma_nv}>
                  {nv.ma_nv} - {nv.ho_ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="loai_hd"
            label="Loại hợp đồng"
            initialValue="ThuViec"
          >
            <Select>
              <Select.Option value="ThuViec">Thử việc (2 tháng)</Select.Option>
              <Select.Option value="NganHan">Ngắn hạn (1 năm)</Select.Option>
              <Select.Option value="DaiHan">
                Dài hạn / Vô thời hạn
              </Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", gap: 10 }}>
            <Form.Item
              name="ngay_ky"
              label="Ngày ký"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="ngay_het_han"
              label="Ngày hết hạn"
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" block>
            Lưu Hợp đồng
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default ContractManager;
