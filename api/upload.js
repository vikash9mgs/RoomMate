import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.S3_KEY || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET || process.env.AWS_SECRET_ACCESS_KEY;
const acl = process.env.S3_ACL || "public-read";

// Validation config
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (!bucket || !accessKeyId || !secretAccessKey) {
  console.warn("S3 not fully configured. Set S3_BUCKET, S3_KEY, and S3_SECRET environment variables.");
}

const s3client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { filename, fileType, fileSize } = req.body || {};

    if (!filename || !fileType) {
      return res.status(400).json({ message: "Missing filename or fileType in request body" });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      return res.status(400).json({ 
        message: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
      });
    }

    // Validate file size if provided
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
      });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `uploads/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
      ACL: acl,
    });

    const uploadUrl = await getSignedUrl(s3client, command, { expiresIn: 900 });

    // Public URL (works if bucket objects are public or using CloudFront)
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return res.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Upload presign error:", error);
    return res.status(500).json({ message: "Failed to create upload URL" });
  }
}
