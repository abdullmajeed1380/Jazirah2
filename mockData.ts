/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Room, Message } from '../types';

// Preset avatar options for registration
export const presetAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", // Female 1
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face", // Male 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", // Female 2
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // Male 2
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", // Female 3
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", // Male 3
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", // Female 4
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face", // Male 4
];

export const defaultContacts: Contact[] = [
  {
    id: "ali",
    name: "Ali Rezaei",
    persianName: "علی رضایی",
    phone: "+989123456789",
    email: "ali@jazirah.app",
    avatar: presetAvatars[1],
    status: "online",
    bio: "Always learning, building the future of communication.",
    persianBio: "همیشه در حال یادگیری، ساختن آینده ارتباطات."
  },
  {
    id: "sarah",
    name: "Sarah Smith",
    persianName: "سارا اسمیت",
    phone: "+12025550143",
    email: "sarah@jazirah.app",
    avatar: presetAvatars[0],
    status: "online",
    bio: "Persian literature enthusiast. Let's learn together!",
    persianBio: "علاقه‌مند به ادبیات فارسی. بیایید با هم یاد بگیریم!"
  },
  {
    id: "amir",
    name: "Amir Karimi",
    persianName: "امیر کریمی",
    phone: "+989357778899",
    email: "amir@jazirah.app",
    avatar: presetAvatars[5],
    status: "online",
    bio: "Call me anytime for video chats or tech talks!",
    persianBio: "هر زمان برای چت ویدیویی یا گفتگوهای فنی تماس بگیرید!"
  },
  {
    id: "support",
    name: "Jazirah Bot",
    persianName: "ربات جزیره",
    phone: "+18005550100",
    email: "bot@jazirah.app",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    status: "online",
    bio: "Here to demonstrate Jazirah app features in English and Farsi.",
    persianBio: "اینجا برای نمایش قابلیت‌های برنامه جزیره به فارسی و انگلیسی.",
    isBot: true
  }
];

export const defaultRooms: Room[] = [
  {
    id: "support_chat",
    name: "Jazirah Bot Help",
    persianName: "پشتیبانی ربات جزیره",
    type: "chat",
    description: "Interactive helper bot for Jazirah features.",
    persianDescription: "ربات راهنمای تعاملی برای آشنایی با ویژگی‌های جزیره.",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    unreadCount: 1,
    isJoined: true,
    isBotRoom: true,
    botBehavior: "support",
    messages: [
      {
        id: "msg_sup_1",
        senderId: "support",
        senderName: "Jazirah Bot",
        senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
        text: "سلام! به پیام‌رسان جزیره خوش آمدید. من ربات راهنمای شما هستم. می‌توانید با من گفتگو کنید یا تماس صوتی و تصویری برقرار کنید تا سیستم پیشرفته تماس را آزمایش کنید!\n\nHi! Welcome to Jazirah Messenger. I am your helper bot. You can chat with me or make simulated voice & video calls to test our calling engine!",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "ali_chat",
    name: "Ali Rezaei",
    persianName: "علی رضایی",
    type: "chat",
    description: "Direct Chat with Ali.",
    persianDescription: "گفتگوی مستقیم با علی.",
    avatar: presetAvatars[1],
    unreadCount: 0,
    isJoined: true,
    isBotRoom: true,
    botBehavior: "echo-fa",
    messages: [
      {
        id: "msg_ali_1",
        senderId: "ali",
        senderName: "Ali Rezaei",
        senderAvatar: presetAvatars[1],
        text: "سلام دوست من! برنامه جزیره فوق‌العاده طراحی شده است. به خصوص منوی دو زبانه و سرعت بالای پیام‌رسانی آن. تماس‌های تصویری را تست کردی؟",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "sarah_chat",
    name: "Sarah Smith",
    persianName: "سارا اسمیت",
    type: "chat",
    description: "Direct Chat with Sarah.",
    persianDescription: "گفتگوی مستقیم با سارا.",
    avatar: presetAvatars[0],
    unreadCount: 0,
    isJoined: true,
    isBotRoom: true,
    botBehavior: "echo",
    messages: [
      {
        id: "msg_sar_1",
        senderId: "sarah",
        senderName: "Sarah Smith",
        senderAvatar: presetAvatars[0],
        text: "Hello! Jazirah chat has a very beautiful user interface, just like imo. How do you like the dual English and Persian translation?",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "dev_group",
    name: "Jazirah Developers",
    persianName: "توسعه‌دهندگان جزیره",
    type: "group",
    description: "Official tech discussions and community updates.",
    persianDescription: "گفتگوهای رسمی فنی و بروزرسانی‌های جامعه برنامه نویسان.",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
    unreadCount: 2,
    isJoined: true,
    messages: [
      {
        id: "msg_dev_1",
        senderId: "ali",
        senderName: "Ali Rezaei",
        senderAvatar: presetAvatars[1],
        text: "من در حال توسعه قابلیت تماس صوتی با استفاده از شبیه‌ساز صوتی هستم. افکت‌های صوتی تماس عالی کار می‌کنند!",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        type: "text"
      },
      {
        id: "msg_dev_2",
        senderId: "sarah",
        senderName: "Sarah Smith",
        senderAvatar: presetAvatars[0],
        text: "That is awesome, Ali! I really love how we can switch between English and Persian without any delay. It supports full RTL layouts.",
        timestamp: new Date(Date.now() - 17000000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "family_group",
    name: "Family Island 🌴",
    persianName: "جزیره خانوادگی 🌴",
    type: "group",
    description: "Keep in touch with family members.",
    persianDescription: "ارتباط با اعضای خانواده و بستگان.",
    avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&h=150&fit=crop",
    unreadCount: 0,
    isJoined: false,
    messages: [
      {
        id: "msg_fam_1",
        senderId: "amir",
        senderName: "Amir Karimi",
        senderAvatar: presetAvatars[5],
        text: "سلام به همگی! امیدوارم حالتون خوب باشه. این گروه خانوادگی ما در برنامه جزیره هست.",
        timestamp: new Date(Date.now() - 25000000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "news_channel",
    name: "Jazirah News Channel",
    persianName: "کانال اخبار جزیره",
    type: "channel",
    description: "Latest official news, announcements, and features releases.",
    persianDescription: "آخرین اخبار رسمی، اطلاعیه‌ها و ویژگی‌های منتشر شده.",
    avatar: "https://images.unsplash.com/photo-1495020689067-958852a6565d?w=150&h=150&fit=crop",
    unreadCount: 0,
    isJoined: true,
    messages: [
      {
        id: "msg_news_1",
        senderId: "support",
        senderName: "Channel Admin",
        senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
        text: "📢 به کانال رسمی جزیره خوش آمدید!\n\nنسخه جدید پلتفرم چت و تماس جزیره منتشر شد:\n- پشتیبانی کامل از زبان‌های شیرین فارسی و انگلیسی\n- ثبت نام سریع با شماره تلفن و ایمیل\n- سیستم شبیه‌ساز تماس صوتی و تصویری هوشمند\n- بهینه‌سازی شده برای موبایل و دسکتاپ\n\n📢 Welcome to Jazirah Official Channel!\n\nNew version is live:\n- Full support for Persian and English\n- Fast phone and email registration\n- Rich voice and video call simulation\n- Optimized for mobile and desktop",
        timestamp: new Date(Date.now() - 40000000).toISOString(),
        type: "text"
      }
    ]
  },
  {
    id: "exchange_channel",
    name: "English - Persian Exchange",
    persianName: "تبادل زبان فارسی و انگلیسی",
    type: "channel",
    description: "Daily words, grammar, and expressions.",
    persianDescription: "کلمات روزانه، قواعد و اصطلاحات کاربردی فارسی و انگلیسی.",
    avatar: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&h=150&fit=crop",
    unreadCount: 0,
    isJoined: false,
    messages: [
      {
        id: "msg_ex_1",
        senderId: "sarah",
        senderName: "Sarah Smith",
        senderAvatar: presetAvatars[0],
        text: "💡 Word of the Day / کلمه امروز:\n\nEnglish: **Island**\nFarsi: **جزیره (Jazirah)**\n\nExample / مثال:\nEN: Jazirah is a beautiful application.\nFA: جزیره یک برنامه بسیار زیبا است.",
        timestamp: new Date(Date.now() - 50000000).toISOString(),
        type: "text"
      }
    ]
  }
];

// Returns a simulated automated reply based on the contact, room and text sent
export function getBotResponse(roomId: string, userMessage: string, lang: 'fa' | 'en'): { text: string; senderId: string; delay: number } | null {
  const normalizedText = userMessage.trim().toLowerCase();
  
  if (normalizedText.startsWith("gift_sent:")) {
    const giftId = normalizedText.split(":")[1];
    const isAli = roomId === "ali_chat";
    const isSarah = roomId === "sarah_chat";
    const senderId = isAli ? "ali" : (isSarah ? "sarah" : "support");
    
    const giftResponses: Record<string, { en: string; fa: string }> = {
      rose: {
        en: "Oh my god! Thank you so much for the beautiful Red Rose! 🌹",
        fa: "وای خدای من! خیلی ممنون بابت شاخه گل سرخ زیبا! 🌹"
      },
      diamond: {
        en: "Wow! A shiny diamond! You are so generous! 💎",
        fa: "واو! یک الماس درخشان! شما فوق‌العاده سخاوتمند هستید! 💎"
      },
      car: {
        en: "A Sports Car! Oh wow! Let's ride in style! 🏎️",
        fa: "یک ماشین اسپرت شیک! خیلی هیجان‌انگیز است! 🏎️ بریم دور دور!"
      },
      yacht: {
        en: "A Luxury Yacht! Sailing high on the Jazirah waters! 🛳️",
        fa: "یک کشتی تفریحی مجلل! روی موج‌های خروشان آب‌های جزیره در حال حرکتیم! 🛳️"
      },
      crown: {
        en: "I am crowned! Thank you for the Royal Crown! 👑 You are amazing!",
        fa: "من پادشاه شدم! ممنون بابت تاج پادشاهی زیباتون! 👑 شما بی‌نظیرید!"
      },
      castle: {
        en: "Incredible! A Magic Castle! 🏰 This is absolutely magical, thank you!",
        fa: "باورنکردنیه! یک قلعه جادویی! 🏰 این هدیه واقعا رویایی و جادوییه، سپاس فراوان!"
      }
    };
    
    const giftRes = giftResponses[giftId] || { en: "Thank you so much for the beautiful gift!", fa: "ممنون بابت هدیه زیباتون!" };
    return {
      text: lang === 'fa' ? giftRes.fa : giftRes.en,
      senderId,
      delay: 1500
    };
  }
  
  if (roomId === "support_chat") {
    // English responses
    if (lang === 'en') {
      if (normalizedText.includes("hello") || normalizedText.includes("hi")) {
        return {
          text: "Hello! Great to hear from you. How can I assist you with Jazirah today? You can try making a **Video Call** using the camera icon above!",
          senderId: "support",
          delay: 1000
        };
      }
      if (normalizedText.includes("call") || normalizedText.includes("video") || normalizedText.includes("voice")) {
        return {
          text: "To start a call, just click on the 📞 (Voice Call) or 📹 (Video Call) buttons in the top header. It opens our interactive web-calling simulator with audio feedback and actual camera support!",
          senderId: "support",
          delay: 1500
        };
      }
      if (normalizedText.includes("language") || normalizedText.includes("farsi") || normalizedText.includes("persian")) {
        return {
          text: "You can toggle the entire application's language from Persian to English in the top-right header or inside the **Settings** panel. Jazirah adapts its design to right-to-left (RTL) for Persian and left-to-right (LTR) for English!",
          senderId: "support",
          delay: 1200
        };
      }
      return {
        text: "Thank you for trying out Jazirah! I am fully interactive. If you write in Farsi, I will reply in Farsi. Try typing 'سلام' or asking about our group chats!",
        senderId: "support",
        delay: 1500
      };
    } else {
      // Persian responses
      if (normalizedText.includes("سلام") || normalizedText.includes("درود")) {
        return {
          text: "سلام دوست عزیز! خوشحالم که به جزیره سر زدید. چطور می‌توانم به شما کمک کنم؟ شما می‌توانید دکمه‌های تماس صوتی و تصویری بالای چت را برای آزمایش شبیه‌ساز فشار دهید!",
          senderId: "support",
          delay: 1000
        };
      }
      if (normalizedText.includes("تماس") || normalizedText.includes("تصویری") || normalizedText.includes("صوتی")) {
        return {
          text: "برای شروع تماس، کافیست روی نماد 📞 (تماس صوتی) یا 📹 (تماس تصویری) در گوشه بالای صفحه چت کلیک کنید. این بخش دسترسی دوربین شما را گرفته و یک شبیه‌ساز تماس با صدای زنگ و تایمر فعال می‌کند!",
          senderId: "support",
          delay: 1500
        };
      }
      if (normalizedText.includes("زبان") || normalizedText.includes("فارسی") || normalizedText.includes("انگلیسی")) {
        return {
          text: "شما می‌توانید زبان برنامه را در بالای صفحه سمت راست یا از منوی تنظیمات تغییر دهید. ظاهر برنامه با تغییر زبان به صورت راست‌چین (RTL) یا چپ‌چین (LTR) هماهنگ می‌شود!",
          senderId: "support",
          delay: 1200
        };
      }
      return {
        text: "سپاس از پیام شما! من یک ربات هوشمند هستم. شما می‌توانید گروه‌ها و کانال‌های جدیدی نیز ایجاد کنید و با بقیه چت کنید. پیام‌های بعدی خود را بفرستید تا پاسخ دهم!",
        senderId: "support",
        delay: 1500
      };
    }
  }

  if (roomId === "ali_chat") {
    const responsesFa = [
      "بسیار عالی! چت کردن در جزیره واقعا لذت‌بخش است. 😊",
      "موافقم! من هم دارم روی توسعه جزیره کار می‌کنم. طرح‌های گرافیکی imo الهام‌بخش ما بودند.",
      "حتما! راستی تماس تصویری جزیره را با دکمه بالا امتحان کردی؟ دوربین جلو را نشان می‌دهد!",
      "چه جالب! حتماً این موضوع را به کانال اخبار جزیره هم ارسال می‌کنم.",
    ];
    return {
      text: responsesFa[Math.floor(Math.random() * responsesFa.length)],
      senderId: "ali",
      delay: 1800
    };
  }

  if (roomId === "sarah_chat") {
    const responsesEn = [
      "Wow, that's really cool! I love chatting here. 😍",
      "I agree with you. The user interface layout of Jazirah makes it so easy to stay in touch.",
      "Yes! By the way, have you tried calling me? The voice call sounds so realistic with the ringtone!",
      "Awesome! Let's keep practicing our English and Persian translation.",
    ];
    return {
      text: responsesEn[Math.floor(Math.random() * responsesEn.length)],
      senderId: "sarah",
      delay: 1800
    };
  }

  return null;
}
