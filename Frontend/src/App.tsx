import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { WalletsPage } from "./pages/WalletsPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { ReportsPage } from "./pages/ReportsPage";

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/wallets"
              element={
                <ProtectedRoute>
                  <WalletsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/wallets" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
