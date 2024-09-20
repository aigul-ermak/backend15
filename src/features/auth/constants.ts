import * as process from "process";

export const jwtAccessConstants = {
    jwt_secret: process.env.JWT_SECRET,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
};

export const jwtRefreshConstants = {
    jwt_secret: process.env.JWT_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
};

export const basicConstants = {
    userName: process.env.HTTP_BASIC_USER,
    password: process.env.HTTP_BASIC_PASS,
}