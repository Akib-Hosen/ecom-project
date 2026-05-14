import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "src/users/enums/user-role.enum";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @MinLength(6)
    password!: string;

    @IsEnum(UserRole)
    role!: UserRole;
}