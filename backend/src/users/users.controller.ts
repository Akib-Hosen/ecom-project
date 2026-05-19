import { Controller, Get, Delete, Param, Patch, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@CurrentUser() user: User) {
        return this.usersService.findAll(user);
    }

    @Patch(':id')
    updateUser(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(user, Number(id), updateUserDto);
    }

    @Delete(':id')
    deleteUser(
        @CurrentUser() user: User,
        @Param('id') id: string,
    ) {
        return this.usersService.deleteUser(user, Number(id));
    }

    @Patch('profile')
    updateProfile(
        @CurrentUser() user: User,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user.id, updateProfileDto);
    }

    @Patch('change-password')
    changePassword(
        @CurrentUser() user: User,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changePassword(user.id, changePasswordDto);
    }
}
