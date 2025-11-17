# Wallet Tracker

Ứng dụng quản lý chi tiêu cá nhân với nhiều ví (Multi-wallet Personal Finance Manager)

## Tech Stack

### Frontend

- React 19 + TypeScript
- Ant Design
- Vite
- Axios
- React Router

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JWT Authentication

### Deployment

- Docker & Docker Compose
- Nginx

## Cấu trúc dự án

```
wallet-tracker/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database, passport config
│   │   ├── controllers/    # Request handlers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── common/    # Reusable components
│   │   │   └── layout/    # Layout components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

## Cài đặt

### Yêu cầu

- Node.js 20+
- MongoDB (hoặc Docker)
- Google OAuth credentials

### Development

1. Clone repository

```bash
git clone https://github.com/nqdo26/wallet-tracker.git
cd wallet-tracker
```

2. Cài đặt dependencies

Backend:

```bash
cd Backend
npm install
cp .env
# Cập nhật .env với credentials của bạn
```

Frontend:

```bash
cd Frontend
npm install
cp .env
# Cập nhật .env với API URL
```

3. Chạy development

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd Frontend
npm run dev
```

### Production với Docker

```bash
# Tạo file .env trong Backend/
cp Backend/.env.example Backend/.env
# Cập nhật credentials

# Build và chạy
docker-compose up -d
```

## API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất

### Wallets

- `GET /api/wallets` - Lấy danh sách ví
- `POST /api/wallets` - Tạo ví mới
- `GET /api/wallets/:id` - Lấy chi tiết ví
- `PUT /api/wallets/:id` - Cập nhật ví
- `DELETE /api/wallets/:id` - Xóa ví

### Transactions

- `GET /api/transactions` - Lấy danh sách giao dịch
- `POST /api/transactions` - Tạo giao dịch mới
- `GET /api/transactions/:id` - Lấy chi tiết giao dịch
- `PUT /api/transactions/:id` - Cập nhật giao dịch
- `DELETE /api/transactions/:id` - Xóa giao dịch

### Reports

- `GET /api/reports/statement` - Lấy báo cáo sao kê theo ví và khoảng thời gian

## License

MIT
