import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { SqliteService } from "../shared/db/sqlite.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientRepository {

  constructor(private readonly sqliteService: SqliteService) {}

  rowMapper(row: any): Client {
    for (let i = 0; i < 10; i++)
      console.log(uuidv4());
    const client = new Client();
    client.id = row['id'];
    client.uuid = row['uuid'];
    client.name = row['name'];
    client.email = row['email'];
    client.phone = row['phone'];
    client.address = row['address'];
    client.createdAt = row['created_at'];
    client.updatedAt = row['updated_at'];
    return client;
  }

  async create(customerData: CreateClientDto): Promise<Client> {
    const insertQuery = `INSERT INTO clients (uuid, name, email, phone, address) VALUES (?, ?, ?, ?, ?)`;
    return this.sqliteService
      .run(insertQuery, [
        uuidv4(),
        customerData.name,
        customerData.email,
        customerData.phone,
        customerData.address,
      ])
      .then(() => {
        const selectQuery = `SELECT id FROM clients ORDER BY id DESC LIMIT 1`;
        return this.sqliteService.get<Client>(selectQuery, undefined, this.rowMapper);
      });
  }

  async findAll(): Promise<Client[]> {
    return this.sqliteService.all<Client>(
      'SELECT * FROM clients ORDER BY created_at DESC', undefined, this.rowMapper
    );
  }

  async findOne(id: number): Promise<Client> {
    return this.sqliteService.get<Client>('SELECT * FROM clients WHERE id = ?', [id], this.rowMapper);
  }

  async update(id: number, customerData: Partial<CreateClientDto>): Promise<Client> {
    const updateQuery = `
      UPDATE clients
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address)
      WHERE id = ?`;
    return this.sqliteService
      .run(updateQuery, [
        customerData.name || null,
        customerData.email || null,
        customerData.phone || null,
        customerData.address || null,
        id,
      ])
      .then(() => {
        const selectQuery = `SELECT * FROM clients WHERE id =?)`;
        return this.sqliteService.get<Client>(selectQuery, [id], this.rowMapper);
      });
  }

  async remove(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.sqliteService
        .run('DELETE FROM clients WHERE id = ?', [id])
        .then(() => {
          this.sqliteService
            .get<{ count: number }>(
              'SELECT COUNT(*) as count FROM clients WHERE id = ?',
              [id],
            )
            .then((result: { count: number }) => resolve(result.count === 0))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }
}
