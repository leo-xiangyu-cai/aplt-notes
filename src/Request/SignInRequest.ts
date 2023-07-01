import {validateLength} from "../Middleware/VaildateLength";
import {IsString, Length} from "class-validator";
export class SignInRequest {
  // add limitation?
  @IsString()
  @Length(4, 100)
  username: string;

  @IsString()
  @Length(8, 100)
  password: string;

  constructor(requestBody: any = {}) {
    this.username = requestBody.username;
    this.password = requestBody.password;
  }
}
