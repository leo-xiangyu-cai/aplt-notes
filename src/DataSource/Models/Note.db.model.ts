import {Note} from "../Entities/Note.entity";
import {DataSourceUtils} from "../DataSourceUtils";

export default class NoteDbModel {

  static async getAll(): Promise<Note[]> {
    return DataSourceUtils.getDataSource().getRepository(Note).find();
  }

  static async getById(id: string): Promise<Note | null> {
    return DataSourceUtils.getDataSource().getRepository(Note).findOneBy({id});
  }

  static async create(title: string, content: string): Promise<Note> {
    return DataSourceUtils.getDataSource().getRepository(Note).save(new Note(title, content));
  }

  static async updateById(id: string, title: string, content: string): Promise<Note | null> {
    const note = await DataSourceUtils.getDataSource().getRepository(Note).findOneBy({id});
    if (note) {
      if (title) {
        (note as Note).title = title;
      }
      if (content) {
        (note as Note).content = content;
      }
      return await DataSourceUtils.getDataSource().getRepository(Note).save(note);
    }
    return null;
  }

  static async deleteById(id: string): Promise<boolean> {
    return (await DataSourceUtils.getDataSource().getRepository(Note).delete({id})).affected === 1;
  }
}
