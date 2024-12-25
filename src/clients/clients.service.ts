import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    return this.clientRepository.create(createClientDto);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async findOne(id: number): Promise<Client> {
    return this.clientRepository.findOne(id);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    return this.clientRepository.update(id, updateClientDto);
  }

  async remove(id: number): Promise<boolean> {
    return this.clientRepository.remove(id);
  }
}
