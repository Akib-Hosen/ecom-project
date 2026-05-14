import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class AddCartItemDto {
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;
}

