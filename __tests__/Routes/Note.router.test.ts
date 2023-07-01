import {Server} from 'http';
// import {describe} from "node-test";
// @ts-ignore
import request from "supertest";
import KoaApp from "../../src/KoaApp";
import NoteDbModel from "../../src/DataSource/Models/Note.db.model";
import {Environment} from "../../src/Config";
import {AddNoteRequest} from "../../src/Request/AddNoteRequest";
// @ts-ignore
import jwt from 'jsonwebtoken';

const koaApp = new KoaApp();
let server: Server;
jest.mock('../../src/DataSource/Models/Note.db.model'); // This line mocks the NoteDbModel

beforeAll(async () => {
  server = await koaApp.start(Environment.TEST);
});

afterAll(done => {
  koaApp.stop();
  done();
});

describe("note.router", () => {
  it('it should GET all the notes', async () => {
    // arrange
    const mockNote = {title: 'test note', content: 'test content'};
    (NoteDbModel.getAll as jest.Mock).mockResolvedValueOnce([mockNote]);

    // act
    const response = await request(server).get('/notes');

    // assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'success',
      data: {
        notes: [mockNote]
      }
    });
  });

  it('should respond with the note if it exists', async () => {
    // Mock NoteDbModel.getById to return a mock note
    const mockNote = { id: 'test_id', title: 'Test Note', content: 'Test Content', authorId: 'test_author_id' };
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce(mockNote);

    // arrange
    const id = 'test_id';
    const expectedResponse = {
      message: 'success',
      data: {
        notes: mockNote,
      },
    };

    // act
    const response = await request(server).get(`/notes/${id}`);

    // assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should respond with 404 if the id does not exist', async () => {
    // Mock NoteDbModel.getById to return null, indicating note does not exist
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce(null);

    // arrange
    const id = 'nonexistent_id';
    const expectedResponse = {
      message: `Cannot find note with id: ${id}`,
    };

    // act
    const response = await request(server).get(`/notes/${id}`);

    // assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should create a new note and respond with 201', async () => {
    // Mock AddNoteRequest and NoteDbModel.create
    const mockAddNoteRequest = { title: 'Test Note', content: 'Test Content' };
    const mockNote = { id: 'test_id', ...mockAddNoteRequest };
    const mockToken = jwt.sign(
        { userId: 'test_user_id', expirationTime: Date.now() + 3600000 },
        process.env.TOKEN_SECRET as string
    );

    NoteDbModel.create = jest.fn().mockResolvedValueOnce(mockNote);
    // const createNoteMock = jest.spyOn(NoteDbModel, 'create').mockResolvedValue(mockNote);

    // Act
    const response = await request(server)
        .post('/notes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockAddNoteRequest);

    // Assert
    // expect(createNoteMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'success:',
      data: {
        note: mockNote,
      },
    });
  });

  it('should not delete with wrong author id and respond with 403', async () => {
    const id = 'note_id';
    const mockToken = jwt.sign(
        { userId: 'test_user_id', expirationTime: Date.now() + 3600000 },
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce({id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'real_author_id'});

    const response = await request(server)
        .delete(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Forbidden',
    });
  })

  it('delete successfully', async () => {
    const id = 'note_id';
    const mockToken = jwt.sign(
        { userId: 'real_author_id', expirationTime: Date.now() + 3600000 },
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce({id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'real_author_id'});
    NoteDbModel.deleteById=jest.fn().mockResolvedValueOnce(true);

    const response = await request(server)
        .delete(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.body).toEqual({
      message: 'success',
    });
  })

  it('should not delete ob invalid note id', async () => {
    const id = 'note_id';
    const mockToken = jwt.sign(
        { userId: 'real_author_id', expirationTime: Date.now() + 3600000 },
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce({id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'real_author_id'});
    NoteDbModel.deleteById=jest.fn().mockResolvedValueOnce(false);

    const response = await request(server)
        .delete(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `Cannot find note with id: ${id}`,
    });
  })

  it('should not patch with wrong author id and respond with 403', async () => {
    const id = 'note_id';
    const mockToken = jwt.sign(
        {userId: 'test_user_id', expirationTime: Date.now() + 3600000},
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.updateById = jest.fn().mockResolvedValueOnce({
      id: 'note_id',
      title: 'Test Note',
      content: 'Test Content',
      authorId: 'real_author_id'
    });

    const response = await request(server)
        .patch(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Forbidden',
    });
  })

  it('patch successfully', async () => {
    const id = 'note_id';
    const mockUpdateNoteRequest={id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'real_author_id'}
    const mockToken = jwt.sign(
        { userId: 'real_author_id', expirationTime: Date.now() + 3600000 },
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.updateById = jest.fn().mockResolvedValueOnce(mockUpdateNoteRequest);

    const response = await request(server)
        .patch(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.body).toEqual({
      message: 'success',
      data: {
        note: mockUpdateNoteRequest,
      },
    });
  })

  it('should not patch with invalid request body and respond with 400', async () => {
    const id = 'note_id';
    const mockUpdateNoteRequest={id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'test_author_id'}
    const mockToken = jwt.sign(
        {userId: 'test_user_id', expirationTime: Date.now() + 3600000},
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.updateById = jest.fn().mockResolvedValueOnce(null);
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce(mockUpdateNoteRequest);
    const response = await request(server)
        .patch(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Invalid request body',
    });
  })

  it('should not patch with invalid not id and respond with 404', async () => {
    const id = 'note_id';
    const mockUpdateNoteRequest={id: 'note_id', title: 'Test Note', content: 'Test Content', authorId: 'test_author_id'}
    const mockToken = jwt.sign(
        {userId: 'test_user_id', expirationTime: Date.now() + 3600000},
        process.env.TOKEN_SECRET as string
    );
    NoteDbModel.updateById = jest.fn().mockResolvedValueOnce(null);
    NoteDbModel.getById = jest.fn().mockResolvedValueOnce(null);
    const response = await request(server)
        .patch(`/notes/${id}`)
        .set('Authorization', `Bearer ${mockToken}`)

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `Cannot find note with id: ${id}`,
    });
  })
})
