import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Comment, CommentDocument} from "../domain/comment.entity";


@Injectable()
export class CommentsRepository {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
    }

    async createComment(newComment: any) {
        const res = await this.commentModel.create(newComment)
        return res._id.toString();
    }

}