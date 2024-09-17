import {PostDocument} from "../../../domain/posts.entity";

export class PostOutputModel {
    id: string
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: [],
    };
}

export const PostOutputModelMapper = (post: PostDocument): PostOutputModel => {
    const outputModel = new PostOutputModel();

    outputModel.id = post.id;
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = post.createdAt;

    outputModel.extendedLikesInfo = {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
    }

    return outputModel;
}