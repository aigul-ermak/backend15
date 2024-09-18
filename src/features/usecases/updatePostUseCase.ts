import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {UpdatePostDto} from "../posts/api/models/input/create-post.input.dto";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {GetPostByIdUseCaseCommand} from "./getPostByIdUseCase";


export class UpdatePostUseCaseCommand {
    constructor(public id: string, public updatePostDto: UpdatePostDto) {
    }
}

@CommandHandler(UpdatePostUseCaseCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostUseCaseCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {
    }

    async execute(command: UpdatePostUseCaseCommand) {

        const post = await this.postsQueryRepository.getPostById(command.id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const updatedPost = await this.postsRepository.update(
            command.id, command.updatePostDto);

        if (!updatedPost) {
            throw new NotFoundException(`Post wasn't created`);
        }

        return updatedPost;
    }
}
