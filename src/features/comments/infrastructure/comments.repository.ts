import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Comment, CommentDocument} from "../domain/comment.entity";
import {CommentInputDto} from "../api/model/input/comment-input.dto";


@Injectable()
export class CommentsRepository {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
    }

    //TODO type
    async createComment(newComment: any) {
        // const res = await this.commentModel.insertMany(newComment);
        // return res[0];
        const res = await this.commentModel.create(newComment)
        return res._id.toString();
    }

    async updateComment(id: string, updateCommentDto: CommentInputDto) {
        return this.commentModel
            .findByIdAndUpdate(id, updateCommentDto, {new: true})
            .exec();
    }

    async deleteComment(id: string) {
        const result = await this.commentModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async incrementLikeCount(id: string) {
        await this.commentModel.updateOne({_id: id}, {
            $inc: {likesCount: 1}
        });
    }


    async decrementLikeCount(id: string) {
        await this.commentModel.updateOne({_id: id}, {
            $inc: {likesCount: -1}
        });
    }

    async incrementDislikeCount(id: string) {
        await this.commentModel.updateOne({_id: id}, {
            $inc: {dislikesCount: 1}
        });
    }

    async decrementDislikeCount(id: string) {
        await this.commentModel.updateOne({_id: id}, {
            $inc: {dislikesCount: -1}
        });
    }

}