import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {SortPostsDto} from "../posts/api/models/input/sort-post.input.dto";
import {PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";


export class GetAllPostsUseCaseCommand {
    constructor(public sortData: SortPostsDto) {
    }
}

@QueryHandler(GetAllPostsUseCaseCommand)
export class GetAllPostsUseCase implements IQueryHandler<GetAllPostsUseCaseCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {
    }

    async execute(command: GetAllPostsUseCaseCommand) {
        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const pageNumber = command.sortData.pageNumber ?? 1;
        const pageSize = command.sortData.pageSize ?? 10;

        const postsResult = await this.postsQueryRepository
            .findAllPostsPaginated(sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize);

        const totalCount = await this.postsQueryRepository.countDocuments();

        const posts = postsResult.posts;
        console.log(posts)
        const pageCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: posts.map(PostOutputModelMapper),
        }

    }
}