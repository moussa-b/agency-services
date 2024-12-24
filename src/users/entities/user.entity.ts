import { UserSex } from "./user-sex.enum";

export class User {
  id: number;
  uuid: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: UserSex;
  role: string;
  isActive: boolean;
  activationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
