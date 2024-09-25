import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {LikeComment, LikeCommentDocument} from "../domain/like-comment.entity";
import {Model} from "mongoose";

@Injectable()
export class LikesCommentQueryRepository {
    constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {
    }

    async getLike() {

    }
}