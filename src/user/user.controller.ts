import { Controller, Get, UsePipes, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { CreateUserDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<any> {
    return await this.userService.findByEmail(email);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }
}
