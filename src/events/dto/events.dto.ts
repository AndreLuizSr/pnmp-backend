export class EventsDto {
  readonly type: string;
  readonly reference: string;
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly institution: string;
  };
  readonly new_data: object;
  readonly old_data: object;
}
