import { Transport } from '@nestjs/common/enums/transport.enum';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { APP_CONFIG } from './configurations/app.config';
import { UserModule } from './user.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(UserModule.forRoot({ i18n: 'zh-CN' }), {
        transport: Transport.GRPC,
        options: {
            url: '0.0.0.0:50052',
            package: 'nt_module_user',
            protoPath: join(__dirname, 'protobufs/nt-module-user.proto'),
            loader: {
                arrays: true
            }
        }
    });

    await app.listenAsync();
}

bootstrap();