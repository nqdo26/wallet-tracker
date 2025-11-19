# Wallet Tracker

Ứng dụng quản lý chi tiêu cá nhân với nhiều ví (Multi-wallet Personal Finance Manager)

## Tech Stack

### Frontend

- React 18 + TypeScript
- Ant Design 5
- Vite
- Axios
- React Router v6
- pdfmake (PDF export)

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Passport.js (Google OAuth 2.0)
- JWT Authentication
- express-validator

### Deployment

- Docker & Docker Compose
- Nginx

## Tính năng

- ✅ Đăng nhập Google OAuth 2.0
- ✅ Quản lý nhiều ví (Multi-wallet)
- ✅ Quản lý giao dịch thu/chi
- ✅ Báo cáo chi tiết theo ví và thời gian
- ✅ Xuất báo cáo PDF
- ✅ Tự động tính số dư sau mỗi giao dịch
- ✅ Responsive design

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
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/            # API clients
│   │   ├── components/     # React components
│   │   │   ├── common/     # Reusable components
│   │   │   └── layout/     # Layout components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

## Yêu cầu hệ thống

- Docker & Docker Compose
- Google OAuth 2.0 Credentials

## Cài đặt và chạy với Docker

### Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Nếu chưa có OAuth consent screen, hãy cấu hình:
   - User Type: **External**
   - App name: `Wallet Tracker`
   - Support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
   - Save and continue (để mặc định các bước còn lại)
6. Quay lại **Credentials**, tạo **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: `Wallet Tracker`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click **Create**
7. Copy **Client ID** và **Client Secret**

### Bước 2: Tạo file `.env`

Tạo file `.env` ở thư mục gốc (`wallet-tracker/.env`):

```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

### Bước 3: Chạy Docker

```bash
git clone https://github.com/nqdo26/wallet-tracker.git
cd wallet-tracker
docker-compose up --build
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

Click **"Đăng nhập với Google"** để bắt đầu!

## Development (Không dùng Docker)

### Yêu cầu

- Node.js 20+
- MongoDB chạy local hoặc MongoDB Atlas

### Backend

```bash
cd Backend
npm install

# Tạo file .env
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wallet-tracker
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret
EOF

npm run dev
```

### Frontend

```bash
cd Frontend
npm install

# Tạo file .env
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF

npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

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
- `DELETE /api/wallets/:id` - Xóa ví (và tất cả giao dịch liên quan)

### Transactions

- `GET /api/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Lấy danh sách giao dịch theo khoảng thời gian
- `POST /api/transactions` - Tạo giao dịch mới
- `DELETE /api/transactions/:id` - Xóa giao dịch

### Statements (Reports)

- `GET /api/statements/wallet/:walletId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Lấy sổ giao dịch của ví

## Troubleshooting

### Lỗi Google OAuth: "redirect_uri_mismatch"

- Kiểm tra redirect URI phải chính xác: `http://localhost:5000/api/auth/google/callback`
- Không có dấu `/` ở cuối
- Đảm bảo port đúng (5000 cho backend)

### Lỗi: "Access blocked: This app's request is invalid"

- Thêm email test của bạn vào **Test users** trong OAuth consent screen
- Hoặc publish app (chọn In production)

### Docker build lỗi

```bash
# Xóa container và volume cũ
docker-compose down -v

# Build lại
docker-compose up --build
```

### Không thể đăng nhập

- Kiểm tra file `.env` đã tạo đúng chưa
- Kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET đúng chưa
- Xem logs: `docker-compose logs backend`

## Lưu ý

- File `.env` **KHÔNG** được commit lên GitHub (đã có trong `.gitignore`)
- Dữ liệu MongoDB được lưu trong Docker volume `mongodb_data`
- Để xóa dữ liệu: `docker-compose down -v`
- Google OAuth credentials chỉ dùng cho local development

## License

MIT

