import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/post/getposts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?limit=3`
        );
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <main className='flex flex-col max-w-6xl mx-auto min-h-screen px-4'>
      <div className='max-w-2xl mx-auto w-full text-center mt-10'>
        <Link
          to={`/search?category=${post && post.category}`}
          className='eyebrow'
        >
          {post && post.category}
        </Link>
        <h1 className='font-serif font-semibold mt-3 lg:text-5xl text-3xl leading-tight'>
          {post && post.title}
        </h1>
      </div>

      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-8 max-h-[520px] w-full object-cover'
      />

      <div className='byline flex justify-between py-3 rule mx-auto w-full max-w-2xl normal-case tracking-normal'>
        <span>
          By Aman Kumar
          {post &&
            ' · ' + new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
        </span>
        <span>
          {post && (post.content.length / 1000).toFixed(0)} min read
        </span>
      </div>
      <div
        className='py-4 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-2xl mx-auto w-full py-8 border-t border-rule dark:border-ruledark mt-4'>
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className='flex flex-col items-center mb-14 mt-10 w-full'>
        <div className='flex items-center w-full mb-8'>
          <h2 className='eyebrow text-sm whitespace-nowrap'>Recent Articles</h2>
          <div className='rule flex-1 ml-4' />
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 w-full'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
