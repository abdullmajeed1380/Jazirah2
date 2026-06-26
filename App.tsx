/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { translations } from './lib/translations';
import { defaultRooms, defaultContacts, getBotResponse, presetAvatars } from './lib/mockData';
import { Room, Contact, CallState, UserProfile, Message, RoomType } from './types';
import AuthScreen from './components/AuthScreen';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import CallScreen from './components/CallScreen';
import ProfileSettings from './components/ProfileSettings';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('jazirah_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.diamonds === 'undefined') {
        parsed.diamonds = 1000;
      }
      return parsed;
    }
    return null;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('jazirah_rooms');
    return saved ? JSON.parse(saved) : defaultRooms;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('jazirah_contacts');
    return saved ? JSON.parse(saved) : defaultContacts;
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(() => {
    return defaultRooms[0]?.id || null;
  });

  const [activeView, setActiveView] = useState<'chats' | 'settings'>('chats');

  const [callState, setCallState] = useState<CallState>({
    type: null,
    status: null,
    direction: null,
    roomId: null,
    participantId: null,
    duration: 0,
  });

  const callSimulationTimeoutRef = useRef<any>(null);
  const onboardingCallTimeoutRef = useRef<any>(null);

  // Sync state with localstorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jazirah_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jazirah_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jazirah_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('jazirah_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Handle automatic onboarding incoming call from a real friend/contact (NOT a bot!)
  useEffect(() => {
    if (currentUser && rooms.length > 0) {
      // Trigger a simulated incoming call from Ali Rezaei (a real contact) 15 seconds after registration
      // to demonstrate the real peer-to-peer calling system
      const hasCalls = rooms.some(room => room.messages.some(m => m.type === 'call'));
      if (!hasCalls) {
        onboardingCallTimeoutRef.current = setTimeout(() => {
          triggerIncomingCall('ali', 'video');
        }, 15000);
      }
    }

    return () => {
      if (onboardingCallTimeoutRef.current) {
        clearTimeout(onboardingCallTimeoutRef.current);
      }
      if (callSimulationTimeoutRef.current) {
        clearTimeout(callSimulationTimeoutRef.current);
      }
    };
  }, [currentUser]);

  const activeRoom = rooms.find(r => r.id === activeRoomId) || null;
  const activeLang = currentUser?.language || 'fa';
  const t = translations[activeLang];

  // Register / Onboard user
  const handleRegister = (profile: UserProfile) => {
    setCurrentUser({
      ...profile,
      diamonds: 1000
    });
    // Reset rooms and contacts to defaults or localized defaults
    setRooms(defaultRooms);
    setContacts(defaultContacts);
    setActiveRoomId(defaultRooms[0]?.id || null);
    setActiveView('chats');
  };

  // Update profile settings
  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
  };

  // Send virtual gift
  const handleSendGift = (gift: { id: string, name: string, persianName: string, icon: string, cost: number, color: string, animation: string }) => {
    if (!activeRoomId || !currentUser) return;

    const currentDiamonds = currentUser.diamonds ?? 1000;
    
    // Check if user has enough diamonds
    if (currentDiamonds < gift.cost) {
      // Award 500 free diamonds, and alert them so they can buy immediately!
      const bonus = 500;
      const updatedUser = {
        ...currentUser,
        diamonds: currentDiamonds + bonus
      };
      setCurrentUser(updatedUser);
      
      alert(activeLang === 'fa' 
        ? `الماس‌های شما کافی نیست! ۵۰۰ الماس هدیه رایگان به حساب شما اضافه شد تا بتوانید این هدیه را ارسال کنید. لطفاً دوباره کلیک کنید!` 
        : `Insufficient diamonds! 500 free diamonds have been added to your balance so you can send this gift. Please click send again!`
      );
      return;
    }

    // Deduct cost
    const updatedUser = {
      ...currentUser,
      diamonds: currentDiamonds - gift.cost
    };
    setCurrentUser(updatedUser);

    const giftMsgText = activeLang === 'fa'
      ? `هدیه "${gift.persianName}" را به گروه/کانال ارسال کرد 🎁`
      : `sent a "${gift.name}" gift to the room 🎁`;

    const newMsg: Message = {
      id: `gift_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: giftMsgText,
      timestamp: new Date().toISOString(),
      type: 'gift',
      giftInfo: gift
    };

    // Append to current room messages
    setRooms(prev => prev.map(room => {
      if (room.id === activeRoomId) {
        return {
          ...room,
          messages: [...room.messages, newMsg]
        };
      }
      return room;
    }));

    // Trigger Simulated Active Bot replies
    if (activeRoom?.isBotRoom) {
      simulateBotReply(activeRoomId, `gift_sent:${gift.id}`);
    }
  };

  // Add free diamonds
  const handleAddDiamonds = (amount: number = 200) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        diamonds: (prev.diamonds ?? 1000) + amount
      };
    });
  };

  // Logout
  const handleLogout = () => {
    if (window.confirm(activeLang === 'fa' ? 'آیا مطمئن هستید که می‌خواهید خارج شوید؟' : 'Are you sure you want to logout?')) {
      setCurrentUser(null);
      setActiveRoomId(null);
      localStorage.clear();
    }
  };

  // Select a chat room from directory list
  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setActiveView('chats');

    // Reset unread count for selected room
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, unreadCount: 0 };
      }
      return room;
    }));
  };

  // Select contact from list to chat
  const handleSelectContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Check if direct chat room already exists
    let existingRoom = rooms.find(r => r.type === 'chat' && r.id.includes(contactId));
    if (!existingRoom) {
      // Create new direct chat room
      const newRoom: Room = {
        id: `chat_${contactId}`,
        name: contact.name,
        persianName: contact.persianName,
        type: 'chat',
        description: `Direct conversation with ${contact.name}`,
        persianDescription: `گفتگوی مستقیم با ${contact.persianName}`,
        avatar: contact.avatar,
        unreadCount: 0,
        isJoined: true,
        isBotRoom: contact.isBot || contactId === 'ali' || contactId === 'sarah',
        botBehavior: contactId === 'ali' ? 'echo-fa' : (contactId === 'sarah' ? 'echo' : 'support'),
        messages: [],
      };
      setRooms(prev => [newRoom, ...prev]);
      setActiveRoomId(newRoom.id);
    } else {
      setActiveRoomId(existingRoom.id);
    }
    setActiveView('chats');
  };

  // Create a new group or channel
  const handleCreateRoom = (name: string, type: RoomType, description: string) => {
    const randomPresetImg = presetAvatars[Math.floor(Math.random() * presetAvatars.length)];
    
    const newRoom: Room = {
      id: `${type}_${Date.now()}`,
      name: name,
      persianName: name, // simplified
      type: type,
      description: description,
      persianDescription: description,
      avatar: randomPresetImg,
      unreadCount: 0,
      isJoined: true, // creator auto-joins
      messages: [
        {
          id: `sys_${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: '',
          text: activeLang === 'fa' 
            ? `📢 این ${type === 'group' ? 'گروه' : 'کانال'} توسط ${currentUser?.name} ایجاد شد.` 
            : `📢 This ${type === 'group' ? 'group' : 'channel'} was created by ${currentUser?.name}.`,
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ]
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setActiveView('chats');
  };

  // Join or Leave a Group/Channel
  const handleJoinLeaveRoom = (roomId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const nextJoined = !room.isJoined;
        
        // Append system notification message
        const sysMsg: Message = {
          id: `sys_${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: '',
          text: nextJoined
            ? (activeLang === 'fa' ? `👤 ${currentUser?.name} به ما پیوست.` : `👤 ${currentUser?.name} joined the room.`)
            : (activeLang === 'fa' ? `👤 ${currentUser?.name} گروه را ترک کرد.` : `👤 ${currentUser?.name} left the room.`),
          timestamp: new Date().toISOString(),
          type: 'text'
        };

        return {
          ...room,
          isJoined: nextJoined,
          messages: [...room.messages, sysMsg]
        };
      }
      return room;
    }));
  };

  // Send message in active room
  const handleSendMessage = (text: string, type: 'text' | 'image' = 'text', imageUrl?: string) => {
    if (!activeRoomId || !currentUser) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text,
      timestamp: new Date().toISOString(),
      type: type,
      imageUrl: imageUrl
    };

    // Append to current room messages
    setRooms(prev => prev.map(room => {
      if (room.id === activeRoomId) {
        return {
          ...room,
          messages: [...room.messages, newMsg]
        };
      }
      return room;
    }));

    // Trigger Simulated Active Bot replies
    if (activeRoom?.isBotRoom) {
      simulateBotReply(activeRoomId, text);
    }
  };

  // Bot Reply Simulation
  const simulateBotReply = (roomId: string, userText: string) => {
    const response = getBotResponse(roomId, userText, activeLang);
    if (!response) return;

    // Simulate typing delay
    setTimeout(() => {
      const contact = contacts.find(c => c.id === response.senderId) || contacts[3]; // Fallback to support bot
      const botMsg: Message = {
        id: `bot_msg_${Date.now()}`,
        senderId: response.senderId,
        senderName: activeLang === 'fa' ? contact.persianName : contact.name,
        senderAvatar: contact.avatar,
        text: response.text,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            messages: [...room.messages, botMsg],
            unreadCount: activeRoomId === roomId ? 0 : room.unreadCount + 1
          };
        }
        return room;
      }));
    }, response.delay);
  };

  // Trigger outbound calling simulation
  const handleInitiateCall = (type: 'voice' | 'video') => {
    if (!activeRoom || activeRoom.type !== 'chat') return;

    // Find the participant contact
    const participant = contacts.find(c => activeRoom.id.includes(c.id)) || contacts[0];

    // Set dialing call state
    setCallState({
      type,
      status: 'dialing',
      direction: 'outgoing',
      roomId: activeRoom.id,
      participantId: participant.id,
      duration: 0,
    });

    // Simulated Call progression: Dialing -> Ringing -> Connected
    callSimulationTimeoutRef.current = setTimeout(() => {
      setCallState(prev => {
        if (prev.status !== 'dialing') return prev;
        return { ...prev, status: 'ringing' };
      });

      // Ring for 2.5 seconds, then accept the call automatically!
      callSimulationTimeoutRef.current = setTimeout(() => {
        setCallState(prev => {
          if (prev.status !== 'ringing') return prev;
          return { ...prev, status: 'connected' };
        });
      }, 2500);

    }, 1500);
  };

  // Trigger Simulated Incoming call from sidebar (Only human contacts allowed, NOT the bot)
  const triggerIncomingCall = (contactId: string, type: 'voice' | 'video') => {
    if (callState.status) return; // already in a call
    
    // Robots/Bots are strictly forbidden from initiating calls to contacts/users!
    if (contactId === 'support') return;

    const contact = contacts.find(c => c.id === contactId) || contacts[0];
    const roomId = `chat_${contactId}`;

    setCallState({
      type,
      status: 'ringing',
      direction: 'incoming',
      roomId: roomId,
      participantId: contactId,
      duration: 0,
    });
  };

  // Accept incoming call
  const handleAcceptIncomingCall = () => {
    setCallState(prev => ({
      ...prev,
      status: 'connected',
    }));
  };

  // End active call
  const handleEndCall = (callDuration: number) => {
    if (callSimulationTimeoutRef.current) {
      clearTimeout(callSimulationTimeoutRef.current);
    }

    const { type, roomId, participantId } = callState;
    if (roomId && participantId) {
      const contact = contacts.find(c => c.id === participantId) || contacts[0];
      
      // Log call as message in chat log
      const callText = type === 'video'
        ? (activeLang === 'fa' ? '📹 تماس تصویری پایان یافت' : '📹 Video call ended')
        : (activeLang === 'fa' ? '📞 تماس صوتی پایان یافت' : '📞 Voice call ended');

      const callLogMsg: Message = {
        id: `call_${Date.now()}`,
        senderId: 'system',
        senderName: 'Call Log',
        senderAvatar: '',
        text: callText,
        timestamp: new Date().toISOString(),
        type: 'call',
        duration: callDuration,
      };

      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            messages: [...room.messages, callLogMsg]
          };
        }
        return room;
      }));
    }

    // Reset CallState
    setCallState({
      type: null,
      status: null,
      direction: null,
      roomId: null,
      participantId: null,
      duration: 0,
    });
  };

  // Active call overlay
  const callParticipant = contacts.find(c => c.id === callState.participantId) || contacts[0];

  return (
    <div className="w-full h-screen bg-slate-950 md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:from-slate-900 md:via-slate-950 md:to-slate-950 flex items-center justify-center overflow-hidden relative">
      
      {/* Decorative desktop ambient light shapes */}
      <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Modern Smartphone Mockup Frame for Desktop */}
      <div className="w-full h-full md:w-[412px] md:h-[860px] md:rounded-[55px] md:border-[12px] md:border-slate-800/90 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] md:relative md:overflow-hidden md:flex md:flex-col md:bg-slate-950 md:outline md:outline-2 md:outline-slate-700/30 transition-all z-10">
        
        {/* iPhone Style Dynamic Island / Pill for Desktop Screen */}
        <div className="hidden md:flex absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 items-center justify-between px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Inner application content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden rounded-none md:rounded-[43px] relative bg-slate-950">
          {!currentUser ? (
            <AuthScreen onRegister={handleRegister} />
          ) : (
            <div className="w-full h-full bg-slate-950 flex overflow-hidden relative select-none">
              {/* Desktop side-by-side or responsive mobile single panel */}
              <div className="flex-1 flex h-full min-w-0" style={{ direction: t.direction }}>
                {/* Directory Switcher Panel (Visible on desktop, or mobile if no active room is chosen) */}
                <div className={`${activeRoomId && activeView === 'chats' ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 h-full`}>
                  <ChatList
                    rooms={rooms}
                    contacts={contacts}
                    activeRoomId={activeRoomId}
                    currentUser={currentUser}
                    lang={activeLang}
                    onSelectRoom={handleSelectRoom}
                    onSelectContact={handleSelectContact}
                    onCreateRoom={handleCreateRoom}
                    onOpenSettings={() => setActiveView('settings')}
                    onInitiateSimulatedContactCall={(cid, ctype) => triggerIncomingCall(cid, ctype)}
                  />
                </div>

                {/* Action Panel / Right Pane (Active Chat room or Settings screen) */}
                <div className={`flex-1 flex h-full min-w-0 ${!activeRoomId && activeView === 'chats' ? 'hidden md:flex' : 'flex'}`}>
                  {activeView === 'settings' ? (
                    <ProfileSettings
                      user={currentUser}
                      lang={activeLang}
                      onUpdateUser={handleUpdateUser}
                      onLogout={handleLogout}
                      onBack={() => setActiveView('chats')}
                    />
                  ) : activeRoom ? (
                    <ChatRoom
                      room={activeRoom}
                      currentUser={currentUser}
                      lang={activeLang}
                      onSendMessage={handleSendMessage}
                      onInitiateCall={handleInitiateCall}
                      onJoinLeaveRoom={handleJoinLeaveRoom}
                      onBackToMain={() => setActiveRoomId(null)}
                      onSendGift={handleSendGift}
                      onAddDiamonds={handleAddDiamonds}
                    />
                  ) : (
                    /* Blank select state (Only shown on Desktop when no room is open) */
                    <div className="hidden md:flex flex-1 flex-col justify-center items-center text-center p-8 bg-slate-900 border-l border-slate-800 w-full h-full">
                      <div className="p-4 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl shadow-xl shadow-cyan-500/10 mb-4 animate-bounce">
                        <MessageSquare className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-sm font-bold text-slate-200 mb-1">{t.welcome}</h2>
                      <p className="text-[10px] text-slate-500 max-w-xs">{t.slogan}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Full-screen Call Screen active overlay inside frame */}
          {callState.status && (
            <CallScreen
              callState={callState}
              contact={callParticipant}
              lang={activeLang}
              onEndCall={handleEndCall}
              onAcceptCall={handleAcceptIncomingCall}
            />
          )}
        </div>

        {/* iPhone Style Bottom Home Sweep Bar for Desktop Screen */}
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-750/40 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
}
