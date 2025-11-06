"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Check, LogIn, UserCog, Users, Plus, Shield, X, Save } from 'lucide-react';

const MAIN_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL || '';

interface AdminSession {
  email: string;
}

interface AdminUserRow {
  name: string;
  email: string;
  mobile: string;
  abstract_status: string | null;
  payment_transaction_id: string | null;
  payment_date: string | null;
  payment_status: string | null;
  paper_status: string | null;
  accompanying_persons: number;
  workshop_participants: number;
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [tab, setTab] = useState<'users' | 'add_admin'>('users');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Users
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [savingRow, setSavingRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const isMainAdmin = useMemo(() => session?.email === MAIN_ADMIN_EMAIL, [session]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.payment_transaction_id || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  useEffect(() => {
    // Ensure admin table and default admin exist
    const init = async () => {
      try {
        await fetch('/api/admin/migrate');
        await fetch('/api/admin/bootstrap', { method: 'POST' });
      } catch {}
    };
    init();

    const saved = localStorage.getItem('admin_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AdminSession;
        setSession(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/list-users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (e) {
        console.error('Failed to load users', e);
      }
    };
    fetchUsers();
  }, [session]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Sign in failed');
      const s = { email: data.admin.email } as AdminSession;
      localStorage.setItem('admin_session', JSON.stringify(s));
      setSession(s);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gemail = result.user.email || '';
      const resp = await fetch(`/api/admin/is-admin?email=${encodeURIComponent(gemail)}`);
      const data = await resp.json();
      if (!data.success || !data.isAdmin) throw new Error('Not an admin account');
      const s = { email: gemail } as AdminSession;
      localStorage.setItem('admin_session', JSON.stringify(s));
      setSession(s);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    localStorage.removeItem('admin_session');
    setSession(null);
  };

  const updateAbstract = async (row: AdminUserRow, status: 'accepted' | 'rejected') => {
    setSavingRow(row.email);
    try {
      const res = await fetch('/api/abstract/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: row.email, status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      setUsers(prev => prev.map(u => u.email === row.email ? { ...u, abstract_status: status } : u));
    } catch (e) {
      alert((e as any).message || 'Failed to update abstract status');
    } finally {
      setSavingRow(null);
    }
  };

  const updatePayment = async (row: AdminUserRow, nextStatus: 'failed' | 'completed', paymentDate?: string) => {
    setSavingRow(row.email);
    try {
      const res = await fetch('/api/admin/update-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: row.email, status: nextStatus, payment_date: paymentDate }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      setUsers(prev => prev.map(u => u.email === row.email ? { ...u, payment_status: nextStatus, payment_date: paymentDate || new Date().toISOString() } : u));
    } catch (e) {
      alert((e as any).message || 'Failed to update payment status');
    } finally {
      setSavingRow(null);
    }
  };

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [createAdminError, setCreateAdminError] = useState('');

  // Admin list (for Add Admin tab)
  const [admins, setAdmins] = useState<{ email: string; created_at: string }[]>([]);
  const loadAdmins = async () => {
    try {
      const res = await fetch('/api/admin/list-admins');
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (e) {
      console.error('Failed to load admins', e);
    }
  };

  useEffect(() => {
    if (session && tab === 'add_admin' && isMainAdmin) {
      loadAdmins();
    }
  }, [session, tab, isMainAdmin]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAdminError('');
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': session?.email || '' },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create admin');
      alert('Admin created');
      setNewAdminEmail('');
      setNewAdminPassword('');
      await loadAdmins();
    } catch (e: any) {
      setCreateAdminError(e.message || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (emailToDelete: string) => {
    if (!confirm(`Delete admin ${emailToDelete}?`)) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': session?.email || '' },
        body: JSON.stringify({ email: emailToDelete }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete admin');
      await loadAdmins();
    } catch (e: any) {
      alert(e.message || 'Failed to delete admin');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-md w-full text-center border border-white/20">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <UserCog size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Sign In</h1>
          <p className="text-purple-200 mb-6">Restricted area</p>

          <form onSubmit={handleAdminSignIn} className="space-y-4 text-left">
            <div>
              <label className="block text-white/80 mb-1">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white" required />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white" required />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          <div className="my-4 text-white/60">Or</div>

          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20">Continue with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mt-6 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-green-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <span className="text-purple-200">({session.email})</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-xl">Logout</button>
        </div>

        <div className="bg-white/10 p-2 rounded-2xl inline-flex gap-2 mb-6">
          <button onClick={() => setTab('users')} className={`px-6 py-3 rounded-xl font-semibold ${tab==='users'?'bg-gradient-to-r from-purple-500 to-blue-500 text-white':'text-white/70 hover:text-white hover:bg-white/5'}`}>
            <Users className="inline mr-2" size={18}/> Users
          </button>
          {isMainAdmin && (
            <button onClick={() => setTab('add_admin')} className={`px-6 py-3 rounded-xl font-semibold ${tab==='add_admin'?'bg-gradient-to-r from-purple-500 to-blue-500 text-white':'text-white/70 hover:text-white hover:bg-white/5'}`}>
              <Plus className="inline mr-2" size={18}/> Add Admin
            </button>
          )}
        </div>

        {tab === 'users' && (
          <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-white/80">
                <span className="text-sm">Users: </span>
                <span className="font-semibold">{filteredUsers.length}</span>
              </div>
              <div className="flex-1 max-w-md">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or transaction ID"
                  className="w-full px-4 py-2 rounded-xl bg-white/90 text-slate-900 placeholder-slate-500 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white/90">
                <thead className="text-white">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Mobile</th>
                    <th className="px-3 py-2">Abstract</th>
                    <th className="px-3 py-2">Txn ID</th>
                    <th className="px-3 py-2">Txn Date</th>
                    <th className="px-3 py-2">Payment</th>
                    <th className="px-3 py-2">Paper</th>
                    <th className="px-3 py-2">Accomp.</th>
                    <th className="px-3 py-2">Workshop</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr className="border-t border-white/10">
                      <td colSpan={11} className="px-3 py-6 text-center text-white/60">No users match your search.</td>
                    </tr>
                  )}
                  {filteredUsers.map((u) => (
                    <tr key={u.email} className="border-t border-white/10">
                      <td className="px-3 py-2">{u.name}</td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">{u.mobile}</td>
                      <td className="px-3 py-2">
                        <select
                          defaultValue={u.abstract_status || ''}
                          onChange={(e) => updateAbstract(u, e.target.value as 'accepted' | 'rejected')}
                          className="bg-white text-slate-900 border border-slate-300 rounded px-2 py-1"
                        >
                          <option value="">-</option>
                          <option value="accepted">accepted</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">{u.payment_transaction_id || '-'}</td>
                      <td className="px-3 py-2">
                        {u.payment_status === 'pending' ? (
                          <input
                            type="datetime-local"
                            defaultValue={u.payment_date ? new Date(u.payment_date).toISOString().slice(0,16) : ''}
                            onChange={(e) => (u.payment_date = new Date(e.target.value).toISOString())}
                            className="bg-white/10 border border-white/20 rounded px-2 py-1"
                          />
                        ) : (
                          u.payment_date ? new Date(u.payment_date).toLocaleString() : '-'
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {u.payment_status === 'pending' ? (
                          <select
                            defaultValue={u.payment_status || ''}
                            onChange={(e) => (u.payment_status = e.target.value)}
                            className="bg-white text-slate-900 border border-slate-300 rounded px-2 py-1"
                          >
                            <option value="pending">pending</option>
                            <option value="failed">failed</option>
                            <option value="completed">completed</option>
                          </select>
                        ) : (
                          u.payment_status || '-'
                        )}
                      </td>
                      <td className="px-3 py-2">{u.paper_status || '-'}</td>
                      <td className="px-3 py-2 text-center">{u.accompanying_persons}</td>
                      <td className="px-3 py-2 text-center">{u.workshop_participants}</td>
                      <td className="px-3 py-2">
                        {u.payment_status === 'pending' || u.abstract_status ? (
                          <button
                            disabled={savingRow === u.email}
                            onClick={() => {
                              if (u.payment_status === 'pending') {
                                alert('Select failed or completed before saving.');
                              } else if (u.payment_status === 'completed') {
                                updatePayment(u, 'completed', u.payment_date || undefined);
                              } else if (u.payment_status === 'failed') {
                                updatePayment(u, 'failed', u.payment_date || undefined);
                              } else if (u.abstract_status) {
                                // abstract already updated via onChange; no-op here
                              }
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-xl"
                          >
                            {savingRow === u.email ? 'Saving...' : 'Save'}
                          </button>
                        ) : (
                          <span className="text-white/60">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'add_admin' && isMainAdmin && (
          <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="text-green-400"/> Add Admin
                </h2>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-1">Admin Email</label>
                    <input type="email" value={newAdminEmail} onChange={e=>setNewAdminEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-1">Password</label>
                    <input type="password" value={newAdminPassword} onChange={e=>setNewAdminPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white" />
                  </div>
                  {createAdminError && <p className="text-red-400 text-sm">{createAdminError}</p>}
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold">Create Admin</button>
                </form>
                <p className="text-white/60 text-sm mt-3">Note: Only visible to the main admin.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-purple-400"/> Existing Admins
                </h2>
                <div className="overflow-x-auto bg-white/5 rounded-2xl border border-white/10">
                  <table className="min-w-full text-left text-white/90">
                    <thead className="text-white">
                      <tr>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Created</th>
                        <th className="px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length === 0 && (
                        <tr className="border-t border-white/10">
                          <td colSpan={3} className="px-3 py-6 text-center text-white/60">No admins found.</td>
                        </tr>
                      )}
                      {admins.map((a) => (
                        <tr key={a.email} className="border-t border-white/10">
                          <td className="px-3 py-2">{a.email}</td>
                          <td className="px-3 py-2">{a.created_at ? new Date(a.created_at).toLocaleString() : '-'}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleDeleteAdmin(a.email)}
                              className="px-3 py-2 bg-red-600 text-white rounded-xl disabled:opacity-50"
                              disabled={a.email === (process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL || '')}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
