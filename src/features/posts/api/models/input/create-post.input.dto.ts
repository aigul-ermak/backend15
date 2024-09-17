import {IsString, Length} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";

export class CreatePostInputDto {
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
