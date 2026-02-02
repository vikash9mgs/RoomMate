/**
 * S3 Upload Utility for RoomMate
 * Handles presigned URL requests and direct S3 uploads
 */

export const uploadToS3 = async (file, apiBaseUrl = '') => {
  if (!file) throw new Error('No file provided');
  
  // Request presigned URL from server
  const presignResp = await fetch(`${apiBaseUrl}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, fileType: file.type }),
  });

  if (!presignResp.ok) {
    const error = await presignResp.json();
    throw new Error(error.message || 'Failed to get upload URL');
  }

  const { uploadUrl, publicUrl } = await presignResp.json();

  // Upload directly to S3 using presigned URL
  const uploadResp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadResp.ok) {
    throw new Error('Failed to upload file to S3');
  }

  return publicUrl;
};

export const uploadMultipleToS3 = async (files, apiBaseUrl = '') => {
  return Promise.all(files.map(file => uploadToS3(file, apiBaseUrl)));
};
