import {UserEntity} from "../Entities/User.entity";
import {DataSourceUtils} from "../DataSourceUtils";

export default class UserDbModel {

  static async getByUsername(username: string): Promise<UserEntity | null> {
    return DataSourceUtils.getDataSource().getRepository(UserEntity).findOneBy({username: username});
  }

  static async getById(id: string): Promise<UserEntity | null> {
    return DataSourceUtils.getDataSource().getRepository(UserEntity).findOneBy({id});
  }

  static async create(user: UserEntity): Promise<UserEntity> {
    return DataSourceUtils.getDataSource().getRepository(UserEntity).save(user);
  }
}
