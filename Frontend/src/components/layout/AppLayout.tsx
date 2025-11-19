import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import { useState, useEffect } from "react";
import {
  UserOutlined,
  WalletOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FirstWalletSetup } from "../common/FirstWalletSetup";

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [walletSetupKey, setWalletSetupKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/wallets",
      icon: <WalletOutlined />,
      label: "Ví của tôi",
      onClick: () => navigate("/wallets"),
    },
    {
      key: "/transactions",
      icon: <FileTextOutlined />,
      label: "Giao dịch",
      onClick: () => navigate("/transactions"),
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Báo cáo",
      onClick: () => navigate("/reports"),
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const handleWalletCreated = () => {
    setWalletSetupKey((prev) => prev + 1);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <FirstWalletSetup
        key={walletSetupKey}
        onWalletCreated={handleWalletCreated}
      />
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          Wallet Tracker
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" style={{ color: "white" }}>
            <Avatar icon={<UserOutlined />} /> {user?.name}
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={200}
          collapsedWidth={80}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          style={{ background: "#fff" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
