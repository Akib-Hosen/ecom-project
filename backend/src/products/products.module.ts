import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService],
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductsService],
})
export class ProductsModule {}
