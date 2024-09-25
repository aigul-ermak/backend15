import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CommentDocument} from "../domain/comment.entity";


@Injectable()
export class CommentsRepository {
    constructor(@InjectModel(Comment.name) private postModel: Model<CommentDocument>) {
    }

    async findAll() {

    }

}