import { useApp } from "../store/app-context";
import type { Lang } from "./types";

// Lightweight i18n: keys are the English source strings. Missing translations
// fall back to the key itself, so surfaces can be localised incrementally.
export type { Lang };

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

type Entry = Partial<Record<Lang, string>>;

// Only en-fallback is implicit; add hi/ta/te per key as surfaces are localised.
const DICT: Record<string, Entry> = {
  /* ------------------------------ Roles ------------------------------- */
  Teacher: { hi: "शिक्षक", ta: "ஆசிரியர்", te: "ఉపాధ్యాయుడు" },
  Student: { hi: "छात्र", ta: "மாணவர்", te: "విద్యార్థి" },
  Parent: { hi: "अभिभावक", ta: "பெற்றோர்", te: "తల్లిదండ్రులు" },
  "School Admin": { hi: "स्कूल व्यवस्थापक", ta: "பள்ளி நிர்வாகி", te: "పాఠశాల నిర్వాహకుడు" },
  Principal: { hi: "प्रधानाचार्य", ta: "தலைமை ஆசிரியர்", te: "ప్రధానోపాధ్యాయుడు" },
  Accountant: { hi: "लेखाकार", ta: "கணக்காளர்", te: "అకౌంటెంట్" },
  "Platform Admin": { hi: "प्लेटफ़ॉर्म व्यवस्थापक", ta: "தள நிர்வாகி", te: "ప్లాట్‌ఫారం నిర్వాహకుడు" },

  /* --------------------------- Navigation ----------------------------- */
  Home: { hi: "होम", ta: "முகப்பு", te: "హోమ్" },
  "My Classes": { hi: "मेरी कक्षाएँ", ta: "எனது வகுப்புகள்", te: "నా తరగతులు" },
  Attendance: { hi: "उपस्थिति", ta: "வருகை", te: "హాజరు" },
  Learning: { hi: "अधिगम", ta: "கற்றல்", te: "అభ్యాసం" },
  Assessments: { hi: "मूल्यांकन", ta: "மதிப்பீடுகள்", te: "మూల్యాంకనాలు" },
  Messages: { hi: "संदेश", ta: "செய்திகள்", te: "సందేశాలు" },
  More: { hi: "और", ta: "மேலும்", te: "మరిన్ని" },
  Learn: { hi: "सीखें", ta: "கற்க", te: "నేర్చుకో" },
  Tasks: { hi: "कार्य", ta: "பணிகள்", te: "పనులు" },
  Timetable: { hi: "समय-सारिणी", ta: "கால அட்டவணை", te: "టైమ్‌టేబుల్" },
  Results: { hi: "परिणाम", ta: "முடிவுகள்", te: "ఫలితాలు" },
  Child: { hi: "बच्चा", ta: "குழந்தை", te: "పిల్లవాడు" },
  Fees: { hi: "शुल्क", ta: "கட்டணம்", te: "ఫీజులు" },
  People: { hi: "लोग", ta: "நபர்கள்", te: "వ్యక్తులు" },
  Academics: { hi: "शैक्षणिक", ta: "கல்வி", te: "విద్యా విషయాలు" },
  Operations: { hi: "संचालन", ta: "செயல்பாடுகள்", te: "కార్యకలాపాలు" },
  Communication: { hi: "संचार", ta: "தொடர்பு", te: "సమాచారం" },
  Reports: { hi: "रिपोर्ट", ta: "அறிக்கைகள்", te: "నివేదికలు" },
  Settings: { hi: "सेटिंग्स", ta: "அமைப்புகள்", te: "సెట్టింగ్‌లు" },
  Students: { hi: "छात्र", ta: "மாணவர்கள்", te: "విద్యార్థులు" },
  Staff: { hi: "स्टाफ़", ta: "பணியாளர்கள்", te: "సిబ్బంది" },
  Finance: { hi: "वित्त", ta: "நிதி", te: "ఆర్థికం" },
  Approvals: { hi: "अनुमोदन", ta: "ஒப்புதல்கள்", te: "ఆమోదాలు" },
  Payments: { hi: "भुगतान", ta: "கட்டணங்கள்", te: "చెల్లింపులు" },
  Reconciliation: { hi: "समाधान", ta: "சரிசெய்தல்", te: "సమన్వయం" },
  Schools: { hi: "स्कूल", ta: "பள்ளிகள்", te: "పాఠశాలలు" },
  Plans: { hi: "योजनाएँ", ta: "திட்டங்கள்", te: "ప్రణాళికలు" },
  Support: { hi: "सहायता", ta: "ஆதரவு", te: "మద్దతు" },

  /* ------------------------------ Shell ------------------------------- */
  "School Management": { hi: "स्कूल प्रबंधन", ta: "பள்ளி மேலாண்மை", te: "పాఠశాల నిర్వహణ" },
  "Profile & Preferences": { hi: "प्रोफ़ाइल और प्राथमिकताएँ", ta: "சுயவிவரம் & விருப்பங்கள்", te: "ప్రొఫైల్ & ప్రాధాన్యతలు" },
  Profile: { hi: "प्रोफ़ाइल", ta: "சுயவிவரம்", te: "ప్రొఫైల్" },
  Preferences: { hi: "प्राथमिकताएँ", ta: "விருப்பங்கள்", te: "ప్రాధాన్యతలు" },
  "Sign out": { hi: "साइन आउट", ta: "வெளியேறு", te: "సైన్ అవుట్" },
  "You are offline. Attendance and drafts are saved on this device and will sync when you reconnect.": {
    hi: "आप ऑफ़लाइन हैं। उपस्थिति और ड्राफ़्ट इस डिवाइस पर सहेजे गए हैं और दोबारा कनेक्ट होने पर सिंक होंगे।",
    ta: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். வருகை மற்றும் வரைவுகள் இந்தச் சாதனத்தில் சேமிக்கப்பட்டு, மீண்டும் இணைந்ததும் ஒத்திசைக்கப்படும்.",
    te: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. హాజరు మరియు డ్రాఫ్ట్‌లు ఈ పరికరంలో సేవ్ చేయబడ్డాయి, మళ్లీ కనెక్ట్ అయినప్పుడు సింక్ అవుతాయి.",
  },

  /* ----------------------------- Sign-in ------------------------------ */
  "Sign in to SMLS": { hi: "SMLS में साइन इन करें", ta: "SMLS இல் உள்நுழையவும்", te: "SMLS లో సైన్ ఇన్ చేయండి" },
  "Email or phone": { hi: "ईमेल या फ़ोन", ta: "மின்னஞ்சல் அல்லது தொலைபேசி", te: "ఇమెయిల్ లేదా ఫోన్" },
  Password: { hi: "पासवर्ड", ta: "கடவுச்சொல்", te: "పాస్‌వర్డ్" },
  "Forgot?": { hi: "भूल गए?", ta: "மறந்துவிட்டதா?", te: "మర్చిపోయారా?" },
  "Sign In": { hi: "साइन इन", ta: "உள்நுழை", te: "సైన్ ఇన్" },
  or: { hi: "या", ta: "அல்லது", te: "లేదా" },
  "Continue with SSO": { hi: "SSO से जारी रखें", ta: "SSO உடன் தொடரவும்", te: "SSO తో కొనసాగించండి" },
  "A teacher who can use WhatsApp can use SMLS. Need help?": {
    hi: "जो शिक्षक WhatsApp चला सकता है, वह SMLS चला सकता है। मदद चाहिए?",
    ta: "WhatsApp பயன்படுத்தத் தெரிந்த ஆசிரியர் SMLS ஐப் பயன்படுத்தலாம். உதவி வேண்டுமா?",
    te: "WhatsApp వాడగలిగే ఉపాధ్యాయుడు SMLS వాడగలరు. సహాయం కావాలా?",
  },
  "Contact your school": { hi: "अपने स्कूल से संपर्क करें", ta: "உங்கள் பள்ளியைத் தொடர்பு கொள்ளவும்", te: "మీ పాఠశాలను సంప్రదించండి" },

  /* ---------------------------- Dashboards ---------------------------- */
  "Good morning": { hi: "सुप्रभात", ta: "காலை வணக்கம்", te: "శుభోదయం" },
  "Take Attendance": { hi: "उपस्थिति लें", ta: "வருகை எடு", te: "హాజరు తీసుకోండి" },
  "Assign Homework": { hi: "गृहकार्य दें", ta: "வீட்டுப்பாடம் ஒதுக்கு", te: "హోంవర్క్ ఇవ్వండి" },
  "Enter Marks": { hi: "अंक दर्ज करें", ta: "மதிப்பெண்களை உள்ளிடு", te: "మార్కులు నమోదు చేయండి" },
  "Today's classes": { hi: "आज की कक्षाएँ", ta: "இன்றைய வகுப்புகள்", te: "నేటి తరగతులు" },
  Announcements: { hi: "घोषणाएँ", ta: "அறிவிப்புகள்", te: "ప్రకటనలు" },
  "View all": { hi: "सभी देखें", ta: "அனைத்தையும் காண்க", te: "అన్నీ చూడండి" },
  "Pending grading": { hi: "लंबित मूल्यांकन", ta: "நிலுவையில் உள்ள மதிப்பீடு", te: "పెండింగ్ గ్రేడింగ్" },
  Grade: { hi: "मूल्यांकन", ta: "மதிப்பிடு", te: "గ్రేడ్" },
  "Take attendance": { hi: "उपस्थिति लें", ta: "வருகை எடு", te: "హాజరు తీసుకోండి" },
  "Attendance done": { hi: "उपस्थिति पूर्ण", ta: "வருகை முடிந்தது", te: "హాజరు పూర్తయింది" },
  "Continue Learning": { hi: "सीखना जारी रखें", ta: "கற்றலைத் தொடரவும்", te: "అభ్యాసం కొనసాగించండి" },
  "View Tasks": { hi: "कार्य देखें", ta: "பணிகளைக் காண்க", te: "పనులు చూడండి" },
  "Due tasks": { hi: "देय कार्य", ta: "நிலுவைப் பணிகள்", te: "గడువు పనులు" },
  "Next class": { hi: "अगली कक्षा", ta: "அடுத்த வகுப்பு", te: "తదుపరి తరగతి" },
  Open: { hi: "खोलें", ta: "திற", te: "తెరవండి" },
  Overdue: { hi: "अतिदेय", ta: "தாமதமானது", te: "గడువు మించింది" },
  Due: { hi: "देय", ta: "நிலுவை", te: "గడువు" },
  Upcoming: { hi: "आगामी", ta: "வரவிருக்கும்", te: "రాబోయే" },
  "Welcome back": { hi: "वापसी पर स्वागत है", ta: "மீண்டும் வரவேற்கிறோம்", te: "తిరిగి స్వాగతం" },
  "Your family's important updates": { hi: "आपके परिवार के महत्वपूर्ण अपडेट", ta: "உங்கள் குடும்பத்தின் முக்கிய புதுப்பிப்புகள்", te: "మీ కుటుంబం యొక్క ముఖ్యమైన నవీకరణలు" },
  "Needs your attention": { hi: "आपके ध्यान की आवश्यकता", ta: "உங்கள் கவனம் தேவை", te: "మీ దృష్టి అవసరం" },
  "Pay Fees": { hi: "शुल्क भुगतान करें", ta: "கட்டணம் செலுத்து", te: "ఫీజులు చెల్లించండి" },
  "Apply Leave": { hi: "अवकाश हेतु आवेदन", ta: "விடுப்பு விண்ணப்பி", te: "సెలవు కోసం దరఖాస్తు" },
  "Contact School": { hi: "स्कूल से संपर्क करें", ta: "பள்ளியைத் தொடர்பு கொள்", te: "పాఠశాలను సంప్రదించండి" },
  "School notices": { hi: "स्कूल सूचनाएँ", ta: "பள்ளி அறிவிப்புகள்", te: "పాఠశాల నోటీసులు" },
  View: { hi: "देखें", ta: "காண்க", te: "చూడండి" },
  "Fees due": { hi: "देय शुल्क", ta: "நிலுவைக் கட்டணம்", te: "చెల్లించవలసిన ఫీజు" },
  "Open tasks": { hi: "खुले कार्य", ta: "திறந்த பணிகள்", te: "తెరిచిన పనులు" },
};

export function translate(key: string, lang: Lang): string {
  if (lang === "en") return key;
  return DICT[key]?.[lang] ?? key;
}

// Hook returning a translate function bound to the current language.
export function useT() {
  const { lang } = useApp();
  return (key: string) => translate(key, lang);
}
