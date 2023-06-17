export class AddNoteRequest {

  title: string;

  content: string;

  constructor(requestBody: any = {}) {
    this.title = requestBody.title;
    this.content = requestBody.content;
  }
}