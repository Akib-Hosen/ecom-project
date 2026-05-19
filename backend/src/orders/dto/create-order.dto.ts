import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "../enums/payment-method.enum";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    shippingAddress!: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber!: string;

    @IsEnum(PaymentMethod)
    paymentMethod!: PaymentMethod;

    @IsOptional()
    @IsString()
    cardLast4?: string;
}