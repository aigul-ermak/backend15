import {IsString, IsUUID, Length} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";
import {ValidateBlogExists} from "../../../../../infrastructure/decorators/validate/blog-is-exist.decorator";

export class CreatePostInputDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    @Length(1, 100, {message: "Length not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Length not correct"})
    content: string;

    // @IsString()
    // @Trim()
    @ValidateBlogExists({message: "Blog not correct"})
    blogId: string;
}

export class CreatePostForBlogInputDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    @Length(1, 100, {message: "Length not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Length not correct"})
    content: string;

    @IsString()
    @Trim()
        //@ValidateBlogExists({message: "Blog not correct"})
    blogId: string;
}

export class UpdatePostDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    shortDescription: string;

    @IsString()
    @Trim()
    content: string;

    @IsString()
    @Trim()
    blogId: string;
}
