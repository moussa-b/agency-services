import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailService } from "../shared/mail/mail.service";
import { UpdateClientDto } from "../clients/dto/update-client.dto";

@Injectable()
export class UsersService {

  constructor(private usersRepository: UsersRepository,
              private mailService: MailService,) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findByEmailOrUsername(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = uuidv4();

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      activationToken,
      isActive: false,
    });

    const url = `http://localhost:3000/auth/confirm?token=${activationToken}`;

    await this.mailService.sendEmail(
      user.email,
      'Welcome! Confirm your Email',
      {template: './confirmation', context: { name: user.firstName, url }}
    );

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<User> {
    return this.usersRepository.update(id, updateClientDto);
  }

  async remove(id: number): Promise<boolean> {
    return this.usersRepository.remove(id);
  }

  async findByEmailOrUsername(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmailOrUsername(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByActivationToken(token: string): Promise<User | null> {
    return this.usersRepository.findByActivationToken(token);
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.usersRepository.findByResetPasswordToken(token);
  }

  async activateUser(id: number): Promise<void> {
    await this.usersRepository.activateUser(id);
  }

  async setResetPasswordToken(id: number, token: string, expires: Date): Promise<void> {
    await this.usersRepository.setResetPasswordToken(id, token, expires);
  }

  async resetPassword(id: number, hashedPassword: string): Promise<void> {
    await this.usersRepository.resetPassword(id, hashedPassword);
  }
}
