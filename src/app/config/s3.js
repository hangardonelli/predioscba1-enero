import AWS from 'aws-sdk';

/**
 * Digital Ocean Spaces Connection
 */

const spacesEndpoint = new AWS.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.REACT_APP_S3_KEY_ID,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
    });
export default s3;