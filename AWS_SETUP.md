# AWS S3 Setup Guide

This guide will walk you through setting up AWS S3 for the cloud file uploader.

## Step 1: Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/)
2. Create a new account or sign in
3. Navigate to the S3 service

## Step 2: Create S3 Bucket

1. **Create Bucket:**
   - Click "Create bucket"
   - Choose a unique bucket name (file-uploader-demo-kiran)
   - Select your region (Europe (Stockholm) eu-north-1)

2. **Configure Public Access:**
   - **IMPORTANT:** Uncheck "Block all public access"
   - Acknowledge the warning (needed for public file access)

3. **Set Bucket Policy:**
   - Go to bucket → Permissions → Bucket policy
   - Add this policy for your bucket `file-uploader-demo-kiran`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::file-uploader-demo-kiran/*"
        }
    ]
}
```

## Step 3: Create IAM User

1. **Go to IAM Service:**
   - Navigate to IAM in AWS Console
   - Click "Users" → "Create user"

2. **User Configuration:**
   - Username: `file-uploader-user`
   - Access type: Programmatic access only

3. **Attach Permissions:**
   - Attach existing policies directly
   - Search and select: `AmazonS3FullAccess`

4. **Save Credentials:**
   - Download the CSV file with credentials
   - Save `Access key ID` and `Secret access key`

## Step 4: Fix Access Denied Error

**If you're getting "Access Denied" error, follow these steps:**

### 4.1: Unblock Public Access
1. Go to your S3 bucket `file-uploader-demo-kiran`
2. Click **Permissions** tab
3. Under **Block public access (bucket settings)**, click **Edit**
4. **UNCHECK all 4 options:**
   - ✅ Block all public access (uncheck this)
   - ✅ Block public access to buckets and objects granted through new access control lists (ACLs) (uncheck)
   - ✅ Block public access to buckets and objects granted through any access control lists (ACLs) (uncheck)
   - ✅ Block public access to buckets and objects granted through new public bucket or access point policies (uncheck)
   - ✅ Block public access to buckets and objects granted through any public bucket or access point policies (uncheck)
5. Click **Save changes**
6. Type `confirm` when prompted

### 4.2: Apply Bucket Policy
1. Still in **Permissions** tab, scroll to **Bucket policy**
2. Click **Edit**
3. Paste this exact policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::file-uploader-demo-kiran/*"
        }
    ]
}
```
4. Click **Save changes**

### 4.3: Test Configuration
1. Upload a test file (like `test.txt`) to your bucket
2. Try accessing it via: `https://file-uploader-demo-kiran.s3.eu-north-1.amazonaws.com/test.txt`
3. You should now see the file content instead of "Access Denied"

## Step 5: Environment Variables

Add to your `.env` file:
```env
AWS_ACCESS_KEY_ID=your_access_key_from_csv
AWS_SECRET_ACCESS_KEY=your_secret_key_from_csv  
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=file-uploader-demo-kiran
```

## Security Best Practices

1. **IAM User Permissions:**
   - Only grant S3 access, not full AWS access
   - Consider creating a policy specific to your bucket

2. **Bucket Security:**
   - Only allow public read access, not write
   - Monitor access logs
   - Set up CloudWatch alerts for unusual activity

3. **Credentials Security:**
   - Never commit `.env` files to version control
   - Rotate access keys regularly
   - Use environment variables in production

## Custom IAM Policy (Recommended)

Instead of `AmazonS3FullAccess`, create a custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::file-uploader-demo-kiran",
                "arn:aws:s3:::file-uploader-demo-kiran/*"
            ]
        }
    ]
}
```

## Troubleshooting

**Access Denied:**
- Check IAM user permissions
- Verify bucket policy
- Ensure credentials are correct

**Bucket Not Found:**
- Check bucket name spelling
- Verify region matches

**Public Access Issues:**
- Ensure public access is not blocked
- Check bucket policy syntax