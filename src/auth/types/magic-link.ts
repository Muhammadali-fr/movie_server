export interface ISendMagicLink {
    token: string;
    email: string;
};

export interface IMagicLinkToken {
    email: string;
    method: "sign-in" | "sign-up";
};