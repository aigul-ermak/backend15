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
        newestLikes: {
            addedAt: string;
            userId: string;
            login: string;
        }[],
    };
}

export const PostOutputModelMapper = (post: PostDocument): PostOutputModel => {
    const outputModel = new PostOutputModel();

    outputModel.id = post._id.toString();
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = post.createdAt;

    outputModel.extendedLikesInfo = {
        likesCount: post.likesCount ?? 0,
        dislikesCount: post.dislikesCount ?? 0,
        myStatus: 'None',
        newestLikes: [
            {
                addedAt: "",
                userId: 'string',
                login: 'string'
            }
        ],
    }

    return outputModel;
}