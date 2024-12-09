import { Container, Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/useTheme";

function Header() {
  const authStatus = useSelector((state) => state.auth?.status);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: !authStatus && true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: "My Profile",
      slug: "/user-profile",
      active: authStatus,
    },
  ];

  return (
    <header className="w-full  shadow-xl bg-white dark:bg-gray-800 transition-colors duration-200 fixed top-0 left-0 right-0 z-50">
      <Container>
        <nav className="flex justify-between items-center">
          <div className="w-1/4">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-2xl p-2 dark:text-white"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {/* Desktop Menu */}
            <ul className=" hidden lg:flex ml-auto">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full dark:text-white"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <Link to="/">
                  <LogoutBtn />
                </Link>
              )}
            </ul>
            {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FaSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FaMoon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          </div>

          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg lg:hidden">
              <ul className="flex flex-col py-4">
                {navItems.map((item) =>
                  item.active ? (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-6 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-white"
                      >
                        {item.name}
                      </button>
                    </li>
                  ) : null
                )}
                {authStatus && (
                  <li>
                    <Link to="/" onClick={() => setIsOpen(false)}>
                      <LogoutBtn />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
}

export default Header;
