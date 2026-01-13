export interface IUser{
    id?:string;
    name: string;
    email: string;
}

export interface IGoogleUser{
    email:string;
    name:string;
    avatar?:string;
    provider: "google"| "email";
    googleId?:string;
}