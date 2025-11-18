import { Button, Card, Typography, Space } from "antd";
import { GoogleOutlined, WalletOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/wallets", { replace: true });
      return;
    }

    const token = searchParams.get("token");
    if (token) {
      login(token);
      navigate("/wallets", { replace: true });
    }
  }, [user, searchParams, login, navigate]);

  const handleGoogleLogin = () => {
    authApi.loginWithGoogle();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 440,
          textAlign: "center",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <WalletOutlined style={{ fontSize: 48, color: "#1890ff" }} />

          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              Wallet Tracker
            </Title>
            <Text type="secondary">Quản lý tài chính cá nhân thông minh</Text>
          </div>

          <Text style={{ color: "#595959" }}>
            Đăng nhập để bắt đầu theo dõi thu chi và quản lý ví của bạn
          </Text>

          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            onClick={handleGoogleLogin}
            block
            style={{ height: 48, fontSize: 16 }}
          >
            Đăng nhập với Google
          </Button>
        </Space>
      </Card>
    </div>
  );
};
