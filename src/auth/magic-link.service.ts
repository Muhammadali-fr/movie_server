import { Injectable } from "@nestjs/common";
import { MailerService } from "src/mailer/mailer.service";

// interfaces 
import { ISendMagicLink } from "./types/magic-link";

@Injectable()
export class SendAuthMagicLink {
    constructor(
        private mailer: MailerService
    ) { }

    sendMagicLink(payload: ISendMagicLink) {
        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${payload.token}`;
        this.mailer.sendMail(
            payload.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer;">Click here to Continue</button></a>`,
            "Save your movies for later!"
        );

        return {
            message: `Message sent to ${payload.email}, please verify your email to complete registration.`,
        };
    };
};