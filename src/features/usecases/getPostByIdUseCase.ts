import {NotFoundException} from "@nestjs/common";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {PostOutputModel, PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";


export class GetPostByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@QueryHandler(GetPostByIdUseCaseCommand)
export class GetPostByIdUseCase implements IQueryHandler<GetPostByIdUseCaseCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {
    }

    async execute(query: GetPostByIdUseCaseCommand): Promise<PostOutputModel | null> {
        console.log(query.id)
        const post = await this.postsQueryRepository.findById(query.id);
        //console.log(query.id)

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        return PostOutputModelMapper(post);
    }
}