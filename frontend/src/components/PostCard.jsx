import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const dateline = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link
      to={`/post/${post.slug}`}
      className='group flex flex-col w-full sm:w-[380px] mx-auto'
    >
      <div className='overflow-hidden'>
        <img
          src={post.image}
          alt='post cover'
          className='h-[220px] w-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500'
        />
      </div>
      <div className='pt-4 flex flex-col gap-2'>
        <span className='eyebrow'>{post.category}</span>
        <p className='font-serif text-xl font-semibold leading-snug line-clamp-2 group-hover:text-masthead dark:group-hover:text-mastheaddark transition-colors'>
          {post.title}
        </p>
        <div className='byline flex items-center gap-2 mt-1'>
          <span>By Aman Kumar</span>
          {dateline && (
            <>
              <span aria-hidden='true'>·</span>
              <span>{dateline}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
