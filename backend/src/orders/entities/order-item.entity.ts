import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order!: Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product!: Product;

    @Column()
    quantity!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @CreateDateColumn()
    createdAt!: Date;
}