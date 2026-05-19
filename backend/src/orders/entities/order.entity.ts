import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    customer!: User;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus;

    @Column('text')
    shippingAddress!: string;

    @Column()
    phoneNumber!: string;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH_ON_DELIVERY,
    })
    paymentMethod!: PaymentMethod;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
    })
    paymentStatus!: PaymentStatus;

    @Column({ nullable: true })
    cardLast4?: string;


    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}