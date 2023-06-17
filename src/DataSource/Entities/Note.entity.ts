import {Entity, Column, PrimaryColumn} from "typeorm"
import {v4 as uuidv4} from "uuid";

@Entity()
export class Note {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column()
  content: string

  constructor(title: string = "", content: string = "") {
    this.id = uuidv4();
    this.title = title;
    this.content = content;
  }
}