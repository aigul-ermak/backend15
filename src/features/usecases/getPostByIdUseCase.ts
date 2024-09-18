import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {PostOutputModel, PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";


export class GetPostByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(GetPostByIdUseCaseCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository
    ) {
    }

    async execute(query: GetPostByIdUseCaseCommand): Promise<PostOutputModel | null> {

        const post = await this.postsQueryRepository.getPostById(query.id);

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        return PostOutputModelMapper(post);
    }
}