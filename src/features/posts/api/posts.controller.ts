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
import {PostsService} from '../application/posts.service';
import {Blog} from '../../blogs/domain/blog.entity';
import {CreatePostInputDto, UpdatePostDto} from './models/input/create-post.input.dto';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetBlogByIdUseCaseCommand} from "../../usecases/getBlogByIdUseCase";
import {CreatePostUseCaseCommand} from "../../usecases/createPostUseCase";
import {GetPostByIdUseCaseCommand} from "../../usecases/getPostByIdUseCase";
import {BasicAuthGuard} from "../../auth/basic-auth.guard";
import {UpdatePostUseCaseCommand} from "../../usecases/updatePostUseCase";
import {SortPostsDto} from "./models/input/sort-post.input.dto";
import {GetAllBlogsUseCaseCommand} from "../../usecases/getAllBlogsUseCase";
import {GetAllPostsUseCaseCommand} from "../../usecases/getAllPostsUseCase";


@Controller('posts')
export class PostsController {
    constructor(
        private postsService: PostsService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,) {
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

    @Get()
    async getAllPosts(
        @Query() sortData: SortPostsDto) {
        return this.queryBus.execute(new GetAllPostsUseCaseCommand(sortData));
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        const post = this.queryBus.execute(new GetPostByIdUseCaseCommand(id));
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    @Delete(':id')
    @HttpCode(204)
    async deletePost(@Param('id') id: string): Promise<void> {
        const result = await this.postsService.deletePostById(id);
        if (!result) {
            throw new NotFoundException(`Blog with id ${id} not found`);
        }
    }
}
