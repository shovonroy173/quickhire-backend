import { IUser } from '../model/user.model';

export class UserDTO {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromArray(users: IUser[]): UserDTO[] {
    return users.map((user) => new UserDTO(user));
  }
}
