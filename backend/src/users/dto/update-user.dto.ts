import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}