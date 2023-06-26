import {validate} from 'class-validator';
import {AddNoteRequest} from "../../src/Request/AddNoteRequest";

describe('AddNoteRequest', () => {

  // Test if the validation succeeds when valid title and content are provided
  it('should validate successfully with valid title and content', async () => {
    const request = new AddNoteRequest({
      title: 'Valid title',
      content: 'Valid content',
    });

    const errors = await validate(request);

    // Expect no errors
    expect(errors).toHaveLength(0);
  });

  // Test if the validation fails when the title is too long
  it('should fail validation if title is too long', async () => {
    const request = new AddNoteRequest({
      title: 'a'.repeat(101), // This title exceeds 100 characters
      content: 'Valid content',
    });

    const errors = await validate(request);

    // Expect one error
    expect(errors).toHaveLength(1);
    // Expect the error is on the "title" property
    expect(errors[0].property).toBe('title');
  });

  // Test if the validation fails when the content is too long
  it('should fail validation if content is too long', async () => {
    const request = new AddNoteRequest({
      title: 'Valid title',
      content: 'a'.repeat(5001), // This content exceeds 5000 characters
    });

    const errors = await validate(request);

    // Expect one error
    expect(errors).toHaveLength(1);
    // Expect the error is on the "content" property
    expect(errors[0].property).toBe('content');
  });

  // Test if the validation fails when the title is not provided
  it('should fail validation if title is not provided', async () => {
    const request = new AddNoteRequest({
      // The "title" field is not provided
      content: 'Valid content',
    });

    const errors = await validate(request);

    // Expect one error
    expect(errors).toHaveLength(1);
    // Expect the error is on the "title" property
    expect(errors[0].property).toBe('title');
  });

  // Test if the validation fails when the content is not provided
  it('should fail validation if content is not provided', async () => {
    const request = new AddNoteRequest({
      title: 'Valid title',
      // The "content" field is not provided
    });

    const errors = await validate(request);

    // Expect one error
    expect(errors).toHaveLength(1);
    // Expect the error is on the "content" property
    expect(errors[0].property).toBe('content');
  });
});
