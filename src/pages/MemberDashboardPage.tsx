import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import {
  User,
  Shield,
  BookOpen,
  Calendar,
  Lock,
  Globe,
  Trash2,
  Edit3,
  Bookmark,
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { CommunitySubmission, LanguageCode } from '../types';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const MemberDashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'settings'>('overview');
  const [privacyVisibility, setPrivacyVisibility] = useState(user?.profile?.profile_visibility || 'members');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/community/submissions/my')
      .then(r => r.json())
      .then(d => setSubmissions(d.submissions || []))
      .catch(console.error);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-stone-300">You must be logged in to view your member dashboard.</p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-[#c99738] text-[#300207]"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErr(null);
    setPasswordMsg(null);

    if (newPass !== confirmPass) {
      setPasswordErr('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
          confirm_password: confirmPass
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg('Password changed successfully.');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        setPasswordErr(data.error || 'Failed to update password.');
      }
    } catch {
      setPasswordErr('Network error updating password.');
    }
  };

  const handleUpdatePrivacy = async (visibility: any) => {
    setPrivacyVisibility(visibility);
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_visibility: visibility })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you certain you wish to request deletion of your account? This will anonymize your profile records.')) return;

    try {
      const res = await fetch('/api/auth/account', { method: 'DELETE' });
      if (res.ok) {
        await logout();
        onNavigate('/');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1e0710] via-[#161c2b] to-[#0e121d] border border-[#c99738]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user.profile?.profile_photo_url ? (
            <img
              src={user.profile.profile_photo_url}
              alt={user.profile.full_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#d4af37] shadow-lg shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#580014] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] text-2xl font-bold font-royal-heading shrink-0">
              {user.profile?.full_name?.charAt(0) || 'M'}
            </div>
          )}
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-semibold text-[#e8c872] uppercase tracking-wider">
              <Shield className="w-3 h-3 text-[#d4af37]" />
              <span>Role: {user.role.replace('_', ' ')}</span>
            </div>
            <h1 className="font-royal-heading font-extrabold text-2xl sm:text-3xl text-[#fcedc7]">
              Welcome, {user.profile?.full_name || user.email}
            </h1>
            <p className="text-xs text-stone-400">
              {user.profile?.district ? `${user.profile.district}, ${user.profile.state_or_province}, ${user.profile.country}` : user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/edit-profile')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#182030] text-[#e8c872] border border-[#c99738]/50 hover:bg-[#202b40] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onNavigate('/submit-research')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#c99738] text-[#300207] hover:bg-[#dfab43] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Submit Research</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'submissions', label: `My Research Submissions (${submissions.length})` },
          { id: 'settings', label: 'Privacy & Security Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#c99738] text-[#300207] shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-[#fcedc7] flex items-center gap-2">
              <User className="w-4 h-4 text-[#d4af37]" /> Profile Visibility
            </h3>
            <p className="text-xs text-stone-400">
              Current Setting: <strong className="text-stone-200 uppercase">{privacyVisibility}</strong>
            </p>
            <div className="pt-2 text-xs text-stone-500">
              Your exact date of birth and home address are never published in public views.
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-[#fcedc7] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" /> Active Language
            </h3>
            <p className="text-xs text-stone-400">
              Current preferred UI language: <strong className="text-stone-200">{language.toUpperCase()}</strong>
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {SUPPORTED_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code as LanguageCode)}
                  className={`text-[11px] px-2 py-0.5 rounded ${
                    language === l.code ? 'bg-[#c99738] text-black font-bold' : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-[#fcedc7] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4af37]" /> Archival Contributions
            </h3>
            <p className="text-xs text-stone-400">
              You have submitted <strong>{submissions.length}</strong> items to the Editorial Board.
            </p>
            <button
              onClick={() => onNavigate('/submit-research')}
              className="text-xs font-semibold text-[#e8c872] hover:underline block pt-2"
            >
              Upload new manuscript or photo →
            </button>
          </div>
        </div>
      )}

      {/* Tab: Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="p-12 text-center text-stone-400 bg-[#121622] rounded-3xl border border-stone-800 space-y-3">
              <p>You have not submitted any historical research or manuscripts yet.</p>
              <button
                onClick={() => onNavigate('/submit-research')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#c99738] text-[#300207]"
              >
                Submit Historical Material
              </button>
            </div>
          ) : (
            submissions.map(sub => (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {sub.submission_type}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    sub.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    sub.status === 'needs_correction' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    Status: {sub.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-royal-heading font-bold text-base text-stone-100">
                  {sub.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {sub.description}
                </p>

                {sub.reviewer_notes && (
                  <div className="p-3 rounded-xl bg-[#161c2a] border border-stone-800 text-xs text-stone-300">
                    <strong className="text-[#e8c872]">Editorial Reviewer Notes:</strong> {sub.reviewer_notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Privacy Visibility Controls */}
          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-4">
            <h3 className="font-royal-heading font-bold text-base text-[#fcedc7]">
              Member Profile Visibility Setting
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Control who can see your biographical details and profession in the Public Directory.
            </p>

            <div className="space-y-2">
              {[
                { val: 'public', label: 'Public (Visible to all visitors)' },
                { val: 'members', label: 'Registered Members Only (Recommended)' },
                { val: 'private', label: 'Private (Hidden from directory)' }
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-3 p-3 rounded-xl bg-[#182030] border border-stone-800 cursor-pointer">
                  <input
                    type="radio"
                    name="profile_visibility"
                    value={opt.val}
                    checked={privacyVisibility === opt.val}
                    onChange={() => handleUpdatePrivacy(opt.val)}
                    className="text-[#c99738]"
                  />
                  <span className="text-xs text-stone-200 font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-4">
            <h3 className="font-royal-heading font-bold text-base text-[#fcedc7]">
              Change Account Password
            </h3>

            {passwordMsg && <div className="text-xs text-emerald-400">{passwordMsg}</div>}
            {passwordErr && <div className="text-xs text-rose-400">{passwordErr}</div>}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#182030] text-stone-100 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  required
                  placeholder="Min 8 chars, uppercase, digit & symbol"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#182030] text-stone-100 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#182030] text-stone-100 border border-stone-700"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#c99738] text-[#300207] hover:bg-[#dfab43]"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Account Deletion Request */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-rose-950/20 border border-rose-900/50 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-rose-300">
              Account Deletion & Data Privacy Compliance
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              In accordance with data protection regulations, you can permanently request the deletion of your account and anonymization of personal credentials.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-900 text-rose-100 hover:bg-rose-800 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Purge Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
