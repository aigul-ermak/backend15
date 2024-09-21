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


export class CreateLikeForPostUseCaseCommand {

    constructor(public postId: string, public likeStatus: any, userId: string) {
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

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        const user = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const isLikeExist = await this.likeQueryRepository.checkLikeStatus(user.id, post.id);

        if (!isLikeExist) {
            const newLike = {
                status: likeStatus,
                userId,
                parentId,
                login: user?.accountData.login,
                createdAt: Date.now(),
            };

            const res = await this.likeRepository.createLike(newLike);

            if (likeStatus == LIKE_STATUS.LIKE) {
                await this.postsRepository.incrementLikeCount(parentId);
            } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                await this.postsRepository.incrementDislikeCount(parentId);
            }
            return res;
        } else {
            like = await this.likeRepository.getLike(parentId, userId);
            if (like!.status !== likeStatus) {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.postsRepository.decrementLikeCount(parentId);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.decrementDislikeCount(parentId);
                }

                if (likeStatus === LIKE_STATUS.LIKE) {
                    await this.postsRepository.incrementLikeCount(parentId);
                } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.incrementDislikeCount(parentId);
                }
            }
            like!.status = likeStatus;

            return await this.likeRepository.updateLike(like!._id.toString(), like);
        }
    }
}