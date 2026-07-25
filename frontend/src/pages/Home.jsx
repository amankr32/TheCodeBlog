import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts`
      );
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Front-page intro */}
      <div className='max-w-6xl mx-auto px-4 pt-10 pb-8'>
        <span className='eyebrow'>Issue No. {new Date().getFullYear()}</span>
        <h2 className='font-serif text-3xl sm:text-5xl font-semibold leading-tight mt-2 max-w-3xl'>
          Field notes from the front end of software.
        </h2>
        <p className='dropcap font-body text-base sm:text-lg leading-relaxed max-w-2xl mt-4 text-ink/80 dark:text-inkdark/80'>
          Welcome to The Codeblog — a running log of tutorials, project
          write-ups, and lessons learned while building web apps, distributed
          systems, and everything in between. Dive in and explore.
        </p>
        <Link
          to='/search'
          className='inline-block mt-5 eyebrow border-b border-masthead dark:border-mastheaddark pb-1 hover:opacity-70'
        >
          Browse the archive →
        </Link>
      </div>

      <div className='rule-thick max-w-6xl mx-auto' />

      {/* Featured story */}
      {featured && (
        <div className='max-w-6xl mx-auto px-4 py-10'>
          <Link to={`/post/${featured.slug}`} className='group grid md:grid-cols-2 gap-6 items-center'>
            <div className='overflow-hidden'>
              <img
                src={featured.image}
                alt='featured post cover'
                className='w-full h-[320px] object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500'
              />
            </div>
            <div>
              <span className='eyebrow'>Featured · {featured.category}</span>
              <p className='font-serif text-2xl sm:text-4xl font-semibold leading-tight mt-2 group-hover:text-masthead dark:group-hover:text-mastheaddark transition-colors'>
                {featured.title}
              </p>
              <div className='byline mt-3'>
                By Aman Kumar
                {featured.createdAt && (
                  <>
                    {' '}
                    · {new Date(featured.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className='rule max-w-6xl mx-auto' />

      <div className='max-w-6xl mx-auto px-4 py-10'>
        <div className='p-5 border border-rule dark:border-ruledark'>
          <CallToAction />
        </div>
      </div>

      {rest && rest.length > 0 && (
        <div className='max-w-6xl mx-auto px-4 pb-14 flex flex-col gap-8'>
          <div className='flex items-center justify-between'>
            <h3 className='eyebrow text-sm'>Latest Stories</h3>
            <div className='rule flex-1 ml-4' />
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10'>
            {rest.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Link
            to={'/search'}
            className='eyebrow text-center mt-2 hover:text-masthead dark:hover:text-mastheaddark'
          >
            View all posts →
          </Link>
        </div>
      )}
    </div>
  );
}
