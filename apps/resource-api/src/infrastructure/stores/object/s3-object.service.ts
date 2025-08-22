import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { store, type StoreConfig } from 'common/configs/store';
import { hoursToSeconds } from 'common/functions/hoursToMinutes';

@Injectable()
export class S3ObjectService implements OnModuleInit {
  private s3Client: S3Client;

  constructor(@Inject(store.KEY) private readonly store: StoreConfig) {}

  async onModuleInit(): Promise<void> {
    this.s3Client = new S3Client({
      endpoint: this.store.uri,
      region: this.store.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.store.accessKeyId,
        secretAccessKey: this.store.secretAccessKey,
      },
    });

    let hasBucket = true;

    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: this.store.bucketName,
        }),
      );
    } catch {
      hasBucket = false;
    }

    if (hasBucket) return;

    await this.s3Client.send(
      new CreateBucketCommand({
        Bucket: this.store.bucketName,
      }),
    );
  }

  async getPreSignedUrl(ids: string[], name: string): Promise<string> {
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.store.bucketName,
        Key: `${ids.join('/')}/${name}`,
      }),
      { expiresIn: hoursToSeconds(this.store.presignedUriTTL) },
    );
  }

  async save(ids: string[], name: string, data: Buffer): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.store.bucketName,
        Key: `${ids.join('/')}/${name}`,
        Body: data,
      }),
    );
  }

  async delete(ids: string[], name: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.store.bucketName,
        Key: `${ids.join('/')}/${name}`,
      }),
    );
  }
}
