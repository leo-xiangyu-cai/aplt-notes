import {validate} from 'class-validator';
import {SignInRequest} from "../../src/Request/SignInRequest";
import {AddNoteRequest} from "../../src/Request/AddNoteRequest";

describe('SignInRequest', () => {
    it('should validate successfully with valid username and password', async () => {
        // arrange
        const request = new SignInRequest({
            username: 'Valid username',
            password: 'Valid password',
        });
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(0);
    })

    it('should fail validation if username is not provided', async () => {
        // arrange
        const request = new SignInRequest({password: 'Valid username'});

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('username');
    });

    it('should fail validation if password is not provided', async () => {
        // arrange
        const request = new SignInRequest({username: 'Valid password'});

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
    });


})
