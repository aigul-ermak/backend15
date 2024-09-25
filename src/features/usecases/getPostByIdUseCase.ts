import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {PostOutputModel, PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";


export class GetPostByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(GetPostByIdUseCaseCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private likesQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(query: GetPostByIdUseCaseCommand): Promise<PostOutputModel | null> {

        const post = await this.postsQueryRepository.getPostById(query.id);

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }
        const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(post.id);

        return PostOutputModelMapper(post, newestLikes);
      
    }
}