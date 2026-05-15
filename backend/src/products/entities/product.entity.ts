import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';


@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column()
    pname!: string;

    @Column('text')
    description!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column()
    stock!: number;

    @Column()
    category!: string;

    @Column()
    imageUrl!: string;

    @Column({default: true})
    isActive!: boolean;

    @ManyToOne(() => User, (user) => user.products)
    seller!: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems!: CartItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}