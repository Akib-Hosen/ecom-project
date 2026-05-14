import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uid')
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role!: UserRole;

    @Column({default: true})
    isActive!: boolean;

    @OneToOne(() => Cart, (cart) => cart.user)
    cart!: Cart;

    @OneToMany(() => Product, (product) => product.seller)
    products!: Product[];

    @OneToMany(() => Order, (order) => order.customer)
    orders!: Order[];

    @CreateDateColumn()
    createdAt!: Date;   

    @UpdateDateColumn()
    updatedAt!: Date;

    
}