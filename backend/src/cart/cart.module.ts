import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Product } from 'src/products/entities/product.entity';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product]),],
})
export class CartModule {}
