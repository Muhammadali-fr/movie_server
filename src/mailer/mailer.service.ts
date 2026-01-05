import { Injectable, Logger } from '@nestjs/common';
import { Transporter } from "nodemailer";
import * as nodemailer from "nodemailer";
import "dotenv/config"

@Injectable()
export class MailerService {
    private readonly transporter: Transporter;
    private readonly logger = new Logger(MailerService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    };

    async sendMail(to: string, html: string, subject: string) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            return { messageId: info.messageId };
        } catch (error) {
            this.logger.error(`Email send failed: ${error.message}`);
            return { success: false, error: error.message };
        };
    };
};
