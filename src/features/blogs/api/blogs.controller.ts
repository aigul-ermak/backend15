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
import {BlogsService} from '../application/blogs.service';
import {
    CreateBlogInputDto,
    CreatePostToBlogDto,
    UpdateBlogDto,
} from './models/input/create-blog.input.dto';
import {PostsService} from '../../posts/posts.service';
import {CreateBlogUseCase} from "../../usecases/createBlogUseCase";
import {GetBlogByIdUseCase, GetBlogByIdUseCaseCommand} from "../../usecases/getBlogByIdUseCase";
import {BlogOutputModel} from "./models/output/blog.output.model";
import {BasicAuthGuard} from "../../auth/basic-auth.guard";
import {SortBlogsDto} from "./models/input/sort-blog.input.dto";
import {GetAllBlogsUseCase} from "../../usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCaseCommand} from "../../usecases/deleteBlogByIdUseCase";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {UpdateBlogUseCaseCommand} from "../../usecases/updateBlogUseCase";

@Controller('blogs')
export class BlogsController {

    constructor(
        private blogsService: BlogsService,
        private postsService: PostsService,
        private createBlogUseCase: CreateBlogUseCase,
        private getUserByIdUseCase: GetBlogByIdUseCase,
        private getAllBlogsUseCase: GetAllBlogsUseCase,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async create(
        @Body()
            createBlogDto: CreateBlogInputDto,
    ): Promise<BlogOutputModel> {

        const newBlogId = await this.createBlogUseCase.execute(
            createBlogDto
        );

        const blog: BlogOutputModel | null = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(newBlogId));

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }

    @Put(':id')
    @HttpCode(204)
    async updateBlog(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {

        const blog = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(id));

        if (!blog) {

            throw new NotFoundException(`Blog with not found`);
        }

        return this.commandBus.execute(new UpdateBlogUseCaseCommand(id, updateBlogDto));

    }

    @Post(':id/posts')
    async createPost(
        @Param('id') blogId: string,
        @Body()
            createPostToBlogDto: CreatePostToBlogDto,
    ) {
        const createdPost = await this.postsService.create({
            ...createPostToBlogDto,
            blogId,
        });

        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
            extendedLikesInfo: createdPost.extendedLikesInfo,
        };
    }

    @Get()
    async getAllBlogs(
        @Query() sortData: SortBlogsDto) {
        return this.getAllBlogsUseCase.execute(sortData);
    }

    @Get(':id/posts')
    async getPostsForBlog(
        @Param('id') id: string,
        @Query('pageNumber') pageNumber?: number,
        @Query('pageSize') pageSize?: number,
        @Query('sortBy') sortBy?: string,
        @Query('sortDirection') sortDirection?: string,
    ) {

        const sort = sortBy ?? 'createdAt';
        const direction = sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        const page = pageNumber ?? 1;
        const size = pageSize ?? 10;

        const blog = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(id));

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const totalCount = await this.postsService.countByBlogId(id);
        const pagesCount = Math.ceil(totalCount / +size);

        const skip = (page - 1) * size;
        const posts = await this.postsService.findByBlogIdPaginated(
            id,
            skip,
            size,
            sort,
            direction,
        );

        return {
            pagesCount,
            page: +page,
            pageSize: +size,
            totalCount,
            items: posts.map((post) => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: [],
                },
            })),
        };
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {

        return this.queryBus.execute(new GetBlogByIdUseCaseCommand(id));

    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteBlog(@Param('id') blogId: string): Promise<void> {
        // const result = await this.deleteBlogByIdUseCase.execute(blogId);
        const blog = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(blogId));

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const result = this.commandBus.execute(
            new DeleteBlogByIdUseCaseCommand(blogId)
        );

        if (!result) {
            throw new NotFoundException(`Blog with id not found`);
        }
    }
}
