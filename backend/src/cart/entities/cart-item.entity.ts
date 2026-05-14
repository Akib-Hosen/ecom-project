import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
@Unique(['cart', 'product'])
export class CartItem {
    @PrimaryGeneratedColumn('uid')
    id!: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart!: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems)
    product!: Product;

    @Column()
    quantity!: number;
}