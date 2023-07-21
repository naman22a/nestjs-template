import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.model';

@Module({
    imports: [MikroOrmModule.forFeature([User])],
    providers: [UsersService],
})
export class UsersModule {}
