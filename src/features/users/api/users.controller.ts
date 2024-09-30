import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query, UseGuards,
} from '@nestjs/common';
import {UsersService} from '../application/users.service';
import {CreateUserDto} from "./models/input/create-user.input.dto";
import {UserOutputModel} from "./models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth.guard";
import {SortUserDto} from "./models/output/sort.user.dto";
import {CreateUserUseCase} from "../../usecases/createUserUseCase";

@Controller('users')
export class UsersController {
    usersService: UsersService;

    constructor(
        userService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
        private createUserUseCase: CreateUserUseCase,
    ) {
        this.usersService = userService;
    }

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserOutputModel> {

        const userId = await this.createUserUseCase.execute(
            createUserDto.email,
            createUserDto.login,
            createUserDto.password,
        );

        const user = await this.usersQueryRepository.getUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Get()
    @UseGuards(BasicAuthGuard)
    async getAllUsers(@Query() sortData: SortUserDto) {
        return this.usersService.getAllUsers(sortData);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {
        const result = await this.usersService.deleteUserById(id);
        if (!result) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
