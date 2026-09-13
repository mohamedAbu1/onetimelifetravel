const DarkTheme = {
  name: "dark",

  // خلفية داكنة مع لمسة حجرية وزجاجية
  background: "#050505",

  // النصوص الأساسية (عاج رملي فاتح)
  text: "text-[#F2E8D5]",

  // النصوص الثانوية (رمادي-بيج محايد)
  subText: "text-[#C8B99B]",

  // العناوين الرئيسية (ذهب فرعوني ملكي)
  title: "text-[#C2A878] font-extrabold tracking-wide",

  // العناوين الثانوية (بني حجري فاتح)
  heading: "text-[#C2A878] font-semibold",

  // الكروت الزجاجية الداكنة
  card: "bg-[rgba(14,14,14,0.88)] backdrop-blur-[14px] rounded-[18px] border border-[#C2A878]/55",

  // شعار
  logoGradientFrom: "#FFFFFF", // أبيض
  logoGradientTo: "#C2A878", // بيج حجري
  logoBorder: "#A68B5B",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,0,0,0.2)]",

  // الحدود
  border: "border border-[rgba(194,168,120,0.45)] rounded-[18px]",

  // الظلال
  shadow:
    "shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(255,255,255,0.05)]",

  // الأزرار الأساسية (ذهبي حجري)
  buttonPrimary:
    "bg-[#C2A878] text-black font-semibold rounded-xl px-6 py-3 hover:bg-[#A68B5B] transition-all shadow-md hover:shadow-lg",

  // الأزرار الثانوية (حجر داكن مع حدود ذهبية)
  buttonSecondary:
    "bg-[#C2A878] text-[#E6DCCF] font-medium rounded-xl px-6 py-3 hover:bg-[#C2A878] transition-all border border-[#C2A878]",

  // الأيقونات
  icon: "text-[#C2A878]",
  iconInactive: "text-[#8C7C5A]",
  iconHover: "text-[#A68B5B] transition-colors",

  // ألوان إضافية للهوية
  night: "bg-[#050505]", // خلفية ليلية
  stoneGold: "text-[#C2A878]", // ذهب حجري فرعوني
  sandIvory: "text-[#E6DCCF]", // عاج رملي
  deepBrown: "text-[#3F3228]", // بني داكن
  crimsonAccent: "text-[#E07A5F]", // لمسة قرمزية
};

export default DarkTheme;
