import { Configuration } from "./configuration.model";

export class User {

  firstName: string;
  lastName: string;
  permissions: string[] = [];
  configuration: Configuration = new Configuration();

}
