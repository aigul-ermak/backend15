import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {CommentOutputModelMapper} from "../comments/api/model/output/comment-output.model";


export class GetCommentByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(GetCommentByIdUseCaseCommand)
export class GetCommentByIdUseCase implements ICommandHandler<GetCommentByIdUseCaseCommand> {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async execute(command: GetCommentByIdUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id);

        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        return CommentOutputModelMapper(comment);
    }
}