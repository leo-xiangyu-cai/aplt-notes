import Router from "koa-router";
import {AddNoteRequest} from "../Request/AddNoteRequest";
import logger from "../Utils/Logger";
import {UpdateNoteRequest} from "../Request/UpdateNoteRequest";
import NoteDbModel from "../DataSource/Models/Note.db.model";

// import UserDbModel from "../DataSource/Models/User.db.model";
import {handleResponse} from "../Middleware/HandleResponse";
const Authorise = require('../Middleware/Authorise');

const router = new Router();

router.get('/notes', async (ctx) => {
  let notes = await NoteDbModel.getAll();
  ctx.body = {
    message: 'success',
    data: {
      notes: notes
    }
  }
});

router.get('/notes/:id', async (ctx) => {
  const id = ctx.params.id;
  let note = await NoteDbModel.getById(id);
  if (note) {
    ctx.body = {
      message: 'success',
      data: {
        notes: note
      }
    }
  } else {
    ctx.status = 404
    ctx.body = {
      message: `Cannot find note with id: ${id}`
    }
  }
});

router.post('/notes', Authorise, async (ctx) => {
  let addNoteRequest = new AddNoteRequest(ctx.request.body);
  let note = await NoteDbModel.create(ctx.state.userId, addNoteRequest.title, addNoteRequest.content);
  ctx.status = 201;
  ctx.body = {
    message: 'success:',
    data: {
      note: note
    }
  }
});

router.delete('/notes/:id', Authorise, async (ctx) => {
  const id = ctx.params.id;
  const note = await NoteDbModel.getById(id);
  if (note?.authorId !== ctx.state.userId) {
    ctx.status = 403
    ctx.body = {
      message: 'Forbidden'
    }
    return;
  }
  let deleteResult = await NoteDbModel.deleteById(id);
  if (deleteResult) {
    ctx.body = {
      message: 'success',
    }
  } else {
    ctx.status = 404
    ctx.body = {
      message: `Cannot find note with id: ${id}`
    }
  }
});

router.patch('/notes/:id', Authorise, async (ctx) => {
    let updateNoteRequest = new UpdateNoteRequest(ctx.request.body);

    let note = await NoteDbModel.updateById(ctx.params.id, updateNoteRequest.title, updateNoteRequest.content);
    if (note) {
      if (note.authorId !== ctx.state.userId) {
        ctx.status = 403
        ctx.body = {
          message: 'Forbidden'
        }
        return;
      }
      if (updateNoteRequest.title) {
        note.title = updateNoteRequest.title;
      }
      if (updateNoteRequest.content) {
        note.content = updateNoteRequest.content;
      }
      ctx.body = {
        message: 'success',
        data: {
          note: note
        }
      }
    } else {
      if (await NoteDbModel.getById(ctx.params.id)) {
        ctx.status = 400
        ctx.body = {
          message: 'Invalid request body'
        }
      } else {
        ctx.status = 404
        ctx.body = {
          message: `Cannot find note with id: ${ctx.params.id}`
        }
      }
    }
  }
)
;

export default router;
