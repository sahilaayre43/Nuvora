import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import {
  Users,
  UserRound,
  ShieldCheck,
  CalendarDays,
} from 'lucide-react';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    const fetchUsers = async () => {
      setUsers([]);
      setLoading(true);
      setError('');

      if (!user?.token) {
        setError('Please sign in as an administrator to view users.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to fetch users.');
        }
        if (!Array.isArray(data)) {
          throw new Error('The server returned an invalid users response.');
        }

        if (isCurrent) {
          setUsers(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || 'Unable to fetch users.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-[#fafaff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-sm font-medium text-purple-600">
                NUVORA ADMIN
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#171329] sm:text-3xl">
              User Directory
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered NUVORA customers
            </p>
          </div>

          {/* User Count */}
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <Users className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Total Users
              </p>

              <p className="text-lg font-bold text-[#171329]">
                {users.length}
              </p>
            </div>

          </div>

        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(80,50,150,0.06)]">

          {/* Card Header */}
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <h2 className="text-lg font-bold text-[#171329]">
                All Users
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Registered customers and administrators
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-purple-50 px-4 py-2">

              <Users className="h-4 w-4 text-purple-600" />

              <span className="text-sm font-semibold text-purple-600">
                {users.length} Users
              </span>

            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-gray-100 bg-[#fcfbff]">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">  ID</th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">  Name</th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">  Email</th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">  Role</th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">  Joined</th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {loading || error || users.length === 0 ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                        <Users className="h-6 w-6 text-purple-500" />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#171329]">
                        {loading ? 'Loading users...' : error ? 'Could not load users' : 'No users found'}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {error || (loading ? 'Fetching registered users.' : 'Registered users will appear here.')}
                      </p>

                    </td>
                  </tr>

                ) : (

                  users.map((u) => (

                    <tr
                      key={u._id}
                      className="group transition-colors hover:bg-[#faf8ff]"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">

                        <span className="rounded-lg bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-500">
                          {u._id.substring(0, 8)}...
                        </span>

                      </td>

                      {/* Name */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
                            <UserRound className="h-4 w-4 text-purple-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#171329]">
                              {u.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              NUVORA User
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-6 py-5">

                        <p className="text-sm text-gray-600">
                          {u.email}
                        </p>

                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">

                        <div
                          className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 ${
                            u.role === 'admin'
                              ? 'border-purple-100 bg-purple-50 text-purple-600'
                              : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                          }`}
                        >

                          {u.role === 'admin' ? (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          ) : (
                            <UserRound className="h-3.5 w-3.5" />
                          )}

                          <span className="text-xs font-semibold">
                            {u.role.toUpperCase()}
                          </span>

                        </div>

                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <CalendarDays className="h-4 w-4 text-gray-400" />

                          {u.createdAt ? new Date(
                            u.createdAt
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }) : 'Unavailable'}

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>
          </div>

          {/* Footer */}
          {users.length > 0 && (
            <div className="border-t border-gray-100 bg-[#fcfbff] px-6 py-4">

              <p className="text-xs text-gray-400">
                Showing{' '}
                <span className="font-semibold text-gray-600">
                  {users.length}
                </span>{' '}
                registered user{users.length !== 1 ? 's' : ''}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminUsers;