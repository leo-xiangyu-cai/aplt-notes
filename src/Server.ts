import KoaApp from './KoaApp';

require('dotenv').config();

const koaApp = new KoaApp();

const server = koaApp.start();

export default server;
