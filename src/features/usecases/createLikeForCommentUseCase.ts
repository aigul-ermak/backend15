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
        let like;

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
                await this.commentsRepository.incrementLikeCount(command.commentId,);
            } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                await this.commentsRepository.incrementDislikeCount(command.commentId,);
            }
            return res;
        } else {

            like = await this.likeCommentQueryRepository.getLike(command.commentId, command.userId);

            if (like!.status !== command.likeStatus.likeStatus) {

                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.decrementLikeCount(command.commentId);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.decrementDislikeCount(command.commentId);
                }

                if (command.likeStatus.likeStatus === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.incrementLikeCount(command.commentId,);
                } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.incrementDislikeCount(command.commentId,);
                }

            } else {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.decrementLikeCount(command.commentId);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.decrementDislikeCount(command.commentId);
                }
                this.likeCommentRepository.deleteLikeStatus(command.commentId, command.userId);
            }

            return await this.likeCommentRepository.updateLike(like!._id.toString(), like);
        }
    }
}
