import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto, user: User) {
        if (user.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can create category');
        }

        const existingCategory = await this.categoryRepository.findOne({
            where: {
                name: createCategoryDto.name,
            },
        });

        if (existingCategory) {
            throw new BadRequestException('Category already exists');
        }

        const category = this.categoryRepository.create({
            name: createCategoryDto.name,
        });

        return this.categoryRepository.save(category);
    }

    async findAll() {
        return this.categoryRepository.find({
            where: {
                isActive: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto, user: User) {
        if (user.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can update category');
        }

        const category = await this.categoryRepository.findOne({
            where: {
                id,
                isActive: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategory = await this.categoryRepository.findOne({
                where: {
                    name: updateCategoryDto.name,
                },
            });

            if (existingCategory) {
                throw new BadRequestException('Category already exists');
            }
        }

        Object.assign(category, updateCategoryDto);

        return this.categoryRepository.save(category);
    }

    async remove(id: number, user: User) {
        if (user.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can delete category');
        }

        const category = await this.categoryRepository.findOne({
            where: {
                id,
                isActive: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        category.isActive = false;

        await this.categoryRepository.save(category);

        return {
            message: 'Category deleted successfully',
        };
    }
}