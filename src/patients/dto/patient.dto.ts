export class PatientDTO {
    _id?: string;
    readonly name: string;
    readonly social_name: string;
    readonly health_number: string;
    readonly fiscal_number : string;
    readonly birthdate: string;
    readonly sex: string;
    readonly color: string;
    readonly mother_name: string;
    readonly country: string;
    readonly attributes: {
        weight: string;
        education: string;
        job: string;
    };
    readonly phone: string;
    readonly address: {
        address_line_1: string;
        address_line_2: string;
        postal_code: string;
      };
    readonly zone: string;
    readonly unit: string;
    readonly city: string;

}