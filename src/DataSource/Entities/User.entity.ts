import {Entity, Column, PrimaryColumn} from "typeorm"
import {v4 as uuidv4} from "uuid";

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string

  @Column()
  username: string

  @Column()
  password: string

  constructor(username: string = "", password: string = "") {
    this.id = uuidv4();
    this.username = username;
    this.password = password;
  }
}
