import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../../posts/domain/posts.entity";
import {Model} from "mongoose";
import {LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesRepository {
    constructor(@InjectModel(Post.name) private likeModel: Model<LikeDocument>) {
    }


}
