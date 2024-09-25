export class PostCommentOutputModel {
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    };
    createdAt: Date;
    likesInfo: {
        likesCount: string;
        dislikesCount: string;
        myStatus: string;
    }
}

export const PostCommentOutputModelMapper = (postComment: any): PostCommentOutputModel => {
    //TODO type?
    const outputModel = new PostCommentOutputModel();

    outputModel.postId = postComment._id.toString();
    outputModel.content = postComment.content;
    outputModel.commentatorInfo = {
        userId: postComment.userId,
        userLogin: postComment.user.login
    }
    outputModel.createdAt = postComment.createdAt;

    outputModel.likesInfo = {
        likesCount: postComment.likesCount ?? 0,
        dislikesCount: postComment.dislikesCount ?? 0,
        myStatus: 'None',
    }

    return outputModel;
}