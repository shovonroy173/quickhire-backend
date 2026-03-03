import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../user/model/user.model';
import { config } from '../../../config/env';

export class AuthService {
  async findUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string): string {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);
  }
}
