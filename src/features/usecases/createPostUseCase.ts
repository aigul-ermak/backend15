import {CreatePostInputDto} from "../posts/api/models/input/create-post.input.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "../blogs/domain/blog.entity";
import {Model} from "mongoose";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {NotFoundException} from "@nestjs/common";
import {Post} from "../posts/domain/posts.entity";
import {PostDBModel} from "../posts/api/models/input/post-db.input.model";
import {PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";

export class CreatePostUseCaseCommand {
    constructor(public post: Post) {
    }
}

@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository
    ) {
    }

    async execute(command: CreatePostUseCaseCommand) {        //const {title, shortDescription, content, blogId} = command;

        const createdPost = await this.postsRepository.insert(command.post);

        return createdPost.id
    }
}