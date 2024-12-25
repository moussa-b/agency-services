import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Sex } from '../../shared/models/user-sex.enum';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(Sex)
  @IsOptional()
  sex: string;

  @IsString()
  @IsOptional()
  address?: string;
}
