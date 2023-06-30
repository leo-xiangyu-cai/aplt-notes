import {validate} from 'class-validator';
import {SignUpRequest} from "../../src/Request/SignUpRequest";

describe('SignUpRequest', () => {
    it('should validate successfully with valid username and password', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid username',
            password: 'Valid_password',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(0);
    });

    it('should fail validation if username exceeds 100 characters', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'a'.repeat(101),
            password: 'Valid_password',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('username');
    });

    it('should fail validation if username is less than 4 characters', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'a'.repeat(3),
            password: 'Valid_password',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('username');
    });

    it('should fail validation if password exceeds 100 characters', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid title',
            password: 'a'.repeat(101)+'A@',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });

    it('should fail validation if password is less than 8 characters', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid title',
            password: 'Aa@',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });

    it('should fail validation if password does not contain special characters.', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid title',
            password: 'Aaaaaaaaa',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });

    it('should fail validation if password does not contain big letters.', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid title',
            password: '@aaaaaaaa',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });

    it('should fail validation if password does not contain small letters.', async () => {
        // arrange
        const request = new SignUpRequest({
            username: 'Valid title',
            password: '@AAAAAAAA',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });

    it('should fail validation if username is not provided', async () => {
        // arrange
        const request = new SignUpRequest({password: 'Valid_password'});

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('username');
    });

    it('should fail validation if password is not provided', async () => {
        // arrange
        const request = new SignUpRequest({username: 'Valid username'});

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });
});
