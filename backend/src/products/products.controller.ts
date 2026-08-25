import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors, UseGuards, Res,} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, memoryStorage } from 'multer';
import type { Response } from 'express';
import { CloudinaryService } from './cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('getimage/:name')
  getImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads' });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: {
        fileSize: 600000,
      },
      storage: memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadFile(file);
    return {
      imageUrl,
    };
  }
}
