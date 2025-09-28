# Cloud File Uploader by Kiran from RV University

**Progress Challenge 1** - A professional full-stack cloud file uploader with AWS S3 integration

🌐 **Live Demo**: [https://cloud-file-uploader-kiran.vercel.app/](https://cloud-file-uploader-kiran.vercel.app/)

A modern web application that allows users to securely upload files to AWS S3 cloud storage with a beautiful React frontend and serverless Node.js backend.

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop File Upload**: Intuitive interface with visual feedback
- **Real-time Upload Progress**: Live progress tracking with percentage
- **File Preview**: View uploaded files with direct S3 URLs
- **Copy File URLs**: One-click URL copying for easy sharing

### 🔒 Security & Validation
- **File Size Limit**: Maximum 5MB per file
- **File Type Restrictions**: 
  - Images: JPEG, PNG, GIF
  - Documents: PDF, TXT, DOC, DOCX
- **Rate Limiting**: 10 uploads per 15 minutes per IP
- **CORS Protection**: Configured for secure cross-origin requests
- **Secure File Names**: UUID-based naming to prevent conflicts

### 🎨 User Experience
- **Professional Design**: Clean, modern UI with teal/navy color scheme
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Error Handling**: Clear error messages and validation feedback
- **Loading States**: Visual feedback during upload process

### ☁️ Cloud Integration
- **AWS S3 Storage**: Reliable cloud storage with global CDN
- **Public File Access**: Direct URLs for easy file sharing
- **Serverless Backend**: Scalable Vercel serverless functions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│ Vercel Serverless│────│   AWS S3 Bucket │
│                 │    │   API Functions  │    │                 │
│ • File Selection│    │ • File Upload    │    │ • File Storage  │
│ • Drag & Drop   │    │ • Validation     │    │ • Public Access │
│ • Progress UI   │    │ • Rate Limiting  │    │ • CDN Delivery  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
cloud-file-uploader/
├── 📂 frontend/              # React Application
│   ├── 📂 public/           
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── FileUploader.js    # Main upload component
│   │   │   └── FileUploader.css   # Styling
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Base styles
│   └── package.json
├── 📂 backend/               # Express Server (for local dev)
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
├── 📂 api/                   # Vercel Serverless Functions
│   └── upload.js            # File upload API endpoint
├── 📄 vercel.json           # Vercel deployment config
├── 📄 package.json          # Root dependencies
├── 📄 AWS_SETUP.md         # AWS configuration guide
└── 📄 README.md            # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with flexbox and animations
- **HTML5**: Semantic markup and file APIs

### Backend & API
- **Node.js**: Runtime environment
- **Express.js**: Web framework (local development)
- **Vercel Functions**: Serverless API endpoints
- **Multer**: File upload middleware
- **AWS SDK v2**: S3 integration

### Cloud Services
- **AWS S3**: File storage and delivery
- **AWS IAM**: Access management
- **Vercel**: Hosting and serverless functions
- **GitHub**: Version control and CI/CD

## 🚀 Deployment

### Live Application
- **Production URL**: [https://cloud-file-uploader-kiran.vercel.app/](https://cloud-file-uploader-kiran.vercel.app/)
- **Repository**: [https://github.com/KIRANS420/cloud-file-uploader-kiran](https://github.com/KIRANS420/cloud-file-uploader-kiran)

### Deployment Configuration
- **Platform**: Vercel
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **API**: Serverless functions in `/api` directory

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- AWS Account with S3 access
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/KIRANS420/cloud-file-uploader-kiran.git
   cd cloud-file-uploader-kiran
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup AWS S3**
   - Create S3 bucket: `file-uploader-demo-kiran`
   - Configure IAM user with S3 access
   - Set bucket policy for public read access
   - See `AWS_SETUP.md` for detailed instructions

4. **Configure environment variables**
   
   Backend (`.env`):
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=eu-north-1
   AWS_BUCKET_NAME=file-uploader-demo-kiran
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

2. **Environment Variables (Vercel)**
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=eu-north-1
   AWS_BUCKET_NAME=file-uploader-demo-kiran
   ```

## � API Documentation

### Upload Endpoint
- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

**Request:**
```
POST /api/upload
Content-Type: multipart/form-data

file: [binary file data]
```

**Success Response (200):**
```json
{
  "message": "File uploaded successfully",
  "fileName": "uuid-generated-name.ext",
  "originalName": "original-file-name.ext",
  "size": 1024000,
  "url": "https://s3-bucket-url/uuid-generated-name.ext",
  "uploadedAt": "2025-09-28T10:30:00.000Z"
}
```

**Error Responses:**
```json
{
  "error": "File too large. Maximum size is 5MB."
}
```

## 🔧 Configuration

### Supported File Types
- **Images**: JPEG, PNG, GIF
- **Documents**: PDF, TXT, DOC, DOCX
- **Size Limit**: 5MB per file

### Rate Limiting
- **Limit**: 10 uploads per IP
- **Window**: 15 minutes
- **Response**: 429 Too Many Requests

### Security Features
- CORS protection
- File type validation
- Size limitations
- Rate limiting
- Secure file naming

## 🌟 About

This project was created by **Kiran from RV University** as part of **Progress Challenge 1**. It demonstrates:

- Full-stack web development skills
- Cloud service integration (AWS S3)
- Modern React development
- Serverless architecture
- Professional UI/UX design
- Security best practices
- Production deployment

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact Kiran from RV University.

---

**Built with ❤️ by Kiran | RV University | Progress Challenge 1**
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