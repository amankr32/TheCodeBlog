import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='bg-paper text-ink dark:text-inkdark dark:bg-paperdark min-h-screen font-body'>
        {children}
      </div>
    </div>
  );
}
