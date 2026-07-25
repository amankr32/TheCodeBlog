import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className='bg-paper dark:bg-paperdark border-b border-rule dark:border-ruledark'>
      {/* Masthead */}
      <div className='max-w-6xl mx-auto px-4 pt-6 pb-3 flex items-end justify-between gap-4'>
        <Link to='/' className='group'>
          <h1 className='font-serif font-semibold tracking-tight text-3xl sm:text-5xl text-ink dark:text-inkdark leading-none'>
            The Codeblog
          </h1>
          <p className='eyebrow mt-2 hidden sm:block'>
            Dispatches on code, systems &amp; the craft of building
          </p>
        </Link>
        <span className='byline hidden md:block pb-1 whitespace-nowrap'>
          {today}
        </span>
      </div>

      {/* Nav rule */}
      <Navbar
        fluid
        className='!bg-transparent !p-0 border-t border-ink dark:border-inkdark'
      >
        <div className='max-w-6xl mx-auto w-full px-4 py-2 flex items-center justify-between'>
          <Navbar.Collapse className='!mt-0'>
            <Navbar.Link
              active={path === '/'}
              as={'div'}
              className='!bg-transparent'
            >
              <Link
                to='/'
                className='eyebrow !text-ink dark:!text-inkdark hover:!text-masthead dark:hover:!text-mastheaddark tracking-widest'
              >
                Home
              </Link>
            </Navbar.Link>
            <Navbar.Link
              active={path === '/about'}
              as={'div'}
              className='!bg-transparent'
            >
              <Link
                to='/about'
                className='eyebrow !text-ink dark:!text-inkdark hover:!text-masthead dark:hover:!text-mastheaddark tracking-widest'
              >
                About
              </Link>
            </Navbar.Link>
            <Navbar.Link
              active={path === '/projects'}
              as={'div'}
              className='!bg-transparent'
            >
              <Link
                to='/projects'
                className='eyebrow !text-ink dark:!text-inkdark hover:!text-masthead dark:hover:!text-mastheaddark tracking-widest'
              >
                Projects
              </Link>
            </Navbar.Link>
          </Navbar.Collapse>

          <form onSubmit={handleSubmit} className='hidden lg:block'>
            <TextInput
              type='text'
              placeholder='Search articles…'
              rightIcon={AiOutlineSearch}
              className='w-56'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className='flex gap-2 items-center'>
            <Button
              className='w-10 h-9 lg:hidden'
              color='gray'
              pill
              onClick={handleSubmit}
            >
              <AiOutlineSearch />
            </Button>
            <Button
              className='w-10 h-9 hidden sm:inline'
              color='gray'
              pill
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt='user'
                    img={currentUser.profilePicture}
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>
                    @{currentUser.username}
                  </span>
                  <span className='block text-sm font-medium truncate'>
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to='/sign-in'>
                <Button
                  className='!bg-masthead hover:!bg-ink dark:!bg-mastheaddark dark:hover:!bg-inkdark dark:!text-ink !border-none'
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Navbar.Toggle />
          </div>
        </div>
      </Navbar>
    </div>
  );
}
