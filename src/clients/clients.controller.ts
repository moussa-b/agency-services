import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user-role.enum';
import { Client } from "./entities/client.entity";
import { ResponseStatus } from "../shared/dto/response-status.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.', type: Client })
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Retrieve a list of all clients' })
  @ApiResponse({ status: 200, description: 'List of all clients.', type: [Client] })
  @Get()
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiResponse({ status: 200, description: 'The client with the given ID.', type: Client })
  @ApiResponse({
    status: 404,
    description: 'Client not found.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Client> {
    const client = await this.clientsService.findOne(+id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsService.findOne(+id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.clientsService.update(+id, updateClientDto);
  }

  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: 200, description: 'The client has been successfully deleted.', type: ResponseStatus })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<ResponseStatus> {
    const client = await this.clientsService.findOne(+id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return { status: await this.clientsService.remove(+id) };
  }
}
