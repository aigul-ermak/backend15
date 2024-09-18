import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {UpdatePostDto} from "../posts/api/models/input/create-post.input.dto";
import {PostsRepository} from "../posts/infrastructure/posts.repository";


export class UpdatePostUseCaseCommand {
    constructor(public id: string, public updatePostDto: UpdatePostDto) {
    }
}

@CommandHandler(UpdatePostUseCaseCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostUseCaseCommand> {
    constructor(private postsRepository: PostsRepository) {
    }

    async execute(command: UpdatePostUseCaseCommand) {

        const updatedPost = await this.postsRepository.update(
            command.id, command.updatePostDto);

        if (!updatedPost) {
            throw new NotFoundException(`Post wasn't created`);
        }
        return updatedPost;
    }
}
