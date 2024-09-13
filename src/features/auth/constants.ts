import * as process from "process";

export const jwtConstants = {
    JWT_SECRET: "123",
    ACCESS_TOKEN_EXPIRY: '30s',
    REFRESH_TOKEN_EXPIRY: '20s'
};

export const basicConstants = {
    userName: process.env.HTTP_BASIC_USER,
    password: process.env.HTTP_BASIC_PASS
}