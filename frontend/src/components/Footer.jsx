import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <footer className='bg-paper dark:bg-paperdark border-t border-ink dark:border-inkdark mt-10'>
      <div className='w-full max-w-6xl mx-auto px-4 pt-10 pb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-8'>
          <div className='sm:col-span-2'>
            <Link to='/' className='font-serif text-2xl font-semibold text-ink dark:text-inkdark'>
              The Codeblog
            </Link>
            <p className='byline mt-3 normal-case tracking-normal text-sm max-w-sm'>
              Notes on web development, distributed systems, and the everyday
              craft of shipping software — written by Aman Kumar.
            </p>
          </div>
          <div>
            <p className='eyebrow mb-3'>Read</p>
            <div className='flex flex-col gap-2 text-sm'>
              <Link to='/' className='hover:text-masthead dark:hover:text-mastheaddark'>Home</Link>
              <Link to='/about' className='hover:text-masthead dark:hover:text-mastheaddark'>About</Link>
              <Link to='/projects' className='hover:text-masthead dark:hover:text-mastheaddark'>Projects</Link>
            </div>
          </div>
          <div>
            <p className='eyebrow mb-3'>Elsewhere</p>
            <div className='flex gap-4 text-xl text-ink dark:text-inkdark'>
              <a href='https://github.com/amankr32' target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
                <BsGithub />
              </a>
              <a href='https://linkedin.com/in/amankr32' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
                <BsLinkedin />
              </a>
              <a href='#' aria-label='Twitter'>
                <BsTwitter />
              </a>
            </div>
          </div>
        </div>
        <div className='rule mt-8 pt-4 flex flex-col sm:flex-row justify-between gap-2 byline normal-case tracking-normal'>
          <span>© {new Date().getFullYear()} The Codeblog. All rights reserved.</span>
          <div className='flex gap-4'>
            <a href='#' className='hover:text-masthead dark:hover:text-mastheaddark'>Privacy Policy</a>
            <a href='#' className='hover:text-masthead dark:hover:text-mastheaddark'>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
