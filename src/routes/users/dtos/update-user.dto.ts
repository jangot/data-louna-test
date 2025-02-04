import { IsString, Length, MinLength } from 'class-validator';
import { Match } from '../../../validators/match';

export class UpdateUserDto {
    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    passwordConfirm!: string;
}
