import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  notification,
  Space,
  Tag,
  Popconfirm,
  Card,
  Statistic,
  Row,
  Col,
  Empty,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { AppLayout } from "../components/layout/AppLayout";
import { transactionApi, walletApi } from "../api";
import type { Transaction, CreateTransactionRequest } from "../api/transaction";
import type { Wallet } from "../types";
import { formatCurrency, formatDateTime } from "../utils/format";
import { exportTransactionsPDF } from "../utils/pdfExport";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const INCOME_CATEGORIES = [
  "Lương",
  "Thưởng",
  "Đầu tư",
  "Kinh doanh",
  "Quà tặng",
  "Khác",
];

const EXPENSE_CATEGORIES = [
  "Ăn uống",
  "Mua sắm",
  "Di chuyển",
  "Giải trí",
  "Hóa đơn",
  "Y tế",
  "Giáo dục",
  "Nhà ở",
  "Khác",
];

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );

  useEffect(() => {
    fetchWallets();
    fetchTransactions();

    const handleWalletCreated = () => {
      fetchWallets();
    };

    window.addEventListener("wallet-created", handleWalletCreated);

    return () => {
      window.removeEventListener("wallet-created", handleWalletCreated);
    };
  }, [dateRange]);

  const fetchWallets = async () => {
    try {
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
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionApi.getAll(
        dateRange[0].format("YYYY-MM-DD"),
        dateRange[1].format("YYYY-MM-DD")
      );
      setTransactions(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách giao dịch";
      notification.error({
        message: "Lỗi tải giao dịch",
        description: errorMessage,
        duration: 5,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      type: "expense",
      date: dayjs(),
      amount: 0,
    });
    setTransactionType("expense");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload: CreateTransactionRequest = {
        walletId: values.walletId,
        type: values.type,
        amount: values.amount,
        category: values.category,
        date: values.date.format("YYYY-MM-DD"),
        note: values.note,
      };

      await transactionApi.create(payload);
      notification.success({
        message: "Thành công",
        description: "Thêm giao dịch thành công",
        placement: "topRight",
      });
      handleCloseModal();
      fetchTransactions();
      fetchWallets();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể thêm giao dịch";

      notification.error({
        message: "Lỗi thêm giao dịch",
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionApi.delete(id);
      notification.success({
        message: "Thành công",
        description: "Xóa giao dịch thành công",
        placement: "topRight",
      });
      fetchTransactions();
      fetchWallets();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xóa giao dịch";
      notification.error({
        message: "Lỗi xóa giao dịch",
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Ngày giờ",
      dataIndex: "date",
      key: "date",
      width: 170,
      fixed: "left",
      render: (date: string) => (
        <Space size="small">
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontSize: "14px" }}>{formatDateTime(date)}</span>
        </Space>
      ),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 90,
      render: (type: string) =>
        type === "income" ? (
          <Tag
            color="success"
            icon={<ArrowUpOutlined />}
            style={{ fontSize: "13px" }}
          >
            Thu
          </Tag>
        ) : (
          <Tag
            color="error"
            icon={<ArrowDownOutlined />}
            style={{ fontSize: "13px" }}
          >
            Chi
          </Tag>
        ),
      filters: [
        { text: "Thu", value: "income" },
        { text: "Chi", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => (
        <span style={{ fontSize: "14px" }}>{category}</span>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 150,
      render: (amount: number, record) => (
        <strong
          style={{
            color: record.type === "income" ? "#52c41a" : "#ff4d4f",
            fontSize: "15px",
          }}
        >
          {record.type === "income" ? "+" : "-"}
          {formatCurrency(amount)}
        </strong>
      ),
    },
    {
      title: "Ví",
      dataIndex: "walletName",
      key: "walletName",
      width: 140,
      render: (name: string) => (
        <span style={{ fontSize: "14px" }}>{name || "-"}</span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (note: string) => (
        <span style={{ fontSize: "14px", color: "#8c8c8c" }}>
          {note || "-"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="Xóa giao dịch"
          description="Bạn có chắc chắn muốn xóa giao dịch này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <AppLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Tổng thu"
                value={totalIncome}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="₫"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Tổng chi"
                value={totalExpense}
                precision={0}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                suffix="₫"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Còn lại"
                value={balance}
                precision={0}
                valueStyle={{ color: balance >= 0 ? "#3f8600" : "#cf1322" }}
                suffix="₫"
              />
            </Card>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h2>Lịch sử giao dịch</h2>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
            <Button
              type="default"
              icon={<FilePdfOutlined />}
              onClick={() =>
                exportTransactionsPDF(
                  transactions.map((t) => ({
                    date: t.date,
                    type: t.type,
                    amount: t.amount,
                    category: t.category,
                    walletName: t.walletName,
                    note: t.note,
                  })),
                  {
                    start: dateRange[0].format("YYYY-MM-DD"),
                    end: dateRange[1].format("YYYY-MM-DD"),
                  }
                )
              }
            >
              Xuất PDF
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
            >
              Thêm giao dịch
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `Tổng ${total} giao dịch`,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          locale={{
            emptyText: (
              <Empty description="Chưa có giao dịch nào trong khoảng thời gian này" />
            ),
          }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        />

        <Modal
          title="Thêm giao dịch mới"
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: "expense",
              date: dayjs(),
              amount: 0,
            }}
          >
            <Form.Item
              name="type"
              label="Loại giao dịch"
              rules={[
                { required: true, message: "Vui lòng chọn loại giao dịch" },
              ]}
            >
              <Radio.Group onChange={(e) => setTransactionType(e.target.value)}>
                <Radio.Button value="income">Thu nhập</Radio.Button>
                <Radio.Button value="expense">Chi tiêu</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="walletId"
              label="Ví"
              rules={[{ required: true, message: "Vui lòng chọn ví" }]}
            >
              <Select placeholder="Chọn ví">
                {wallets.map((wallet) => (
                  <Select.Option key={wallet.id} value={wallet.id}>
                    {wallet.name} - {formatCurrency(wallet.balance)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select placeholder="Chọn danh mục">
                    {(transactionType === "income"
                      ? INCOME_CATEGORIES
                      : EXPENSE_CATEGORIES
                    ).map((cat) => (
                      <Select.Option key={cat} value={cat}>
                        {cat}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="Ngày giao dịch"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày giao dịch" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="amount"
              label="Số tiền"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền" },
                {
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject("Số tiền phải lớn hơn 0");
                    }
                    return Promise.resolve();
                  },
                },
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

            <Form.Item name="note" label="Ghi chú">
              <TextArea rows={3} placeholder="Nhập ghi chú (không bắt buộc)" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Thêm giao dịch
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AppLayout>
  );
};
