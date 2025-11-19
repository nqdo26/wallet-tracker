import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Space,
  Tag,
  Popconfirm,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { AppLayout } from "../components/layout/AppLayout";
import { walletApi } from "../api";
import type { Wallet, CreateWalletRequest, WalletType } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

export const WalletsPage = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWallets();

    // Listen for wallet created event from FirstWalletSetup
    const handleWalletCreated = () => {
      fetchWallets();
    };

    window.addEventListener("wallet-created", handleWalletCreated);

    return () => {
      window.removeEventListener("wallet-created", handleWalletCreated);
    };
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await walletApi.getAll();
      setWallets(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách ví";
      notification.error({
        message: "Lỗi tải danh sách ví",
        description: errorMessage,
        duration: 5,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (wallet?: Wallet) => {
    if (wallet) {
      setEditingWallet(wallet);
      form.setFieldsValue({
        name: wallet.name,
        type: wallet.type,
      });
    } else {
      setEditingWallet(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWallet(null);
    form.resetFields();
  };

  const handleSubmit = async (values: CreateWalletRequest) => {
    try {
      if (editingWallet) {
        await walletApi.update(editingWallet.id, {
          name: values.name,
          type: values.type,
        });
        notification.success({
          message: "Thành công",
          description: "Cập nhật ví thành công",
          placement: "topRight",
        });
      } else {
        await walletApi.create(values);
        notification.success({
          message: "Thành công",
          description: "Tạo ví mới thành công",
          placement: "topRight",
        });
      }
      handleCloseModal();
      fetchWallets();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        (editingWallet ? "Không thể cập nhật ví" : "Không thể tạo ví mới");
      notification.error({
        message: editingWallet ? "Lỗi cập nhật ví" : "Lỗi tạo ví",
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await walletApi.delete(id);
      notification.success({
        message: "Thành công",
        description: "Xóa ví thành công",
        placement: "topRight",
      });
      fetchWallets();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xóa ví";
      notification.error({
        message: "Lỗi xóa ví",
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    }
  };

  const getWalletTypeColor = (type: WalletType): string => {
    const colors: Record<string, string> = {
      bank: "blue",
      cash: "green",
      "e-wallet": "purple",
      "credit-card": "orange",
      other: "default",
    };
    return colors[type] || "default";
  };

  const getWalletTypeName = (type: WalletType): string => {
    const names: Record<string, string> = {
      bank: "Ngân hàng",
      cash: "Tiền mặt",
      "e-wallet": "Ví điện tử",
      "credit-card": "Thẻ tín dụng",
      other: "Khác",
    };
    return names[type] || type;
  };

  const columns: ColumnsType<Wallet> = [
    {
      title: "Tên ví",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      render: (name: string) => (
        <Space>
          <WalletOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
          <strong style={{ fontSize: "14px" }}>{name}</strong>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: WalletType) => (
        <Tag color={getWalletTypeColor(type)} style={{ fontSize: "13px" }}>
          {getWalletTypeName(type)}
        </Tag>
      ),
    },
    {
      title: "Số dư ban đầu",
      dataIndex: "initialBalance",
      key: "initialBalance",
      align: "right",
      width: 160,
      render: (amount: number) => (
        <span style={{ fontSize: "14px" }}>{formatCurrency(amount)}</span>
      ),
    },
    {
      title: "Số dư hiện tại",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      width: 160,
      render: (amount: number) => (
        <strong
          style={{
            color: amount >= 0 ? "#52c41a" : "#ff4d4f",
            fontSize: "15px",
          }}
        >
          {formatCurrency(amount)}
        </strong>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 130,
      align: "right",
      render: (date: string) => (
        <span style={{ fontSize: "14px" }}>{formatDate(date)}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record: Wallet) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: "#1890ff" }}
          />
          <Popconfirm
            title="Xóa ví"
            description="Bạn có chắc chắn muốn xóa ví này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const totalWallets = wallets.length;

  return (
    <AppLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Tổng số ví"
                value={totalWallets}
                prefix={<WalletOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Card>
              <Statistic
                title="Tổng số dư"
                value={totalBalance}
                precision={0}
                valueStyle={{
                  color: totalBalance >= 0 ? "#3f8600" : "#cf1322",
                }}
                suffix="₫"
              />
            </Card>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Danh sách ví</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm ví mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={wallets}
          rowKey="id"
          loading={loading}
          bordered
          size="middle"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} ví`,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        />

        <Modal
          title={editingWallet ? "Chỉnh sửa ví" : "Thêm ví mới"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: "cash",
              initialBalance: 0,
            }}
          >
            <Form.Item
              name="name"
              label="Tên ví"
              rules={[
                { required: true, message: "Vui lòng nhập tên ví" },
                { max: 50, message: "Tên ví không quá 50 ký tự" },
              ]}
            >
              <Input placeholder="VD: Ví tiền mặt, Techcombank, MoMo..." />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại ví"
              rules={[{ required: true, message: "Vui lòng chọn loại ví" }]}
            >
              <Select>
                <Select.Option value="cash">Tiền mặt</Select.Option>
                <Select.Option value="bank">Ngân hàng</Select.Option>
                <Select.Option value="e-wallet">Ví điện tử</Select.Option>
                <Select.Option value="credit-card">Thẻ tín dụng</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            </Form.Item>

            {!editingWallet && (
              <>
                <Form.Item
                  name="initialBalance"
                  label="Số dư ban đầu"
                  rules={[
                    { required: true, message: "Vui lòng nhập số dư ban đầu" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      Number(value?.replace(/\$\s?|(,*)/g, "") || "0") as 0
                    }
                    addonAfter="₫"
                  />
                </Form.Item>

                <Form.Item name="startDate" label="Ngày bắt đầu">
                  <Input type="date" />
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  {editingWallet ? "Cập nhật" : "Tạo mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AppLayout>
  );
};
