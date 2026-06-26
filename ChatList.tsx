/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Users, Radio, User, Settings, Info, Check, X, Sparkles, Phone, Video } from 'lucide-react';
import { translations } from '../lib/translations';
import { Room, Contact, UserProfile, RoomType } from '../types';
import { presetAvatars } from '../lib/mockData';

interface ChatListProps {
  rooms: Room[];
  contacts: Contact[];
  activeRoomId: string | null;
  currentUser: UserProfile;
  lang: 'fa' | 'en';
  onSelectRoom: (roomId: string) => void;
  onSelectContact: (contactId: string) => void;
  onCreateRoom: (name: string, type: RoomType, description: string) => void;
  onOpenSettings: () => void;
  onInitiateSimulatedContactCall: (contactId: string, type: 'voice' | 'video') => void;
}

export default function ChatList({
  rooms,
  contacts,
  activeRoomId,
  currentUser,
  lang,
  onSelectRoom,
  onSelectContact,
  onCreateRoom,
  onOpenSettings,
  onInitiateSimulatedContactCall
}: ChatListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'chats' | 'groups' | 'channels' | 'contacts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState<RoomType | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const t = translations[lang];
  const isRtl = t.direction === 'rtl';

  // Filters rooms/contacts based on search and active tab
  const filteredRooms = rooms.filter(room => {
    // Tab filter
    if (activeTab === 'chats' && room.type !== 'chat') return false;
    if (activeTab === 'groups' && room.type !== 'group') return false;
    if (activeTab === 'channels' && room.type !== 'channel') return false;
    if (activeTab === 'contacts') return false; // Handled separately

    // Search filter
    const query = searchQuery.toLowerCase();
    const nameMatch = room.name.toLowerCase().includes(query) || room.persianName.includes(query);
    const msgMatch = room.messages.some(m => m.text.toLowerCase().includes(query));
    return nameMatch || msgMatch;
  });

  const filteredContacts = contacts.filter(contact => {
    if (activeTab !== 'all' && activeTab !== 'contacts') return false;
    const query = searchQuery.toLowerCase();
    return contact.name.toLowerCase().includes(query) || contact.persianName.includes(query) || contact.phone.includes(query);
  });

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !showCreateModal) return;

    onCreateRoom(newRoomName.trim(), showCreateModal, newRoomDesc.trim());
    setNewRoomName('');
    setNewRoomDesc('');
    setShowCreateModal(null);
  };

  const getRoomSubtitle = (room: Room) => {
    if (room.messages.length === 0) return t.noMessages;
    const lastMsg = room.messages[room.messages.length - 1];
    
    if (lastMsg.type === 'image') return lang === 'fa' ? '📸 تصویر پیوست شده' : '📸 Image attached';
    if (lastMsg.type === 'call') return lastMsg.text;
    
    return lastMsg.text;
  };

  const formatLastMsgTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800 font-sans" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Search Header and Profile launcher */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-white font-mono">{t.appName}</h1>
          </div>
          
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-1.5 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white group"
            id="btn-settings-toggle"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700/60"
            />
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className={`absolute inset-y-0 flex items-center text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`}>
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-xl py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
              isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'
            }`}
            id="input-chat-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 flex items-center text-slate-500 hover:text-slate-200 ${isRtl ? 'left-3' : 'right-3'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs list (All, Chats, Groups, Channels, Contacts) */}
      <div className="flex px-2 py-1 bg-slate-900 border-b border-slate-800 overflow-x-auto gap-1 select-none scrollbar-none">
        {(['all', 'chats', 'groups', 'channels', 'contacts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all uppercase shrink-0 ${
              activeTab === tab
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
            id={`tab-${tab}`}
          >
            {tab === 'all' && (lang === 'fa' ? 'همه' : 'All')}
            {tab === 'chats' && t.chats}
            {tab === 'groups' && t.groups}
            {tab === 'channels' && t.channels}
            {tab === 'contacts' && t.contacts}
          </button>
        ))}
      </div>

      {/* Scrollable Directory list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900/60">
        {/* Rooms List */}
        {activeTab !== 'contacts' && filteredRooms.map((room) => {
          const isActive = activeRoomId === room.id;
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-950/25 border-l-4 border-cyan-500'
                  : 'hover:bg-slate-900/40'
              }`}
              id={`room-item-${room.id}`}
            >
              <img
                src={room.avatar}
                alt={room.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-800"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {room.type === 'group' && <Users className="w-3 h-3 text-cyan-500 shrink-0" />}
                    {room.type === 'channel' && <Radio className="w-3 h-3 text-amber-500 shrink-0" />}
                    {lang === 'fa' ? room.persianName : room.name}
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {room.messages.length > 0 && formatLastMsgTime(room.messages[room.messages.length - 1].timestamp)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[170px] font-sans">
                    {getRoomSubtitle(room)}
                  </p>
                  {room.unreadCount > 0 && !isActive && (
                    <span className="bg-cyan-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center shadow-md shadow-cyan-950/10">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Contacts Directory */}
        {(activeTab === 'all' || activeTab === 'contacts') && (
          <div className="p-2">
            {filteredContacts.length > 0 && (
              <span className="text-[9px] font-bold text-slate-500 block px-3 py-1 uppercase tracking-wider">
                {t.contacts}
              </span>
            )}
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-900/30 transition-all group"
                id={`contact-item-${contact.id}`}
              >
                <div
                  onClick={() => onSelectContact(contact.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-800"
                    />
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                      {lang === 'fa' ? contact.persianName : contact.name}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono truncate">{contact.phone}</p>
                  </div>
                </div>

                {/* Call buttons directly inside Contacts Tab */}
                {!contact.isBot && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => onInitiateSimulatedContactCall(contact.id, 'voice')}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                      id={`btn-contact-call-${contact.id}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onInitiateSimulatedContactCall(contact.id, 'video')}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                      id={`btn-contact-video-${contact.id}`}
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredRooms.length === 0 && filteredContacts.length === 0 && (
          <div className="p-8 text-center text-slate-600 text-xs">
            {t.noRooms}
          </div>
        )}
      </div>

      {/* Directory creation footer bar (similar to imo) */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex gap-2">
        <button
          onClick={() => setShowCreateModal('group')}
          className="flex-1 bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700/50 hover:border-slate-600 py-2.5 px-3 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center justify-center gap-1"
          id="btn-trigger-create-group"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.createGroup}
        </button>
        <button
          onClick={() => setShowCreateModal('channel')}
          className="flex-1 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700/50 hover:border-slate-600 py-2.5 px-3 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center justify-center gap-1"
          id="btn-trigger-create-channel"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.createChannel}
        </button>
      </div>

      {/* Dynamic Creation Dialog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                {showCreateModal === 'group' ? <Users className="w-4 h-4 text-cyan-400" /> : <Radio className="w-4 h-4 text-amber-400" />}
                {showCreateModal === 'group' ? t.createGroup : t.createChannel}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(null);
                  setNewRoomName('');
                  setNewRoomDesc('');
                }}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
              {/* Room name inputs */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">
                  {showCreateModal === 'group' ? t.groupName : t.channelName}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'fa' ? 'مثال: اخبار تکنولوژی' : 'e.g. Technology Updates'}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  id="input-new-room-name"
                  required
                />
              </div>

              {/* Room description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">
                  {t.description}
                </label>
                <textarea
                  placeholder={lang === 'fa' ? 'توضیحات کوتاه در مورد هدف...' : 'A short purpose description...'}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all resize-none h-20"
                  id="input-new-room-desc"
                />
              </div>

              {/* Confirm submit button */}
              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all text-white ${
                  showCreateModal === 'group'
                    ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/20'
                    : 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/20'
                }`}
                id="btn-confirm-create-room"
              >
                {t.create}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
