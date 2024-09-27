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

let blog;

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


})
