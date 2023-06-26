import {Server} from 'http';
import {describe} from "node:test";
import request from "supertest";
import KoaApp from "../../src/KoaApp";
import {Environment} from "../../src/Config";

const koaApp = new KoaApp();
let server: Server;
beforeAll(async () => {
  server = await koaApp.start(Environment.TEST);
});

afterAll(done => {
  koaApp.stop();
  done();
});

describe("health-check.router", () => {
  it("/ping", async () => {
    // act
    const response = await request(server).get("/ping");

    // assert
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toBe("pong");
  });
})
