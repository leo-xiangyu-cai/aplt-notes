
import {IsString, Length, Matches} from "class-validator";
export class SignUpRequest {

  @IsString()
  @Length(4, 100)
  username: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!_@#$%^&*])/)
  password: string;

  constructor(requestBody: any = {}) {
    this.username = requestBody.username;
    this.password = requestBody.password;
  }
}

