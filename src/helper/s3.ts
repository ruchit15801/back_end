import multer from 'multer'
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3'
import config from 'config';
import { S3Client } from '@aws-sdk/client-s3'
const aws: any = config.get("aws");


const S3 = new S3Client({
    region: aws.AWS_Bucket_Region,
    credentials: {
        accessKeyId: aws.AWS_Access_Key,
        secretAccessKey: aws.AWS_Secret_Key
    },
})
// console.log('S3----------------------------------------------------------------- :>> ', S3);
const bucket_name = aws.AWS_Bucket_Name
const bucket_URL = aws.AWS_bucket_URL

export const uploadS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req: any, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req: any, file, cb) => {
            const file_type = file.originalname.split('.');
            req.body.size = parseInt(req.headers['content-length']) / 1048576
            req.body.location = `/${req.header('user')?._id}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
            cb(null, `image/${req.header('user')?._id}/${Date.now().toString()}.${file_type[file_type.length - 1]}`)
        }
    })
})