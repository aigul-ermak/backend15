import {Injectable, NotFoundException} from "@nestjs/common";
import {BlogOutputModel, BlogOutputModelMapper} from "../blogs/api/models/output/blog.output.model";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";


export class GetBlogByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@QueryHandler(GetBlogByIdUseCaseCommand)
export class GetBlogByIdUseCase implements IQueryHandler<GetBlogByIdUseCaseCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(query: GetBlogByIdUseCaseCommand): Promise<BlogOutputModel | null> {

        const blog = await this.blogsQueryRepository.getBlogById(query.id);

        if (blog === null) {
            throw new NotFoundException(`Blog not found`);
        }

        return BlogOutputModelMapper(blog);
    }
}