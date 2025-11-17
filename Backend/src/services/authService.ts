import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static async findOrCreateUser(
    googleId: string,
    email: string,
    name: string
  ): Promise<IUser> {
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
      });
    }

    return user;
  }

  static generateToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  static async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }
}
