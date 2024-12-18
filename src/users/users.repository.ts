import { Injectable } from '@nestjs/common';
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { SqliteService } from "../shared/db/sqlite.service";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "./entities/user-role.enum";

@Injectable()
export class UsersRepository {

  constructor(private readonly sqliteService: SqliteService) {}

  rowMapper(row: any, includePassword = false, includeUsername = false): User {
    const user = new User();
    user.id = row['id'];
    user.uuid = row['uuid'];
    if (includeUsername) {
      user.username = row['username'];
    }
    user.email = row['email'];
    if (includePassword) {
      user.password = row['password'];
    }
    user.firstName = row['first_name'];
    user.lastName = row['last_name'];
    user.role = row['role'];
    user.isActive = row['is_active'];
    user.activationToken = row['activation_token'];
    user.resetPasswordToken = row['reset_password_token'];
    user.resetPasswordExpires = row['reset_password_expires'];
    user.createdAt = row['created_at'];
    user.updatedAt = row['updated_at'];
    return user;
  }

  async create(userData: CreateUserDto & {
    password: string;
    activationToken: string;
    isActive: boolean;
  }): Promise<User> {
    const insertQuery = `INSERT INTO users (
      uuid, username, email, password, first_name, last_name, activation_token, role, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return this.sqliteService
      .run(insertQuery,
        [
          uuidv4(),
          userData.username || userData.email,
          userData.email,
          userData.password,
          userData.firstName,
          userData.lastName,
          userData.activationToken,
          userData.role || UserRole.USER,
          userData.isActive,
        ])
      .then(() => {
        const selectQuery = `SELECT id FROM users ORDER BY id DESC LIMIT 1`;
        return this.sqliteService.get<User>(selectQuery, undefined, this.rowMapper);
      });
  }

  async findAll(): Promise<User[]> {
    return this.sqliteService.all<User>(
      'SELECT * FROM users ORDER BY created_at DESC', undefined, this.rowMapper
    );
  }

  async findOne(id: number): Promise<User> {
    return this.sqliteService.get<User>('SELECT * FROM users WHERE id = ?', [id], this.rowMapper);
  }

  async update(id: number, customerData: Partial<CreateUserDto>): Promise<User> {
    const updateQuery = `
      UPDATE users
      SET email = COALESCE(?, email),
          first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          role = COALESCE(?, role)
      WHERE id = ?`;
    return this.sqliteService
      .run(updateQuery, [
        customerData.email || null,
        customerData.firstName || null,
        customerData.lastName || null,
        customerData.role || null,
        id,
      ])
      .then(() => {
        const selectQuery = `SELECT * FROM users WHERE id =?)`;
        return this.sqliteService.get<User>(selectQuery, [id], this.rowMapper);
      });
  }

  async remove(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.sqliteService
        .run('DELETE FROM users WHERE id = ?', [id])
        .then(() => {
          this.sqliteService
            .get<{ count: number }>(
              'SELECT COUNT(*) as count FROM users WHERE id = ?',
              [id],
            )
            .then((result: { count: number }) => resolve(result.count === 0))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  async findByEmailOrUsername(email: string): Promise<User> {
    return this.sqliteService.get<User>('SELECT * FROM users WHERE email = ? OR username = ?', [email, email], (row: any) => this.rowMapper(row, true));
  }

  async findById(id: number): Promise<User> {
    return this.sqliteService.get<User>('SELECT * FROM users WHERE id = ?', [id], this.rowMapper);
  }

  async findByActivationToken(activationToken: string): Promise<User> {
    return this.sqliteService.get<User>('SELECT * FROM users WHERE activation_token = ?', [activationToken], this.rowMapper);
  }

  async findByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    return this.sqliteService.get<User>('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()', [resetPasswordToken], this.rowMapper);
  }

  async activateUser(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.sqliteService
        .run('UPDATE users SET is_active = true, activation_token = NULL WHERE id = ?', [id])
        .then(() => {
          this.sqliteService
            .get<{ count: number }>(
              'SELECT COUNT(*) as count FROM users WHERE id = ? AND is_active = true',
              [id],
            )
            .then((result: { count: number }) => resolve(result.count === 1))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  async setResetPasswordToken(id: number, token: string, expires: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.sqliteService
        .run('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [token, expires, id])
        .then(() => {
          this.sqliteService
            .get<{ count: number }>(
              'SELECT COUNT(*) as count FROM users WHERE id = ? AND reset_password_token IS NOT NULL AND reset_password_expires IS NOT NULL',
              [id],
            )
            .then((result: { count: number }) => resolve(result.count === 1))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  async resetPassword(id: number, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.sqliteService
        .run('UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [hashedPassword, id])
        .then(() => {
          this.sqliteService
            .get<{ count: number }>(
              'SELECT COUNT(*) as count FROM users WHERE id = ? AND reset_password_token IS NULL AND reset_password_expires IS NULL',
              [id],
            )
            .then((result: { count: number }) => resolve(result.count === 1))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }
}
