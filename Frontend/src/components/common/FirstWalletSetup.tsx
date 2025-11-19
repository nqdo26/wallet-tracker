import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  notification,
  Button,
} from "antd";
import { WalletOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { walletApi } from "../../api";
import type { CreateWalletRequest, WalletType } from "../../types";

const WALLET_TYPES: { value: WalletType; label: string }[] = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Ngân hàng" },
  { value: "e-wallet", label: "Ví điện tử" },
  { value: "credit-card", label: "Thẻ tín dụng" },
  { value: "other", label: "Khác" },
];

interface FirstWalletSetupProps {
  onWalletCreated: () => void;
}

export const FirstWalletSetup = ({
  onWalletCreated,
}: FirstWalletSetupProps) => {
  const [walletCount, setWalletCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    checkWalletCount();
  }, []);

  const checkWalletCount = async () => {
    try {
      const wallets = await walletApi.getAll();
      setWalletCount(wallets.length);
    } catch (error) {
      console.error("Error checking wallet count:", error);
      setWalletCount(0);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload: CreateWalletRequest = {
        name: values.name,
        type: values.type,
        initialBalance: values.initialBalance,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      };
      await walletApi.create(payload);
      notification.success({
        message: "Thành công",
        description: "Tạo ví thành công.",
        placement: "topRight",
      });
      setWalletCount(1);
      onWalletCreated();

      window.dispatchEvent(new Event("wallet-created"));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo ví. Vui lòng thử lại.";
      notification.error({
        message: "Lỗi tạo ví",
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  if (walletCount === null || walletCount > 0) {
    return null;
  }

  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          <WalletOutlined
            style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
          />
          <h2 style={{ margin: 0 }}>Chào mừng bạn đến với Wallet Tracker!</h2>
          <p style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}>
            Hãy tạo ví đầu tiên để bắt đầu quản lý tài chính của bạn
          </p>
        </div>
      }
      open={true}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          initialBalance: 0,
          startDate: dayjs(),
        }}
      >
        <Form.Item
          name="name"
          label="Tên ví"
          rules={[
            { required: true, message: "Vui lòng nhập tên ví" },
            { min: 2, message: "Tên ví phải có ít nhất 2 ký tự" },
          ]}
        >
          <Input
            placeholder="VD: Ví tiền mặt, Techcombank, MoMo..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại ví"
          rules={[{ required: true, message: "Vui lòng chọn loại ví" }]}
        >
          <Select placeholder="Chọn loại ví" size="large">
            {WALLET_TYPES.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="initialBalance"
          label="Số dư ban đầu"
          rules={[
            { required: true, message: "Vui lòng nhập số dư ban đầu" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject("Số dư không được âm");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            size="large"
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) =>
              Number(value?.replace(/\$\s?|(,*)/g, "") || "0") as 0
            }
            addonAfter="₫"
            placeholder="Nhập số dư hiện tại của ví"
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày bắt đầu theo dõi"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
          >
            Tạo ví đầu tiên
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
