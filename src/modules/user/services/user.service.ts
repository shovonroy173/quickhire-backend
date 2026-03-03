import bcrypt from 'bcryptjs';
import { User, IUser } from '../model/user.model';
import { UserDTO } from '../dtos/user.dto';

export interface UserListFilters {
  search?: string;
}

export class UserService {
  async findAll(
    filters: UserListFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: UserDTO[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return {
      data: UserDTO.fromArray(users as IUser[]),
      total,
    };
  }

  async findById(id: string): Promise<UserDTO | null> {
    const user = await User.findById(id).lean();
    if (!user) {
      return null;
    }

    return new UserDTO(user as IUser);
  }

  async create(payload: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const user = await User.create({
      ...payload,
      password: hashedPassword,
      role: payload.role ?? 'user',
    });

    return new UserDTO(user);
  }

  async update(
    id: string,
    payload: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'admin' | 'user';
    }
  ): Promise<UserDTO | null> {
    const updatePayload: Record<string, unknown> = { ...payload };

    if (payload.password) {
      updatePayload.password = await bcrypt.hash(payload.password, 12);
    }

    const user = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!user) {
      return null;
    }

    return new UserDTO(user as IUser);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await User.findByIdAndDelete(id);
    return Boolean(deleted);
  }

  async existsByEmail(email: string, ignoreUserId?: string): Promise<boolean> {
    const query: Record<string, unknown> = { email };

    if (ignoreUserId) {
      query._id = { $ne: ignoreUserId };
    }

    const existing = await User.findOne(query).select('_id').lean();
    return Boolean(existing);
  }
}
