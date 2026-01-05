import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signInDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
};