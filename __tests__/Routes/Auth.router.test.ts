import {Server} from 'http';
// @ts-ignore
import request from "supertest";
import KoaApp from "../../src/KoaApp";
import {Environment} from "../../src/Config";
import UserDbModel from "../../src/DataSource/Models/User.db.model";
import {TokenGenerator} from "../../src/Utils/TokenGenerator";
import NoteDbModel from "../../src/DataSource/Models/Note.db.model";
import {HashingService} from "../../src/Utils/HashingService";

const koaApp = new KoaApp();
let server: Server;
jest.mock('../../src/DataSource/Models/User.db.model'); // This line mocks the UserDbModel

beforeAll(async () => {
    server = await koaApp.start(Environment.TEST);
});

afterAll(done => {
    koaApp.stop();
    done();
});

describe("auth.router", () => {
    it('should sign up successfully', async () => {
        // Mock UserDbModel.getByUsername to return null, indicating that the username is not taken
        UserDbModel.getByUsername = jest.fn().mockResolvedValueOnce(null);

        // Mock UserDbModel.create to return a newly registered user
        UserDbModel.create = jest.fn().mockResolvedValueOnce({ id: 'user_id' });

        // Mock TokenGenerator.generateUserToken to return a dummy token
        TokenGenerator.generateUserToken = jest.fn().mockReturnValueOnce('dummy_token');

        // arrange
        const mockRequestBody = { username: 'test_username', password: 'Test_password' };

        // act
        const response = await request(server)
            .post('/sign-up')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'success',
            data: {
                token: 'dummy_token',
            },
        });
        expect(UserDbModel.getByUsername).toHaveBeenCalledWith(mockRequestBody.username);
        expect(UserDbModel.create).toHaveBeenCalledWith(expect.objectContaining({
            username: mockRequestBody.username,
            password: expect.any(String),
        }));
        expect(TokenGenerator.generateUserToken).toHaveBeenCalledWith('user_id');
    });

    it('should return 400 if username already exists', async () => {
        // Mock UserDbModel.getByUsername to return a user, indicating that the username is taken
        (UserDbModel.getByUsername as jest.Mock).mockResolvedValueOnce({id: 'test_id', password: 'Test_password', username: 'test_username'});

        // arrange
        const mockRequestBody = { username: 'test_username', password: 'Test_password_one' };

        // act
        const response = await request(server)
            .post('/sign-up')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Username already exists',
        });
    });

    it('should return 500 on internal server error', async () => {
        // Mock UserDbModel.getByUsername to throw an error
        (UserDbModel.getByUsername as jest.Mock).mockResolvedValueOnce(null);
        (UserDbModel.create as jest.Mock).mockResolvedValueOnce(null);

        // arrange
        const mockRequestBody = { username: 'test_username', password: 'Test_password' };

        // act
        const response = await request(server)
            .post('/sign-up')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: 'Internal Server Error',
        });
        // expect(UserDbModel.getByUsername).toHaveBeenCalledWith(mockRequestBody.username);
        // expect(UserDbModel.create).not.toHaveBeenCalled();
        // expect(TokenGenerator.generateUserToken).not.toHaveBeenCalled();
    });

    it('should sign in successfully', async () => {
        (UserDbModel.getByUsername as jest.Mock).mockResolvedValueOnce({password: HashingService.hashText('Test_password'),
            username: 'test_username'});
        TokenGenerator.generateUserToken = jest.fn().mockReturnValueOnce('dummy_token');
        const mockRequestBody = { username: 'test_username', password: 'Test_password' };

        const response = await request(server)
            .post('/sign-in')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'success',
            data: {
                token: 'dummy_token',
            },
        });
    });

    it('should return 401 on invalid password', async () => {
        (UserDbModel.getByUsername as jest.Mock).mockResolvedValueOnce({
            password: HashingService.hashText('Test_password_invalid'),
            username: 'test_username'
        });
        const mockRequestBody = {username: 'test_username', password: 'Test_password'};

        const response = await request(server)
            .post('/sign-in')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Invalid password',
        });
    })

    it('should return 404 on invalid username', async () => {
        (UserDbModel.getByUsername as jest.Mock).mockResolvedValueOnce(null);
        const mockRequestBody = {username: 'test_username', password: 'Test_password'};

        const response = await request(server)
            .post('/sign-in')
            .send(mockRequestBody);

        // assert
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Invalid username',
        });
    })
});
