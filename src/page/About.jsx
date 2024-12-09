import { useEffect } from 'react';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          About Our Blog Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-center">
          This blog website is a platform where users can share their thoughts, ideas, and stories by uploading their own blogs. It fosters community engagement by allowing users to interact with each other&apos;s posts through comments and likes. The platform includes user authentication to ensure a personalized experience.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Key Features
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>User Blog Uploads: Each user can create and publish their own blogs.</span>
            </li>
            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Interactive Features: Users can comment on and like blogs, encouraging discussion and feedback.</span>
            </li>
            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>User Profiles: Each user has a profile to showcase their activity and published content</span>
            </li>
            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure Login/Signup: Ensures secure and personalized access for all users.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;