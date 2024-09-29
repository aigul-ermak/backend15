import {Module} from '@nestjs/common';
import {BlogsController} from './api/blogs.controller';
import {BlogsService} from './application/blogs.service';
import {BlogsRepository} from './infrastructure/blogs.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Blog, BlogEntity} from './domain/blog.entity';
import {BlogsQueryRepository} from "./infrastructure/blogs.query-repository";
import {IsBlogByIdExistsConstraint} from "../../infrastructure/decorators/validation/blog-is-exist.decorator";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Blog.name, schema: BlogEntity}]),
    ],
    providers: [BlogsService, BlogsRepository, BlogsQueryRepository, IsBlogByIdExistsConstraint],
    //controllers: [BlogsController],
    exports: [BlogsRepository, BlogsQueryRepository]
})
export class BlogsModule {
}
