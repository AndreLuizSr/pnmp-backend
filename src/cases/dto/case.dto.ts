export class CaseDTO {
    _id?: string;
    readonly patient_id: string;
    readonly type: string;
    readonly work_related: boolean;
    readonly first_symptoms_at: string;
    readonly infection_source: string;
    readonly clinical_form: string[];
    readonly associated_information: string[];
    readonly associated_information_other: string;
    readonly exams: {
      type: string;
      data: string;
    }[];
    readonly diagnostic_conclusion: {
      conclusion: string;
      agent: string;
      other: string;
    }[];
  }
  