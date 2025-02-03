import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'Match' })
class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        console.log('MatchConstraint')
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        console.log(value, relatedValue)
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must match ${args.constraints[0]}`;
    }
}
