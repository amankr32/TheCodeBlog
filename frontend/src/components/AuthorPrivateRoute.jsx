import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

// Allows access to admins AND readers who have been approved as writers.
// Use OnlyAdminPrivateRoute instead for pages that must stay admin-only
// (e.g. managing users or comments).
export default function AuthorPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && (currentUser.isAdmin || currentUser.isAuthor) ? (
    <Outlet />
  ) : (
    <Navigate to='/dashboard?tab=profile' />
  );
}
