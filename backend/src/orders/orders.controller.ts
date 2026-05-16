import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';


@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ){}

    @Post()
    placeOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User){
        return this.ordersService.placeOrder(createOrderDto, user);
    }

    @Get()
    allOrders(@CurrentUser() user: User){
        return this.ordersService.allOrders(user);
    }

    @Get('me')
    myOrders(@CurrentUser() user: User){
        return this.ordersService.myOrders(user);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: number,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
        @CurrentUser() user: User
    ){
        return this.ordersService.updateStatus(id, updateOrderStatusDto, user);
    }




}
