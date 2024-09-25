export class CommentOutputModel {
    id: string;
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

export const CommentOutputModelMapper = (postComment: any): CommentOutputModel => {
    //TODO type?
    const outputModel = new CommentOutputModel();

    outputModel.id = postComment._id.toString();
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