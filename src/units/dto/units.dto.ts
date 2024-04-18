export class UnitDTO {
  _id?: string;
  readonly code: string;
  readonly name: string;
  readonly parent_unit: string;
  readonly type: string;
  readonly related_units: string[];
}
