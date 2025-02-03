interface ValidationField {
    property: string;
    constraints?: {
        [type: string]: string;
    };
}

export function generateValidationResponse(fields: ValidationField[]) {
    return {
        message: 'Validation failed',
        errors: fields.map(field => ({
            field: field.property,
            constraints: field.constraints
        })),
    };
}
