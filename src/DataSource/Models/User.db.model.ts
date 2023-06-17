import {User} from "../Entities/User.entity";
import {DataSourceUtils} from "../DataSourceUtils";

export default class UserDbModel {

  static async getByUsername(username: string): Promise<User | null> {
    return DataSourceUtils.getDataSource().getRepository(User).findOneBy({username: username});
  }

  static async create(user: User): Promise<User> {
    return DataSourceUtils.getDataSource().getRepository(User).save(user);
  }
}
