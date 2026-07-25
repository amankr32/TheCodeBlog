import { Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashAdminRequests() {
  const { currentUser } = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/admin-requests`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchRequests();
    }
  }, [currentUser._id]);

  const handleDecision = async (userId, decision) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${decision}-admin/${userId}`,
        {
          method: 'PUT',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) => prev.filter((user) => user._id !== userId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <h1 className='text-2xl font-semibold text-center my-4'>
        Pending Admin Requests
      </h1>
      {error && <p className='text-red-500 text-center'>{error}</p>}
      {currentUser.isAdmin && requests.length > 0 ? (
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date requested</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Decision</Table.HeadCell>
          </Table.Head>
          {requests.map((user) => (
            <Table.Body className='divide-y' key={user._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <div className='flex gap-3'>
                    <Button
                      size='xs'
                      color='success'
                      onClick={() => handleDecision(user._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size='xs'
                      color='failure'
                      onClick={() => handleDecision(user._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p className='text-center'>There are no pending admin requests right now.</p>
      )}
    </div>
  );
}
