import { IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(3, 20)
    username!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}
