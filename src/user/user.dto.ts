export class CreateUserDto {
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly phone: string;
  readonly institution: string;
  readonly roles: string[];
}

export class UpdateUserDto {
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly phone: string;
  readonly institution: string;
  readonly roles: string[];
}
