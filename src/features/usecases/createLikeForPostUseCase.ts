import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {LikesRepository} from "../likePost/infrastructure/likes.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";
import {LIKE_STATUS} from "../likePost/domain/like.entity";
import {LikeStatusInputDto} from "../likePost/api/model/like-status.input.dto";


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

        const isLikeExist = await this.likeQueryRepository.checkLike({parentId: post.id, userId: user.id,});

        if (!isLikeExist) {

            const newLike = {
                status: command.likeStatus.likeStatus,
                userId: command.userId,
                parentId: command.postId,
                login: user?.login,
                createdAt: Date.now(),
            };

            const res = await this.likeRepository.createLike(newLike);

            if (command.likeStatus.likeStatus == LIKE_STATUS.LIKE) {
                await this.postsRepository.incrementLikeCount(command.postId,);

            } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                await this.postsRepository.incrementDislikeCount(command.postId,);
            }

            return res;

        } else {

            like = await this.likeQueryRepository.getLike(command.postId, command.userId);

            if (like!.status !== command.likeStatus.likeStatus) {

                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.postsRepository.decrementLikeCount(command.postId);

                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.decrementLikeCount(command.postId,);
                }

                this.likeRepository.deleteLikeStatus(command.postId, command.userId);

            } else {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.postsRepository.decrementLikeCount(command.postId);

                } else if (like!.status === LIKE_STATUS.DISLIKE) {

                    await this.postsRepository.decrementDislikeCount(command.postId);
                }

                this.likeRepository.deleteLikeStatus(command.postId, command.userId);
            }
        }
    }
}
