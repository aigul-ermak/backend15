import {IsString, Length} from "class-validator";
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
    @Length(1, 100, {message: "ShortDescription not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Content not correct"})
    content: string;

    @IsString()
    @Trim()
    blogId: string;
}

export class UpdatePostDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    @Length(1, 100, {message: "ShortDescription not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Content not correct"})
    content: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Blog id not correct"})
    blogId: string;
}
