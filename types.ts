/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomType = 'chat' | 'group' | 'channel';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string; // ISO String
  type: 'text' | 'system' | 'image' | 'call' | 'gift';
  duration?: number; // for finished calls
  imageUrl?: string;
  giftInfo?: {
    id: string;
    name: string;
    persianName: string;
    icon: string;
    cost: number;
    color: string;
    animation: string;
  };
}

export interface Room {
  id: string;
  name: string;
  persianName: string;
  type: RoomType;
  description: string;
  persianDescription: string;
  avatar: string;
  unreadCount: number;
  isJoined?: boolean;
  messages: Message[];
  isBotRoom?: boolean;
  botBehavior?: string; // e.g., 'echo', 'echo-fa', 'news', 'support'
}

export interface Contact {
  id: string;
  name: string;
  persianName: string;
  phone: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  bio?: string;
  persianBio?: string;
  isBot?: boolean;
}

export interface CallState {
  type: 'voice' | 'video' | null;
  status: 'dialing' | 'ringing' | 'connected' | null;
  direction: 'incoming' | 'outgoing' | null;
  roomId: string | null;
  participantId: string | null;
  duration: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  language: 'fa' | 'en';
  gender?: 'male' | 'female' | 'other' | '';
  diamonds?: number;
}
