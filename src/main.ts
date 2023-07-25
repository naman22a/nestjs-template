import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { __prod__ } from './common/constants';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config';
import { CustomValidationPipe } from './common/pipes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService<EnvironmentVariables>);
    const port = configService.get('PORT');
    const origin = configService.get('CORS_ORIGIN');

    // used to make sure cookies work in production
    if (__prod__) {
        app.enable('trust proxy');
    }

    // VALIDATION
    app.useGlobalPipes(new CustomValidationPipe());

    // MIDDLEWARE
    app.enableCors({ origin, credentials: true });

    // SWAGGER
    const config = new DocumentBuilder()
        .setTitle('NestJS Template')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(port);
}
bootstrap();
