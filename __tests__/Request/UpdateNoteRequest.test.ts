import {validate} from 'class-validator';
import {UpdateNoteRequest} from "../../src/Request/UpdateNoteRequest";

describe('AddNoteRequest', () => {
    it('should validate successfully with valid title and content', async () => {
        // arrange
        const request = new UpdateNoteRequest({
            title: 'Valid title',
            content: 'Valid content',
        });

        // act
        const errors = await validate(request);

        // assert
        expect(errors).toHaveLength(0);
    });
});
