import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {LikeComment, LikeCommentDocument} from "../domain/like-comment.entity";

@Injectable()
export class LikesCommentRepository {
    constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {
    }

    async getLike() {

    }
}