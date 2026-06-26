/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Phone, Mail, User, Check, Camera, Sparkles, Search, ChevronDown } from 'lucide-react';
import { presetAvatars } from '../lib/mockData';
import { translations } from '../lib/translations';
import { UserProfile } from '../types';

const COUNTRIES = [
  { code: '+93', name: 'افغانستان', enName: 'Afghanistan', flag: '🇦🇫', placeholder: '799123456' },
  { code: '+98', name: 'ایران', enName: 'Iran', flag: '🇮🇷', placeholder: '9123456789' },
  { code: '+90', name: 'ترکیه', enName: 'Turkey', flag: '🇹🇷', placeholder: '5321234567' },
  { code: '+992', name: 'تاجیکستان', enName: 'Tajikistan', flag: '🇹🇯', placeholder: '901234567' },
  { code: '+998', name: 'ازبکستان', enName: 'Uzbekistan', flag: '🇺🇿', placeholder: '901234567' },
  { code: '+92', name: 'پاکستان', enName: 'Pakistan', flag: '🇵🇰', placeholder: '3001234567' },
  { code: '+971', name: 'امارات متحده عربی', enName: 'United Arab Emirates', flag: '🇦🇪', placeholder: '501234567' },
  { code: '+966', name: 'عربستان سعودی', enName: 'Saudi Arabia', flag: '🇸🇦', placeholder: '501234567' },
  { code: '+964', name: 'عراق', enName: 'Iraq', flag: '🇮🇶', placeholder: '7701234567' },
  { code: '+965', name: 'کویت', enName: 'Kuwait', flag: '🇰🇼', placeholder: '50123456' },
  { code: '+974', name: 'قطر', enName: 'Qatar', flag: '🇶🇦', placeholder: '55123456' },
  { code: '+968', name: 'عمان', enName: 'Oman', flag: '🇴🇲', placeholder: '91234567' },
  { code: '+973', name: 'بحرین', enName: 'Bahrain', flag: '🇧🇭', placeholder: '39123456' },
  { code: '+49', name: 'آلمان', enName: 'Germany', flag: '🇩🇪', placeholder: '15112345678' },
  { code: '+44', name: 'بریتانیا', enName: 'United Kingdom', flag: '🇬🇧', placeholder: '7123456789' },
  { code: '+1', name: 'ایالات متحده آمریکا', enName: 'United States', flag: '🇺🇸', placeholder: '2025550143' },
  { code: '+1-CA', name: 'کانادا', enName: 'Canada', flag: '🇨🇦', placeholder: '6135550143', customCode: '+1' },
  { code: '+46', name: 'سوئد', enName: 'Sweden', flag: '🇸🇪', placeholder: '701234567' },
  { code: '+47', name: 'نروژ', enName: 'Norway', flag: '🇳🇴', placeholder: '90123456' },
  { code: '+31', name: 'هلند', enName: 'Netherlands', flag: '🇳🇱', placeholder: '612345678' },
  { code: '+33', name: 'فرانسه', enName: 'France', flag: '🇫🇷', placeholder: '612345678' },
  { code: '+61', name: 'استرالیا', enName: 'Australia', flag: '🇦🇺', placeholder: '412345678' },
  { code: '+7', name: 'روسیه', enName: 'Russia', flag: '🇷🇺', placeholder: '9123456789' },
  { code: '+86', name: 'چین', enName: 'China', flag: '🇨🇳', placeholder: '13912345678' },
  { code: '+91', name: 'هند', enName: 'India', flag: '🇮🇳', placeholder: '9123456789' },
];

interface AuthScreenProps {
  onRegister: (profile: UserProfile) => void;
}

export default function AuthScreen({ onRegister }: AuthScreenProps) {
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [name, setName] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('+93');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(presetAvatars[0]);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const t = translations[lang];
  const isRtl = t.direction === 'rtl';

  const selectedCountry = COUNTRIES.find(c => c.code === selectedPrefix) || COUNTRIES[0];
  const filteredCountries = COUNTRIES.filter(c => 
    c.name.includes(searchQuery) || 
    c.enName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.includes(searchQuery)
  );

  const validate = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = t.nameRequired;
    }
    if (!phone.trim()) {
      newErrors.phone = t.phoneNumberRequired;
    } else if (!/^[0-9\s\-()]{5,15}$/.test(phone)) {
      newErrors.phone = lang === 'fa' ? 'شماره تلفن وارد شده نامعتبر است' : 'The entered phone number is invalid';
    }
    if (!email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = lang === 'fa' ? 'آدرس ایمیل نامعتبر است' : 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onRegister({
      id: 'current_user',
      name,
      phone: (selectedCountry.customCode || selectedCountry.code) + phone,
      email,
      avatar,
      language: lang,
      gender,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans select-none relative overflow-hidden" id="auth-screen">
      {/* Decorative ocean circles representing island (Jazirah) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"></div>

      {/* Language Toggle bar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setLang('fa')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            lang === 'fa'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          id="btn-lang-fa"
        >
          <Globe className="w-3.5 h-3.5" />
          فارسی
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            lang === 'en'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          id="btn-lang-en"
        >
          <Globe className="w-3.5 h-3.5" />
          English
        </button>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 z-10 transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 mb-3 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1.5 font-mono">
            {t.appName}
          </h1>
          <p className="text-xs text-cyan-600 font-bold">
            {t.slogan}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          {/* Avatar Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-bold text-slate-800 mb-2">
              {t.profilePic}
            </label>
            <div className="relative group mb-3">
              <img
                src={avatar}
                alt="Selected Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500/20 group-hover:border-cyan-500 transition-all shadow-md"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer text-white shadow-md hover:bg-cyan-500 transition-all">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Presets Grid */}
            <div className="w-full">
              <span className="text-[11px] text-slate-500 block text-center mb-2 font-medium">
                {t.choosePreset}
              </span>
              <div className="flex justify-center gap-1.5 flex-wrap px-2">
                {presetAvatars.slice(0, 6).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-200 border-2 ${
                      avatar === preset ? 'border-cyan-500 scale-110 shadow-md' : 'border-slate-100 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {avatar === preset && (
                      <div className="absolute inset-0 bg-cyan-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              {t.name} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder={lang === 'fa' ? 'مثال: علی رضایی' : 'e.g. John Doe'}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`w-full bg-slate-50 border ${
                errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
              } focus:border-cyan-500 focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all`}
              id="input-name"
            />
            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-600" />
              {t.phone} <span className="text-rose-500">*</span>
            </label>
            <div className={`flex rounded-xl bg-slate-50 border ${
              errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300 focus-within:border-cyan-500 focus-within:bg-white'
            } overflow-hidden transition-all`} dir="ltr">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="bg-slate-100/85 hover:bg-slate-200/70 active:bg-slate-200 border-r border-slate-200 px-3 py-2.5 flex items-center gap-1.5 text-slate-700 text-xs font-black select-none shrink-0 transition-colors cursor-pointer"
                id="btn-prefix-selector"
              >
                <span>{selectedCountry ? selectedCountry.flag : '🏳️'}</span>
                <span className="font-mono">{selectedCountry ? (selectedCountry.customCode || selectedCountry.code) : selectedPrefix}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
              </button>
              <input
                type="tel"
                placeholder={selectedCountry ? selectedCountry.placeholder : '9123456789'}
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPhone(val);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                className="w-full bg-transparent border-0 focus:outline-none px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 text-left focus:ring-0"
                id="input-phone"
              />
            </div>

            {/* Elegant Dropdown Overlay containing search and list of countries */}
            {showCountryDropdown && (
              <>
                {/* Backdrop to close the dropdown when clicking outside */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowCountryDropdown(false)} 
                />
                
                <div 
                  className={`absolute z-40 left-0 right-0 mt-1 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-3 flex flex-col gap-2.5 max-h-[290px]`}
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  <span className="text-[10px] font-extrabold text-slate-500 block text-center">
                    {lang === 'fa' ? 'انتخاب پیش‌شماره کشور:' : 'Select Country Prefix:'}
                  </span>
                  
                  {/* Search Input for countries */}
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isRtl ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={lang === 'fa' ? 'جستجوی نام کشور یا پیش‌شماره...' : 'Search country name or prefix...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 text-xs focus:outline-none focus:border-cyan-500 text-slate-700 placeholder-slate-400`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Scrollable vertical list of country prefixes */}
                  <div className="overflow-y-auto divide-y divide-slate-100 border border-slate-200/60 rounded-xl bg-white p-1 scrollbar-thin">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedPrefix(c.code);
                            setPhone('');
                            setShowCountryDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all text-right ${
                            selectedPrefix === c.code
                              ? 'bg-cyan-50/70 text-cyan-700 font-extrabold border-r-4 border-cyan-600 pl-3 pr-2'
                              : 'text-slate-700 hover:bg-slate-50 border-r-4 border-transparent pl-3 pr-2'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base shrink-0">{c.flag}</span>
                            <span className="text-xs font-bold text-slate-700">
                              {lang === 'fa' ? c.name : c.enName}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-black text-slate-500" dir="ltr">{c.code}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-400 text-center py-4 font-bold">
                        {lang === 'fa' ? 'کشوری یافت نشد' : 'No country found'}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-cyan-600" />
              {t.email} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder={lang === 'fa' ? 'مثال: name@gmail.com' : 'e.g. name@gmail.com'}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={`w-full bg-slate-50 border ${
                errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
              } focus:border-cyan-500 focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all text-left`}
              dir="ltr"
              id="input-email"
            />
            {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
          </div>

          {/* Gender Select */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              {t.gender}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    gender === g
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {t[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 mt-4 text-sm"
            id="btn-submit"
          >
            {t.register}
          </button>
        </form>
      </div>

      {/* Small credits footer */}
      <div className="text-center mt-6 text-slate-400 text-xs font-mono relative z-10 max-w-xs leading-relaxed">
        {translations[lang].credits}
      </div>
    </div>
  );
}
