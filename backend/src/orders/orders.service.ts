import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        private datasource: DataSource,
    ) {}

    async placeOrder(createOrderDto: CreateOrderDto, user: User){
        if(user.role !== UserRole.CUSTOMER){
            throw new ForbiddenException('Only customers can place orders');
        }

        return this.datasource.transaction(async manager => {
            const cart = await manager.findOne(Cart, { where: { user: {id: user.id} }, relations: ['items', 'items.product'] });

            if(!cart || cart.items.length === 0){
                throw new BadRequestException('Cart is empty');
            }

            for(const item of cart.items){
                if(item.quantity > item.product.stock){
                    throw new BadRequestException(`Product is out of stock`);
                }
            }

            const totalAmount = cart.items.reduce((sum, item) => {
                return sum + Number(item.product.price) * item.quantity;
            }, 0);

            const order = manager.create(Order, {
                customer: user,
                shippingAddress: createOrderDto.shippingAddress,
                phoneNumber: createOrderDto.phoneNumber,
                totalAmount,
                status: OrderStatus.PENDING,
            });

            const savedOrder = await manager.save(Order, order);
            for(const item of cart.items){
                const orderItem = manager.create(OrderItem, {
                    order: savedOrder,
                    product: item.product,
                    quantity: item.quantity,
                    price: item.product.price,
                });
                await manager.save(OrderItem, orderItem);

                item.product.stock -= item.quantity;
                await manager.save(Product, item.product);
            }

            await manager.delete(CartItem, {cart: {id: cart.id}});
            return{
                message: 'Order placed successfully',
                orderId: savedOrder.id,
                totalAmount,
            };
        });
    }


    async myOrders(user: User){
        if(user.role !== UserRole.CUSTOMER){
            throw new ForbiddenException('Only customers can view their orders');
        }
        return this.orderRepository.find({
            where: { customer: { id: user.id } },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async allOrders(user: User){
        if(user.role !== UserRole.SELLER){
            throw new ForbiddenException('Only sellers can view all orders');
        }
        return this.orderRepository.find({
            relations: ['customer', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateStatus(
        id: number,
        updateOrderStatusDto: UpdateOrderStatusDto,
        user: User,
    ){
        if(user.role !== UserRole.SELLER){
            throw new ForbiddenException('Only sellers can update order status');
        }

        const order = await this.orderRepository.findOne({ where: { id } });
        if(!order){
            throw new NotFoundException('Order not found');
        }

        const allowedFlow = {
            [OrderStatus.PENDING]: OrderStatus.PROCESSING,
            [OrderStatus.PROCESSING]: OrderStatus.SHIPPED,
            [OrderStatus.SHIPPED]: OrderStatus.DELIVERED,
        };
        const nextStatus = allowedFlow[order.status];
        if(updateOrderStatusDto.status !== nextStatus){
            throw new BadRequestException('Invalid order status update');
        }
        order.status = updateOrderStatusDto.status;
        return this.orderRepository.save(order);
    }


}
