import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {JwtService} from "@nestjs/jwt";
import {LikesRepository} from "../like/infrastructure/likes.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {LikesQueryRepository} from "../like/infrastructure/likes.query-repository";
import {LikeStatusInputDto} from "../like/api/model/like-status.input.dto";
import {LIKE_STATUS} from "../like/domain/like.entity";


export class CreateLikeForPostUseCaseCommand {
    constructor(public postId: string,
                public likeStatus: LikeStatusInputDto,
                public userId: string) {
    }
}


@CommandHandler(CreateLikeForPostUseCaseCommand)
export class CreateLikeForPostUseCase implements ICommandHandler<CreateLikeForPostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
        private likeRepository: LikesRepository,
        private likeQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: CreateLikeForPostUseCaseCommand) {

        const post = await this.postsQueryRepository.getPostById(command.postId);
        let like;

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        const user = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const isLikeExist = await this.likeQueryRepository.checkLike(user.id, post.id);

        if (!isLikeExist) {

            const newLike = {
                status: command.likeStatus,
                userId: command.userId,
                parentId: command.postId,
                login: user?.login,
                createdAt: Date.now(),
            };

            const res = await this.likeRepository.createLike(newLike);

            if ((command.likeStatus as unknown as LIKE_STATUS) == LIKE_STATUS.LIKE) {
                await this.postsRepository.incrementLikeCount(command.postId,);
            } else if ((command.likeStatus as unknown as LIKE_STATUS) === LIKE_STATUS.DISLIKE) {
                await this.postsRepository.incrementDislikeCount(command.postId,);
            }
            return res;
        } else {

            like = await this.likeQueryRepository.getLike(command.postId, command.userId);
            if (like!.status !== command.likeStatus) {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.postsRepository.decrementLikeCount(command.postId,);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.decrementDislikeCount(command.postId,);
                }

                if ((command.likeStatus as unknown as LIKE_STATUS) === LIKE_STATUS.LIKE) {
                    await this.postsRepository.incrementLikeCount(command.postId,);
                } else if ((command.likeStatus as unknown as LIKE_STATUS) === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.incrementDislikeCount(command.postId,);
                }
            }
            like!.status = command.likeStatus;

            return await this.likeRepository.updateLike(like!._id.toString(), like);
        }
    }
}
