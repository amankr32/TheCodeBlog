import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen'>
      <div className='max-w-2xl mx-auto px-4 py-16'>
        <span className='eyebrow'>About</span>
        <h1 className='font-serif text-3xl sm:text-4xl font-semibold mt-2 mb-8'>
          About The Codeblog
        </h1>
        <div className='font-body text-lg leading-relaxed flex flex-col gap-6 text-ink/85 dark:text-inkdark/85'>
          <p>
            The Codeblog is a personal project by Aman Kumar, built to share
            notes on web development, distributed systems, and everything
            learned along the way. It started as a way to think out loud
            about code, and has grown into a running archive of tutorials
            and write-ups.
          </p>

          <p>
            Expect articles on frontend and backend engineering, software
            design, and the small lessons that come from shipping real
            projects. New posts go up regularly, so check back often.
          </p>

          <p>
            Comments are open on every post — leave a thought, ask a
            question, or reply to another reader. Good ideas tend to get
            better when they're discussed in the open.
          </p>
        </div>
        <div className='rule mt-12 pt-8'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}