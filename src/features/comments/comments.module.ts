import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CommentsRepository} from "./infrastructure/comments.repository";
import {CommentsQueryRepository} from "./infrastructure/comments.query-repository";
import {CommentsEntity} from "./domain/comment.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Comment.name, schema: CommentsEntity}]),
    ],
    providers: [],
    exports: [CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {
}
