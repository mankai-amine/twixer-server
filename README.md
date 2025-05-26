# Twixer Backend API

## Overview
Backend service for the Twixer social networking application. This API provides authentication, user management, and social networking features including posts, comments, likes, and follows.

## Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Sequelize
- **Database**: MySQL
- **Authentication**: JWT
- **Storage**: AWS S3 for images

## API Features
- User registration and authentication
- Post creation, retrieval, editing, and deletion
- Comment management
- Like/Unlike functionality
- Follow/Unfollow system
- User profile management
- Admin moderation tools
- Image upload handling

## Installation & Setup

### Prerequisites
- Node.js
- MySQL database
- AWS account for S3 storage (optional)

### Setup Steps
1. Clone the repository:
   ```
   git clone https://github.com/mankai-amine/twixer-server.git
   cd twixer-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=twixer
   DB_HOST=localhost
   DB_PORT=3306
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_BUCKET_NAME=your_bucket_name
   AWS_REGION=your_region
   ```

4. Initialize database:
   ```
   npm run db:create
   npm run db:migrate
   ```

5. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## Database Schema
The application uses the following main models:
- User
- Post
- Comment
- Like
- Follow

## Frontend Repository
The frontend code for this project is available at: [twixer-client](https://github.com/mankai-amine/twixer-client)
