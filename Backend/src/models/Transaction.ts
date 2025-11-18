import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";
import { IWallet } from "./Wallet";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: IUser["_id"];
  walletId: IWallet["_id"];
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: [true, "Wallet ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TransactionType),
        message: "{VALUE} is not a valid transaction type",
      },
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for efficient queries
transactionSchema.index({ userId: 1, walletId: 1, date: -1 });
transactionSchema.index({ walletId: 1, date: -1 });
transactionSchema.index({ userId: 1, date: -1 });

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
