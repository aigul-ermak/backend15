import {
    MiddlewareConsumer,
    Module,
    NestModule,
    Provider,
} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersRepository} from './features/users/infrastructure/users.repository';
import {UsersService} from './features/users/application/users.service';
import {User, UsersEntity} from './features/users/domain/users.entity';
import {UsersController} from './features/users/api/users.controller';
import {LoggerMiddleware} from './infrastructure/middlewares/logger.middleware';
import {UsersModule} from "./features/users/users.module";
import {TestingModule} from "./features/testing/testing-module";
import {PostsModule} from "./features/posts/posts.module";
import {AuthModule} from './features/auth/auth.module';
import {AuthController} from './features/auth/api/auth.controller';
import {AuthService} from './features/auth/application/auth.service';
import {UsersQueryRepository} from "./features/users/infrastructure/users.query-repository";
import {EmailModule} from "./features/email/email.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration, {ConfigurationType} from "./settings/configuration";
import {CreateUserUseCase} from "./features/usecases/createUserUseCase";
import {CreateBlogUseCase} from "./features/usecases/createBlogUseCase";
import {GetBlogByIdUseCase} from "./features/usecases/getBlogByIdUseCase";
import {BlogsController} from "./features/blogs/api/blogs.controller";
import {PostsController} from "./features/posts/api/posts.controller";
import {BlogsRepository} from "./features/blogs/infrastructure/blogs.repository";
import {BlogsQueryRepository} from "./features/blogs/infrastructure/blogs.query-repository";
import {BlogsService} from "./features/blogs/application/blogs.service";
import {BlogsModule} from "./features/blogs/blogs.module";
import {Blog, BlogEntity} from "./features/blogs/domain/blog.entity";
import {GetAllBlogsUseCase} from "./features/usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCase} from "./features/usecases/deleteBlogByIdUseCase";
import {CqrsModule} from "@nestjs/cqrs";
import {UpdateBlogUseCase} from "./features/usecases/updateBlogUseCase";
import {Post, PostsEntity} from "./features/posts/domain/posts.entity";
import {CreatePostUseCase} from "./features/usecases/createPostUseCase";
import {PostsService} from "./features/posts/application/posts.service";
import {GetPostByIdUseCase} from "./features/usecases/getPostByIdUseCase";
import {UpdatePostUseCase} from "./features/usecases/updatePostUseCase";
import {GetAllPostsUseCase} from "./features/usecases/getAllPostsUseCase";
import {DeletePostByIdUseCase} from "./features/usecases/deletePostByIdUseCase";


const usersProviders: Provider[] = [UsersRepository, UsersQueryRepository, UsersService];
const blogsProviders: Provider[] = [BlogsRepository, BlogsQueryRepository, BlogsService]
const useCases = [CreateUserUseCase, CreateBlogUseCase, GetBlogByIdUseCase, GetAllBlogsUseCase,
    DeleteBlogByIdUseCase, UpdateBlogUseCase, CreatePostUseCase, GetPostByIdUseCase,
    UpdatePostUseCase, GetAllPostsUseCase, DeletePostByIdUseCase]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env.development.local', '.env.development', '.env'],
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService<ConfigurationType, true>) => {
                const environmentSettings = configService.get('environmentSettings', {
                    infer: true,
                });
                const databaseSettings = configService.get('databaseSettings', {
                    infer: true,
                });
                const uri = environmentSettings.isTesting
                    ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
                    : databaseSettings.MONGO_CONNECTION_URI;

                return {
                    uri
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            {name: User.name, schema: UsersEntity},
            {name: Blog.name, schema: BlogEntity},
            {name: Post.name, schema: PostsEntity}]),
        CqrsModule,
        UsersModule,
        TestingModule,
        PostsModule,
        BlogsModule,
        AuthModule,
        EmailModule,
    ],
    providers: [...usersProviders, ...blogsProviders, AuthService, BlogsService, PostsService, ...useCases],
    controllers: [UsersController, AuthController, BlogsController, PostsController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
