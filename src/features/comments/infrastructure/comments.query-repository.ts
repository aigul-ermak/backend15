import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CommentDocument} from "../domain/comment.entity";


@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
    }

    async getCommentById(commentId: string) {
        return this.commentModel.findOne({_id: commentId});
    }
}