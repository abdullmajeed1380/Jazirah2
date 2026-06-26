/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { translations } from '../lib/translations';
import { audio } from '../lib/audio';
import { CallState, Contact } from '../types';

interface CallScreenProps {
  callState: CallState;
  contact: Contact;
  lang: 'fa' | 'en';
  onEndCall: (duration: number) => void;
  onAcceptCall?: () => void;
}

export default function CallScreen({ callState, contact, lang, onEndCall, onAcceptCall }: CallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(callState.type === 'video');
  const [duration, setDuration] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  const t = translations[lang];
  const isRtl = t.direction === 'rtl';

  // Format call duration to MM:SS
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Sound Engine handler
  useEffect(() => {
    if (callState.status === 'dialing') {
      audio.playOutgoingRing();
    } else if (callState.status === 'ringing') {
      audio.playIncomingRing();
    } else if (callState.status === 'connected') {
      audio.stop();
      audio.playConnectBeep();
      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      audio.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.status]);

  // Camera stream handler
  useEffect(() => {
    if (callState.type === 'video' && isCameraOn && callState.status === 'connected') {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCameraError(false);
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraError(true);
        });
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [callState.type, isCameraOn, callState.status]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // inverse since state hasn't updated yet
      });
    }
  };

  const handleHangUp = () => {
    stopCamera();
    onEndCall(duration);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-none font-sans text-white overflow-hidden" id="call-screen">
      {/* Dynamic BG effects */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
        callState.status === 'connected' ? 'bg-cyan-500 animate-pulse' : 'bg-amber-500 animate-bounce'
      }`}></div>

      {/* Top bar */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
            {callState.type === 'video' ? t.videoCall : t.voiceCall}
          </span>
        </div>
        {callState.status === 'connected' && (
          <div className="bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700/50 text-xs font-mono tracking-widest text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* Main Calling Content */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 text-center py-4">
        <div className="relative mb-6">
          {/* Avatar visual loops */}
          <div className={`absolute -inset-4 rounded-full border-2 border-cyan-500/30 animate-ping opacity-70 ${
            callState.status === 'connected' ? 'duration-1000' : 'duration-700'
          }`}></div>
          <div className="absolute -inset-10 rounded-full border border-cyan-500/10 animate-ping opacity-40 duration-1000"></div>
          
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 relative z-10 shadow-2xl"
          />
        </div>

        <h2 className="text-2xl font-bold mb-1 tracking-tight">
          {lang === 'fa' ? contact.persianName : contact.name}
        </h2>
        <p className="text-sm text-slate-400 mb-4 font-mono">
          {lang === 'fa' ? contact.phone : contact.phone}
        </p>

        {/* Call status message */}
        <p className="text-xs text-cyan-400 font-medium tracking-wide animate-pulse">
          {callState.status === 'dialing' && t.dialing}
          {callState.status === 'ringing' && t.ringing}
          {callState.status === 'connected' && t.connected}
        </p>

        {/* Video stream box (Only for Connected Video Calls) */}
        {callState.type === 'video' && callState.status === 'connected' && (
          <div className="w-full max-w-sm mt-6 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-2xl">
            {/* Local Video Stream Pip */}
            {isCameraOn && !cameraError ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
                <AlertCircle className="w-8 h-8 mb-2 text-slate-600" />
                <span className="text-xs text-slate-400">{t.cameraAccessDenied}</span>
              </div>
            )}

            {/* Simulated Remote User Screen overlaying */}
            <div className="absolute bottom-3 right-3 w-24 h-32 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950/90 shadow-lg flex flex-col justify-center items-center">
              <img src={contact.avatar} alt="Remote" className="w-10 h-10 rounded-full object-cover mb-1.5" />
              <span className="text-[10px] text-slate-300 font-medium">{lang === 'fa' ? contact.persianName.split(' ')[0] : contact.name.split(' ')[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Call Accept/Decline action panel */}
      {callState.direction === 'incoming' && callState.status === 'ringing' ? (
        <div className="flex justify-around items-center max-w-sm mx-auto w-full py-8 z-10 bg-slate-900/40 rounded-3xl p-4 border border-slate-800">
          <button
            onClick={handleHangUp}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            id="btn-decline"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
          
          <button
            onClick={onAcceptCall}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 animate-bounce"
            id="btn-accept"
          >
            <Phone className="w-6 h-6 animate-pulse" />
          </button>
        </div>
      ) : (
        /* Outgoing or Connected Call standard button layout */
        <div className="flex flex-col items-center gap-6 z-10 py-4">
          <div className="flex items-center gap-6 bg-slate-900/60 border border-slate-800/80 px-6 py-4 rounded-3xl backdrop-blur-sm">
            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isMuted ? t.unmute : t.mute}
              id="btn-toggle-mute"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleHangUp}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-110 active:scale-95"
              title={t.endCall}
              id="btn-hang-up"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            {/* Camera Toggle Button (Only for Video type, but can toggle in voice call to promote to video call!) */}
            <button
              onClick={handleToggleCamera}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isCameraOn
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isCameraOn ? t.cameraOff : t.cameraOn}
              id="btn-toggle-camera"
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 max-w-xs text-center leading-relaxed">
            {t.simulatedCall}
          </p>
        </div>
      )}
    </div>
  );
}
