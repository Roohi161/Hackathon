import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Camera, Save, LogOut } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface UserProfilePageProps {
  user?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onUpdateUser?: (updated: { name: string; email: string; avatar: string }) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user: propsUser, onLogout, onUpdateUser }) => {
  const storeUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const storeLogout = useAuthStore((s) => s.logout);

  const activeUser = storeUser || propsUser || { name: 'User', email: 'user@example.com', avatar: '' };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: activeUser?.name || '',
    email: activeUser?.email || '',
    bio: (activeUser as any)?.bio || 'Avid hacker and open source contributor.',
    avatar: activeUser?.avatar || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeUser) {
      setFormData(prev => ({
        ...prev,
        name: activeUser.name || prev.name,
        email: activeUser.email || prev.email,
        avatar: activeUser.avatar || prev.avatar,
      }));
    }
  }, [activeUser]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/api/profile', formData).catch((): any => undefined);
      
      const updatedProfile = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        bio: formData.bio
      };

      // Update Zustand Auth Store (which persists to localStorage)
      updateUser(updatedProfile);

      if (onUpdateUser) {
        onUpdateUser(updatedProfile);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) onLogout();
    else storeLogout();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-slate-500 mt-2">Manage your account settings and preferences.</p>
        </div>
        <button
          onClick={handleLogoutAction}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black border-4 border-indigo-100 shadow-md font-mono uppercase">
                  {(formData.email || 'P').charAt(0)}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Photo</span>

            {/* Hackathon Preset Avatars Selector (Preset Only) */}
            {isEditing && (
              <div className="space-y-2 text-center pt-2">
                <span className="text-xs font-semibold text-indigo-600 block">Select Hackathon Avatar:</span>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: 'Cyber Coder', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150' },
                    { label: 'AI Hacker', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150&h=150' },
                    { label: 'Tech Ninja', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150' },
                    { label: 'Dev Lead', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150&h=150' }
                  ].map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset.url}
                      alt={preset.label}
                      title={preset.label}
                      onClick={() => setFormData({ ...formData, avatar: preset.url })}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 hover:scale-110 transition-all ${
                        formData.avatar === preset.url ? 'border-indigo-600 ring-4 ring-indigo-200' : 'border-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-70 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-70 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                disabled={!isEditing}
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-70 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none text-slate-900 font-medium"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                  >
                    <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} /> 
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
