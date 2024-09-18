import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {CreatePostInputDto} from "../posts/api/models/input/create-post.input.dto";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";


export class CreatePostUseCaseCommand {

    // TODO
    constructor(public post: CreatePostInputDto) {
    }
}

@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
        private blogsQueryRepository: BlogsQueryRepository
    ) {
    }

    async execute(command: CreatePostUseCaseCommand) {

        const blog = await this.blogsQueryRepository.getBlogById(command.post.blogId);

        if (blog === null) {
            throw new NotFoundException(`Blog not found`);
        }

        const newCreatePost = {
            ...command.post,
            blogName: blog.name
        }

        const createdPost = await this.postsRepository.insert(newCreatePost);

        const post = await this.postsQueryRepository.getPostById(createdPost.id);

        if (post === null) {
            throw new NotFoundException(`Blog not found`);
        }

        return post;
    }
}