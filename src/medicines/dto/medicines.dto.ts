export class MedicinesDTO {
    _id?: string;
    readonly code: string;
    readonly name: string;
    readonly type: string;
    readonly dosage : string;
    readonly dosage_type: string;
    readonly presentation: string;
    readonly source: string;
}