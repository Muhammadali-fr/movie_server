export interface ISendMagicLink {
    token: string;
    email: string;
};

export interface IMagicLinkToken {
    name?:string;
    email: string;
    method: "sign-in" | "sign-up";
};