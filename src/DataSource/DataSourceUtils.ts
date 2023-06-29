import {ApltNotesDataSource} from "./aplt-rds";

export const DataSourceUtils = {
  getDataSource: () => {
    return ApltNotesDataSource;
  }
}
