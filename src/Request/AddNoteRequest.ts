import {IsString, Length} from "class-validator";

export class AddNoteRequest {

  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(0, 5000)
  content: string;

  constructor(requestBody: any = {}) {
    this.title = requestBody.title;
    this.content = requestBody.content;
  }
}
