const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { User } = require("../models");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generatePresignedUrl = async (req, res) => {
  const { fileName, fileType } = req.body;
  const uniqueFileName = `profile-pictures/${uuidv4()}-${fileName}.jpg`; // Adds UUID prefix

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Expires: 60,
    ContentType: fileType || 'image/jpeg',
    ACL: 'public-read',
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", s3Params);
    res.status(200).json({ url, fileKey: uniqueFileName });
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
    res.status(500).json({ error: "Could not generate pre-signed URL" });
  }
};

const upload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileKey } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profilePicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    user.profile_pic = profilePicUrl;
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully", profilePicUrl });
  } catch (error) {
    console.error("Error updating profile picture", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generatePresignedUrl, upload };
