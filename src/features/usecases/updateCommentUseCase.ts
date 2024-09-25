import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {CommentInputDto} from "../comments/api/model/input/comment-input.dto";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";


export class UpdateCommentUseCaseCommand {
    constructor(public id: string, public updateCommentDto: CommentInputDto) {
    }
}

@CommandHandler(UpdateCommentUseCaseCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentUseCaseCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async execute(command: UpdateCommentUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id);

        if (!comment) {
            throw new NotFoundException('Post not found');
        }

        const updatedComment = await this.commentsRepository.updateComment(
            command.id, command.updateCommentDto);

        if (!updatedComment) {
            throw new NotFoundException(`Post wasn't created`);
        }

        return updatedComment;
    }
}
