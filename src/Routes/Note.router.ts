import Router from "koa-router";
import {Note} from "../DataSource/Entities/Note.entity";
import {AddNoteRequest} from "../request/AddNoteRequest";
import logger from "../Utils/Logger";
import {UpdateNoteRequest} from "../Request/UpdateNoteRequest";
import {DataSourceUtils} from "../DataSource/DataSourceUtils";

const router = new Router();
let notes: Note[] = [];

router.get('/notes', async (ctx) => {
  let notes = await DataSourceUtils.getDataSource().getRepository(Note).find();
  logger.info(`notes: ${JSON.stringify(notes)}`);
  ctx.body = {
    message: 'success',
    data: {
      notes: notes
    }
  }
});

router.get('/notes/:id', async (ctx) => {
  const id = ctx.params.id;
  let note = await DataSourceUtils.getDataSource().getRepository(Note).findOne({where: {id}});
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

router.post('/notes', async (ctx) => {
  let addNoteRequest = new AddNoteRequest(ctx.request.body);
  let newNote = new Note(addNoteRequest.title, addNoteRequest.content);
  let note = await DataSourceUtils.getDataSource().getRepository(Note).save(newNote);
  ctx.status = 201;
  ctx.body = {
    message: 'success',
    data: {
      note: note
    }
  }
});

router.delete('/notes/:id', async (ctx) => {
  const id = ctx.params.id;
  let deleteResult = await DataSourceUtils.getDataSource().getRepository(Note).delete({id});
  if (deleteResult.affected === 0) {
    ctx.status = 404
    ctx.body = {
      message: `Cannot find note with id: ${id}`
    }
  } else {
    ctx.body = {
      message: 'success',
    }

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