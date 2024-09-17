import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdateBlogDto} from "../blogs/api/models/input/update-blog.input.dto";


export class UpdateBlogUseCaseCommand {
    constructor(public id: string, public updateBlogDto: UpdateBlogDto) {
    }
}


@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogUseCaseCommand> {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(command: UpdateBlogUseCaseCommand) {
        const {id, updateBlogDto} = command;
        return await this.blogsRepository.update(id, updateBlogDto);
    }
}
