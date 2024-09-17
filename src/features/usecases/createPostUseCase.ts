import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";


export class CreatePostUseCaseCommand {

    // TODO
    constructor(public post: any) {
    }
}

@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository
    ) {
    }

    async execute(command: CreatePostUseCaseCommand) {

        const createdPost = await this.postsRepository.insert(command.post);

        return createdPost.id
    }
}