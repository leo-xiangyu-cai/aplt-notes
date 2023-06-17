import Router from "koa-router";
import {Note} from "../DataSource/entities/note.entity";
import {AddNoteRequest} from "../request/AddNoteRequest";
import logger from "../Utils/Logger";
import {UpdateNoteRequest} from "../Request/UpdateNoteRequest";

const router = new Router();
let notes: Note[] = [];

router.get('/notes', async (ctx) => {
  ctx.body = {
    message: 'success',
    data: {
      notes: notes
    }
  }
});

router.get('/notes/:id', async (ctx) => {
  const id = ctx.params.id;
  const filteredNotes = notes.filter(x => x.id === id);
  if (filteredNotes.length > 0) {
    ctx.body = {
      message: 'success',
      data: {
        notes: filteredNotes[0]
      }
    }
  } else {
    ctx.status = 404
    ctx.body = {
      message: `Cannot find note with id: ${id}`
    }
  }
});

router.post('/notes', async (ctx) => {
  let addNoteRequest = new AddNoteRequest(ctx.request.body);
  let newNote = new Note(addNoteRequest.title, addNoteRequest.content);
  notes.push(newNote);
  // let note = await DataSourceUtils.getDataSource().getRepository(Note).save(newNote);
  ctx.status = 201;
  ctx.body = {
    message: 'success',
    data: {
      note: newNote
    }
  }
});

router.delete('/notes/:id', async (ctx) => {
  notes = notes.filter(x => x.id !== ctx.params.id);
  ctx.body = {
    message: 'success'
  }
});

router.patch('/notes/:id', async (ctx) => {
  let updateNoteRequest = new UpdateNoteRequest(ctx.request.body);
  const note = notes.find(x => x.id === ctx.params.id);
  if (note) {
    if (updateNoteRequest.title) {
      note.title = updateNoteRequest.title;
    }
    if (updateNoteRequest.content) {
      note.content = updateNoteRequest.content;
    }
    logger.info(`note: ${JSON.stringify(note)}`);
    ctx.body = {
      message: 'success',
      data: {
        note: note
      }
    }
  } else {
    ctx.status = 404
    ctx.body = {
      message: `Cannot find note with id: ${ctx.params.id}`
    }
  }
});

export default router;