import {Controller} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";

@Controller('comments')
export class CommentsController {
    constructor(
        private commandBus: CommandBus,
    ) {
    }
}