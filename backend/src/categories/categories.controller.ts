import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() createCategoryDto: CreateCategoryDto,
        @CurrentUser() user: User,
    ) {
        return this.categoriesService.create(createCategoryDto, user);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @CurrentUser() user: User,
    ) {
        return this.categoriesService.update(Number(id), updateCategoryDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.categoriesService.remove(Number(id), user);
    }
}