import {Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Put, Req, UseGuards} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {BasicAuthGuard} from "../../../auth/basic-auth.guard";
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {LikeStatusInputDto} from "../../../likePost/api/model/like-status.input.dto";
import {Request} from "express";
import {CommentInputDto} from "./input/comment-input.dto";
import {UpdateCommentUseCaseCommand} from "../../../usecases/updateCommentUseCase";
import {DeleteCommentByIdUseCaseCommand} from "../../../usecases/deleteCommentByIdUseCase";
import {CreateLikeForCommentUseCaseCommand} from "../../../usecases/createLikeForCommentUseCase";
import {GetCommentByIdUseCaseCommand} from "../../../usecases/getCommentByIdUseCase";

@Controller('comments')
export class CommentsController {
    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Get(':id')
    async getCommentById(@Param('id') id: string) {
        return await this.commandBus.execute(new GetCommentByIdUseCaseCommand(id));
    }

    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updateComment(
        @Param('id') id: string,
        @Body() updatePostDto: CommentInputDto,
    ) {

        return await this.commandBus.execute(
            new UpdateCommentUseCaseCommand(id, updatePostDto));

    }


    @Put(':id/like-status')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async createLikeForComment(
        @Param('id') commentId: string,
        @Body() likeStatus: LikeStatusInputDto,
        @Req() req: Request
    ) {
        const userId = req['userId'];

        return await this.commandBus.execute(
            new CreateLikeForCommentUseCaseCommand(commentId, likeStatus, userId));
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteComment(@Param('id') id: string): Promise<void> {

        const result = await this.commandBus.execute(
            new DeleteCommentByIdUseCaseCommand(id));

        if (!result) {
            throw new NotFoundException(`Post not found`);
        }
    }

}