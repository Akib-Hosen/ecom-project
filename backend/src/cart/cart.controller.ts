import { Controller, Get, Patch, Post, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getCart(@CurrentUser() user: User) {
        return this.cartService.getCart(user);
    }

    @Post('items')
    addItem(@Body() addCartItemDto: AddCartItemDto, @CurrentUser() user: User) {
        return this.cartService.addItem(addCartItemDto, user);
    }

    @Patch('items/:id')
    updateItem(
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @CurrentUser() user: User,
    ) {
        return this.cartService.updateItem(Number(id), updateCartItemDto, user);
    }

    @Delete('items/:id')
    removeItem(@Param('id') id: string, @CurrentUser() user: User) {
        return this.cartService.removeItem(Number(id), user);
    }
}
