
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
export class SignUpRequest {
  username: string;
  password: string;

  constructor(requestBody: any = {}) {
    this.username = validateLength(requestBody.username, 4, 8); // 添加长度验证
    this.password = validateLength(requestBody.password, 6); // 添加长度验证
  }
}
const validateLength = (value: string, minLength: number, maxLength?: number): string => {
  if (value.length < minLength) {
    throw Error(`Value length must be at least ${minLength}`);
  }
  if (maxLength && value.length > maxLength) {
    throw Error(`Value length must be at most ${maxLength}`);
  }
  return value;
};