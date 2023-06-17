export class SingInRequest {

  username: string;

  password: string;

  constructor(requestBody: any = {}) {
    this.username = requestBody.username;
    this.password = requestBody.password;
  }
}
