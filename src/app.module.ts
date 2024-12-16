import { Global, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [UsersModule, ClientsModule, CoreModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
