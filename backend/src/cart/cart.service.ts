import { Injectable, BadRequestException, ForbiddenException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    private async getOrCreateCart(user: User) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            cart = this.cartRepository.create({ user, items: [] });
            await this.cartRepository.save(cart);
        }
        return cart;
    }

    async getCart(user: User) {
        if (user.role !== UserRole.CUSTOMER) {
            throw new ForbiddenException('Only customers can have a cart');
        }

        const cart = await this.getOrCreateCart(user);
        const total = cart.items.reduce((sum, item) => {
            return sum + Number(item.product.price) * item.quantity;
        }, 0);
        return{
            id: cart.id,
            items: cart.items,
            total,
        };
    }

    async addItem(addCartItemDto: AddCartItemDto, user: User) {
        if (user.role !== UserRole.CUSTOMER) {
            throw new ForbiddenException('Only customers can add items to cart');
        }

        const product = await this.productRepository.findOne({
            where: { id: addCartItemDto.productId, isActive: true },
        });

        if (!product) {
            throw new ForbiddenException('Product not found');
        }

        if (addCartItemDto.quantity > product.stock) {
            throw new ForbiddenException('Not enough stock available');
        }

        const cart = await this.getOrCreateCart(user);
        let cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: product.id } }, relations: ['cart', 'product'],
        });

        if (cartItem) {
            const newQuantity = cartItem.quantity + addCartItemDto.quantity;
            if (newQuantity > product.stock) {
                throw new ForbiddenException('Not enough stock available');
            }

            cartItem.quantity = newQuantity;
        }
        else {
            cartItem = this.cartItemRepository.create({
                cart,
                product,
                quantity: addCartItemDto.quantity,
            });
        }
        await this.cartItemRepository.save(cartItem);

        return this.getCart(user);
    }

    async updateItem(id: number, updateCartItemDto: UpdateCartItemDto, user: User) {
        if (user.role !== UserRole.CUSTOMER) {
        throw new ForbiddenException('Only customer can update cart');
        }

        const cartItem = await this.cartItemRepository.findOne({
        where: { id },
        relations: ['cart', 'cart.user', 'product'],
        });

        if (!cartItem) {
        throw new NotFoundException('Cart item not found');
        }

        if (cartItem.cart.user.id !== user.id) {
        throw new ForbiddenException('You can update only your own cart item');
        }

        if (updateCartItemDto.quantity > cartItem.product.stock) {
        throw new BadRequestException('Not enough stock');
        }

        cartItem.quantity = updateCartItemDto.quantity;

        await this.cartItemRepository.save(cartItem);

        return this.getCart(user);
}

    async removeItem(id: number, user: User) {
        if (user.role !== UserRole.CUSTOMER) {
        throw new ForbiddenException('Only customer can remove cart item');
        }

        const cartItem = await this.cartItemRepository.findOne({
        where: { id },
        relations: ['cart', 'cart.user'],
        });

        if (!cartItem) {
        throw new NotFoundException('Cart item not found');
        }

        if (cartItem.cart.user.id !== user.id) {
        throw new ForbiddenException('You can remove only your own cart item');
        }

        await this.cartItemRepository.remove(cartItem);

        return this.getCart(user);
    }
}
