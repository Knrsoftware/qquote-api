import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";

@Injectable()
export class UsersService {
  constructor(@InjectModel("users") private usersModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hash;
    const createdUser = new this.usersModel(createUserDto);
    return plainToClass(User, createdUser.save(), {
      excludeExtraneousValues: true,
    });
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.usersModel.findOne({ username });
  }
}
