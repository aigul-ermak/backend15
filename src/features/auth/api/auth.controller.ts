import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {Response} from 'express';
import {UsersService} from "../../users/application/users.service";
import {AuthService} from "../application/auth.service";
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {AuthGuard} from "../../../infrastructure/guards/auth.guard";
import {ResendEmailDto} from "../../email/models/input/email.input.dto";


@Controller('auth')
export class AuthController {
    userService: UsersService;

    constructor(
        private authService: AuthService
    ) {
        this.authService = authService;
    }

    //@HttpCode(HttpStatus.OK)

    // @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: UserLoginDto,
                @Res() res: Response,) {

        const userIP: string = "testuserip";
        const userDevice: string = "testdeviceid";
        const userAgent: string = "user-agent";

        const {accessToken, refreshToken} = await this
            .authService.loginUser(loginDto, userIP, userDevice, userAgent);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({accessToken});
    }

    //
// @Post('/password-recovery')
// async recoveryPassword(
//     @Body()
//     loginUserDto: loginUserDto) {
//
// }

    //
// @Post('/new-password')
// async createNewPassword(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }
//

    @Post('/registration-confirmation')
    @HttpCode(204)
    async confirmRegistration(@Body('code') code: string) {

        const result: boolean = await this.authService.confirmEmail(code)

        if (!result) {
            throw new BadRequestException()
        }
    }

    @Post('/registration')
    @HttpCode(204)
    async registration(
        @Body() createUserDto: CreateUserDto) {

        const result = await this.authService.createUser(
            createUserDto
        );
    }

    @Post('/registration-email-resending')
    @HttpCode(204)
    async sendNewCodeToEmail(@Body() resendEmailDto: ResendEmailDto) {
        const {email} = resendEmailDto;
        await this.authService.sendNewCodeToEmail(email);

    }

    @UseGuards(AuthGuard)
    @Get('/me')
    @HttpCode(200)
    async getUser(
        @Req() req: Request
    ) {
        const userId = req['user']?.id;
        const userLogin = req['user'].login;

        const user = await this.authService.findUserById(userId.toString())

        if (!user) {
            throw new BadRequestException();
        }

        return ({
            "email": user.email,
            "login": user.login,
            "userId": user.id
        })
    }
}

