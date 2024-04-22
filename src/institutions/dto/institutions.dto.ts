export class InstitutionsDTO {
  _id?: string;
  readonly code: string;
  readonly name: string;
  readonly phone: string;
  readonly address: {
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
  };
  readonly unit: string;
  readonly type: string[];
  readonly related_units: string[];
}
