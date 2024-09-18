import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, UseGuards,
} from '@nestjs/common';
import {CreatePostInputDto, UpdatePostDto} from './models/input/create-post.input.dto';
import {CommandBus} from "@nestjs/cqrs";
import {CreatePostUseCaseCommand} from "../../usecases/createPostUseCase";
import {GetPostByIdUseCaseCommand} from "../../usecases/getPostByIdUseCase";
import {BasicAuthGuard} from "../../auth/basic-auth.guard";
import {UpdatePostUseCaseCommand} from "../../usecases/updatePostUseCase";
import {SortPostsDto} from "./models/input/sort-post.input.dto";
import {GetAllPostsUseCaseCommand} from "../../usecases/getAllPostsUseCase";
import {DeletePostByIdUseCaseCommand} from "../../usecases/deletePostByIdUseCase";


@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async create(
        @Body()
            createPostDto: CreatePostInputDto,
    ) {
        return await this.commandBus.execute(new CreatePostUseCaseCommand(createPostDto));
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')
    @HttpCode(204)
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {

        return await this.commandBus.execute(new UpdatePostUseCaseCommand(id, updatePostDto));
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        const post = await this.commandBus.execute(new GetPostByIdUseCaseCommand(id));

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }
        return post;
    }

    @Get()
    async getAllPosts(
        @Query() sortData: SortPostsDto) {
        return await this.commandBus.execute(new GetAllPostsUseCaseCommand(sortData));
    }


    @Delete(':id')
    @HttpCode(204)
    async deletePost(@Param('id') id: string): Promise<void> {

        const result = await this.commandBus.execute(new DeletePostByIdUseCaseCommand(id));

        if (!result) {
            throw new NotFoundException(`Post not found`);
        }
    }
}
