import { Link, NavLink } from 'remix';
import { DarkModeToggle } from './darkMode.js';

export default function Header({
  loginUrl,
  subreddit,
}: {
  loginUrl?: string;
  subreddit?: string;
}) {
  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.reload();
  };

  return (
    <header className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 shadow-md shadow-gray-100 dark:shadow-gray-800 body-font w-full fixed z-10">
      <div className="container mx-auto flex flex-wrap px-5 py-3 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 dark:text-gray-300"
        >
          <span className="ml-3 text-xl">Reddmix</span>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          <NavLink
            to="/"
            title="Home"
            className={({ isActive }) =>
              `mr-5 hover:text-gray-900 dark:hover:text-gray-400 ${
                isActive ? 'font-bold' : ''
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/all"
            title="All"
            className={({ isActive }) =>
              `mr-5 hover:text-gray-900 dark:hover:text-gray-400 ${
                isActive ? 'font-bold' : ''
              }`
            }
          >
            All
          </NavLink>
          {subreddit && (
            <NavLink
              to={`/r/${subreddit}`}
              title={subreddit}
              className={({ isActive }) =>
                `mr-5 hover:text-gray-900 dark:hover:text-gray-400 ${
                  isActive ? 'font-bold' : ''
                }`
              }
            >
              r/{subreddit}
            </NavLink>
          )}
        </nav>
        {loginUrl && (
          <a
            href={loginUrl}
            className="inline-flex items-center bg-gray-200 dark:bg-gray-900 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            Login
          </a>
        )}
        {!loginUrl && (
          <button
            className="inline-flex items-center bg-gray-200 dark:bg-gray-900 border-0 py-1 px-3 rounded text-base mt-4 md:mt-0"
            onClick={logout}
          >
            Logout
          </button>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
