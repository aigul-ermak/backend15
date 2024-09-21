import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../../posts/domain/posts.entity";
import {Model} from "mongoose";
import {LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Post.name) private likeModel: Model<LikeDocument>) {
    }

    async createLike(data: any) {
        const res = await this.likeModel.create(data);
        return res._id.toString();
    }

    async updateLike(id: string, updateData: any) {
        const res = await this.likeModel.updateOne({_id: id}, {
            $set: {
                status: updateData.status,
                userId: updateData.userId,
                parentId: updateData.parentId,
            }
        })
        return !!res.matchedCount;

    }

}
