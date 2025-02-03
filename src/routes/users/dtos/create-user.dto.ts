import { IsString, Length, MinLength } from 'class-validator';
import { Match } from '../../../validators/match';

export class CreateUserDto {
    @IsString()
    @Length(3, 20)
    username!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    passwordConfirm!: string;
}
