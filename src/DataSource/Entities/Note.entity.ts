import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm"
import {v4 as uuidv4} from "uuid"; //unique id
// Add Note Entity
@Entity()
export class Note {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column()
  content: string

  // @ManyToOne(() => User, user => user.id)
  @Column()
  authorId: string

  constructor(userId: string, title: string = "", content: string = "") {
    this.id = uuidv4();
    this.title = title;
    this.content = content;
    this.authorId = userId;
  }
}
