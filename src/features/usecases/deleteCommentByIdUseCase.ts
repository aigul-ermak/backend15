import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";

export class DeleteCommentByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteCommentByIdUseCaseCommand)
export class DeleteCommentByIdUseCase implements ICommandHandler<DeleteCommentByIdUseCaseCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async execute(command: DeleteCommentByIdUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id)

        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        return await this.commentsRepository.deleteComment(command.id);
    }

}