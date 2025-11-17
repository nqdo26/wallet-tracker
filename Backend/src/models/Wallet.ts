import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export enum WalletType {
  BANK = "bank",
  CASH = "cash",
  E_WALLET = "e-wallet",
  CREDIT_CARD = "credit-card",
  OTHER = "other",
}

export interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  userId: IUser["_id"];
  name: string;
  type: WalletType;
  initialBalance: number;
  balance: number;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Wallet name is required"],
      trim: true,
      minlength: [1, "Wallet name cannot be empty"],
      maxlength: [50, "Wallet name cannot exceed 50 characters"],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(WalletType),
        message: "{VALUE} is not a valid wallet type",
      },
      required: [true, "Wallet type is required"],
      default: WalletType.CASH,
    },
    initialBalance: {
      type: Number,
      required: [true, "Initial balance is required"],
      min: [0, "Initial balance cannot be negative"],
      default: 0,
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      min: [0, "Balance cannot be negative"],
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for user's wallets
walletSchema.index({ userId: 1, createdAt: -1 });
walletSchema.index({ userId: 1, name: 1 });

// Pre-save hook to set balance to initialBalance if not explicitly set
walletSchema.pre("save", function (next) {
  if (this.isNew && this.balance === 0 && this.initialBalance !== 0) {
    this.balance = this.initialBalance;
  }
  next();
});

const Wallet: Model<IWallet> = mongoose.model<IWallet>("Wallet", walletSchema);

export default Wallet;
