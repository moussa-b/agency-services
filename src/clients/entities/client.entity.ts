import { Sex } from '../../shared/models/user-sex.enum';

export class Client {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex?: Sex;
  address?: string;
  createdBy?: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
}
