/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Phone, Mail, Globe, LogOut, Check, Edit2, Info, ArrowLeft, ArrowRight, Sparkles, Camera } from 'lucide-react';
import { presetAvatars } from '../lib/mockData';
import { translations } from '../lib/translations';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  user: UserProfile;
  lang: 'fa' | 'en';
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
}

export default function ProfileSettings({ user, lang, onUpdateUser, onLogout, onBack }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [gender, setGender] = useState(user.gender || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);

  const t = translations[lang];
  const isRtl = t.direction === 'rtl';

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      phone,
      email,
      avatar,
      gender,
    });
    setIsEditing(false);
  };

  const handleLangToggle = () => {
    const nextLang = lang === 'fa' ? 'en' : 'fa';
    onUpdateUser({
      ...user,
      language: nextLang,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          onUpdateUser({ ...user, avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Settings Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white"
            id="btn-settings-back"
          >
            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-bold tracking-tight text-white">{t.settings}</h1>
        </div>
        <button
          onClick={handleLangToggle}
          className="px-3 py-1.5 bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 border border-slate-700/60 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
          id="btn-settings-lang-toggle"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'fa' ? 'English' : 'فارسی'}
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Card */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800/60 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl"></div>

          {/* Profile Photo */}
          <div className="relative mb-3.5 group">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500/20"
            />
            <label className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 rounded-full cursor-pointer text-white shadow-md hover:bg-cyan-400 transition-all">
              <Camera className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <button
            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
            className="text-[11px] text-cyan-400 hover:underline mb-4"
            id="btn-settings-toggle-avatar"
          >
            {t.choosePreset}
          </button>

          {/* Preset Grid toggled */}
          {showAvatarGrid && (
            <div className="w-full flex justify-center gap-1.5 flex-wrap bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 mb-4 transition-all">
              {presetAvatars.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAvatar(preset);
                    onUpdateUser({ ...user, avatar: preset });
                    setShowAvatarGrid(false);
                  }}
                  className={`relative w-8 h-8 rounded-full overflow-hidden transition-all border ${
                    avatar === preset ? 'border-cyan-400' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Display or Edit Fields */}
          {!isEditing ? (
            <div className="text-center w-full">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                {name}
                <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </h2>
              <p className="text-xs text-slate-400 font-mono mb-2">{phone}</p>
              {gender && (
                <span className="inline-block px-2.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 border border-slate-700/50 rounded-full font-medium">
                  {t[gender as 'male' | 'female' | 'other']}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full space-y-3.5">
              {/* Edit Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" /> {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                  id="edit-settings-name"
                />
              </div>

              {/* Edit Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-cyan-400" /> {t.phone}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all text-left"
                  dir="ltr"
                  id="edit-settings-phone"
                />
              </div>

              {/* Edit Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" /> {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all text-left"
                  dir="ltr"
                  id="edit-settings-email"
                />
              </div>

              {/* Edit Gender */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">
                  {t.gender}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        gender === g
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {t[g]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                  id="btn-settings-save"
                >
                  <Check className="w-3.5 h-3.5" />
                  {lang === 'fa' ? 'ذخیره' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-all"
                  id="btn-settings-cancel"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/50 space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {t.aboutJazirah}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {t.aboutText}
          </p>
          <div className="pt-2 border-t border-slate-800/40 text-[10px] text-slate-500 flex justify-between">
            <span>{t.appName} v1.2.0</span>
            <span>Made with 💙 inside AI Studio</span>
          </div>
        </div>

        {/* Logout section */}
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          id="btn-settings-logout"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </button>
      </div>
    </div>
  );
}
