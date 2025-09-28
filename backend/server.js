const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later.'
  }
});

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cloud-file-uploader-kiran.vercel.app',
    'https://cloud-file-uploader-kiran-*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// File validation settings
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'application/pdf',
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

// Helper function to generate safe filename
const generateSafeFilename = (originalName) => {
  const timestamp = Date.now();
  const randomId = uuidv4().split('-')[0];
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  
  return `${timestamp}-${randomId}-${baseName}.${extension}`;
};

// Helper function to get file metadata
const getFileMetadata = (file) => {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'anonymous' // In a real app, you'd get this from authentication
  };
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Upload endpoint
app.post('/api/upload', uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const file = req.file;
    const safeFilename = generateSafeFilename(file.originalname);
    const metadata = getFileMetadata(file);

    // S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${safeFilename}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Removed - bucket doesn't allow ACLs
      Metadata: {
        originalName: metadata.originalName,
        uploadedAt: metadata.uploadedAt,
        uploadedBy: metadata.uploadedBy
      },
      // Optional: Add cache control headers
      CacheControl: 'max-age=31536000', // 1 year
      // Optional: Add content disposition for downloads
      ContentDisposition: `inline; filename="${metadata.originalName}"`
    };

    // Upload to S3
    const result = await s3.upload(uploadParams).promise();

    // Log successful upload
    console.log(`File uploaded successfully: ${result.Key}`);
    console.log(`File size: ${file.size} bytes`);
    console.log(`File type: ${file.mimetype}`);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: result.Location,
      fileKey: result.Key,
      metadata: {
        ...metadata,
        s3Key: result.Key,
        s3Bucket: process.env.AWS_S3_BUCKET_NAME
      }
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Handle different types of errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }

    if (error.message === 'File type not supported') {
      return res.status(415).json({
        success: false,
        message: 'File type not supported. Please upload images, text files, PDFs, or Word documents.'
      });
    }

    if (error.code === 'NoSuchBucket') {
      return res.status(500).json({
        success: false,
        message: 'Storage configuration error. Please contact support.'
      });
    }

    if (error.code === 'InvalidAccessKeyId' || error.code === 'SignatureDoesNotMatch') {
      return res.status(500).json({
        success: false,
        message: 'Storage authentication error. Please contact support.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Upload failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get file metadata endpoint (optional)
app.get('/api/file/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    };

    const headResult = await s3.headObject(params).promise();
    
    res.json({
      success: true,
      metadata: {
        size: headResult.ContentLength,
        type: headResult.ContentType,
        lastModified: headResult.LastModified,
        originalName: headResult.Metadata?.originalname || 'Unknown',
        uploadedAt: headResult.Metadata?.uploadedat || headResult.LastModified
      }
    });

  } catch (error) {
    if (error.code === 'NotFound') {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file metadata'
    });
  }
});

// List recent uploads endpoint (optional)
app.get('/api/files', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'uploads/',
      MaxKeys: 20 // Limit to recent 20 files
    };

    const result = await s3.listObjectsV2(params).promise();
    
    const files = result.Contents.map(object => ({
      key: object.Key,
      size: object.Size,
      lastModified: object.LastModified,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${object.Key}`
    }));

    res.json({
      success: true,
      files: files.reverse() // Show most recent first
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Only one file allowed'
      });
    }
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`S3 Bucket: ${process.env.AWS_S3_BUCKET_NAME || 'Not configured'}`);
});