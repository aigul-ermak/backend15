import {Module} from '@nestjs/common';
import {PostsController} from './api/posts.controller';
import {PostsService} from './application/posts.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsRepository} from './infrastructure/posts.repository';
import {Post, PostsEntity} from './domain/posts.entity';
import {Blog, BlogEntity} from '../blogs/domain/blog.entity';
import {BlogsRepository} from '../blogs/infrastructure/blogs.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Post.name, schema: PostsEntity}]),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogEntity}]),
    ],
    providers: [PostsService, PostsRepository, BlogsRepository],
    controllers: [PostsController],
    exports: [PostsService],
})
export class PostsModule {
}
