import{
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';   
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uid')
    id!: number;

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

    @Column('test')
    shippingAddress!: string;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;   
}