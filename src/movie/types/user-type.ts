export interface IUser{
    id:string;
    email:string;
    name:string;
    avatar?:string;
    provider: "google"| "email";
    googleId?:string;
};