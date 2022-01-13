import * as AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_S3_REGION,
});

const Bucket = "pharmstagram-upload";
const bucketInstance = new AWS.S3();

export const uploadToS3 = async (
  file: any,
  username: string,
  foldername: string
) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objName = `${username}/${foldername}/${Date.now()}-${filename}`;
  const { Location } = await bucketInstance
    .upload({
      Bucket,
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const delPhotoS3 = async (fileUrl: string, username: string) => {
  const filePath = fileUrl.split("/photos/")[1];
  const params = {
    Bucket: `${Bucket}/${username}/photos`,
    Key: decodeURI(filePath),
  };
  await bucketInstance
    .deleteObject(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    })
    .promise();
};

export const delAvatarS3 = async (fileUrl: string, username: string) => {
  const filePath = fileUrl.split("/avatars/")[1];
  const params = {
    Bucket: `${Bucket}/${username}/avatars`,
    Key: decodeURI(filePath),
  };
  await bucketInstance
    .deleteObject(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    })
    .promise();
};
