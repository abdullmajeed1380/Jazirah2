/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dictionary {
  appName: string;
  slogan: string;
  language: string;
  persian: string;
  english: string;
  direction: 'rtl' | 'ltr';
  phone: string;
  email: string;
  name: string;
  register: string;
  login: string;
  logout: string;
  profilePic: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  welcome: string;
  chats: string;
  groups: string;
  channels: string;
  contacts: string;
  settings: string;
  searchPlaceholder: string;
  typeMessage: string;
  send: string;
  voiceCall: string;
  videoCall: string;
  incomingCall: string;
  outgoingCall: string;
  ringing: string;
  connected: string;
  dialing: string;
  callDuration: string;
  endCall: string;
  profileSettings: string;
  changeLanguage: string;
  statusOnline: string;
  statusOffline: string;
  statusBusy: string;
  joinRoom: string;
  leaveRoom: string;
  createGroup: string;
  createChannel: string;
  groupName: string;
  channelName: string;
  description: string;
  create: string;
  noRooms: string;
  noMessages: string;
  phoneNumberRequired: string;
  emailRequired: string;
  nameRequired: string;
  selectAvatar: string;
  simulatedCall: string;
  cameraAccessDenied: string;
  cameraAccessGranted: string;
  micAccessGranted: string;
  mute: string;
  unmute: string;
  cameraOn: string;
  cameraOff: string;
  choosePreset: string;
  members: string;
  subscribers: string;
  creator: string;
  aboutJazirah: string;
  credits: string;
  aboutText: string;
  sendGift: string;
  selectGift: string;
  diamondsCount: string;
  insufficientDiamonds: string;
  giftSentMessage: string;
  addDiamonds: string;
  giftRose: string;
  giftDiamond: string;
  giftCar: string;
  giftYacht: string;
  giftCrown: string;
  giftCastle: string;
}

export const translations: Record<'fa' | 'en', Dictionary> = {
  fa: {
    appName: "JAZIRAH",
    slogan: "جزیره - چت، گروه، کانال و تماس صوتی و تصویری رایگان",
    language: "زبان",
    persian: "فارسی",
    english: "English",
    direction: "rtl",
    phone: "شماره تلفن",
    email: "آدرس ایمیل",
    name: "نام و نام خانوادگی",
    register: "ثبت نام در جزیره",
    login: "ورود",
    logout: "خروج از حساب",
    profilePic: "تصویر پروفایل",
    gender: "جنسیت",
    male: "مرد",
    female: "زن",
    other: "سایر",
    welcome: "به جزیره خوش آمدید!",
    chats: "گفتگوها",
    groups: "گروه‌ها",
    channels: "کانال‌ها",
    contacts: "مخاطبین",
    settings: "تنظیمات",
    searchPlaceholder: "جستجو در پیام‌ها، گروه‌ها و مخاطبین...",
    typeMessage: "پیام خود را بنویسید...",
    send: "ارسال",
    voiceCall: "تماس صوتی",
    videoCall: "تماس تصویری",
    incomingCall: "تماس ورودی",
    outgoingCall: "تماس خروجی",
    ringing: "در حال زنگ خوردن...",
    connected: "متصل شد",
    dialing: "در حال شماره‌گیری...",
    callDuration: "مدت تماس",
    endCall: "قطع تماس",
    profileSettings: "تنظیمات پروفایل",
    changeLanguage: "تغییر زبان",
    statusOnline: "آنلاین",
    statusOffline: "آفلاین",
    statusBusy: "مشغول",
    joinRoom: "عضویت",
    leaveRoom: "ترک کردن",
    createGroup: "ایجاد گروه جدید",
    createChannel: "ایجاد کانال جدید",
    groupName: "نام گروه",
    channelName: "نام کانال",
    description: "توضیحات",
    create: "ایجاد",
    noRooms: "آیتمی برای نمایش وجود ندارد",
    noMessages: "پیامی وجود ندارد. اولین پیام را ارسال کنید!",
    phoneNumberRequired: "وارد کردن شماره تلفن الزامی است",
    emailRequired: "وارد کردن آدرس ایمیل الزامی است",
    nameRequired: "وارد کردن نام الزامی است",
    selectAvatar: "انتخاب آواتار",
    simulatedCall: "برقراری تماس مستقیم و رمزگذاری شده دوطرفه (نیازمند دسترسی دوربین/میکروفون)",
    cameraAccessDenied: "دسترسی به دوربین داده نشد، از تصویر پیش‌فرض استفاده می‌شود.",
    cameraAccessGranted: "دوربین فعال شد",
    micAccessGranted: "میکروفون فعال شد",
    mute: "بی‌صدا",
    unmute: "صدا دار",
    cameraOn: "دوربین روشن",
    cameraOff: "دوربین خاموش",
    choosePreset: "انتخاب تصویر آماده",
    members: "عضو",
    subscribers: "دنبال کننده",
    creator: "سازنده",
    aboutJazirah: "درباره جزیره",
    credits: "توسعه یافته برای ارتباطات ایمن و سریع",
    aboutText: "جزیره یک پلتفرم ارتباطی پیشرفته شبیه به imo است که به شما امکان می‌دهد به زبان‌های فارسی و انگلیسی چت کنید، گروه‌ها و کانال‌های متنوع بسازید و تماس‌های صوتی و تصویری با کیفیت بالا برقرار کنید.",
    sendGift: "ارسال هدیه",
    selectGift: "انتخاب هدیه برای ارسال",
    diamondsCount: "الماس‌های من",
    insufficientDiamonds: "الماس کافی ندارید! ۱۰۰ الماس رایگان به حساب شما اضافه شد.",
    giftSentMessage: "یک هدیه زیبا ارسال کرد!",
    addDiamonds: "دریافت الماس رایگان",
    giftRose: "شاخه گل سرخ",
    giftDiamond: "الماس درخشان",
    giftCar: "ماشین اسپرت",
    giftYacht: "کشتی تفریحی",
    giftCrown: "تاج پادشاهی",
    giftCastle: "قلعه جادویی"
  },
  en: {
    appName: "JAZIRAH",
    slogan: "Jazirah - Free Chats, Groups, Channels & Video/Voice Calls",
    language: "Language",
    persian: "فارسی",
    english: "English",
    direction: "ltr",
    phone: "Phone Number",
    email: "Email Address",
    name: "Full Name",
    register: "Register on Jazirah",
    login: "Login",
    logout: "Logout",
    profilePic: "Profile Picture",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    welcome: "Welcome to Jazirah!",
    chats: "Chats",
    groups: "Groups",
    channels: "Channels",
    contacts: "Contacts",
    settings: "Settings",
    searchPlaceholder: "Search chats, groups, channels, contacts...",
    typeMessage: "Type a message...",
    send: "Send",
    voiceCall: "Voice Call",
    videoCall: "Video Call",
    incomingCall: "Incoming Call",
    outgoingCall: "Outgoing Call",
    ringing: "Ringing...",
    connected: "Connected",
    dialing: "Dialing...",
    callDuration: "Call Duration",
    endCall: "End Call",
    profileSettings: "Profile Settings",
    changeLanguage: "Change Language",
    statusOnline: "Online",
    statusOffline: "Offline",
    statusBusy: "Busy",
    joinRoom: "Join",
    leaveRoom: "Leave",
    createGroup: "Create New Group",
    createChannel: "Create New Channel",
    groupName: "Group Name",
    channelName: "Channel Name",
    description: "Description",
    create: "Create",
    noRooms: "No items to display",
    noMessages: "No messages yet. Say hello!",
    phoneNumberRequired: "Phone number is required",
    emailRequired: "Email address is required",
    nameRequired: "Full Name is required",
    selectAvatar: "Select Avatar",
    simulatedCall: "Direct End-to-End Encrypted Calling (Requires Camera/Mic Permissions)",
    cameraAccessDenied: "Camera access denied, fallback active.",
    cameraAccessGranted: "Camera enabled",
    micAccessGranted: "Microphone enabled",
    mute: "Mute",
    unmute: "Unmute",
    cameraOn: "Camera On",
    cameraOff: "Camera Off",
    choosePreset: "Choose Preset Image",
    members: "members",
    subscribers: "subscribers",
    creator: "Creator",
    aboutJazirah: "About Jazirah",
    credits: "Developed for secure and fast communication",
    aboutText: "Jazirah is an advanced communication platform similar to imo, allowing you to chat in English & Persian, build groups and channels, and enjoy high-quality interactive voice/video calls.",
    sendGift: "Send Gift",
    selectGift: "Select a Gift to Send",
    diamondsCount: "My Diamonds",
    insufficientDiamonds: "Not enough diamonds! 100 free diamonds added to your account.",
    giftSentMessage: "sent a beautiful gift!",
    addDiamonds: "Get Free Diamonds",
    giftRose: "Red Rose",
    giftDiamond: "Shiny Diamond",
    giftCar: "Sports Car",
    giftYacht: "Luxury Yacht",
    giftCrown: "Royal Crown",
    giftCastle: "Magic Castle"
  }
};
