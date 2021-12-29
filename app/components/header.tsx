import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, NavLink } from 'remix';
import { DarkModeToggle } from './darkMode.js';

export default function Header({
  loginUrl,
  subreddit,
}: {
  loginUrl?: string;
  subreddit?: string;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.reload();
  };

  return (
    <header className="w-full flex flex-wrap items-center justify-between px-2 py-3 mb-3 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 fixed z-10">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between sm:w-auto sm:static sm:block sm:justify-start">
          <Link
            to="/"
            className="text-base font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-gray-900 dark:text-gray-300"
          >
            Reddmix
          </Link>
          <button
            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block sm:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
        </div>

        <div
          className={`sm:flex flex-col sm:flex-row flex-grow sm:items-center ${
            collapsed ? 'hidden' : 'flex'
          }`}
        >
          <ul className="flex flex-col sm:flex-row list-none sm:mr-auto">
            <li>
              <NavLink
                to="/"
                title="Home"
                className={({ isActive }) =>
                  `px-3 py-2 flex items-center text-sm font-bold leading-snug hover:text-gray-900 dark:hover:text-gray-400 ${
                    isActive ? 'font-bold' : ''
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all"
                title="All"
                className={({ isActive }) =>
                  `px-3 py-2 flex items-center text-sm font-bold leading-snug hover:text-gray-900 dark:hover:text-gray-400 ${
                    isActive ? 'font-bold' : ''
                  }`
                }
              >
                All
              </NavLink>
            </li>
            <li>
              {subreddit && (
                <NavLink
                  to={`/r/${subreddit}`}
                  title={subreddit}
                  className={({ isActive }) =>
                    `px-3 py-2 flex items-center text-sm font-bold leading-snug hover:text-gray-900 dark:hover:text-gray-400 ${
                      isActive ? 'font-bold' : ''
                    }`
                  }
                >
                  r/{subreddit}
                </NavLink>
              )}
            </li>
          </ul>
          <ul className="flex flex-row items-center justify-between sm:justify-start list-none sm:ml-auto">
            {loginUrl && (
              <li>
                <a
                  href={loginUrl}
                  className="inline-flex items-center bg-gray-200 dark:bg-gray-900 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-2 sm:mt-0"
                >
                  Login
                </a>
              </li>
            )}

            {!loginUrl && (
              <li>
                <button
                  className="inline-flex items-center bg-gray-200 dark:bg-gray-900 border-0 py-1 px-3 rounded text-base"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
            <li className="flex items-center justify-start sm:justify-center">
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
