import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

export enum LIKE_STATUS {
    LIKE = 'Like',
    DISLIKE = 'Dislike',
    NONE = 'None'
}

@Schema()
export class Like {
    @Prop({required: true, enum: LIKE_STATUS})
    status: LIKE_STATUS;

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    parentId: string;

    @Prop({required: true})
    login: string;

    @Prop({required: true})
    createdAt: Date;

    static create(userId: string, parentId: string, login: string, status: LIKE_STATUS): Like {
        const like = new Like();
        like.userId = userId;
        like.parentId = parentId;
        like.login = login;
        like.status = status;
        like.createdAt = new Date();
        return like;
    }
}

export const LikeSchema = SchemaFactory.createForClass(Like);
