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
import {
    CreateBlogInputDto,
    CreatePostToBlogDto,
} from './models/input/create-blog.input.dto';
import {CreateBlogUseCaseCommand} from "../../usecases/createBlogUseCase";
import {GetBlogByIdUseCaseCommand} from "../../usecases/getBlogByIdUseCase";
import {BlogOutputModel} from "./models/output/blog.output.model";
import {BasicAuthGuard} from "../../auth/basic-auth.guard";
import {SortBlogsDto} from "./models/input/sort-blog.input.dto";
import {GetAllBlogsUseCaseCommand} from "../../usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCaseCommand} from "../../usecases/deleteBlogByIdUseCase";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {UpdateBlogUseCaseCommand} from "../../usecases/updateBlogUseCase";
import {UpdateBlogDto} from "./models/input/update-blog.input.dto";
import {CreatePostUseCaseCommand} from "../../usecases/createPostUseCase";
import {SortPostsDto} from "../../posts/api/models/input/sort-post.input.dto";
import {GetAllPostsForBlogUseCaseCommand} from "../../usecases/getAllPostsForBlogUseCase";

@Controller('blogs')
export class BlogsController {

    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {
    }


    @Post()
    @UseGuards(BasicAuthGuard)
    async create(
        @Body()
            createBlogDto: CreateBlogInputDto,
    ): Promise<BlogOutputModel> {

        const newBlogId = await this.commandBus.execute(new CreateBlogUseCaseCommand(createBlogDto))

        const blog: BlogOutputModel | null = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(newBlogId));

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }


    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
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
    @UseGuards(BasicAuthGuard)
    async createPostForBlog(
        @Param('id') blogId: string,
        @Body()
            createPostToBlogDto: CreatePostToBlogDto,
    ) {

        const createdPost = {
            ...createPostToBlogDto,
            blogId,
        }

        return await this.commandBus.execute(new CreatePostUseCaseCommand(createdPost));

    }

    @Get()
    async getAllBlogs(
        @Query() sortData: SortBlogsDto) {
        return this.queryBus.execute(new GetAllBlogsUseCaseCommand(sortData))
    }

    @Get(':id/posts')
    async getPostsForBlog(
        @Param('id') blogId: string,
        @Query() sortData: SortPostsDto,
    ) {

        return await this.commandBus.execute(new GetAllPostsForBlogUseCaseCommand(blogId, sortData));


    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {
        return this.queryBus.execute(new GetBlogByIdUseCaseCommand(id));
    }


    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteBlog(@Param('id') blogId: string): Promise<void> {

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
