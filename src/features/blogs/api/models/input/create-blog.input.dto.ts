import {IsString, Length, Matches} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";

export class CreateBlogInputDto {
  @IsString()
  @Trim()
  @Length(1, 15, {message: "Length not correct"})
  name: string;

  @IsString()
  @Trim()
  @Length(1, 500, {message: "Length not correct"})
  description: string;

  @Length(1, 100, { message: "Length not correct" })
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: "Invalid URL format. The URL must start with https://",
  })
  websiteUrl: string;
}

export class CreatePostToBlogDto {
  title: string;
  shortDescription: string;
  content: string;
}

export class UpdateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}
