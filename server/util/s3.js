var s3 = require('s3-client');

var client = s3.createClient({
  maxAsyncS3: 20,     // 20 is the default
  s3RetryCount: 3,    // 3 is the default
  s3RetryDelay: 1000, // 1000 is the default
  multipartUploadThreshold: 20971520, // 20971520 is the default (20 MB)
  multipartUploadSize: 15728640, // 15728640 is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    // endpoint: 's3.yourdomain.com',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

exports.uploadFile = async (fileName, s3_key) => {
    console.log("s3 upload START fileName="+fileName+' s3_key='+s3_key);

    var params = {
        localFile: fileName,
        s3Params: {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3_key,
          // other options supported by putObject, except Body and ContentLength.
          // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        },
      };
      var uploader = client.uploadFile(params);
      uploader.on('error', function(err) {
        console.error('s3 upload DONE fileName='+fileName+' s3_key='+s3_key+':', err.stack);
      });
      uploader.on('progress', function() {
        console.log('s3 upload PROGRESS fileName='+fileName+' s3_key='+s3_key+':', uploader.progressMd5Amount,
                  uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        console.log("s3 upload DONE fileName="+fileName+' s3_key='+s3_key);
      });

};