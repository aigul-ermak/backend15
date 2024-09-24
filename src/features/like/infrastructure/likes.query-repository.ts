import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";

import {Model} from "mongoose";
import {Like, LIKE_STATUS, LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesQueryRepository {
    constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {
    }

    async getLike(parentId: string, userId: string) {
        const res = await this.likeModel.findOne({parentId: parentId, userId: userId});
        return res;
    }

    async getNewestLikes(parentId: string) {
        return this.likeModel.find({parentId: parentId, status: LIKE_STATUS.LIKE})
            .sort({createdAt: -1})
            .limit(3);
    }

    async checkLike({parentId, userId}: { parentId: string, userId: string }) {
        // arguments
        const res = await this.likeModel.findOne({parentId: parentId, userId: userId}).lean();
        return !!res;
    }

}