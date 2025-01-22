import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { EscrowModule } from './escrow/escrow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), 
      }),
      inject: [ConfigService], 
    }),
    AuthModule,
    WalletModule,
    EscrowModule,
  ],
})
export class AppModule {}
