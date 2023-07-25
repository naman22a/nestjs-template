import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';

// Modules
import { UsersModule } from './shared/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [configuration],
            validate,
        }),
        MikroOrmModule.forRoot(),
        AuthModule,

        // Modules
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
