import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {SortPostsDto} from "../posts/api/models/input/sort-post.input.dto";
import {CommentOutputModelMapper} from "../comments/api/model/output/comment-output.model";


export class GetCommentsForPostUseCaseCommand {
    constructor(
        public postId: string,
        public sortData: SortPostsDto) {
    }
}

@CommandHandler(GetCommentsForPostUseCaseCommand)
export class GetCommentsForPostUseCase implements ICommandHandler<GetCommentsForPostUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async execute(command: GetCommentsForPostUseCaseCommand) {

        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const page = command.sortData.pageNumber ?? 1;
        const size = command.sortData.pageSize ?? 10;

        const post = await this.postsQueryRepository.getPostById(command.postId);

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        const totalCount = await this.commentsQueryRepository.countByPostId(command.postId);
        const pagesCount = Math.ceil(totalCount / +size);

        const skip = (page - 1) * size;

        const comments = await this.commentsQueryRepository
            .findCommentssByPostIdPaginated(
                command.postId,
                sortBy,
                sortDirection,
                (page - 1) * size,
                size
            );

        //const mappedComments = comments.map(PostOutputModelMapper);

        return {
            pagesCount: pagesCount,
            page: +page,
            pageSize: +size,
            totalCount: totalCount,
            items: comments.map(CommentOutputModelMapper),
        }
    }
}