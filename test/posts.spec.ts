import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';

const request = require('supertest');
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";


const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

let blog, post, user, accessToken;

describe('Posts testing', () => {
    let app: INestApplication;
    let httpServer;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();


        app = moduleFixture.createNestApplication();
        applyAppSettings(app);
        await app.init();

        httpServer = app.getHttpServer();
    });

    afterAll(async () => {

        await request(httpServer)
            .delete('/testing/all-data')
            .expect(204);

        await app.close();
    });

    it('return 201 for create blog', async () => {

        const blogDto = {
            name: 'testBlog',
            description: 'testDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .post('/blogs')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            name: blogDto.name,
            description: expect.any(String),
            websiteUrl: expect.any(String),
            createdAt: expect.any(String),
            isMembership: false
        };

        blog = response.body;

        expect(response.body).toEqual(expectedResult);

    });


    it('return 201 for create post', async () => {

        const postDto = {
            title: 'testPost',
            shortDescription: 'testShortDescription',
            content: 'testContent',
            blogId: blog.id
        };

        const response = await request(httpServer)
            .post('/posts')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(postDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            title: postDto.title,
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }

        };

        post = response.body;
        expect(response.body).toEqual(expectedResult);

    });

    it('returns 400 for invalid post fields', async () => {

        const postDto = {
            title: '',
            shortDescription: '',
            content: '',
            blogId: ''
        };

        const response = await request(httpServer)
            .post('/posts')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(postDto)
            .expect(400);


        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "title"
                },
                {
                    "message": "ShortDescription not correct",
                    "field": "shortDescription"
                },
                {
                    "message": "Content not correct",
                    "field": "content"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);
    });

    it('returns 401 for Unauthorized', async () => {

        const postDto = {
            title: 'testPost',
            shortDescription: 'testShortDescription',
            content: 'testContent',
            blogId: blog.id
        };

        const response = await request(httpServer)
            .post('/posts')
            .send(postDto)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401
        });
    });

    it('return 200 for get post', async () => {

        const postId = post.id;

        const response = await request(httpServer)
            .get(`/posts/${postId}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            title: post.title,
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }

        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 404 for not found post', async () => {

        const postId = '66f6a26adc4b81ea41af73f8';

        const response = await request(httpServer)
            .get(`/posts/${postId}`)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Post not found',
            error: 'Not Found'
        });
    });

    it('return 204 for update post', async () => {

        const postId = post.id;

        const postUpdateDto = {
            title: 'testUpdatePost',
            shortDescription: 'testUpdateShortDescription',
            content: 'testUpdateContent',
            blogId: blog.id
        };

        const response = await request(httpServer)
            .put(`/posts/${postId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(postUpdateDto)
            .expect(204);

    });

    it('returns 400 for invalid post updated fields', async () => {

        const postId = post.id;

        const postUpdateDto = {
            title: '',
            shortDescription: '',
            content: '',
            blogId: ''
        };


        const response = await request(httpServer)
            .put(`/posts/${postId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(postUpdateDto)
            .expect(400);


        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "title"
                },
                {
                    "message": "ShortDescription not correct",
                    "field": "shortDescription"
                },
                {
                    "message": "Content not correct",
                    "field": "content"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 401 for Unauthorized', async () => {

        const postId = post.id;

        const postUpdateDto = {
            title: 'testUpdatePost',
            shortDescription: 'testUpdateShortDescription',
            content: 'testUpdateContent',
            blogId: blog.id
        };

        const response = await request(httpServer)
            .put(`/posts/${postId}`)
            .send(postUpdateDto)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401
        });
    });

    it('return 201 for create user', async () => {

        const userDto = {
            login: "user1",
            password: "password",
            email: "example@example.com"
        };

        const response = await request(httpServer)
            .post(`/users`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            login: userDto.login,
            email: userDto.email,
            createdAt: expect.any(String),
        };

        user = response.body;

        expect(response.body).toEqual(expectedResult);

    });


    it('return 200 for login user', async () => {


        const userLoginDto = {
            loginOrEmail: "user1",
            password: "password"
        };


        const response = await request(httpServer)
            .post(`/auth/login`)
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken = response.body.accessToken;

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 204 for add like to post', async () => {

        const postId = post.id;

        const likeDto = {
            likeStatus: 'Like'
        };

        const response = await request(httpServer)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(likeDto)
            .expect(204);


    });


    it('returns 204 for delete post', async () => {

        const postId = post.id;

        const response = await request(httpServer)
            .delete(`/posts/${postId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .expect(204);
    });

    it('returns 201 for delete blog: unauthorised user', async () => {

        const postId = post.id;

        const response = await request(httpServer)
            .delete(`/posts/${postId}`)
            .expect(401);
    });

    it('returns 404 for delete blog: Not found', async () => {

        const postId = '66f6a26adc4b81ea41af73f8';

        const response = await request(httpServer)
            .delete(`/posts/${postId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .expect(404);
    });
})
