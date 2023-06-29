import {validate} from 'class-validator';
import {AddNoteRequest} from "../../src/Request/AddNoteRequest";

describe('AddNoteRequest', () => {
  it('should validate successfully with valid title and content', async () => {
    // arrange
    const request = new AddNoteRequest({
      title: 'Valid title',
      content: 'Valid content',
    });

    // act
    const errors = await validate(request);

    // assert
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if title exceeds 100 characters', async () => {
    // arrange
    const request = new AddNoteRequest({
      title: 'a'.repeat(101),
      content: 'Valid content',
    });

    // act
    const errors = await validate(request);

    // assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if content exceeds 5000 characters', async () => {
    // arrange
    const request = new AddNoteRequest({
      title: 'Valid title',
      content: 'a'.repeat(5001),
    });

    // act
    const errors = await validate(request);

    // assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('content');
  });

  it('should fail validation if title is not provided', async () => {
    // arrange
    const request = new AddNoteRequest({content: 'Valid content'});

    // act
    const errors = await validate(request);

    // assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if content is not provided', async () => {
    // arrange
    const request = new AddNoteRequest({title: 'Valid title'});

    // act
    const errors = await validate(request);

    // assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('content');
  });
});
