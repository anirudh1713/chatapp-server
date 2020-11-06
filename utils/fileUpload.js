const utils = require('./utils');

//STORAGE
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
});

//BUCKET
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL_PROFILE);

//FILE UPLOAD
const fileUpload = (req) => new Promise((resolve, reject) => {
  //name the file
  const blob = bucket.file(`profile_images/${req.user._id}.png`);
  //create blob in bucket referencing the file
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  blobWriter.on('error', (err) => {
    console.log(err);
    reject("Something went wrong.");
  });
  blobWriter.on('finish', async () => {
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/profile_images%2F${encodeURI(blob.name.split('/')[1])}?alt=media`;
    resolve(url);
  });
  blobWriter.end(req.file.buffer);
});

module.exports = fileUpload;