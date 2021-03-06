import { Controller, Get, UsePipes, Post, Body, HttpException, HttpStatus, Put, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { UserRO } from './user.interface';

import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) {
      throw new HttpException({errors}, HttpStatus.UNAUTHORIZED);
    }

    const token = await this.userService.generateJWT(_user);
    const { email, username, bio, image } = _user;
    const user = { email, token, username, bio, image };
    return { user };
  }
}
