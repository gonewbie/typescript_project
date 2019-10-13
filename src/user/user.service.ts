import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  async findByEmail(email: string): Promise<any> {
    return 'hi';
  }
}
