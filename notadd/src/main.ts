import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';

import { AppModule } from './app.module';
import { APP_CONFIG } from './configurations/app.config';

async function bootstrap() {
    const logger = new Logger('Notadd');
    logger.log(APP_CONFIG.banner);

    const app = await NestFactory.create(AppModule, {
        // cors: true,
        // bodyParser: false

    });
    // app.use(json({limit: 500000000}));
    // app.use(urlencoded({limit: 500000000, extended: true, parameterLimit: 1000000000}));
    app.enableCors();
    await app.listen(5001, '0.0.0.0', () => {
        logger.log('Notadd GraphQL IDE Server started on: http://localhost:5001/graphql');
    });
}

bootstrap();