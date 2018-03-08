import { Group } from "./group.model";
import { Configuration } from "./configuration.model";

export class User {

  firstName: string;
  lastName: string;
  permissions: string[] = [];
  groups: Group[] = [];
  configuration: Configuration = new Configuration();

}
