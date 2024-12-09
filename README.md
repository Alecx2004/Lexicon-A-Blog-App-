# Blog App Project

## 📝 Project Overview
A full-featured blog application built with React, Appwrite, and Tailwind CSS. This project provides a modern, responsive platform for users to create, read, and interact with blog posts.

## 🚀 Features
- User Authentication
- Blog Post Creation and Management
- Interactive Commenting System
- Responsive Design
- Dark Mode Support
- Rich Text Editing

## 🛠 Tech Stack
- **Frontend**: React.js
- **Backend**: Appwrite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Rich Text Editor**: TinyMCE

## 📦 Dependencies
- React 18.3.1
- Appwrite 14.0.1
- Redux Toolkit 2.3.0
- React Router 6.28.0
- Tailwind CSS

## 🔧 Project Structure
```
blog_app_project/
│
├── src/
│   ├── appwrite/         # Appwrite configuration and services
│   ├── components/       # Reusable React components
│   ├── context/          # React context providers
│   ├── pages/            # Main page components
│   │   ├── Home.jsx      # Landing page
│   │   ├── About.jsx     # About page
│   │   ├── Contact.jsx   # Contact page
│   │   └── ...
│   ├── store/            # Redux store configuration
│   └── App.jsx           # Main application component
│
├── public/               # Public assets
├── .env                  # Environment variables
└── vite.config.js        # Vite configuration
```

## 🌟 Key Components
1. **Authentication**
   - Secure user registration and login
   - Profile management

2. **Blog Posts**
   - Create, edit, and delete posts
   - Rich text editing
   - Image upload support

3. **Interaction**
   - Like and comment on posts
   - User profile pages

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Appwrite account

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/blog-app-project.git
   cd blog-app-project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file
   - Add Appwrite configuration details

4. Run the development server
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables
Required in `.env`:
- `VITE_APPWRITE_URL`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_COLLECTION_ID`
- `VITE_APPWRITE_BUCKET_ID`

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License.

## 🎉 Acknowledgments
- [React](https://reactjs.org/)
- [Appwrite](https://appwrite.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Happy Blogging! 🚀**
