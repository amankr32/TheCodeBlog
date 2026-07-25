import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left'>
      <div className='flex-1'>
        <p className='eyebrow'>Stay in the loop</p>
        <h2 className='font-serif text-xl sm:text-2xl font-semibold mt-1'>
          New dispatches, straight to your inbox.
        </h2>
        <p className='byline normal-case tracking-normal text-sm mt-2 max-w-md'>
          One email whenever a new article on web development, systems, or
          software craft goes live. No spam, unsubscribe any time.
        </p>
      </div>
      <a href='/sign-up' className='w-full sm:w-auto'>
        <Button className='!bg-masthead hover:!bg-ink dark:!bg-mastheaddark dark:hover:!bg-inkdark dark:!text-ink !border-none w-full sm:w-auto'>
          Subscribe
        </Button>
      </a>
    </div>
  );
}
