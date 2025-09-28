# Cloud File Uploader

A full-stack web application that allows users to upload files to AWS S3 with a beautiful React frontend and Node.js backend.

## 🚀 Features

- **Drag & Drop File Upload**: Intuitive file upload interface with drag and drop support
- **File Validation**: 
  - File size limit (5MB)
  - File type restrictions (Images, PDFs, Text files, Word documents)
  - Real-time validation feedback
- **Upload Progress**: Visual progress bar during file uploads
- **AWS S3 Integration**: Secure file storage with public access
- **File Management**: View uploaded files and copy URLs
- **Security Features**:
  - Rate limiting (10 uploads per 15 minutes)
  - CORS protection
  - File type validation
  - Secure filename generation
- **Responsive Design**: Works on desktop and mobile devices
- **Deployment Ready**: Configured for Vercel deployment

## 📁 Project Structure

```
cloud-file-uploader/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploader.js
│   │   │   └── FileUploader.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/                  # Node.js Express API
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example         # Environment variables template
├── vercel.json              # Vercel deployment config
├── package.json             # Root package.json for scripts
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with gradients and animations

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Multer**: File upload handling
- **AWS SDK**: S3 integration
- **Helmet**: Security middleware
- **Express Rate Limit**: Rate limiting protection

### Cloud Services
- **AWS S3**: File storage
- **Vercel**: Hosting platform

## 🚦 Getting Started

### Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** or **yarn**
3. **AWS Account** with S3 access
4. **Git** (for deployment)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd cloud-file-uploader

# Install all dependencies
npm run install-all

# Or install manually
cd backend && npm install
cd ../frontend && npm install
```

### 2. AWS S3 Setup

#### Create S3 Bucket
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Create a new bucket with a unique name
3. **Important**: Configure bucket for public access
4. Go to bucket **Permissions** → **Block Public Access**
5. Uncheck "Block all public access" (needed for file access)
6. Add the following **Bucket Policy**:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

#### Create IAM User
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user with programmatic access
3. Attach the **AmazonS3FullAccess** policy
4. Save the **Access Key ID** and **Secret Access Key**

### 3. Environment Configuration

Create `.env` file in the `backend` directory:

```bash
# Copy the example file
cd backend
cp .env.example .env
```

Edit `.env` with your AWS credentials:

```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# AWS Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-actual-bucket-name-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm start
```

Visit `http://localhost:3000` to use the application!

## 🚀 Deployment

### Deploy to Vercel

1. **Prepare for deployment:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Set up environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Add the following environment variables:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION`
     - `AWS_S3_BUCKET_NAME`
     - `NODE_ENV=production`

3. **Deploy:**
   ```bash
   # Deploy to production
   vercel --prod
   ```

### Alternative: Separate Deployments

**Backend (API) on Vercel:**
```bash
cd backend
vercel --prod
```

**Frontend on Vercel/Netlify:**
```bash
cd frontend
npm run build
# Upload build folder to your hosting service
```

## 📋 API Endpoints

### POST `/api/upload`
Upload a file to S3
- **Body**: FormData with file
- **Response**: File URL and metadata

### GET `/api/health`
Health check endpoint
- **Response**: Server status

### GET `/api/file/:key`
Get file metadata
- **Response**: File information

### GET `/api/files`
List recent uploads (optional)
- **Response**: Array of uploaded files

## 🔧 Configuration Options

### File Validation (Backend)
```javascript
// In server.js
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'application/pdf',
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
```

### Rate Limiting
```javascript
// 10 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});
```

## 🔒 Security Features

- **Rate Limiting**: Prevents spam uploads
- **File Type Validation**: Only allows safe file types
- **File Size Limits**: Prevents large file uploads
- **Secure Filenames**: Generates safe, unique filenames
- **CORS Protection**: Restricts cross-origin requests
- **Helmet**: Adds security headers

## 🐛 Troubleshooting

### Common Issues

1. **"Bucket not found" error:**
   - Check bucket name in `.env`
   - Ensure bucket exists in the correct region

2. **"Access Denied" error:**
   - Verify AWS credentials
   - Check IAM user permissions
   - Ensure bucket policy allows public read

3. **CORS errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Verify frontend is running on correct port

4. **File upload fails:**
   - Check file size (max 5MB)
   - Verify file type is supported
   - Check network connection

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages.

## 📈 Future Enhancements

- [ ] User authentication
- [ ] File encryption
- [ ] Multiple cloud provider support (Azure, GCP)
- [ ] Image optimization
- [ ] File versioning
- [ ] Admin dashboard
- [ ] File sharing with expiration
- [ ] Database integration for metadata

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help:
1. Check the troubleshooting section
2. Review AWS S3 documentation
3. Open an issue on GitHub
4. Contact support

---

**Happy uploading! 🎉**