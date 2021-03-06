import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Injectable()
export class NotaddGrpcClientFactory {
    // @Client(generateGrpcOptions('localhost:50053', 'notadd_rpc_demo', 'root.proto'))
    // public readonly rootServiceClient: ClientGrpc;

    @Client(generateGrpcOptions('10.10.0.2:50052', 'nt_module_user', 'nt-module-user.proto'))
    public readonly userModuleClient: ClientGrpc;
}

export function generateGrpcOptions(url: string, packageName: string, protoFileName: string): GrpcOptions {
    return {
        transport: Transport.GRPC,
        options: {
            url,
            package: packageName,
            protoPath: join(__dirname, 'protobufs/' + protoFileName),
            loader: {
                arrays: true
            }
        }
    };
}