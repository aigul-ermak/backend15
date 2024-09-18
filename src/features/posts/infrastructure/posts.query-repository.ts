import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, SortOrder} from 'mongoose';
import {Post, PostDocument} from '../domain/posts.entity';

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    // async insert(post: Post) {
    //     const res = await this.postModel.insertMany(post);
    //     return res[0];
    // }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async findById(id: any) {
        return this.postModel.findById(id).exec();
    }

    async findAllPostsPaginated(
        sort: string,
        sortDirection: 'asc' | 'desc',
        page: number,
        pageSize: number,
    ) {
        const skip = (page - 1) * pageSize;
        const sortOption: { [key: string]: SortOrder } = {
            [sort]: sortDirection === 'asc' ? 1 : -1,
        };

        const [posts, totalCount] = await Promise.all([
            this.postModel.find().sort(sortOption).skip(skip).limit(pageSize).exec(), // Sort by createdAt
            this.postModel.countDocuments(),
        ]);
        return {posts, totalCount};
    }

    async countDocuments(): Promise<number> {
        return this.postModel.countDocuments().exec();
    }

    // async deleteById(id: string): Promise<boolean> {
    //     const result = await this.postModel.findByIdAndDelete(id).exec();
    //     return result !== null;
    // }

    async findByBlogId(blogId: string): Promise<PostDocument[]> {
        return this.postModel.find({blogId}).exec();
    }

    async countByBlogId(blogId: string) {
        return this.postModel.countDocuments({blogId}).exec();
    }

    async findByBlogIdPaginated(
        sort: string,
        sortDirection: 'asc' | 'desc',
        page: number,
        pageSize: number,
    ): Promise<PostDocument[]> {
        const validPage = Math.max(page, 1); // Ensure page is at least 1
        const skip = (validPage - 1) * pageSize;
        const sortOption: { [key: string]: SortOrder } = {
            [sort]: sortDirection === 'asc' ? 1 : -1,
        };

        return this.postModel
            .find()
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .exec()

    }

    // async update(id: string, updatePostDto: UpdatePostDto) {
    //     return this.postModel
    //         .findByIdAndUpdate(id, updatePostDto, {new: true})
    //         .exec();
    // }
}
