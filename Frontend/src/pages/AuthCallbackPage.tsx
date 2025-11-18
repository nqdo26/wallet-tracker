import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate("/login?error=" + error);
      return;
    }

    if (token) {
      login(token);
      navigate("/wallets");
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" tip="Đang xử lý đăng nhập..." />
    </div>
  );
};
