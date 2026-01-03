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
  Card,
  Space,
  Tag,
} from "antd";
import {
  UserAddOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";

function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // Danh sách phòng ban
  const [positions, setPositions] = useState([]); // Danh sách chức vụ

  // --- ĐÂY LÀ "CÁI CÔNG TẮC" QUAN TRỌNG ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 1. Lấy dữ liệu từ Database
  const fetchData = async () => {
    setLoading(true);
    // Lấy nhân viên
    const { data: nv } = await supabase
      .from("nhan_vien")
      .select("*, phong_ban(ten_pb), chuc_vu(ten_cv)")
      .order("ma_nv", { ascending: true });

    // Lấy phòng ban để đổ vào ô chọn
    const { data: pb } = await supabase.from("phong_ban").select("*");

    // Lấy chức vụ để đổ vào ô chọn
    const { data: cv } = await supabase.from("chuc_vu").select("*");

    if (nv) setEmployees(nv);
    if (pb) setDepartments(pb);
    if (cv) setPositions(cv);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Xử lý khi bấm nút "Lưu"
  const handleCreate = async (values) => {
    const payload = {
      ma_nv: values.ma_nv,
      ho_ten: values.ho_ten,
      ngay_sinh: values.ngay_sinh
        ? values.ngay_sinh.format("YYYY-MM-DD")
        : null,
      gioi_tinh: values.gioi_tinh,
      email: values.email,
      sdt: values.sdt,
      dia_chi: values.dia_chi,
      ma_pb: values.ma_pb, // Lưu mã phòng ban
      ma_cv: values.ma_cv, // Lưu mã chức vụ
    };

    const { error } = await supabase.from("nhan_vien").insert([payload]);

    if (error) {
      if (error.code === "23505") message.error("Mã nhân viên này đã tồn tại!");
      else message.error("Lỗi: " + error.message);
    } else {
      message.success("Thêm nhân viên thành công!");
      setIsModalOpen(false); // Đóng form
      form.resetFields(); // Xóa trắng form
      fetchData(); // Tải lại bảng
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã NV",
      dataIndex: "ma_nv",
      key: "ma",
      render: (t) => <b>{t}</b>,
    },
    { title: "Họ tên", dataIndex: "ho_ten", key: "ten" },
    { title: "Phòng ban", dataIndex: ["phong_ban", "ten_pb"], key: "pb" },
    {
      title: "Chức vụ",
      dataIndex: ["chuc_vu", "ten_cv"],
      key: "cv",
      render: (t) => <Tag color="blue">{t}</Tag>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "sdt", key: "sdt" },
  ];

  return (
    <div>
      {/* THANH TIÊU ĐỀ VÀ NÚT BẤM */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ color: "#003eb3", margin: 0 }}>Hồ sơ Nhân sự</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Tải lại
          </Button>

          {/* --- NÚT BẤM KÍCH HOẠT MODAL Ở ĐÂY --- */}
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm nhân viên
          </Button>
        </Space>
      </div>

      {/* BẢNG HIỂN THỊ */}
      <Card
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table
          loading={loading}
          dataSource={employees}
          columns={columns}
          rowKey="ma_nv"
        />
      </Card>

      {/* --- PHẦN MODAL (FORM ẨN) --- */}
      <Modal
        title="Thêm nhân viên mới"
        open={isModalOpen} // Biến này = true thì hiện, false thì ẩn
        onCancel={() => setIsModalOpen(false)} // Bấm ra ngoài hoặc nút X thì tắt
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleCreate}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* Cột 1 */}
            <div>
              <Form.Item
                name="ma_nv"
                label="Mã Nhân viên"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: NV06" />
              </Form.Item>
              <Form.Item
                name="ho_ten"
                label="Họ và tên"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập họ tên..." />
              </Form.Item>
              <Form.Item name="gioi_tinh" label="Giới tính" initialValue="Nam">
                <Select>
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="ngay_sinh" label="Ngày sinh">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            {/* Cột 2 */}
            <div>
              <Form.Item
                name="ma_pb"
                label="Phòng ban"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn phòng ban">
                  {departments.map((d) => (
                    <Select.Option key={d.ma_pb} value={d.ma_pb}>
                      {d.ten_pb}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="ma_cv"
                label="Chức vụ"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn chức vụ">
                  {positions.map((c) => (
                    <Select.Option key={c.ma_cv} value={c.ma_cv}>
                      {c.ten_cv}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="sdt" label="Số điện thoại">
                <Input />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="dia_chi" label="Địa chỉ">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
              <Button type="primary" htmlType="submit">
                Lưu hồ sơ
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default EmployeeManager;
