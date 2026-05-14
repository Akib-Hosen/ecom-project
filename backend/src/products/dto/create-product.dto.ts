import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    pname!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsNumber()
    @Min(0)
    stock!: number;

    @IsNotEmpty()
    @IsString()
    category!: string;

    @IsNotEmpty()
    @IsString()
    imageUrl!: string;
}