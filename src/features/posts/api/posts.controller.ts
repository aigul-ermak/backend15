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
    Query,
} from '@nestjs/common';
import {PostsService} from '../application/posts.service';
import {Blog} from '../../blogs/domain/blog.entity';
import {CreatePostInputDto, UpdatePostDto} from './models/input/create-post.input.dto';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetBlogByIdUseCaseCommand} from "../../usecases/getBlogByIdUseCase";
import {CreatePostUseCaseCommand} from "../../usecases/createPostUseCase";


@Controller('posts')
export class PostsController {
    constructor(
        private postsService: PostsService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,) {
    }

    @Post()
    async create(
        @Body()
            createPostDto: CreatePostInputDto,
    ) {
        //const createdPost = await this.postsService.create(createPostDto);

        const blog = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(createPostDto.blogId));


        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const newCreatePost = {
            ...createPostDto,
            blogName: blog.name
        }

        const createdPost = await this.commandBus.execute(new CreatePostUseCaseCommand(newCreatePost));


        console.log(createdPost)
        // return {
        //     id: createdPost.id,
        //     title: createdPost.title,
        //     shortDescription: createdPost.shortDescription,
        //     content: createdPost.content,
        //     blogId: createdPost.blogId,
        //     blogName: createdPost.blogName,
        //     createdAt: createdPost.createdAt,
        //     extendedLikesInfo: createdPost.extendedLikesInfo,
        // };
        return true;
    }

    @Put(':id')
    @HttpCode(204)
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postsService.update(id, updatePostDto);
    }

    @Get()
    async getAllPosts(
        @Query('pageNumber') pageNumber: number,
        @Query('pageSize') pageSize: number,
        @Query('sortBy') sortBy?: string,
        @Query('sortDirection') sortDirection?: string,
    ): Promise<{
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: Blog[];
    }> {
        const sort = sortBy ?? 'createdAt';
        const direction = sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        const page = pageNumber ?? 1;
        const size = pageSize ?? 10;

        const {posts, totalCount} = await this.postsService.findAllPaginated(
            page,
            size,
            sort,
            direction,
        );
        const pagesCount = Math.ceil(totalCount / size);

        return {
            pagesCount,
            page: +page,
            pageSize: +size,
            totalCount,
            items: posts,
        };
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return this.postsService.findById(id);
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
