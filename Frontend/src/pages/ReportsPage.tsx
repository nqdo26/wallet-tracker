import { useState, useEffect } from "react";
import {
  Card,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  Tag,
  Empty,
  Spin,
  notification,
  Progress,
  Button,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
  CalendarOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { AppLayout } from "../components/layout/AppLayout";
import { statementApi, walletApi } from "../api";
import type { WalletStatement, Wallet } from "../types";
import { formatCurrency, formatDateTime } from "../utils/format";
import { exportWalletStatementPDF } from "../utils/pdfExport";

const { RangePicker } = DatePicker;

interface TransactionItem {
  id: string;
  date: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  balanceAfter: number;
}

const COLORS = {
  income: "#52c41a",
  expense: "#ff4d4f",
};

export const ReportsPage = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [statement, setStatement] = useState<WalletStatement | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (selectedWalletId) {
      fetchStatement();
    }
  }, [selectedWalletId, dateRange]);

  const fetchWallets = async () => {
    try {
      const data = await walletApi.getAll();
      setWallets(data);
      if (data.length > 0) {
        setSelectedWalletId(data[0].id);
      }
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

  const fetchStatement = async () => {
    if (!selectedWalletId) return;

    try {
      setLoading(true);
      const data = await statementApi.getWalletStatement(
        selectedWalletId,
        dateRange[0].format("YYYY-MM-DD"),
        dateRange[1].format("YYYY-MM-DD")
      );
      setStatement(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải báo cáo";
      notification.error({
        message: "Lỗi tải báo cáo",
        description: errorMessage,
        duration: 5,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletChange = (value: string) => {
    setSelectedWalletId(value);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // Group transactions by category for summary
  const categoryStats = statement?.transactions.reduce((acc, transaction) => {
    const key = `${transaction.type}-${transaction.category}`;
    if (!acc[key]) {
      acc[key] = {
        type: transaction.type,
        category: transaction.category,
        count: 0,
        total: 0,
      };
    }
    acc[key].count += 1;
    acc[key].total += transaction.amount;
    return acc;
  }, {} as Record<string, { type: string; category: string; count: number; total: number }>);

  const incomeSummary = Object.values(categoryStats || {})
    .filter((item) => item.type === "income")
    .sort((a, b) => b.total - a.total);

  const expenseSummary = Object.values(categoryStats || {})
    .filter((item) => item.type === "expense")
    .sort((a, b) => b.total - a.total);

  const columns: ColumnsType<TransactionItem> = [
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
      width: 140,
      render: (amount: number, record) => (
        <strong
          style={{
            color: record.type === "income" ? COLORS.income : COLORS.expense,
            fontSize: "15px",
          }}
        >
          {record.type === "income" ? "+" : "-"}
          {formatCurrency(amount)}
        </strong>
      ),
    },
    {
      title: "Số dư",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      align: "right",
      width: 140,
      render: (balanceAfter: number) => (
        <strong
          style={{
            color: balanceAfter >= 0 ? COLORS.income : COLORS.expense,
            fontSize: "15px",
          }}
        >
          {formatCurrency(balanceAfter)}
        </strong>
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
  ];

  const totalAmount =
    (statement?.totalIncome || 0) + (statement?.totalExpense || 0);
  const incomePercent =
    totalAmount > 0 ? ((statement?.totalIncome || 0) / totalAmount) * 100 : 0;
  const expensePercent =
    totalAmount > 0 ? ((statement?.totalExpense || 0) / totalAmount) * 100 : 0;

  return (
    <AppLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h2>Báo cáo chi tiết</h2>
          <Space>
            <Select
              style={{ width: 200 }}
              placeholder="Chọn ví"
              value={selectedWalletId}
              onChange={handleWalletChange}
            >
              {wallets.map((wallet) => (
                <Select.Option key={wallet.id} value={wallet.id}>
                  <Space>
                    <WalletOutlined />
                    {wallet.name}
                  </Space>
                </Select.Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
            {statement && (
              <Button
                type="default"
                icon={<FilePdfOutlined />}
                onClick={() => {
                  const wallet = wallets.find((w) => w.id === selectedWalletId);
                  if (wallet && statement) {
                    exportWalletStatementPDF(
                      wallet.name,
                      statement.transactions.map((t) => ({
                        date: t.date,
                        type: t.type,
                        amount: t.amount,
                        category: t.category,
                        balanceAfter: t.balanceAfter,
                        note: t.note,
                      })),
                      statement.openingBalance
                    );
                  }
                }}
              >
                Xuất PDF
              </Button>
            )}
          </Space>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" />
          </div>
        ) : !statement ? (
          <Empty description="Vui lòng chọn ví để xem báo cáo" />
        ) : (
          <>
            {/* Statistics Cards */}
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Số dư đầu kỳ"
                    value={statement.openingBalance}
                    precision={0}
                    suffix="₫"
                    valueStyle={{ fontSize: "20px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng thu"
                    value={statement.totalIncome}
                    precision={0}
                    valueStyle={{ color: COLORS.income, fontSize: "20px" }}
                    prefix={<ArrowUpOutlined />}
                    suffix="₫"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng chi"
                    value={statement.totalExpense}
                    precision={0}
                    valueStyle={{ color: COLORS.expense, fontSize: "20px" }}
                    prefix={<ArrowDownOutlined />}
                    suffix="₫"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Số dư cuối kỳ"
                    value={statement.closingBalance}
                    precision={0}
                    valueStyle={{
                      color:
                        statement.closingBalance >= 0
                          ? COLORS.income
                          : COLORS.expense,
                      fontSize: "20px",
                    }}
                    suffix="₫"
                  />
                </Card>
              </Col>
            </Row>

            {/* Income vs Expense Visualization */}
            <Card title="Tỷ lệ thu chi" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 500, color: COLORS.income }}>
                        Thu nhập
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {incomePercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      percent={incomePercent}
                      strokeColor={COLORS.income}
                      showInfo={false}
                    />
                    <div
                      style={{
                        textAlign: "right",
                        marginTop: 4,
                        fontSize: 16,
                        fontWeight: 500,
                        color: COLORS.income,
                      }}
                    >
                      {formatCurrency(statement.totalIncome)}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 500, color: COLORS.expense }}>
                        Chi tiêu
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {expensePercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      percent={expensePercent}
                      strokeColor={COLORS.expense}
                      showInfo={false}
                    />
                    <div
                      style={{
                        textAlign: "right",
                        marginTop: 4,
                        fontSize: 16,
                        fontWeight: 500,
                        color: COLORS.expense,
                      }}
                    >
                      {formatCurrency(statement.totalExpense)}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Category Summary */}
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <ArrowUpOutlined style={{ color: COLORS.income }} />
                      <span>Tổng hợp thu nhập theo danh mục</span>
                    </Space>
                  }
                >
                  {incomeSummary.length > 0 ? (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {incomeSummary.map((item, index) => {
                        const percent =
                          statement.totalIncome > 0
                            ? (item.total / statement.totalIncome) * 100
                            : 0;
                        return (
                          <div
                            key={index}
                            style={{
                              padding: "12px 0",
                              borderBottom:
                                index < incomeSummary.length - 1
                                  ? "1px solid #f0f0f0"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                              }}
                            >
                              <Space>
                                <Tag color="success">{item.category}</Tag>
                                <span
                                  style={{ color: "#8c8c8c", fontSize: "13px" }}
                                >
                                  ({item.count} giao dịch)
                                </span>
                              </Space>
                              <strong
                                style={{
                                  color: COLORS.income,
                                  fontSize: "15px",
                                }}
                              >
                                {formatCurrency(item.total)}
                              </strong>
                            </div>
                            <Progress
                              percent={percent}
                              strokeColor={COLORS.income}
                              size="small"
                              format={(percent) => `${percent?.toFixed(1)}%`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Empty
                      description="Không có thu nhập"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <ArrowDownOutlined style={{ color: COLORS.expense }} />
                      <span>Tổng hợp chi tiêu theo danh mục</span>
                    </Space>
                  }
                >
                  {expenseSummary.length > 0 ? (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {expenseSummary.map((item, index) => {
                        const percent =
                          statement.totalExpense > 0
                            ? (item.total / statement.totalExpense) * 100
                            : 0;
                        return (
                          <div
                            key={index}
                            style={{
                              padding: "12px 0",
                              borderBottom:
                                index < expenseSummary.length - 1
                                  ? "1px solid #f0f0f0"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                              }}
                            >
                              <Space>
                                <Tag color="error">{item.category}</Tag>
                                <span
                                  style={{ color: "#8c8c8c", fontSize: "13px" }}
                                >
                                  ({item.count} giao dịch)
                                </span>
                              </Space>
                              <strong
                                style={{
                                  color: COLORS.expense,
                                  fontSize: "15px",
                                }}
                              >
                                {formatCurrency(item.total)}
                              </strong>
                            </div>
                            <Progress
                              percent={percent}
                              strokeColor={COLORS.expense}
                              size="small"
                              format={(percent) => `${percent?.toFixed(1)}%`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Empty
                      description="Không có chi tiêu"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              </Col>
            </Row>

            {/* Transactions Table */}
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Danh sách giao dịch chi tiết</span>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={statement.transactions}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 800 }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Tổng ${total} giao dịch`,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 50],
                }}
                locale={{
                  emptyText: (
                    <Empty description="Không có giao dịch nào trong khoảng thời gian này" />
                  ),
                }}
                style={{
                  backgroundColor: "#fff",
                }}
              />
            </Card>
          </>
        )}
      </Space>
    </AppLayout>
  );
};
