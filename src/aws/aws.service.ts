import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import "dotenv/config";

@Injectable()
export class AwsService {
    private readonly s3: S3Client;
    private readonly logger = new Logger(AwsService.name);

    constructor() {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION;

        if (!accessKeyId || !secretAccessKey || !region) {
            this.logger.error('AWS configuration is missing!');
            throw new Error('AWS configuration is incomplete.');
        }

        this.s3 = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    };

    async uploadMoviePoster(file: Express.Multer.File): Promise<{ url: string }> {
        if (!file) {
            throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
        };

        if (file.mimetype === 'image/svg+xml') {
            this.logger.warn(`Blocked attempt to upload SVG file: ${file.originalname}`);
            throw new HttpException('SVG files are not allowed for security reasons.', HttpStatus.BAD_REQUEST);
        };

        const fileName = `${uuid()}.webp`; // Store as optimized webp
        const bucket = process.env.AWS_S3_BUCKET_NAME;
        const region = process.env.AWS_REGION;

        if (!bucket) {
            this.logger.error('AWS_S3_BUCKET_NAME is not configured.');
            throw new HttpException('File upload configuration is incomplete.', HttpStatus.INTERNAL_SERVER_ERROR);
        };

        this.logger.log(`Processing product image: ${file.originalname} -> ${fileName}`);

        try {
            const optimizedBuffer = await sharp(file.buffer)
                .resize({ width: 600, height: 800, fit: 'cover' })
                .toFormat('webp', { quality: 60 })
                .toBuffer();

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: fileName,
                Body: optimizedBuffer,
                ContentType: 'image/webp',
            });

            this.logger.log(`Uploading product image ${fileName} to bucket ${bucket}...`);
            await this.s3.send(command);
            this.logger.log(`Product image uploaded successfully: ${fileName}`);

            const url = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
            return { url };
        } catch (error) {
            this.logger.error(`Failed to upload product image: ${error.message}`, error.stack);
            throw new HttpException('An error occurred while uploading the product image.', HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };
};