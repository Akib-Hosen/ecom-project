import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOne({ where: {id: userId},});

        if(!user){
            throw new NotFoundException('User not found');
        }

        if(updateProfileDto.email && updateProfileDto.email !== user.email){
            const existingUser = await this.userRepository.findOne({ where: { email: updateProfileDto.email } });
            if(existingUser){
                throw new BadRequestException('Email already in use');
            }
        }

        Object.assign(user, updateProfileDto);
        const savedUser = await this.userRepository.save(user);
        const { password, ...result } = savedUser;
        
        return result;
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto){
        const user = await this.userRepository.findOne({ where: {id: userId},});

        if(!user){
            throw new NotFoundException('User not found');
        }
        
        const isOldPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if(!isOldPasswordValid){
            throw new BadRequestException('Old password is incorrect');
        }

        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepository.save(user);

        return{
            message: 'Password changed successfully',
        };
    }

}
