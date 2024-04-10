export class UserDTO {
  _id?: string;
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly phone: string;
  readonly institution: string;
  readonly roles: string[];
  readonly permission: string[];
}
