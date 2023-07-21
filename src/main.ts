import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { __prod__ } from './common/constants';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService<EnvironmentVariables>);
    const port = configService.get('PORT');
    const origin = configService.get('CORS_ORIGIN');

    // used to make sure cookies work in production
    if (__prod__) {
        app.enable('trust proxy');
    }

    // MIDDLEWARE
    app.enableCors({ origin, credentials: true });

    await app.listen(port);
}
bootstrap();
