import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signUpDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
};