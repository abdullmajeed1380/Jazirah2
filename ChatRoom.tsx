/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, Send, Smile, Paperclip, Check, CheckCheck, Users, Radio, ArrowLeft, ArrowRight, Image as ImageIcon, Camera, X, Gift, Sparkles, Palette, Coins, Copy } from 'lucide-react';
import { translations } from '../lib/translations';
import { Room, Message, UserProfile } from '../types';

interface ChatRoomProps {
  room: Room;
  currentUser: UserProfile;
  lang: 'fa' | 'en';
  onSendMessage: (text: string, type?: 'text' | 'image', imageUrl?: string) => void;
  onInitiateCall: (type: 'voice' | 'video') => void;
  onJoinLeaveRoom: (roomId: string) => void;
  onBackToMain?: () => void; // for mobile responsive back action
  onSendGift?: (gift: { id: string, name: string, persianName: string, icon: string, cost: number, color: string, animation: string }) => void;
  onAddDiamonds?: (amount: number) => void;
}

const PRESET_EMOJIS = ['😊', '😂', '👍', '❤️', '🌴', '🔥', '👏', '🎉', '🕌', '🤔', '😍', '🌹'];

const GIFTS = [
  { id: 'rose', name: 'Red Rose', persianName: 'شاخه گل سرخ', icon: '🌹', cost: 10, color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30', animation: 'animate-pulse' },
  { id: 'diamond', name: 'Shiny Diamond', persianName: 'الماس درخشان', icon: '💎', cost: 50, color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30', animation: 'animate-bounce' },
  { id: 'car', name: 'Sports Car', persianName: 'ماشین اسپرت', icon: '🏎️', cost: 150, color: 'from-amber-500/20 to-red-500/10 text-amber-400 border-amber-500/30', animation: 'animate-bounce' },
  { id: 'yacht', name: 'Luxury Yacht', persianName: 'کشتی تفریحی', icon: '🛳️', cost: 300, color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30', animation: 'animate-pulse' },
  { id: 'crown', name: 'Royal Crown', persianName: 'تاج پادشاهی', icon: '👑', cost: 500, color: 'from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30', animation: 'animate-bounce' },
  { id: 'castle', name: 'Magic Castle', persianName: 'قلعه جادویی', icon: '🏰', cost: 1000, color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30', animation: 'animate-pulse' },
];

const CHAT_BACKGROUNDS = [
  { id: 'dark-slate', name: 'Midnight', persianName: 'نیمه‌شب تیره', bgClass: 'bg-slate-950', isDark: true, previewColor: 'bg-slate-900 border-slate-700' },
  { id: 'deep-ocean', name: 'Deep Ocean', persianName: 'اقیانوس ژرف', bgClass: 'bg-indigo-950 bg-gradient-to-b from-indigo-950 to-slate-950', isDark: true, previewColor: 'bg-indigo-950 border-indigo-800' },
  { id: 'royal-purple', name: 'Royal Purple', persianName: 'بنفش سلطنتی', bgClass: 'bg-purple-950 bg-gradient-to-b from-purple-950 to-slate-950', isDark: true, previewColor: 'bg-purple-950 border-purple-800' },
  { id: 'sunset-warmth', name: 'Sunset Warm', persianName: 'غروب گرم', bgClass: 'bg-amber-950 bg-gradient-to-b from-amber-950 to-slate-950', isDark: true, previewColor: 'bg-amber-950 border-amber-800' },
  { id: 'classic-imo', name: 'Classic imo', persianName: 'ایمو کلاسیک', bgClass: 'bg-gradient-to-b from-sky-100 to-white text-slate-900', isDark: false, previewColor: 'bg-sky-100 border-sky-300' },
  { id: 'minimalist-white', name: 'Pure White', persianName: 'سفید مینیمال', bgClass: 'bg-white text-slate-900', isDark: false, previewColor: 'bg-white border-slate-200' },
];

const DIAMOND_PACKAGES = [
  { id: 'p1', diamonds: 100, price: '1.00', btc: '0.00003', eth: '0.0004', trx: '10', usdt: '1.00' },
  { id: 'p2', diamonds: 500, price: '4.50', btc: '0.00013', eth: '0.0018', trx: '45', usdt: '4.50' },
  { id: 'p3', diamonds: 1000, price: '8.00', btc: '0.00024', eth: '0.0032', trx: '80', usdt: '8.00' },
  { id: 'p4', diamonds: 5000, price: '35.00', btc: '0.00100', eth: '0.0140', trx: '350', usdt: '35.00' },
];

const CRYPTO_COINS = [
  { id: 'usdt', name: 'Tether USDT', symbol: 'USDT', icon: '🟢', network: 'TRC-20', address: 'TYvWeSrn7QyP26aQZ4iGfUfXvV7U7qAAsX' },
  { id: 'trx', name: 'TRON TRX', symbol: 'TRX', icon: '🔴', network: 'TRON', address: 'TYvWeSrn7QyP26aQZ4iGfUfXvV7U7qAAsX' },
  { id: 'btc', name: 'Bitcoin BTC', symbol: 'BTC', icon: '🟠', network: 'Bitcoin', address: 'bc1q67v7pxn3x7g6n8z7u8m8k6y2e4q5v7v7z8x9gq' },
  { id: 'eth', name: 'Ethereum ETH', symbol: 'ETH', icon: '🔵', network: 'ERC-20', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
];

export default function ChatRoom({ room, currentUser, lang, onSendMessage, onInitiateCall, onJoinLeaveRoom, onBackToMain, onSendGift, onAddDiamonds }: ChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{ icon: string, name: string, color: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Custom Chatroom/Channel backgrounds
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [bgThemeId, setBgThemeId] = useState<string>(() => {
    return localStorage.getItem(`jazirah_theme_${room.id}`) || 'dark-slate';
  });

  // Crypto payment states
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [cryptoStep, setCryptoStep] = useState<'packages' | 'crypto' | 'pay' | 'verifying' | 'success'>('packages');
  const [selectedPackage, setSelectedPackage] = useState<{ id: string, diamonds: number, price: string } | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<{ name: string, symbol: string, address: string, qrValue: string, network: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[lang];
  const isRtl = t.direction === 'rtl';

  // Scroll to bottom whenever messages list change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (selectedImage) {
      onSendMessage(inputText || 'Image Attachment', 'image', selectedImage);
      setSelectedImage(null);
      setInputText('');
      setShowEmojiPicker(false);
    } else if (inputText.trim()) {
      onSendMessage(inputText.trim(), 'text');
      setInputText('');
      setShowEmojiPicker(false);
    }
  };

  const handleGiftSendLocal = (gift: typeof GIFTS[0]) => {
    if (onSendGift) {
      onSendGift(gift);
      
      // Trigger full screen animation local effect
      setActiveGiftAnimation({
        icon: gift.icon,
        name: lang === 'fa' ? gift.persianName : gift.name,
        color: gift.color
      });
      
      // Close modal
      setShowGiftModal(false);
      
      // Clear animation after 3.5 seconds
      setTimeout(() => {
        setActiveGiftAnimation(null);
      }, 3500);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const currentBgTheme = CHAT_BACKGROUNDS.find(b => b.id === bgThemeId) || CHAT_BACKGROUNDS[0];

  return (
    <div
      className={`flex-1 flex flex-col ${currentBgTheme.bgClass} border-l border-slate-800 relative h-full font-sans ${
        dragOver ? 'ring-4 ring-cyan-500/50 ring-inset' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      id={`chatroom-${room.id}`}
    >
      {/* Top Header of Chat Room */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700/60 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="p-1 hover:bg-slate-700 rounded-full text-slate-300 md:hidden transition-all"
              id="btn-chat-back"
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}

          <img
            src={room.avatar}
            alt={room.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
          />

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">
              {lang === 'fa' ? room.persianName : room.name}
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium truncate max-w-[180px] sm:max-w-xs">
              {room.type === 'chat' && (lang === 'fa' ? 'مکالمه مستقیم' : 'Direct Message')}
              {room.type === 'group' && (lang === 'fa' ? `گروه عمومی • ${t.members}` : `Public Group • ${t.members}`)}
              {room.type === 'channel' && (lang === 'fa' ? `کانال رسمی • ${t.subscribers}` : `Official Channel • ${t.subscribers}`)}
            </p>
          </div>
        </div>

        {/* Action icons - call/theme buttons available */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Background Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                showThemeMenu ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700 text-slate-300 hover:text-cyan-400'
              }`}
              title={lang === 'fa' ? 'تغییر پوسته پس‌زمینه' : 'Change Theme Background'}
              id="btn-chat-theme"
            >
              <Palette className="w-4 h-4" />
            </button>
            
            {showThemeMenu && (
              <div 
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-2.5 z-50 flex flex-col gap-1`}
                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
              >
                <div className="text-[10px] text-slate-400 font-bold px-1.5 py-1 border-b border-slate-800/60 mb-1.5 uppercase tracking-wider">
                  🎨 {lang === 'fa' ? 'انتخاب پس‌زمینه' : 'Select Background'}
                </div>
                {CHAT_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setBgThemeId(bg.id);
                      localStorage.setItem(`jazirah_theme_${room.id}`, bg.id);
                      setShowThemeMenu(false);
                    }}
                    className={`flex items-center justify-between w-full text-right px-2 py-1.5 rounded-xl text-xs transition-all ${
                      bgThemeId === bg.id
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang === 'fa' ? bg.persianName : bg.name}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border ${bg.previewColor}`}></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {room.type === 'chat' && (
            <>
              <button
                onClick={() => onInitiateCall('voice')}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-300 hover:text-cyan-400 transition-all"
                title={t.voiceCall}
                id="btn-chat-voice-call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onInitiateCall('video')}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-300 hover:text-cyan-400 transition-all"
                title={t.videoCall}
                id="btn-chat-video-call"
              >
                <Video className="w-4.5 h-4.5" />
              </button>
            </>
          )}
          
          {/* Join / Leave button for Groups/Channels */}
          {room.type !== 'chat' && (
            <button
              onClick={() => onJoinLeaveRoom(room.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                room.isJoined
                  ? 'bg-slate-700 text-slate-300 hover:bg-rose-950 hover:text-rose-400 border border-slate-600/50'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/20'
              }`}
              id="btn-join-leave"
            >
              {room.isJoined ? t.leaveRoom : t.joinRoom}
            </button>
          )}
        </div>
      </div>

      {/* Active Group Call Banner (Real peer-to-peer contact calling each other) */}
      {room.type === 'group' && (
        <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900/90 to-cyan-950/90 border-b border-cyan-800/30 px-4 py-2.5 flex items-center justify-between z-10 shadow-sm animate-pulse">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[11px] font-bold text-slate-100 flex items-center gap-1">
                {lang === 'fa' 
                  ? '📞 تماس صوتی گروهی فعال' 
                  : '📞 Active Group Voice Call'}
              </p>
              <p className="text-[9.5px] text-cyan-400 truncate">
                {lang === 'fa' 
                  ? 'علی، سارا و امیر در حال گفتگو هستند...' 
                  : 'Ali, Sarah, and Amir are currently talking...'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onInitiateCall('voice')}
            className="px-3.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 shrink-0"
            id="btn-join-group-call"
          >
            {lang === 'fa' ? 'پیوستن 📞' : 'Join 📞'}
          </button>
        </div>
      )}

      {/* Messages Scroll viewport */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${currentBgTheme.isDark ? 'bg-slate-900/40' : 'bg-slate-100/30'}`}>
        {room.messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-slate-500 p-4">
            <Smile className="w-12 h-12 mb-2 stroke-[1.5px] text-slate-600 animate-bounce" />
            <p className="text-xs">{t.noMessages}</p>
          </div>
        ) : (
          room.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const isSystem = msg.type === 'call';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2" id={`msg-${msg.id}`}>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-400 shadow-sm">
                    {msg.text.includes('video') ? <Video className="w-3 h-3 text-cyan-400" /> : <Phone className="w-3 h-3 text-cyan-400" />}
                    {msg.text} {msg.duration ? `(${Math.floor(msg.duration / 60)}:${(msg.duration % 60).toString().padStart(2, '0')})` : ''}
                  </span>
                </div>
              );
            }

            if (msg.type === 'gift' && msg.giftInfo) {
              const gift = msg.giftInfo;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] sm:max-w-[70%] ${
                    isMe ? (isRtl ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''
                  }`}
                  id={`msg-${msg.id}`}
                >
                  <img
                    src={isMe ? currentUser.avatar : msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700 shadow-sm"
                  />
                  <div className="flex flex-col space-y-0.5">
                    {!isMe && room.type !== 'chat' && (
                      <span className="text-[10px] font-bold text-cyan-400 px-1">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl p-4 shadow-xl border border-dashed text-xs flex flex-col items-center justify-center text-center bg-gradient-to-b ${gift.color} ${
                        isMe ? 'rounded-tr-none' : 'rounded-tl-none'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-800/40 mb-2">
                        🎁 {lang === 'fa' ? 'هدیه ارسالی' : 'GIFT'}
                      </span>
                      <div className={`text-5xl select-none my-3 ${gift.animation || 'animate-bounce'}`}>
                        {gift.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {lang === 'fa' ? gift.persianName : gift.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 max-w-[150px] mb-2 leading-snug">
                        {isMe 
                          ? (lang === 'fa' ? `شما این هدیه را ارسال کردید` : `You sent this gift`)
                          : (lang === 'fa' ? `${msg.senderName} این هدیه را فرستاد` : `${msg.senderName} sent this gift`)}
                      </p>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-amber-400">
                        <span>💎</span>
                        <span>{gift.cost} {lang === 'fa' ? 'الماس' : 'Diamonds'}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-3 w-full text-[9px] opacity-60">
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-cyan-400 stroke-[2.5px]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                  isMe ? (isRtl ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''
                }`}
                id={`msg-${msg.id}`}
              >
                {/* Avatar */}
                <img
                  src={isMe ? currentUser.avatar : msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700 shadow-sm"
                />

                {/* Bubble details */}
                <div className="flex flex-col space-y-0.5">
                  {/* Sender Name in group */}
                  {!isMe && room.type !== 'chat' && (
                    <span className="text-[10px] font-bold text-cyan-400 px-1">
                      {msg.senderName}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs shadow-md break-all leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/40 rounded-tl-none'
                    }`}
                  >
                    {/* Render message image if present */}
                    {msg.type === 'image' && msg.imageUrl && (
                      <div className="mb-1.5 max-w-xs rounded-lg overflow-hidden border border-slate-700">
                        <img src={msg.imageUrl} alt="Attached File" className="w-full h-auto object-cover max-h-48" />
                      </div>
                    )}
                    
                    <p className="whitespace-pre-line select-text font-sans">{msg.text}</p>
                    
                    {/* Bubble Footer info */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                      <span>{formatMessageTime(msg.timestamp)}</span>
                      {isMe && (
                        <CheckCheck className="w-3 h-3 text-cyan-200 stroke-[2.5px]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment / Upload Image display bar */}
      {selectedImage && (
        <div className="absolute bottom-16 left-4 right-4 bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center justify-between shadow-xl z-20" id="image-preview">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-600">
              <img src={selectedImage} alt="Preview Attachment" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs text-slate-200 font-semibold">Image Attachment ready</span>
              <span className="text-[10px] text-slate-400 block">Drag-and-drop or manual click upload</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker display shelf */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 right-4 bg-slate-800 border border-slate-700 p-2.5 rounded-2xl flex justify-center gap-2 flex-wrap shadow-xl z-20">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="w-9 h-9 text-lg hover:bg-slate-700 rounded-xl transition-all active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Chat Room bottom input container */}
      {room.type === 'channel' && !room.isJoined ? (
        /* Channel not joined bar */
        <div className="px-4 py-4 bg-slate-850 border-t border-slate-700 flex justify-center text-center">
          <button
            onClick={() => onJoinLeaveRoom(room.id)}
            className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
            id="btn-subscribe-channel"
          >
            <Radio className="w-4 h-4" />
            {t.joinRoom}
          </button>
        </div>
      ) : room.type === 'channel' && room.isJoined ? (
        /* Channel joined but reads only - WITH GIFT ACTION FOR IMO STYLE SUPPORT! */
        <div className="px-4 py-3.5 bg-slate-850 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 font-medium text-center sm:text-right">
            📢 {lang === 'fa' ? 'فقط ادمین می‌تواند پیام ارسال کند. اما می‌توانید از کانال حمایت کنید!' : 'Only admins can post messages, but you can send a gift to support!'}
          </div>
          <button
            type="button"
            onClick={() => setShowGiftModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/10 transition-all transform active:scale-95"
            id="btn-channel-gift"
          >
            <Gift className="w-4 h-4 text-slate-950 animate-bounce" />
            {lang === 'fa' ? 'ارسال هدیه به کانال 🎁' : 'Send Gift to Channel 🎁'}
          </button>
        </div>
      ) : (
        /* Standard user chat keyboard input panel */
        <form
          onSubmit={handleSend}
          className="px-3.5 py-3 bg-slate-850 border-t border-slate-700/60 flex items-center gap-2 relative"
        >
          {/* Attachment Selector */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 transition-all shrink-0"
            title="Attach Image"
            id="btn-chat-attach"
          >
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>

          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              showEmojiPicker ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-700 hover:text-cyan-400'
            }`}
            title="Emojis"
            id="btn-chat-emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Gift Trigger Button */}
          <button
            type="button"
            onClick={() => setShowGiftModal(true)}
            className="p-2 rounded-xl transition-all shrink-0 text-amber-400 hover:bg-slate-700 hover:text-amber-300"
            title={t.sendGift}
            id="btn-chat-gift"
          >
            <Gift className="w-4 h-4 text-amber-400 animate-pulse" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={t.typeMessage}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/50 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            id="input-chat-message"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-xl shadow-lg shadow-cyan-900/20 transition-all shrink-0"
            id="btn-chat-send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Dynamic Screen-wide Full-Screen Gift Celebration Splash Overlay */}
      {activeGiftAnimation && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-center items-center z-50 pointer-events-none animate-fade-in">
          <div className="relative flex flex-col items-center">
            {/* Flying background particles */}
            <div className="absolute -top-12 animate-ping text-5xl opacity-40">✨</div>
            <div className="absolute -left-12 animate-bounce text-4xl opacity-50">🎉</div>
            <div className="absolute -right-12 animate-bounce text-4xl opacity-50" style={{ animationDelay: '0.3s' }}>✨</div>
            
            <div className="p-8 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-full shadow-2xl shadow-yellow-500/20 mb-4 transform scale-125 animate-bounce">
              <span className="text-8xl select-none leading-none block">{activeGiftAnimation.icon}</span>
            </div>
            
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-2">
              {lang === 'fa' ? 'ارسال هدیه شگفت‌انگیز!' : 'Incredible Gift Sent!'}
            </span>
            
            <h3 className="text-2xl font-black text-white text-center tracking-tight px-4 max-w-sm">
              {activeGiftAnimation.name}
            </h3>
            
            <p className="text-xs text-slate-400 mt-2 text-center">
              {lang === 'fa' 
                ? `از طرف شما به کانال/گروه تقدیم شد!` 
                : `Presented by you to the room!`}
            </p>
          </div>
        </div>
      )}

      {/* virtual Gift Selection Modal Sheet */}
      {showGiftModal && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-40" onClick={() => setShowGiftModal(false)}>
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800/85 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90%] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Gift className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">
                  {t.selectGift}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowGiftModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Diamond balance widget */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💎</span>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">{t.diamondsCount}</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    {currentUser.diamonds ?? 1000}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGiftModal(false);
                  setShowCryptoModal(true);
                  setCryptoStep('packages');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black rounded-xl text-[10.5px] transition-all active:scale-95 shadow-md shadow-amber-500/15"
              >
                <Coins className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                <span>{lang === 'fa' ? 'خرید الماس با ارز دیجیتال 🪙' : 'Buy with Crypto 🪙'}</span>
              </button>
            </div>

            {/* Grid of Gifts */}
            <div className="grid grid-cols-2 gap-3 my-1">
              {GIFTS.map((gift) => {
                const canAfford = (currentUser.diamonds ?? 1000) >= gift.cost;
                return (
                  <button
                    type="button"
                    key={gift.id}
                    onClick={() => handleGiftSendLocal(gift)}
                    className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group ${
                      canAfford 
                        ? 'bg-slate-850/60 border-slate-700/60 hover:border-amber-500/40 cursor-pointer' 
                        : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100 cursor-pointer'
                    }`}
                  >
                    {/* Floating price badge */}
                    <span className={`absolute top-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-950/90 border border-slate-800 text-[9px] font-mono font-bold text-amber-400 ${
                      isRtl ? 'left-2' : 'right-2'
                    }`}>
                      <span>💎</span>
                      <span>{gift.cost}</span>
                    </span>

                    <span className="text-4xl my-3 block select-none group-hover:scale-110 transition-transform">
                      {gift.icon}
                    </span>

                    <div className="mt-1">
                      <span className="text-xs font-bold text-slate-200 block truncate max-w-[120px]">
                        {lang === 'fa' ? gift.persianName : gift.name}
                      </span>
                    </div>

                    <div className="w-full mt-3">
                      <span className={`block w-full py-1.5 rounded-xl text-[10px] font-bold ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110'
                          : 'bg-slate-850 text-slate-400 border border-slate-700/30'
                      }`}>
                        {lang === 'fa' ? 'ارسال 🎁' : 'Send 🎁'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cryptocurrency Checkout Modal */}
      {showCryptoModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-45" onClick={() => setShowCryptoModal(false)}>
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90%] overflow-y-auto relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">
                  {lang === 'fa' ? 'درگاه پرداخت ارز دیجیتال Jazirah' : 'Jazirah Crypto Payment Gateway'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowCryptoModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper indicator */}
            {cryptoStep !== 'success' && (
              <div className="flex items-center justify-between px-2 py-1 bg-slate-950/40 rounded-xl text-[10px] text-slate-400 font-bold border border-slate-800/80">
                <span className={cryptoStep === 'packages' ? 'text-amber-400' : ''}>
                  {lang === 'fa' ? '۱. انتخاب بسته' : '1. Package'}
                </span>
                <span className="opacity-40">➔</span>
                <span className={cryptoStep === 'crypto' ? 'text-amber-400' : ''}>
                  {lang === 'fa' ? '۲. انتخاب ارز' : '2. Crypto'}
                </span>
                <span className="opacity-40">➔</span>
                <span className={(cryptoStep === 'pay' || cryptoStep === 'verifying') ? 'text-amber-400' : ''}>
                  {lang === 'fa' ? '۳. پرداخت و تایید' : '3. Confirm'}
                </span>
              </div>
            )}

            {/* STEP 1: PACKAGES */}
            {cryptoStep === 'packages' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {lang === 'fa' 
                    ? 'بسته الماس مورد نظر خود را انتخاب کنید تا فرآیند خرید آغاز شود:' 
                    : 'Select a diamond package to initiate the purchase:'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {DIAMOND_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setCryptoStep('crypto');
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 hover:bg-slate-950/80 transition-all duration-200 text-right group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl animate-bounce">💎</span>
                        <div>
                          <span className="text-xs font-black text-slate-100 block">
                            {pkg.diamonds} {lang === 'fa' ? 'الماس' : 'Diamonds'}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {lang === 'fa' ? 'شارژ فوری حساب' : 'Instant Account Credit'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-400">
                          ${pkg.price} USD
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">➔</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT CRYPTO */}
            {cryptoStep === 'crypto' && selectedPackage && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>{lang === 'fa' ? 'بسته انتخاب شده:' : 'Selected Bundle:'}</span>
                  <span className="font-bold text-amber-400 font-mono">💎 {selectedPackage.diamonds} (${selectedPackage.price} USD)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed text-center mt-1">
                  {lang === 'fa' 
                    ? 'کدام رمز ارز را برای پرداخت ترجیح می‌دهید؟' 
                    : 'Select preferred cryptocurrency for checkout:'}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {CRYPTO_COINS.map((coin) => {
                    let cost = selectedPackage.price;
                    if (coin.id === 'btc') cost = selectedPackage.btc;
                    if (coin.id === 'eth') cost = selectedPackage.eth;
                    if (coin.id === 'trx') cost = selectedPackage.trx;
                    
                    return (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => {
                          setSelectedCrypto({
                            ...coin,
                            qrValue: coin.id === 'btc' ? `bitcoin:${coin.address}?amount=${cost}` : coin.address
                          });
                          setCryptoStep('pay');
                        }}
                        className="flex flex-col items-center p-4 rounded-2xl border border-slate-800 hover:border-cyan-500 bg-slate-950/40 hover:bg-slate-950/70 text-center transition-all group"
                      >
                        <span className="text-3xl mb-2 block">{coin.icon}</span>
                        <span className="text-xs font-bold text-slate-200 block">{coin.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block mt-1 uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-800">
                          {coin.network}
                        </span>
                        <div className="mt-3.5 w-full pt-2 border-t border-slate-800/60">
                          <span className="text-[10px] font-mono font-black text-cyan-400 block">
                            {cost} {coin.symbol}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setCryptoStep('packages')}
                  className="mt-2 text-center text-[10px] text-slate-400 hover:text-slate-200 underline font-medium"
                >
                  {lang === 'fa' ? 'بازگشت به انتخاب بسته‌ها' : 'Back to bundles'}
                </button>
              </div>
            )}

            {/* STEP 3: PAYING */}
            {cryptoStep === 'pay' && selectedPackage && selectedCrypto && (
              <div className="flex flex-col gap-4">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{lang === 'fa' ? 'مبلغ کل قابل پرداخت' : 'Total Payable Amount'}</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">
                      {selectedCrypto.id === 'btc' && selectedPackage.btc}
                      {selectedCrypto.id === 'eth' && selectedPackage.eth}
                      {selectedCrypto.id === 'trx' && selectedPackage.trx}
                      {selectedCrypto.id === 'usdt' && selectedPackage.usdt} {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">{lang === 'fa' ? 'بسته انتخابی' : 'Bundle'}</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">💎 {selectedPackage.diamonds}</span>
                  </div>
                </div>

                {/* QR Code section */}
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-white rounded-2xl border-4 border-slate-800 shadow-xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedCrypto.qrValue)}`} 
                      alt="Wallet Address QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    QR Code for {selectedCrypto.name} ({selectedCrypto.network})
                  </span>
                </div>

                {/* Wallet Address Copy section */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block px-1">
                    {lang === 'fa' ? 'آدرس کیف پول واریز (شبکه بلاک‌چین)' : 'Deposit Wallet Address'}
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono text-slate-300 truncate select-all flex-1 text-left px-1" dir="ltr">
                      {selectedCrypto.address}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCrypto.address);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1.5 bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-cyan-300 rounded-lg transition-all"
                      title="Copy Address"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[9px] text-emerald-400 font-bold block text-center animate-pulse">
                      {lang === 'fa' ? 'آدرس با موفقیت کپی شد!' : 'Wallet address copied successfully!'}
                    </span>
                  )}
                </div>

                {/* Action CTA */}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCryptoStep('verifying');
                      // Simulate Blockchain network transaction scan
                      setTimeout(() => {
                        if (onAddDiamonds && selectedPackage) {
                          onAddDiamonds(selectedPackage.diamonds);
                        }
                        setCryptoStep('success');
                        
                        try {
                          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const osc = audioCtx.createOscillator();
                          const gainNode = audioCtx.createGain();
                          osc.connect(gainNode);
                          gainNode.connect(audioCtx.destination);
                          osc.type = 'triangle';
                          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
                          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); 
                          osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); 
                          osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.45); 
                          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
                          osc.start();
                          osc.stop(audioCtx.currentTime + 0.8);
                        } catch (err) {}
                      }, 4000);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    <span>{lang === 'fa' ? 'پرداخت را انجام دادم (تایید تراکنش)' : 'I Have Transferred (Verify Deposit)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCryptoStep('crypto')}
                    className="text-center text-[10px] text-slate-500 hover:text-slate-300 underline font-medium"
                  >
                    {lang === 'fa' ? 'تغییر ارز انتخابی' : 'Change crypto token'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: VERIFYING */}
            {cryptoStep === 'verifying' && selectedPackage && selectedCrypto && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    ⚙️
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-100">
                    {lang === 'fa' ? 'در حال تایید در شبکه بلاک‌چین...' : 'Confirming on the Blockchain ledger...'}
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    {lang === 'fa' 
                      ? 'سیستم در حال اسکن ممپول و بلاک‌های جدید جهت یافتن تراکنش واریز شما می‌باشد. لطفا صبر کنید...' 
                      : 'Our nodes are scanning the network mempool for your deposit transaction. Please wait...'}
                  </p>
                </div>

                {/* Mock logs */}
                <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-left font-mono text-[9px] text-cyan-400/80 space-y-1">
                  <div className="flex justify-between">
                    <span>[SYS] Node status:</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div>[SCAN] Deposit search on network to: {selectedCrypto.address.substring(0, 10)}...</div>
                  <div className="animate-pulse">[INFO] Mempool scanned, confirming Block height...</div>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {cryptoStep === 'success' && selectedPackage && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-4 animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 animate-bounce">
                  🎉
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-emerald-400">
                    {lang === 'fa' ? 'پرداخت با موفقیت تایید شد!' : 'Payment Verified Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                    {lang === 'fa' 
                      ? `بلاک‌چین تراکنش را تایید کرد! تعداد ${selectedPackage.diamonds} الماس به حساب شما اضافه گردید.` 
                      : `The blockchain validated your TX! ${selectedPackage.diamonds} Diamonds added directly to your balance.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCryptoModal(false);
                  }}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  {lang === 'fa' ? 'بسیار عالی (بازگشت به چت)' : 'Awesome (Back to chat)'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
