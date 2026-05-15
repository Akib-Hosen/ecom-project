import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto, user: User) {
        if (user.role !== UserRole.SELLER) {
        throw new ForbiddenException('Only seller can create product');
        }

        const product = this.productRepository.create({
        ...createProductDto,
        seller: user,
        });

        return this.productRepository.save(product);
    }

    async findAll(query: {
        search?: string;
        category?: string;
        page?: string;
        limit?: string;
    }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const where: any = {
        isActive: true,
        };

        if (query.category) {
        where.category = query.category;
        }

        if (query.search) {
        where.title = ILike(`%${query.search}%`);
        }

        const [products, total] = await this.productRepository.findAndCount({
        where,
        relations: ['seller'],
        skip,
        take: limit,
        order: {
            createdAt: 'DESC',
        },
        });

        return {
        data: products,
        total,
        page,
        limit,
        };
    }

    async findOne(id: number) {
        const product = await this.productRepository.findOne({
        where: {
            id,
            isActive: true,
        },
        relations: ['seller'],
        });

        if (!product) {
        throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto, user: User) {
        const product = await this.findOne(id);

        if (user.role !== UserRole.SELLER) {
        throw new ForbiddenException('Only seller can update product');
        }

        Object.assign(product, updateProductDto);

        return this.productRepository.save(product);
    }

    async remove(id: number, user: User) {
        const product = await this.findOne(id);

        if (user.role !== UserRole.SELLER) {
        throw new ForbiddenException('Only seller can delete product');
        }

        product.isActive = false;

        await this.productRepository.save(product);

        return {
        message: 'Product deleted successfully',
        };
    }
}