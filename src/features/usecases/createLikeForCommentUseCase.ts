import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {LIKE_STATUS} from "../likePost/domain/like.entity";
import {LikeStatusInputDto} from "../likePost/api/model/like-status.input.dto";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {LikesCommentRepository} from "../likeComment/infrastructure/likes-comment.repository";
import {LikesCommentQueryRepository} from "../likeComment/infrastructure/likes-comment.query-repository";


export class CreateLikeForCommentUseCaseCommand {
    constructor(public commentId: string,
                public likeStatus: LikeStatusInputDto,
                public userId: string) {
    }
}

@CommandHandler(CreateLikeForCommentUseCaseCommand)
export class CreateLikeForCommentUseCase implements ICommandHandler<CreateLikeForCommentUseCaseCommand> {

    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
        private likeCommentRepository: LikesCommentRepository,
        private likeCommentQueryRepository: LikesCommentQueryRepository,
    ) {
    }

    async execute(command: CreateLikeForCommentUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.commentId);

        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        const user = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const isLikeExist = await this.likeCommentQueryRepository.checkLike({
            commentId: command.commentId,
            userId: user.id,
        });

        if (!isLikeExist) {

            const newLike = {
                status: command.likeStatus.likeStatus,
                userId: command.userId,
                commentId: command.commentId,
                login: user?.login,
                createdAt: Date.now(),
            };

            const res = await this.likeCommentRepository.createLike(newLike);

            if (command.likeStatus.likeStatus == LIKE_STATUS.LIKE) {
                await this.commentsRepository.incrementLikeCount(command.commentId);

            } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                await this.commentsRepository.incrementDislikeCount(command.commentId,);
            }

            return res;

        } else {

            const currentLike = await this.likeCommentQueryRepository.getLike(command.commentId, command.userId);

            if (command.likeStatus.likeStatus === LIKE_STATUS.NONE) {
                await this.commentsRepository.deleteLikeStatus(command.commentId, command.userId);

                const updatedLikesInfo = {
                    likesCount: 0,
                    dislikesCount: 0,
                };

                await this.commentsRepository.updatePostLikesCount(command.commentId, updatedLikesInfo)
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.LIKE) {
                if (currentLike!.status === LIKE_STATUS.LIKE) {
                    return;
                    // await this.commentsRepository.decrementLikeCount(command.commentId);
                    // await this.likeCommentRepository.deleteLikeStatus(command.commentId, command.userId);

                } else if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.incrementLikeCount(command.commentId);
                    await this.commentsRepository.decrementDislikeCount(command.commentId);
                    await this.likeCommentRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.LIKE});
                }
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                if (currentLike!.status === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.decrementLikeCount(command.commentId);
                    await this.commentsRepository.incrementDislikeCount(command.commentId);
                    await this.likeCommentRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.DISLIKE});

                } else if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    return;
                    // await this.commentsRepository.decrementDislikeCount(command.commentId);
                    // await this.likeCommentRepository.deleteLikeStatus(command.commentId, command.userId);
                }
            }

        }
    }
}
