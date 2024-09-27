import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';

const request = require('supertest');
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";
import {BlogOutputModelMapper} from "../src/features/blogs/api/models/output/blog.output.model";


const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

let blog, blog1;

describe('Blogs testing', () => {
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

    it('return 201 for create blog1', async () => {

        const blogDto = {
            name: 'testBlog1',
            description: 'testDescription1',
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

        blog1 = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 400 for invalid blog fields', async () => {

        const blogDto = {
            name: '',
            description: '',
            websiteUrl: ''
        };

        const response = await request(httpServer)
            .post('/blogs')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogDto)
            .expect(400);


        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "name"
                },
                {
                    "message": "Description not correct",
                    "field": "description"
                },
                {
                    "message": "Invalid URL format. The URL must start with https://",
                    "field": "websiteUrl"
                }
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 401 for Unauthorized', async () => {

        const blogDto = {
            name: 'testBlog',
            description: 'testDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .post('/blogs')
            .send(blogDto)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401
        });
    });


    it('return 200 for get blog', async () => {

        const blogId = blog.id;

        const response = await request(httpServer)
            .get(`/blogs/${blogId}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            name: blog.name,
            description: expect.any(String),
            websiteUrl: expect.any(String),
            createdAt: expect.any(String),
            isMembership: false
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 404 for not found blog', async () => {

        const blogId = '66f6a26adc4b81ea41af73f8';

        const response = await request(httpServer)
            .get(`/blogs/${blogId}`)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Blog not found',
            error: 'Not Found'
        });
    });


    it('return 204 for update blog', async () => {

        const blogId = blog.id;

        const blogUpdateDto = {
            name: 'testNewBlog',
            description: 'testNewDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .put(`/blogs/${blogId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogUpdateDto)
            .expect(204);

        //blog = response.body;

    });

    it('returns 400 for invalid blog updated fields', async () => {

        const blogId = blog.id;

        const blogUpdateDto = {
            name: '',
            description: '',
            websiteUrl: ''
        };

        const response = await request(httpServer)
            .put(`/blogs/${blogId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogUpdateDto)
            .expect(400);


        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "name"
                },
                {
                    "message": "Description not correct",
                    "field": "description"
                },
                {
                    "message": "Invalid URL format. The URL must start with https://",
                    "field": "websiteUrl"
                }
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 401 for Unauthorized', async () => {

        const blogId = blog.id;

        const blogUpdateDto = {
            name: 'testBlog',
            description: 'testDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .put(`/blogs/${blogId}`)
            .send(blogUpdateDto)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401
        });
    });

    it('returns 404 for not found blog', async () => {

        const blogId = '66f6a26adc4b81ea41af73f8';

        const blogUpdateDto = {
            name: 'testBlog',
            description: 'testDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .put(`/blogs/${blogId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogUpdateDto)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Blog not found',
            error: 'Not Found'
        });
    });


    it('returns 200 for get all blogs', async () => {


        const response = await request(httpServer)
            .get('/blogs')
            .expect(200);

        const expectedResponse = {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    name: blog.name,
                    description: expect.any(String),
                    websiteUrl: expect.any(String),
                    createdAt: expect.any(String),
                    isMembership: false
                },
                {
                    id: expect.any(String),
                    name: blog1.name,
                    description: expect.any(String),
                    websiteUrl: expect.any(String),
                    createdAt: expect.any(String),
                    isMembership: false
                }
            ],
        };

        expect(response.body).toEqual(expectedResponse);
    });


    // it('Get all blogs', async () => {
    //     const response = await request(httpServer)
    //         .get('/blogs')
    //         .expect(200);
    //
    //     const expectedResponse = {
    //         pagesCount: 0,
    //         page: 1,
    //         pageSize: 10,
    //         totalCount: 0,
    //         items: []
    //     };
    //
    //     expect(response.body).toEqual(expectedResponse);
    // });
    //

    it('returns 204 for delete blog', async () => {

        const blogId = blog.id;

        const response = await request(httpServer)
            .delete(`/blogs/${blogId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .expect(204);
    });

    it('returns 201 for delete blog: unauthorised user', async () => {

        const blogId = blog.id;

        const response = await request(httpServer)
            .delete(`/blogs/${blogId}`)
            .expect(401);
    });
    it('returns 404 for delete blog: Not found', async () => {

        const blogId = '66f6a26adc4b81ea41af73f8';

        const response = await request(httpServer)
            .delete(`/blogs/${blogId}`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .expect(404);
    });

});
