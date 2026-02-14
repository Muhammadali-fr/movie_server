import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

@Injectable()
export class AwsService {
    private readonly s3: S3Client;
    private readonly logger = new Logger(AwsService.name);

    private readonly region: string;
    private readonly bucket: string;

    constructor(private readonly config: ConfigService) {
        const accessKeyId = this.config.get<string>("AWS_ACCESS_KEY_ID");
        const secretAccessKey = this.config.get<string>("AWS_SECRET_ACCESS_KEY");
        this.region = this.config.get<string>("AWS_REGION") ?? "";
        this.bucket = this.config.get<string>("AWS_S3_BUCKET") ?? "";

        const missing = [
            !accessKeyId && "AWS_ACCESS_KEY_ID",
            !secretAccessKey && "AWS_SECRET_ACCESS_KEY",
            !this.region && "AWS_REGION",
            !this.bucket && "AWS_S3_BUCKET",
        ].filter(Boolean);

        if (missing.length) {
            this.logger.error(`AWS configuration is missing: ${missing.join(", ")}`);
            throw new Error("AWS configuration is incomplete.");
        }

        this.s3 = new S3Client({
            region: this.region,
            credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
        });
    }

    async uploadMoviePoster(file: Express.Multer.File): Promise<{ url: string }> {
        if (!file) throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);

        if (file.mimetype === "image/svg+xml") {
            this.logger.warn(`Blocked SVG upload: ${file.originalname}`);
            throw new HttpException("SVG files are not allowed.", HttpStatus.BAD_REQUEST);
        }

        const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
        if (!allowed.has(file.mimetype)) {
            throw new HttpException("Only JPG/PNG/WebP/AVIF allowed.", HttpStatus.BAD_REQUEST);
        }

        const key = `public/${uuid()}.webp`;

        try {
            const optimizedBuffer = await sharp(file.buffer)
                .resize({ width: 800, height: 450, fit: "cover" })
                .toFormat("webp", { quality: 60 })
                .toBuffer();

            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: optimizedBuffer,
                    ContentType: "image/webp",
                    CacheControl: "public, max-age=31536000, immutable",
                }),
            );

            const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
            return { url };
        } catch (error: any) {
            this.logger.error(`Failed to upload image: ${error?.message}`, error?.stack);
            throw new HttpException("An error occurred while uploading the image.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadUserAvatar(
        file: Express.Multer.File,
        userId: string,
    ): Promise<{ url: string; key: string }> {
        if (!file) throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);

        // Optional but recommended: size limit (10MB)
        const MAX = 10 * 1024 * 1024;
        if (file.size > MAX) {
            throw new HttpException("Max file size is 10MB.", HttpStatus.BAD_REQUEST);
        }

        // Block SVG (scriptable)
        if (file.mimetype === "image/svg+xml") {
            this.logger.warn(`Blocked SVG upload: ${file.originalname}`);
            throw new HttpException("SVG files are not allowed.", HttpStatus.BAD_REQUEST);
        }

        const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
        if (!allowed.has(file.mimetype)) {
            throw new HttpException("Only JPG/PNG/WebP/AVIF allowed.", HttpStatus.BAD_REQUEST);
        }

        // Put avatars in a dedicated folder, scoped per user
        const key = `avatars/${userId}/${uuid()}.webp`;

        try {
            // Square avatar crop; adjust size to your UI needs
            const optimizedBuffer = await sharp(file.buffer)
                .rotate() // respects EXIF orientation (common phone issue)
                .resize({ width: 256, height: 256, fit: "cover" })
                .toFormat("webp", { quality: 75 })
                .toBuffer();

            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: optimizedBuffer,
                    ContentType: "image/webp",
                    CacheControl: "public, max-age=31536000, immutable",
                }),
            );

            const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
            return { url, key };
        } catch (error: any) {
            this.logger.error(`Failed to upload avatar: ${error?.message}`, error?.stack);
            throw new HttpException(
                "An error occurred while uploading the avatar.",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

}
