
// export class SignUpRequest {
//
//   username: string;
//
//   password: string;
//
//   constructor(requestBody: any = {}) {
//     this.username = requestBody.username;
//     this.password = requestBody.password;
//   }
// }


import {validateLength} from "../Middleware/VaildateLength";
export class SignUpRequest {
  username: string;
  password: string;

  constructor(requestBody: any = {}) {
    this.username = validateLength(requestBody.username, 4, 8); // 添加长度验证
    this.password = validateLength(requestBody.password, 6); // 添加长度验证
  }
}

