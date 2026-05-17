import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({ where: { email: registerDto.email } });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.usersRepository.create({ ...registerDto, password: hashedPassword });

        const savedUser = await this.usersRepository.save(user);
        const { password, ...result } = savedUser;

        return {
            message: 'User registered successfully',
            user: result,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(payload);
        const { password, ...result } = user;

        return {
            accessToken,
            user: result,
        };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const user = await this.usersRepository.findOne({
            where: {
                email: verifyEmailDto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        return {
            message: 'Email verified successfully',
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { email: forgotPasswordDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        user.password = await bcrypt.hash(forgotPasswordDto.newPassword, 10);

        await this.usersRepository.save(user);

        return {
            message: 'Password updated successfully',
        };
    }
}