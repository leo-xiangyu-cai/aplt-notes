import {Server} from 'http';
import {describe} from "node:test";
import request from "supertest";
import KoaApp from "../../src/KoaApp";
import NoteDbModel from "../../src/DataSource/Models/Note.db.model";
import {Environment} from "../../src/Config";

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
})
