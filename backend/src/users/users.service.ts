import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOne({ where: { id: userId }, });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: updateProfileDto.email } });
            if (existingUser) {
                throw new BadRequestException('Email already in use');
            }
        }

        Object.assign(user, updateProfileDto);
        const savedUser = await this.userRepository.save(user);
        const { password, ...result } = savedUser;

        return result;
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId }, });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isOldPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new BadRequestException('Old password is incorrect');
        }

        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepository.save(user);

        return {
            message: 'Password changed successfully',
        };
    }

    async findAll(currentUser: User) {
        if (currentUser.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can view users');
        }

        const users = await this.userRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async updateUser(
        currentUser: User,
        userId: number,
        updateUserDto: UpdateUserDto,
    ) {
        if (currentUser.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can update users');
        }

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: {
                    email: updateUserDto.email,
                },
            });

            if (existingUser) {
                throw new BadRequestException('Email already in use');
            }
        }

        Object.assign(user, updateUserDto);

        const savedUser = await this.userRepository.save(user);

        const { password, ...result } = savedUser;

        return result;
    }

    async deleteUser(currentUser: User, userId: number) {
        if (currentUser.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only seller can delete users');
        }

        if (currentUser.id === userId) {
            throw new BadRequestException('You cannot delete your own account');
        }

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.remove(user);

        return {
            message: 'User deleted successfully',
        };
    }

}
