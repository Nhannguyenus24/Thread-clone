# Thread Clone

A social media application similar to Twitter/Threads built with Node.js and MongoDB.

## 📋 Key Features

### 🔐 Authentication & Account Management
- User registration with email verification
- Login/Logout functionality
- Forgot password and password reset
- Personal profile management (avatar, name, bio)

### 📝 Thread Management
- Create new threads with text and images
- View feed of threads from followed users
- Like and comment on threads
- Display post time and interaction counts

### 👥 Social Features
- Follow/Unfollow other users
- View user profiles and their threads
- Notification system for activities
- User search functionality

### ⚙️ Settings
- Edit personal information
- Account management

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Template Engine**: Handlebars
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT and Express Session
- **File Upload**: Multer, Cloudinary
- **Email**: Nodemailer
- **Styling**: Custom CSS, TailwindCSS

## 📦 Installation & Setup

### System Requirements
- Node.js (version 14 or higher)
- MongoDB
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/Thread-clone.git
cd Thread-clone/project
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the `project` directory with the following variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/thread-clone

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Email Configuration (for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=3000
HOST=localhost
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Run the application**
```bash
# Development mode with nodemon
npm start

# Or run directly
node app.js
```

6. **Access the application**
Open your browser and navigate to: `http://localhost:3000`

## 📱 How to Use

1. **Register Account**: Create a new account and verify via email
2. **Login**: Use username/email and password
3. **Create Thread**: Write content and upload images (optional)
4. **Explore**: View feed, search and follow other users
5. **Interact**: Like, comment and receive notifications

## 🗂️ Project Structure

```
project/
├── app.js                 # Entry point
├── controllers/           # Business logic handlers
├── models/               # Mongoose schemas
├── routes/               # Route definitions
├── views/                # Handlebars templates
├── public/               # Static files (CSS, images)
├── service/              # Database connection
└── utils/                # Utility functions
```

## 👥 Contributors

This project was developed by HCMUS - 22KTPM4 students:
- 22127240
- 22127306  
- 22127442

## 📄 License

This project is distributed under the ISC License. See the `LICENSE` file for more details.
