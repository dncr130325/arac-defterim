"use strict";
/* ============ Araç Defterim ============ */
const CAP = window.capacitorExports && window.capacitorExports.Capacitor;
const NATIVE = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform());
const P = NATIVE ? {
  App: window.capacitorApp?.App,
  Preferences: window.capacitorPreferences?.Preferences,
  LocalNotifications: window.capacitorLocalNotifications?.LocalNotifications,
  Filesystem: window.capacitorFilesystemPluginCapacitor?.Filesystem,
  Share: window.capacitorShare?.Share,
  Haptics: window.capacitorHaptics?.Haptics,
  StatusBar: window.capacitorStatusBar?.StatusBar,
} : {};
const $ = s => document.querySelector(s);
const withTimeout = (pr, ms) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

/* ---------- simgeler ---------- */
const ICONS = {
  clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  car:'<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
  receipt:'<path d="M5 2v20l2-1.5L9 22l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5V2l-2 1.5L15 2l-2 1.5L11 2 9 3.5 7 2z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  wind:'<path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  fuel:'<path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.8a2 2 0 0 0-.6-1.4L18 5"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  tire:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21"/>',
  drop:'<path d="M12 2.7s-6 6.3-6 11a6 6 0 0 0 12 0c0-4.7-6-11-6-11z"/>',
  parking:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  flame:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1.2-1-2-2.6-2-4-2.5 2.5-5 5.2-5 8a7 7 0 0 0 7 7z"/>',
  gauge:'<circle cx="12" cy="13" r="8"/><path d="M12 13l3.5-3.5M12 5V3M8 3h8"/>',
  dots:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>',
  sliders:'<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M9.9 4.2A10 10 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.6 8 10 8a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  wallet:'<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  folder:'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>',
  idcard:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M14 10h4M14 14h4"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
};
const ic = (k, extra="") => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${extra}>${ICONS[k]||""}</svg>`;
const LOGO = `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d63e0"/><stop offset="1" stop-color="#0f2f7a"/></linearGradient></defs>
<rect width="64" height="64" rx="16" fill="url(#lg)"/>
<path d="M14 40.5 17.4 29q1.6-5 6.6-5h16q5 0 6.6 5L50 40.5V49q0 2.5-2.5 2.5H45q-2.5 0-2.5-2.5v-2H21.5v2q0 2.5-2.5 2.5h-2.5Q14 51.5 14 49z" fill="#fff"/>
<path d="m20.5 37.5 2.3-7q.8-2.4 3.3-2.4h11.8q2.5 0 3.3 2.4l2.3 7z" fill="#1d4fb8"/>
<circle cx="21" cy="43" r="2.6" fill="#1d4fb8"/><circle cx="43" cy="43" r="2.6" fill="#1d4fb8"/>
<circle cx="48" cy="17" r="9" fill="#f5b301"/><path d="m43.8 17 3 3 5.2-5.6" stroke="#16202c" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- araç çizimleri ---------- */
const W = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--tire)"/><circle cx="${cx}" cy="${cy}" r="${r*0.45}" fill="var(--hub)"/>`;
const ART = {
  otomobil:`<path d="M14 62 20 47q3-7 13-8l29-3 19-13q6-5 16-5h33q10 0 17 7l15 13 19 4q8 2 8 10v10q0 4-4 4H18q-4 0-4-4z" fill="var(--vc)"/><path d="m70 37 18-12q4-3 10-3h14v15zM117 22h14q8 0 14 5l11 10h-39z" fill="var(--glass)"/><path d="M30 50h8M176 50h8" stroke="var(--glass)" stroke-width="4" stroke-linecap="round"/>${W(52,66,13)}${W(156,66,13)}`,
  ticari:`<path d="M12 64V36q0-18 18-18h88q10 0 18 8l20 18 24 4q10 2 10 10v6q0 4-4 4H16q-4 0-4-4z" fill="var(--vc)"/><path d="M122 25l27 21h-27z" fill="var(--glass)"/><path d="M80 24v38" stroke="var(--glass)" stroke-width="2" opacity=".6"/>${W(46,68,13)}${W(158,68,13)}`,
  kamyon:`<rect x="6" y="10" width="120" height="52" rx="4" fill="var(--vc)" opacity=".85"/><path d="M130 62V30q0-6 6-6h26q6 0 10 6l16 18q4 4 4 10v4q0 4-4 4h-58z" fill="var(--vc)"/><path d="M140 30h22l14 16h-36z" fill="var(--glass)"/><rect x="6" y="62" width="188" height="6" rx="2" fill="var(--tire)"/>${W(32,70,12)}${W(62,70,12)}${W(166,70,12)}`,
  ismakinesi:`<path d="M42 30 18 12l-8 6 26 24z" fill="var(--vc)"/><path d="M6 14 2 36l14-2-2-16z" fill="var(--tire)"/><path d="M36 46h116q6 0 6 6v12H36z" fill="var(--vc)"/><path d="M82 46V16q0-4 4-4h34q4 0 4 4v30z" fill="var(--vc)"/><rect x="88" y="18" width="30" height="22" rx="3" fill="var(--glass)"/><path d="m150 50 26-12 4 6-24 14z" fill="var(--vc)"/><path d="M174 30h20v26q-9 3-16-4z" fill="var(--tire)"/>${W(62,66,17)}${W(140,70,12)}`,
  traktor:`<path d="M96 36h70q6 0 6 6v12H96z" fill="var(--vc)"/><path d="M60 54h116v10H60z" fill="var(--vc)"/><path d="M50 56V16h40v40" fill="none" stroke="var(--vc)" stroke-width="5"/><rect x="44" y="10" width="52" height="8" rx="2" fill="var(--vc)"/><rect x="54" y="20" width="32" height="26" rx="2" fill="var(--glass)"/><rect x="146" y="18" width="5" height="18" rx="1" fill="var(--tire)"/>${W(66,60,25)}${W(158,70,14)}`,
  motosiklet:`<path d="M40 64 78 40h44l38 24" fill="none" stroke="var(--tire)" stroke-width="5" stroke-linejoin="round"/><path d="M76 38q14-12 36-9l14 11H78z" fill="var(--vc)"/><path d="M56 38q12-8 26-2l-4 6H54z" fill="var(--vc)"/><path d="m130 24 30 40M124 22h16" stroke="var(--tire)" stroke-width="5" stroke-linecap="round" fill="none"/>${W(40,64,19)}${W(160,64,19)}`,
};
const art = kind => `<svg viewBox="0 0 200 90" aria-hidden="true">${ART[kind] || ART.otomobil}</svg>`;

/* ---------- sabitler ---------- */
const TYPES = {
  muayene:{name:"Araç muayenesi", short:"Muayene", months:24, icon:"clipboard", exp:"muayene", hint:"Otomobilde 2 yılda bir, ticari araçta yılda bir."},
  trafik:{name:"Trafik sigortası", short:"Trafik", months:12, icon:"shield", exp:"sigorta"},
  kasko:{name:"Kasko", short:"Kasko", months:12, icon:"car", exp:"kasko"},
  mtv:{name:"MTV", short:"MTV", months:0, icon:"receipt", exp:"mtv", hint:"Ocak ve Temmuz sonunda iki taksit."},
  egzoz:{name:"Egzoz emisyon ölçümü", short:"Egzoz", months:24, icon:"wind", exp:"muayene"},
  bakim:{name:"Periyodik bakım", short:"Bakım", months:12, icon:"wrench", exp:"bakim"},
  takograf:{name:"Takograf muayenesi", short:"Takograf", months:24, icon:"gauge", exp:"muayene"},
  yangin:{name:"Yangın tüpü dolumu", short:"Yangın tüpü", months:12, icon:"flame", exp:"diger"},
};
const ORDER = ["muayene","trafik","kasko","mtv","egzoz","bakim"];          // yeni araçta varsayılan açık
const ALL_TYPES = [...ORDER, "takograf", "yangin"];
const KINDS = {
  otomobil:{name:"Otomobil", muayene:24}, ticari:{name:"Kamyonet / panelvan", muayene:12}, kamyon:{name:"Kamyon", muayene:12},
  ismakinesi:{name:"İş makinesi", muayene:12}, traktor:{name:"Traktör", muayene:12}, motosiklet:{name:"Motosiklet", muayene:24},
};
const COLORS = {lacivert:"#2f5bd3", yesil:"#1f9a5a", turuncu:"#e07b24", kirmizi:"#d23f3f", mor:"#7a4fd0", turkuaz:"#1593a3", antrasit:"#56606e", sari:"#c99a06"};
const ACCENTS = {mavi:"#2f5bd3", yesil:"#1f9a5a", turuncu:"#e07b24", mor:"#7a4fd0", kirmizi:"#d23f3f", turkuaz:"#1593a3"};
const EXP = {
  yakit:{name:"Yakıt", icon:"fuel", c:"#e07b24"}, bakim:{name:"Bakım", icon:"wrench", c:"#2f5bd3"}, tamir:{name:"Tamir", icon:"cog", c:"#d23f3f"},
  sigorta:{name:"Trafik sigortası", icon:"shield", c:"#1593a3"}, kasko:{name:"Kasko", icon:"car", c:"#7a4fd0"}, mtv:{name:"MTV", icon:"receipt", c:"#c99a06"},
  muayene:{name:"Muayene", icon:"clipboard", c:"#1f9a5a"}, lastik:{name:"Lastik", icon:"tire", c:"#56606e"}, yikama:{name:"Yıkama", icon:"drop", c:"#2a9fd6"},
  otopark:{name:"Otopark / otoyol", icon:"parking", c:"#8a6d3b"}, ceza:{name:"Trafik cezası", icon:"alert", c:"#b23a5e"}, diger:{name:"Diğer", icon:"dots", c:"#7b8696"},
};
const DOC_CATS = ["Ruhsat","Trafik poliçesi","Kasko poliçesi","Muayene raporu","Fatura / fiş","Ehliyet","Diğer"];
const FUELS = ["","Benzin","Dizel","LPG","Benzin + LPG","Hibrit","Elektrik"];
const AYLAR = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const AYLAR_UZUN = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DEFAULT_SETTINGS = {notify:true, offsets:[30,7,1,0], hour:10, theme:"auto", accent:"mavi"};
const KEY = "arac-defterim-v1", AUTH_KEY = "arac-defterim-auth", REM_KEY = "arac-defterim-remember", LOCK_AFTER_MS = 5*60*1000;

/* ---------- yardımcılar ---------- */
const pad = n => String(n).padStart(2,"0");
const iso = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y,m-1,d); };
const today = () => { const t = new Date(); return new Date(t.getFullYear(),t.getMonth(),t.getDate()); };
const daysLeft = s => Math.round((parse(s) - today())/86400000);
const fmt = s => { const d = parse(s); return d.getDate()+" "+AYLAR[d.getMonth()]+" "+d.getFullYear(); };
function addMonths(s, m){ const d = parse(s); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth()+m);
  const last = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); d.setDate(Math.min(day,last)); return iso(d); }
function nextMtv(from){ const t = from || today(); const y = t.getFullYear();
  const jan = new Date(y,0,31), jul = new Date(y,6,31);
  if (t <= jan) return iso(jan); if (t <= jul) return iso(jul); return iso(new Date(y+1,0,31)); }
function mtvAfter(s){ const d = parse(s); d.setDate(d.getDate()+1); return nextMtv(d); }
const TL = new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0});
const money = n => TL.format(Math.round(n||0));
const moneyShort = n => n >= 1000 ? (Math.round(n/100)/10).toLocaleString("tr-TR")+" B" : String(Math.round(n));
function parseAmount(s){
  s = String(s||"").replace(/[^\d.,]/g,""); if (!s) return 0;
  if (s.includes(",")) s = s.replace(/\./g,"").replace(",",".");
  else if ((s.match(/\./g)||[]).length > 1 || /\.\d{3}$/.test(s)) s = s.replace(/\./g,"");
  const n = parseFloat(s); return isFinite(n) ? Math.round(n*100)/100 : 0;
}
const amountInput = n => n ? String(n).replace(".",",") : "";
function tone(it){
  if (!it.date) return {t:"none", text:"Tarih yok"};
  const n = daysLeft(it.date);
  if (n < 0) return {t:"bad", text:(-n)+" gün geçti"};
  if (n === 0) return {t:"bad", text:"Bugün son gün"};
  if (n <= 30) return {t:"warn", text:n+" gün kaldı"};
  return {t:"ok", text:n+" gün kaldı"};
}
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const val = id => (document.getElementById(id)?.value ?? "").trim();
const colorOf = v => COLORS[v.color] || COLORS.lacivert;
function haptic(kind){
  try { if (!P.Haptics) return;
    if (kind === "success") P.Haptics.notification({type:"SUCCESS"});
    else if (kind === "warn") P.Haptics.notification({type:"WARNING"});
    else P.Haptics.impact({style:"LIGHT"});
  } catch {}
}

/* ---------- durum ---------- */
let state = {vehicles:[], settings:{...DEFAULT_SETTINGS}};
let auth = null;                       // {user, salt, hash}
let session = {locked:true, mode:"login", hiddenAt:0, err:""}, remember = false;
let current = null, tab = "takvim", animate = true, flashId = null, notifPerm = "unknown", ui = {};

function normalize(v, i){
  if (!KINDS[v.kind]) v.kind = "otomobil";
  if (!COLORS[v.color]) v.color = Object.keys(COLORS)[i % 8];
  v.items = v.items || {}; v.card = v.card || {}; v.expenses = v.expenses || []; v.docs = v.docs || [];
  Object.values(v.items).forEach(it => { it.history = it.history || []; });
  return v;
}
const newItem = (k, kind) => ({type:k, date: k==="mtv" ? nextMtv() : "", note:"", history:[],
  months: k==="muayene" ? KINDS[kind].muayene : TYPES[k].months});
function newVehicle(f, types = ORDER){
  const items = {};
  types.forEach(k => items[k] = newItem(k, f.kind));
  return {id:uid(), plate:f.plate, model:f.model, year:f.year, kind:f.kind, color:f.color, photo:f.photo||null,
    items, card:{}, expenses:[], docs:[], created:Date.now()};
}
const itemName = it => it.type==="custom" ? it.title : (TYPES[it.type]?.name || it.title);
const itemIcon = it => TYPES[it.type]?.icon || "bell";
function itemList(v){
  return Object.entries(v.items||{}).filter(([,it]) => !it.off).map(([id,it]) => ({id, ...it, name:itemName(it)}))
    .sort((a,b) => (a.date?daysLeft(a.date):1e9) - (b.date?daysLeft(b.date):1e9));
}
const cur = () => state.vehicles.find(x => x.id===current);

/* ---------- saklama ---------- */
async function kvGet(k){
  try { if (P.Preferences){ const r = await withTimeout(P.Preferences.get({key:k}), 5000); if (r.value != null) return r.value; } } catch {}
  try { return localStorage.getItem(k); } catch { return null; }
}
async function kvSet(k, v){
  let ok = false;
  try { localStorage.setItem(k, v); ok = true; } catch {}
  try { if (P.Preferences){ await withTimeout(P.Preferences.set({key:k, value:v}), 5000); ok = true; } } catch {}
  return ok;
}
async function kvDel(k){ try { localStorage.removeItem(k); } catch {} try { if (P.Preferences) await P.Preferences.remove({key:k}); } catch {} }

async function load(){
  const raw = await kvGet(KEY);
  if (raw){ try { const s = JSON.parse(raw); state = {vehicles:(s.vehicles||[]).map(normalize), settings:{...DEFAULT_SETTINGS, ...(s.settings||{})}}; } catch {} }
  const a = await kvGet(AUTH_KEY);
  if (a){ try { auth = JSON.parse(a); } catch {} }
  remember = !!auth && (await kvGet(REM_KEY)) === "1";
}
async function save(msg, opts={}){
  const ok = await kvSet(KEY, JSON.stringify(state));
  render();
  if (!ok){ toast("Kaydedilemedi. Telefonda boş alan olduğundan emin ol.", false); return false; }
  if (msg){ toast(msg); haptic("success"); }
  if (!opts.noSchedule) scheduleAll();
  return true;
}

/* ---------- fotoğraflar ---------- */
const IDB = {
  db:null,
  open(){ if (this.db) return this.db; this.db = new Promise((res, rej) => { const r = indexedDB.open("arac-defterim", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("photos"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); return this.db; },
  async tx(mode, fn){ const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction("photos", mode); const st = t.objectStore("photos");
    const r = fn(st); t.oncomplete = () => res(r?.result); t.onerror = () => rej(t.error); }); },
  get(id){ return this.tx("readonly", st => st.get(id)); },
  set(id, v){ return this.tx("readwrite", st => st.put(v, id)); },
  del(id){ return this.tx("readwrite", st => st.delete(id)); },
};
const Photos = {
  src:{},
  path: id => `photos/${id}.jpg`,
  async put(id, dataUrl){
    if (P.Filesystem){
      await P.Filesystem.writeFile({path:this.path(id), data:dataUrl.split(",")[1], directory:"DATA", recursive:true});
      this.src[id] = dataUrl;
    } else { await IDB.set(id, dataUrl); this.src[id] = dataUrl; }
  },
  async url(id){
    if (this.src[id]) return this.src[id];
    try {
      if (P.Filesystem){ const r = await P.Filesystem.getUri({path:this.path(id), directory:"DATA"}); this.src[id] = CAP.convertFileSrc(r.uri); }
      else this.src[id] = (await IDB.get(id)) || localStorage.getItem("ph:"+id) || "";
    } catch { this.src[id] = ""; }
    return this.src[id];
  },
  async read(id){
    try {
      if (P.Filesystem) return (await P.Filesystem.readFile({path:this.path(id), directory:"DATA"})).data;
      const d = (await IDB.get(id)) || localStorage.getItem("ph:"+id); return d ? d.split(",")[1] : null;
    } catch { return null; }
  },
  async del(id){
    if (!id) return; delete this.src[id];
    try { if (P.Filesystem) await P.Filesystem.deleteFile({path:this.path(id), directory:"DATA"}); else { await IDB.del(id); localStorage.removeItem("ph:"+id); } } catch {}
  },
  async share(id, title){
    const name0 = (title||"belge").replace(/[^\wçğıöşüÇĞİÖŞÜ -]/g,"").trim().replace(/\s+/g,"-") + ".jpg";
    if (!P.Filesystem || !P.Share){ const u = await this.url(id); const blob = await (await fetch(u)).blob();
      return shareOrDownload(new File([blob], name0, {type:"image/jpeg"}), title); }
    const name = (title||"belge").replace(/[^\wçğıöşüÇĞİÖŞÜ -]/g,"").trim().replace(/\s+/g,"-") + ".jpg";
    await P.Filesystem.copy({from:this.path(id), directory:"DATA", to:name, toDirectory:"CACHE"});
    const r = await P.Filesystem.getUri({path:name, directory:"CACHE"});
    await P.Share.share({title, files:[r.uri], dialogTitle:"Belgeyi paylaş"});
  },
};
async function hydratePhotos(root=document){
  for (const img of root.querySelectorAll("img[data-photo]")){
    const id = img.dataset.photo; const u = await Photos.url(id);
    if (u && img.getAttribute("src") !== u) img.src = u;
  }
}
async function compress(file, max){
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url; await img.decode();
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth*s); c.height = Math.round(img.naturalHeight*s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.82);
  } finally { URL.revokeObjectURL(url); }
}
let photoTarget = null;
async function onPick(e){
  const f = e.target.files[0]; e.target.value = ""; if (!f || !photoTarget) return;
  try {
    const data = await compress(f, photoTarget === "vehicle" ? 1200 : 1800);
    ui.photoData = data; ui.removePhoto = false;
    const box = document.getElementById("photoPrev");
    if (box) box.innerHTML = `<img src="${data}" alt="Seçilen fotoğraf">`;
    const rm = document.getElementById("photoRemove"); if (rm) rm.hidden = false;
  } catch { toast("Fotoğraf okunamadı, başka bir fotoğraf dene.", false); }
}
document.getElementById("pickCam").addEventListener("change", onPick);
document.getElementById("pickGal").addEventListener("change", onPick);

/* ---------- giriş / şifre ---------- */
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
async function hashPw(pw, salt){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", salt:enc.encode(salt), iterations:120000, hash:"SHA-256"}, key, 256);
  return b64(bits);
}
const normUser = u => u.trim().toLocaleLowerCase("tr-TR");
async function setCredentials(user, pw){
  const salt = uid()+uid();
  auth = {user:user.trim(), salt, hash: await hashPw(pw, salt)};
  return kvSet(AUTH_KEY, JSON.stringify(auth));
}
async function checkCredentials(user, pw){
  if (!auth) return false;
  if (normUser(user) !== normUser(auth.user)) return false;
  return (await hashPw(pw, auth.salt)) === auth.hash;
}
async function setRemember(on){ remember = on; if (on) await kvSet(REM_KEY, "1"); else await kvDel(REM_KEY); }
function lock(){ session = {...session, locked:true, mode: auth ? "login" : "create", err:""}; closeAll(); render(); }
function unlock(){ session.locked = false; session.err = ""; animate = true; render(); scheduleAll(); }

function pwField(id, label, auto){
  return `<div class="field"><label for="${id}">${label}</label><div class="pw">
    <input id="${id}" type="password" autocomplete="${auto}" minlength="4" required>
    <button type="button" data-a="togglePw" data-for="${id}" aria-label="Şifreyi göster">${ic("eye")}</button></div></div>`;
}
function authView(){
  const m = session.mode;
  const head = `<div class="auth-head">${LOGO}<h1>Araç Defterim</h1><p>${
    m==="create" ? "Kayıtlarını korumak için bir kullanıcı adı ve şifre belirle." :
    m==="reset" ? "Şifreni unuttuysan uygulamayı sıfırlayıp yeni hesap açabilirsin." : "Devam etmek için giriş yap."}</p></div>`;
  let form;
  if (m === "create") form = `<form id="f-create" class="card" autocomplete="on">
      <div class="field"><label for="f-user">Kullanıcı adı</label><input id="f-user" autocomplete="username" autocapitalize="none" maxlength="30" required></div>
      ${pwField("f-pw","Şifre (en az 4 karakter)","new-password")}
      ${pwField("f-pw2","Şifre tekrar","new-password")}
      <label class="check"><input type="checkbox" id="f-remember" checked> Beni hatırla (bu telefonda şifre sorma)</label>
      <div class="err" role="alert">${esc(session.err)}</div>
      <button class="btn primary block">Hesabı oluştur</button></form>
      ${state.vehicles.length ? `<p class="note">Mevcut araç kayıtların korunur.</p>` : ""}`;
  else if (m === "reset") form = `<div class="card">
      <p>Şifre yalnızca bu telefonda saklanır ve kurtarılamaz. Sıfırlarsan <b>tüm araçlar, masraflar ve belgeler silinir</b>. Daha önce yedek aldıysan yeni hesap açtıktan sonra Ayarlar › Yedekten yükle ile geri alabilirsin.</p>
      <button class="btn danger block" data-a="doReset">Her şeyi sil ve sıfırla</button>
      <button class="btn ghost block" data-a="authMode" data-mode="login">Girişe dön</button></div>`;
  else form = `<form id="f-login" class="card" autocomplete="on">
      <div class="field"><label for="f-user">Kullanıcı adı</label><input id="f-user" autocomplete="username" autocapitalize="none" maxlength="30" required></div>
      ${pwField("f-pw","Şifre","current-password")}
      <label class="check"><input type="checkbox" id="f-remember"> Beni hatırla</label>
      <div class="err" role="alert">${esc(session.err)}</div>
      <button class="btn primary block">${ic("lock")} Giriş yap</button></form>
      <button class="linkbtn" data-a="authMode" data-mode="reset">Şifremi unuttum</button>`;
  return `<div class="auth">${head}${form}</div>`;
}

/* ---------- tema ---------- */
const mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
function applyTheme(theme = state.settings.theme, accent = state.settings.accent){
  const r = document.documentElement;
  if (theme === "light" || theme === "dark") r.dataset.theme = theme; else delete r.dataset.theme;
  r.dataset.accent = ACCENTS[accent] ? accent : "mavi";
  const dark = theme === "dark" || (theme !== "light" && mq?.matches);
  try { if (P.StatusBar){ P.StatusBar.setStyle({style: dark ? "DARK" : "LIGHT"}); P.StatusBar.setBackgroundColor({color: dark ? "#0e1319" : "#eef1f4"}); } } catch {}
}
mq?.addEventListener?.("change", () => applyTheme());

/* ---------- bildirimler ---------- */
async function checkPerm(ask){
  const LN = P.LocalNotifications; if (!LN){ notifPerm = "none"; return notifPerm; }
  try {
    let r = await withTimeout(LN.checkPermissions(), 4000);
    if (r.display !== "granted" && ask) r = await withTimeout(LN.requestPermissions(), 60000);
    notifPerm = r.display;
  } catch { notifPerm = "none"; }
  return notifPerm;
}
async function scheduleAll(){
  const LN = P.LocalNotifications; if (!LN) return;
  try {
    const pend = await LN.getPending();
    if (pend.notifications.length) await LN.cancel({notifications: pend.notifications.map(n => ({id:n.id}))});
    if (!state.settings.notify || notifPerm !== "granted") return;
    const now = Date.now(), list = []; let id = 1;
    for (const v of state.vehicles) for (const it of itemList(v)){
      if (!it.date) continue;
      for (const off of state.settings.offsets){
        const at = parse(it.date); at.setDate(at.getDate()-off); at.setHours(state.settings.hour, 0, 0, 0);
        if (at.getTime() <= now) continue;
        list.push({ id:id++, title:`${v.plate} · ${it.name}`,
          body: off===0 ? `Bugün son gün (${fmt(it.date)}).` : `${off} gün kaldı, son tarih ${fmt(it.date)}.`,
          schedule:{at, allowWhileIdle:true}, smallIcon:"ic_stat_car", iconColor:"#1D4FB8" });
      }
    }
    list.sort((a,b) => a.schedule.at - b.schedule.at);
    if (list.length) await LN.schedule({notifications: list.slice(0, 60)});
  } catch(e){ console.warn("bildirim", e); }
}

/* ---------- web: paylaş veya indir ---------- */
async function shareOrDownload(file, title){
  if (navigator.canShare && navigator.canShare({files:[file]})){
    try { await navigator.share({files:[file], title}); return; } catch(e){ if (e?.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}

/* ---------- takvime aktar (.ics) ---------- */
function buildICS(){
  const ymd = s => s.replace(/-/g,""), stamp = new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
  const fold = t => t.replace(/([,;\\])/g,"\\$1").replace(/\n/g,"\\n");
  const offs = [...state.settings.offsets].sort((a,b) => b-a), h = state.settings.hour;
  const alarms = (offs.length > 1 ? [offs[0], offs[offs.length-1]] : offs);   // iPhone Takvim en fazla 2 uyarı gösterir
  const L = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Arac Defterim//TR","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Araç Defterim"];
  let n = 0;
  for (const v of state.vehicles) for (const it of itemList(v)){
    if (!it.date || daysLeft(it.date) < 0) continue;
    const next = new Date(parse(it.date).getTime() + 86400000);
    L.push("BEGIN:VEVENT", `UID:${v.id}-${it.id}-${ymd(it.date)}@arac-defterim`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(it.date)}`, `DTEND;VALUE=DATE:${ymd(iso(next))}`,
      `SUMMARY:${fold(`${v.plate} · ${it.name} son gün`)}`, `DESCRIPTION:${fold(`Araç Defterim hatırlatması.${it.note ? " Not: "+it.note : ""}`)}`, "TRANSP:TRANSPARENT");
    for (const d of alarms){ const hrs = d*24 - h;
      L.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${fold(`${v.plate} · ${it.name}: ${d ? d+" gün kaldı" : "bugün son gün"}`)}`,
        `TRIGGER:${hrs > 0 ? "-PT"+hrs+"H" : "PT"+(-hrs)+"H"}`,"END:VALARM"); }
    L.push("END:VEVENT"); n++;
  }
  L.push("END:VCALENDAR");
  return {text: L.join("\r\n"), count: n};
}
async function exportCalendar(){
  const {text, count} = buildICS();
  if (!count){ toast("Takvime aktarılacak ileri tarihli kayıt yok.", false); return; }
  const file = new File([text], "arac-defterim-takvim.ics", {type:"text/calendar"});
  try {
    if (P.Filesystem && P.Share){
      await P.Filesystem.writeFile({path:file.name, data:text, directory:"CACHE", encoding:"utf8"});
      const r = await P.Filesystem.getUri({path:file.name, directory:"CACHE"});
      await P.Share.share({title:"Araç Defterim takvimi", files:[r.uri], dialogTitle:"Takvime ekle"});
    } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      // iPhone: .ics dosyasını doğrudan açınca Takvim "Tümünü Ekle" ekranı çıkar
      location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(text);
    } else await shareOrDownload(file, "Araç Defterim takvimi");
  } catch(e){ if (!/cancel|abort/i.test(String(e?.message||e))) toast("Takvim dosyası oluşturulamadı.", false); }
}

/* ---------- yedek ---------- */
function photoIds(){
  const ids = [];
  state.vehicles.forEach(v => { if (v.photo) ids.push(v.photo); v.docs.forEach(d => d.photo && ids.push(d.photo)); });
  return ids;
}
async function exportBackup(){
  toast("Yedek hazırlanıyor…", false);
  const photos = {};
  for (const id of photoIds()){ const d = await Photos.read(id); if (d) photos[id] = d; }
  const data = JSON.stringify({app:"arac-defterim", version:2, exported:new Date().toISOString(), vehicles:state.vehicles, settings:state.settings, photos});
  const name = "arac-defterim-yedek-"+iso(today())+".json";
  try {
    if (P.Filesystem && P.Share){
      await P.Filesystem.writeFile({path:name, data, directory:"CACHE", encoding:"utf8"});
      const r = await P.Filesystem.getUri({path:name, directory:"CACHE"});
      await P.Share.share({title:"Araç Defterim yedeği", files:[r.uri], dialogTitle:"Yedeği kaydet veya gönder"});
    } else await shareOrDownload(new File([data], name, {type:"application/json"}), "Araç Defterim yedeği");
  } catch(e){ if (!/cancel/i.test(String(e?.message||e))) toast("Yedek oluşturulamadı.", false); }
}
document.getElementById("importFile").addEventListener("change", async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  try {
    const s = JSON.parse(await f.text());
    if (s.app !== "arac-defterim" || !Array.isArray(s.vehicles)) throw 0;
    for (const [id, d] of Object.entries(s.photos || {})) await Photos.put(id, "data:image/jpeg;base64,"+d);
    state = {vehicles:s.vehicles.map(normalize), settings:{...DEFAULT_SETTINGS, ...(s.settings||{})}};
    current = null; closeAll(); animate = true; await save(`${s.vehicles.length} araç geri yüklendi`);
  } catch { toast("Bu dosya bir Araç Defterim yedeği değil.", false); }
});

/* ---------- ana görünüm ---------- */
function render(){
  applyTheme();
  const app = $("#app");
  if (session.locked){ app.classList.add("anim"); app.innerHTML = authView(); return; }
  const vs = state.vehicles.sort((a,b) => (a.created||0)-(b.created||0));
  if (!vs.find(v => v.id===current)) current = vs[0]?.id || null;
  const v = cur();
  let h = `<header class="top"><div class="brand">${LOGO}<div><b>Araç Defterim</b><small>${esc(auth?.user||"")}</small></div></div>
    <div class="r"><button class="btn icon-btn" data-a="settings" aria-label="Ayarlar">${ic("sliders")}</button>
    ${v ? `<button class="btn primary sm" data-a="addVehicle">${ic("plus")} Araç</button>` : ""}</div></header>`;
  if (!NATIVE && vs.length && !state.settings.icsTipHidden)
    h += `<div class="banner s-warn"><span>Hatırlatma almak için tarihleri Takvim'e ekle.</span><span class="btns" style="flex:none"><button class="btn sm" data-a="ics">${ic("calendar")} Ekle</button><button class="btn sm ghost icon-btn" data-a="hideIcsTip" aria-label="Gizle">✕</button></span></div>`;
  if (NATIVE && state.settings.notify && notifPerm === "denied" && vs.length)
    h += `<div class="banner s-warn">Bildirim izni kapalı; hatırlatma gelmez.<button class="btn sm" data-a="askPerm">İzin ver</button></div>`;
  if (vs.length > 1)
    h += `<div class="tabs" role="tablist">` + vs.map(x => `<button class="tab" role="tab" style="--vc:${colorOf(x)}" aria-selected="${x.id===current}" data-a="pick" data-id="${x.id}"><span class="dot"></span>${esc(x.plate)}</button>`).join("") + `</div>`;
  if (!v){
    h += `<div class="empty rise"><div class="art" style="--vc:${COLORS.lacivert}">${art("otomobil")}</div><h2>İlk aracını ekle</h2>
      <p>Muayene, sigorta, kasko, MTV ve bakım tarihlerini, masraflarını ve belgelerini tek yerde tut. Tarih yaklaşınca telefonun haber verir.</p>
      <div class="row"><button class="btn primary" data-a="addVehicle">${ic("plus")} Araç ekle</button><button class="btn" data-a="import">Yedekten yükle</button></div></div>`;
  } else {
    h += hero(v);
    const tabs = [["takvim","Takvim","calendar"],["masraf","Masraflar","wallet"],["belge","Belgeler","folder"],["kart","Araç kartı","idcard"]];
    h += `<nav class="seg" role="tablist">` + tabs.map(([k,l,i]) => `<button role="tab" aria-selected="${tab===k}" data-a="tab" data-tab="${k}">${ic(i)}${l}</button>`).join("") + `</nav>`;
    h += tab==="masraf" ? expensesView(v) : tab==="belge" ? docsView(v) : tab==="kart" ? cardView(v) : calendarView(v);
  }
  h += `<div class="note">Kayıtlar bu telefonda saklanır. Telefon değiştirmeden önce Ayarlar'dan yedek al.</div>`;
  app.classList.toggle("anim", animate);
  app.innerHTML = h;
  animate = false; flashId = null;
  hydratePhotos(app);
}

function hero(v){
  const items = itemList(v), n = {bad:0,warn:0,ok:0,none:0};
  items.forEach(i => n[tone(i).t]++);
  const nx = items.find(i => i.date), t = nx && tone(nx), dl = nx ? daysLeft(nx.date) : 0;
  const chips = [["bad","gecikmiş"],["warn","yaklaşan"],["ok","tamam"],["none","tarih yok"]].filter(([k]) => n[k])
    .map(([k,l]) => `<span class="schip s-${k}"><i></i>${n[k]} ${l}</span>`).join("");
  return `<section class="hero rise" style="--vc:${colorOf(v)}">
    <div class="hero-band">
      <div class="hero-id"><div class="plate" aria-label="Plaka"><div class="tr">TR</div><div class="no">${esc(v.plate)}</div></div>
        <div><div class="model">${esc(v.model || "Model girilmedi")}</div><div class="meta">${KINDS[v.kind].name}${v.year ? " · "+esc(v.year) : ""}</div></div></div>
      <div class="hero-art">${v.photo ? `<img data-photo="${v.photo}" alt="${esc(v.plate)} fotoğrafı">` : art(v.kind)}</div>
      <button class="btn hero-edit" data-a="editVehicle" aria-label="Aracı düzenle">${ic("edit")}</button>
    </div>
    <div class="hero-body">
      <div class="chips">${chips}</div>
      ${nx ? `<div class="next s-${t.t}"><div><div class="lbl">Sıradaki</div><div class="what">${esc(nx.name)}</div><div style="font-size:13px">${fmt(nx.date)}</div></div>
        <div class="big">${Math.abs(dl)}<span>${dl<0 ? "gün geçti" : "gün kaldı"}</span></div></div>`
        : `<div class="next s-none"><div><div class="lbl">Başlarken</div><div class="what">Aşağıdan tarihleri gir</div></div></div>`}
    </div></section>`;
}

function ring(it, i){
  const t = tone(it);
  if (!it.date) return `<div class="ring c-none"><svg viewBox="0 0 48 48"><circle class="trk" cx="24" cy="24" r="19"/></svg><span class="rv"><b>–</b></span></div>`;
  const n = daysLeft(it.date);
  const total = it.type==="mtv" ? 182 : (it.months ? it.months*30.44 : 365);
  const frac = n < 0 ? 1 : Math.max(0.04, Math.min(1, n/total));
  const C = 2*Math.PI*19, off = C*(1-frac);
  const [main, sub] = n < 0 ? [-n, "geçti"] : n >= 100 ? [Math.round(n/30.44), "ay"] : [n, "gün"];
  return `<div class="ring c-${t.t}" style="--c:${C.toFixed(1)};--i:${i}" aria-label="${t.text}"><svg viewBox="0 0 48 48"><circle class="trk" cx="24" cy="24" r="19"/><circle class="val" cx="24" cy="24" r="19" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 24 24)"/></svg><span class="rv"><b>${main}</b>${sub}</span></div>`;
}

function timeline(v){
  const items = itemList(v).filter(i => i.date); if (!items.length) return "";
  const t0 = today(), cells = [];
  const late = items.filter(i => daysLeft(i.date) < 0);
  if (late.length) cells.push({label:"Geçmiş", sub:"gecikmiş", items:late, cls:"late"});
  for (let k=0; k<12; k++){
    const d = new Date(t0.getFullYear(), t0.getMonth()+k, 1);
    const its = items.filter(i => { const x = parse(i.date); return daysLeft(i.date) >= 0 && x.getFullYear()===d.getFullYear() && x.getMonth()===d.getMonth(); });
    cells.push({label:AYLAR[d.getMonth()], sub:(k===0 || d.getMonth()===0) ? d.getFullYear() : "", items:its, cls:k===0 ? "now" : ""});
  }
  return `<div class="sec-h"><h2>Önümüzdeki 12 ay</h2></div>
  <div class="tl rise" style="--i:1"><div class="tl-row">${cells.map(c => `<div class="tl-cell ${c.cls}"><div class="tl-m">${c.label}<span>${c.sub}</span></div>
    <div class="tl-dots">${c.items.map(it => `<button class="tl-chip s-${tone(it).t}" data-a="editItem" data-id="${it.id}" aria-label="${esc(it.name)} ${fmt(it.date)}">${ic(itemIcon(it))}${parse(it.date).getDate()}</button>`).join("")}</div></div>`).join("")}</div></div>`;
}

function calendarView(v){
  const items = itemList(v);
  const head = `<div class="sec-h"><h2>Yükümlülükler</h2><div class="btns"><button class="btn sm" data-a="manage">${ic("sliders")} Düzenle</button><button class="btn sm" data-a="addCustom">${ic("plus")} Ekle</button></div></div>`;
  if (!items.length) return head + `<div class="empty rise"><div class="ico s-none">${ic("calendar")}</div><h2>Takip edilen yükümlülük yok</h2>
    <p>Muayene, sigorta, MTV gibi takip etmek istediklerini seç.</p><div class="row"><button class="btn primary" data-a="manage">${ic("sliders")} Yükümlülükleri seç</button></div></div>`;
  return timeline(v) + head + `
  <div class="list">` + items.map((it, i) => { const t = tone(it);
    const last = it.history?.length ? it.history[it.history.length-1] : null;
    return `<div class="item rise ${flashId===it.id ? "flash" : ""}" style="--i:${i+2}">
      <div class="ico s-${t.t}">${ic(itemIcon(it))}</div>
      <div class="body"><div class="name">${esc(it.name)}</div>
        <div class="sub">${it.date ? fmt(it.date)+" · "+t.text : "Son tarihi ekle"}</div>
        ${it.note ? `<div class="sub">${esc(it.note)}</div>` : ""}
        ${last ? `<div class="sub">${ic("history",'style="width:13px;height:13px;vertical-align:-2px"')} Son yenileme ${fmt(last.on)}${last.amount ? " · "+money(last.amount) : ""}</div>` : ""}
        <div class="acts">${it.date && (it.type==="mtv" || it.months) ? `<button class="btn sm" data-a="renew" data-id="${it.id}">${ic("check")} ${it.type==="mtv" ? "Ödendi" : "Yenilendi"}</button>` : ""}
          <button class="btn sm ghost" data-a="editItem" data-id="${it.id}">${it.date ? "Düzenle" : "Tarih ekle"}</button></div></div>
      ${ring(it, i+2)}</div>`;
  }).join("") + `</div>`;
}

function expensesView(v){
  const ex = [...v.expenses].sort((a,b) => b.date.localeCompare(a.date) || (b.created||0)-(a.created||0));
  const add = `<button class="btn primary sm" data-a="addExpense">${ic("plus")} Masraf</button>`;
  if (!ex.length) return `<div class="empty rise"><div class="ico s-none">${ic("wallet")}</div><h2>Masraf eklenmedi</h2>
    <p>Yakıt, bakım, sigorta, lastik ve diğer harcamaları gir; aylık ve yıllık toplamları burada gör.</p>
    <div class="row">${add}</div><p style="font-size:13px">“Yenilendi” dediğinde girdiğin tutarlar da buraya otomatik eklenir.</p></div>`;
  const t0 = today(), months = [];
  for (let k=11; k>=0; k--){ const d = new Date(t0.getFullYear(), t0.getMonth()-k, 1); months.push({y:d.getFullYear(), m:d.getMonth(), sum:0}); }
  const start = new Date(months[0].y, months[0].m, 1);
  let yearSum = 0, monthSum = 0; const cats = {};
  ex.forEach(e => { const d = parse(e.date);
    const mm = months.find(x => x.y===d.getFullYear() && x.m===d.getMonth()); if (mm) mm.sum += e.amount;
    if (d.getFullYear()===t0.getFullYear()) yearSum += e.amount;
    if (d.getFullYear()===t0.getFullYear() && d.getMonth()===t0.getMonth()) monthSum += e.amount;
    if (d >= start) cats[e.cat] = (cats[e.cat]||0) + e.amount; });
  const last12 = months.reduce((s,m) => s+m.sum, 0);
  const max = Math.max(...months.map(m => m.sum), 1);
  const Wd = 336, Hd = 150, top = 20, bot = 22, slot = Wd/12, bw = 16;
  const maxI = months.findIndex(m => m.sum === max && max > 1);
  const bars = months.map((m,i) => { const hh = m.sum ? Math.max(3, (m.sum/max)*(Hd-top-bot)) : 0; const x = i*slot+(slot-bw)/2, y = Hd-bot-hh;
    return `${hh ? `<rect class="bar ${i===11?"cur":""}" style="--i:${i}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${hh.toFixed(1)}" rx="4"/>` : ""}
      ${i===maxI ? `<text class="vl" x="${(x+bw/2).toFixed(1)}" y="${(y-6).toFixed(1)}" text-anchor="middle">${moneyShort(m.sum)}</text>` : ""}
      <text class="ax" x="${(x+bw/2).toFixed(1)}" y="${Hd-6}" text-anchor="middle">${AYLAR[m.m]}</text>`; }).join("");
  const catRows = Object.entries(cats).sort((a,b) => b[1]-a[1]).map(([k,s]) => { const c = EXP[k] || EXP.diger;
    return `<div class="cat" style="--cc:${c.c}"><div class="ico" style="background:color-mix(in srgb,${c.c} 16%,var(--surface));color:${c.c}">${ic(c.icon)}</div>
      <div><div class="nm"><span>${c.name}</span><span class="amt">${money(s)}</span></div><div class="track"><i style="width:${(s/last12*100).toFixed(1)}%"></i></div></div>
      <span class="meta">%${Math.round(s/last12*100)}</span></div>`; }).join("");
  let list = "", lastKey = "";
  const groupSum = {}; ex.forEach(e => { const k = e.date.slice(0,7); groupSum[k] = (groupSum[k]||0) + e.amount; });
  ex.forEach(e => { const k = e.date.slice(0,7);
    if (k !== lastKey){ const d = parse(e.date); list += `<div class="mgroup"><span>${AYLAR_UZUN[d.getMonth()]} ${d.getFullYear()}</span><span>${money(groupSum[k])}</span></div>`; lastKey = k; }
    const c = EXP[e.cat] || EXP.diger;
    list += `<button class="exp" data-a="editExpense" data-id="${e.id}"><div class="ico" style="background:color-mix(in srgb,${c.c} 16%,var(--surface));color:${c.c}">${ic(c.icon)}</div>
      <div style="min-width:0"><div class="t">${c.name}</div><div class="s">${fmt(e.date)}${e.km ? " · "+Number(e.km).toLocaleString("tr-TR")+" km" : ""}${e.note ? " · "+esc(e.note) : ""}</div></div>
      <div class="amt">${money(e.amount)}</div></button>`; });
  return `<section class="panel sum rise">
      <div class="sum-top"><div><span class="lab">Son 12 ay</span><div class="total">${money(last12)}</div></div>
        <div class="minis"><div class="mini"><span class="lab">Bu ay</span><b>${money(monthSum)}</b></div><div class="mini"><span class="lab">${t0.getFullYear()}</span><b>${money(yearSum)}</b></div></div></div>
      <svg class="chart" viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="Son 12 ayın aylık masrafları"><line class="base" x1="0" x2="${Wd}" y1="${Hd-bot}" y2="${Hd-bot}"/>${bars}</svg>
      ${catRows ? `<div class="cats">${catRows}</div>` : ""}
    </section>
    <div class="sec-h"><h2>Tüm masraflar</h2>${add}</div>
    <div class="list rise" style="--i:2">${list}</div>`;
}

function docsView(v){
  const add = `<button class="btn primary sm" data-a="addDoc">${ic("camera")} Belge ekle</button>`;
  if (!v.docs.length) return `<div class="empty rise"><div class="ico s-none">${ic("folder")}</div><h2>Belge eklenmedi</h2>
    <p>Ruhsat, poliçe ve muayene raporunun fotoğrafını çek; lazım olduğunda telefondan aç veya paylaş.</p><div class="row">${add}</div></div>`;
  const docs = [...v.docs].sort((a,b) => (b.added||0)-(a.added||0));
  return `<div class="sec-h"><h2>${docs.length} belge</h2>${add}</div>
    <div class="docs">${docs.map((d,i) => `<button class="doc rise" style="--i:${i}" data-a="viewDoc" data-id="${d.id}">
      <div class="th"><img data-photo="${d.photo}" alt=""></div>
      <div class="cap"><b>${esc(d.title || d.cat)}</b><span>${d.title ? esc(d.cat)+" · " : ""}${fmt(iso(new Date(d.added)))}</span></div></button>`).join("")}</div>`;
}

const CARD_FIELDS = [
  ["sase","Şase no",1],["motor","Motor no",1],["ruhsat","Ruhsat seri no",1],["tescil","Tescil tarihi",0,"date"],["yakit","Yakıt",0,"fuel"],
  ["trafikPol","Trafik poliçe no",1],["kaskoPol","Kasko poliçe no",1],
  ["acente","Sigorta acentesi"],["acenteTel","Acente telefonu",0,"tel"],["servis","Servis"],["servisTel","Servis telefonu",0,"tel"],["notlar","Notlar"],
];
function cardView(v){
  const c = v.card, filled = CARD_FIELDS.filter(([k]) => c[k]);
  const edit = `<button class="btn sm" data-a="editCard">${ic("edit")} Düzenle</button>`;
  if (!filled.length) return `<div class="empty rise"><div class="ico s-none">${ic("idcard")}</div><h2>Araç kartı boş</h2>
    <p>Şase ve motor numarası, ruhsat seri no, poliçe numaraları, acente ve servis telefonlarını kaydet.</p>
    <div class="row"><button class="btn primary" data-a="editCard">${ic("edit")} Bilgileri gir</button></div></div>`;
  return `<div class="sec-h"><h2>Araç bilgileri</h2>${edit}</div>
  <div class="list rise">${filled.map(([k,l,mono,type]) => { const vv = type==="date" ? fmt(c[k]) : c[k];
    return `<div class="kv"><div style="min-width:0"><div class="k">${l}</div><div class="v ${mono ? "mono" : ""}">${esc(vv)}</div></div>
      <div class="acts">${type==="tel" ? `<a class="btn sm primary" href="tel:${esc(c[k].replace(/[^\d+]/g,""))}">${ic("phone")} Ara</a>` : ""}
      ${mono || type==="tel" ? `<button class="btn sm icon-btn" data-a="copy" data-v="${esc(c[k])}" aria-label="${l} kopyala">${ic("copy")}</button>` : ""}</div></div>`; }).join("")}</div>`;
}

/* ---------- paneller ---------- */
function openSheet(title, formId, body){
  $("#layer").innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${title}"><div class="sheet-in">
    <div class="sheet-head"><button type="button" class="btn ghost sm" data-a="close">Vazgeç</button><h3>${title}</h3>
      ${formId ? `<button type="submit" form="${formId}" class="btn primary sm">Kaydet</button>` : `<span style="width:64px"></span>`}</div>${body}</div></div>`;
  document.body.style.overflow = "hidden";
  hydratePhotos($("#layer"));
}
function closeAll(){ $("#layer").innerHTML = ""; document.body.style.overflow = ""; ui = {}; }
function toast(t, good = true){
  document.querySelectorAll(".toast").forEach(x => x.remove());
  const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role","status");
  el.innerHTML = (good ? ic("check") : "") + `<span>${esc(t)}</span>`;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}
const photoPicker = (label, current) => `<div class="field photo-box"><span class="lab">${label}</span>
  <div class="photo-prev" id="photoPrev">${current ? `<img data-photo="${current}" alt="Mevcut fotoğraf">` : "Fotoğraf seçilmedi"}</div>
  <div class="btns"><button type="button" class="btn" data-a="pickPhoto" data-src="cam">${ic("camera")} Fotoğraf çek</button>
  <button type="button" class="btn" data-a="pickPhoto" data-src="gal">${ic("image")} Galeriden seç</button>
  <button type="button" class="btn ghost" id="photoRemove" data-a="removePhoto" ${current ? "" : "hidden"}>Kaldır</button></div></div>`;

function vehicleSheet(v){
  ui = {kind:"vehicle", id:v?.id}; photoTarget = "vehicle";
  const kind = v?.kind || "otomobil", color = v?.color || Object.keys(COLORS)[state.vehicles.length % 8];
  openSheet(v ? "Aracı düzenle" : "Yeni araç", "vf", `<form id="vf" class="card">
    <div class="field"><label for="f-plate">Plaka</label><input id="f-plate" required maxlength="12" autocapitalize="characters" placeholder="50 AB 123" value="${esc(v?.plate)}"></div>
    <div class="row2"><div class="field"><label for="f-model">Marka / model</label><input id="f-model" maxlength="40" placeholder="Fiat Doblo" value="${esc(v?.model)}"></div>
      <div class="field"><label for="f-year">Model yılı</label><input id="f-year" inputmode="numeric" maxlength="4" placeholder="2021" value="${esc(v?.year)}"></div></div>
    <div class="field"><span class="lab">Araç türü</span><div class="kinds" style="--vc:${COLORS[color]}">${Object.entries(KINDS).map(([k,o]) =>
      `<label class="opt"><input type="radio" name="kind" value="${k}" ${k===kind ? "checked" : ""}><span>${art(k)}${o.name}</span></label>`).join("")}</div>
      <span class="hint">Muayene aralığı türe göre ayarlanır; istersen satırdan değiştirebilirsin.</span></div>
    <div class="field"><span class="lab">Renk</span><div class="sw">${Object.entries(COLORS).map(([k,c]) =>
      `<label class="opt"><input type="radio" name="color" value="${k}" ${k===color ? "checked" : ""} aria-label="${k}"><span style="--c:${c}"></span></label>`).join("")}</div></div>
    ${v ? "" : `<div class="field"><span class="lab">Takip edilecekler</span><div class="chips-in">${ALL_TYPES.map(k =>
      `<label class="opt"><input type="checkbox" name="track" value="${k}" ${ORDER.includes(k) ? "checked" : ""}><span>${ic(TYPES[k].icon)}${TYPES[k].short}</span></label>`).join("")}</div>
      <span class="hint">Kasko yaptırmıyorsan işaretini kaldır. Sonradan Takvim › Düzenle'den değiştirebilirsin.</span></div>`}
    ${photoPicker("Araç fotoğrafı (isteğe bağlı)", v?.photo)}
    <div id="vconf"></div>
    ${v ? `<button type="button" class="btn danger" data-a="askDelete">${ic("trash")} Aracı sil</button>` : ""}
  </form>`);
}
function itemSheet(it){
  ui = {kind:"item", id:it?.id};
  const isCustom = !it || it.type==="custom", isMtv = it?.type==="mtv", t = it && TYPES[it.type];
  const hist = (it?.history || []).slice().reverse();
  openSheet(it ? esc(it.name) : "Yeni hatırlatma", "if", `<form id="if" class="card">
    ${isCustom ? `<div class="field"><label for="f-title">Başlık</label><input id="f-title" required maxlength="40" placeholder="Kış lastiği, takograf, ruhsat…" value="${esc(it?.title)}"></div>` : ""}
    <div class="field"><label for="f-date">${isMtv ? "Taksit son günü" : "Son geçerlilik tarihi"}</label><input id="f-date" type="date" value="${esc(it?.date)}" ${isCustom ? "required" : ""}>
      ${t?.hint ? `<span class="hint">${t.hint}</span>` : ""}</div>
    ${isMtv ? "" : `<div class="field"><label for="f-months">Yenileme aralığı</label><select id="f-months">
      ${[[0,"Tekrarlamıyor"],[6,"6 ay"],[12,"1 yıl"],[24,"2 yıl"],[36,"3 yıl"]].map(([m,l]) => `<option value="${m}"${Number(it?.months ?? 12)===m ? " selected" : ""}>${l}</option>`).join("")}</select>
      <span class="hint">“Yenilendi” dediğinde yeni tarih bu kadar ileri önerilir.</span></div>`}
    <div class="field"><label for="f-note">Not</label><input id="f-note" maxlength="60" placeholder="Acente, poliçe no, km…" value="${esc(it?.note)}"></div>
    <div id="iconf"></div>
    ${it ? `<div class="btns"><button type="button" class="btn danger" data-a="askRemoveItem">${ic("trash")} Listeden kaldır</button></div>` : ""}
  </form>
  ${hist.length ? `<div class="card"><span class="lab">${ic("history",'style="width:14px;height:14px;vertical-align:-2px"')} Geçmiş</span><div class="hist">${hist.map(h => `<div class="hist-r"><i></i>
    <div style="min-width:0"><div class="t">${fmt(h.on)} tarihinde ${isMtv ? "ödendi" : "yenilendi"}</div><div class="s">${h.from ? fmt(h.from)+" → " : ""}${fmt(h.to)}${h.note ? " · "+esc(h.note) : ""}</div></div>
    <div class="amt">${h.amount ? money(h.amount) : ""}</div></div>`).join("")}</div></div>` : ""}`);
}
function manageSheet(v){
  ui = {kind:"manage"};
  const customs = Object.entries(v.items).filter(([,it]) => it.type === "custom");
  const row = (key, icon, name, sub, on) => `<label class="mrow"><span class="ico s-none">${ic(icon)}</span>
    <span style="min-width:0"><b>${esc(name)}</b><small>${sub}</small></span>
    <input type="checkbox" class="switch" name="m" value="${key}" ${on ? "checked" : ""}></label>`;
  const every = m => m ? (m % 12 ? `${m} ayda bir` : m === 12 ? "Her yıl" : `${m/12} yılda bir`) : "Tekrarlamıyor";
  openSheet("Yükümlülükler", "mf", `<form id="mf" class="sheet-in">
    <p class="help">Takip etmek istediklerini aç, istemediklerini kapat. Kapattıklarının geçmiş kayıtları silinmez.</p>
    <div class="list">${ALL_TYPES.map(k => { const it = v.items[k];
      const m = k === "mtv" ? 0 : (it?.months ?? (k==="muayene" ? KINDS[v.kind].muayene : TYPES[k].months));
      return row(k, TYPES[k].icon, TYPES[k].name, k === "mtv" ? "Ocak ve Temmuz taksitleri" : every(m), it && !it.off); }).join("")}</div>
    ${customs.length ? `<span class="lab">Kendi hatırlatmaların</span><div class="list">${customs.map(([id,it]) => row(id, "bell", it.title, it.date ? fmt(it.date) : "Tarih yok", !it.off)).join("")}</div>` : ""}
    <button type="button" class="btn" data-a="manageCustom">${ic("plus")} Kendi hatırlatmanı ekle</button>
  </form>`);
}
function renewSheet(v, id){
  const it = v.items[id], isMtv = it.type==="mtv";
  ui = {kind:"renew", id};
  const next = isMtv ? mtvAfter(it.date) : addMonths(it.date, it.months || 12);
  openSheet(`${esc(itemName(it))} ${isMtv ? "ödendi" : "yenilendi"}`, "rf", `<form id="rf" class="card">
    <p>Eski tarih: <b>${fmt(it.date)}</b>. Kaydedince geçmişe eklenir${isMtv ? "" : " ve yeni tarih takvime yazılır"}.</p>
    <div class="field"><label for="f-rdate">${isMtv ? "Sonraki taksit son günü" : "Yeni bitiş tarihi"}</label><input id="f-rdate" type="date" required value="${next}"></div>
    <div class="row2"><div class="field"><label for="f-ramount">Ödenen tutar</label><div class="money"><input id="f-ramount" inputmode="decimal" placeholder="0"></div></div>
      <div class="field"><label for="f-ron">Ödeme tarihi</label><input id="f-ron" type="date" value="${iso(today())}"></div></div>
    <div class="field"><label for="f-rnote">Not</label><input id="f-rnote" maxlength="60" placeholder="${isMtv ? "Dekont no…" : "Acente, poliçe no…"}" value="${esc(isMtv ? "" : it.note)}">
      <span class="hint">Tutar girersen Masraflar'a da eklenir.</span></div>
  </form>`);
  setTimeout(() => document.getElementById("f-ramount")?.focus(), 250);
}
function expenseSheet(v, e){
  ui = {kind:"expense", id:e?.id};
  const cat = e?.cat || "yakit";
  openSheet(e ? "Masrafı düzenle" : "Yeni masraf", "ef", `<form id="ef" class="card">
    <div class="field"><span class="lab">Tür</span><div class="chips-in">${Object.entries(EXP).map(([k,c]) =>
      `<label class="opt"><input type="radio" name="cat" value="${k}" ${k===cat ? "checked" : ""}><span>${ic(c.icon,`style="color:${c.c}"`)}${c.name}</span></label>`).join("")}</div></div>
    <div class="row2"><div class="field"><label for="f-amount">Tutar</label><div class="money"><input id="f-amount" inputmode="decimal" required placeholder="0" value="${amountInput(e?.amount)}"></div></div>
      <div class="field"><label for="f-edate">Tarih</label><input id="f-edate" type="date" required value="${e?.date || iso(today())}"></div></div>
    <div class="row2"><div class="field"><label for="f-km">Kilometre</label><input id="f-km" inputmode="numeric" placeholder="İsteğe bağlı" value="${esc(e?.km)}"></div>
      <div class="field"><label for="f-enote">Not</label><input id="f-enote" maxlength="60" placeholder="İstasyon, servis…" value="${esc(e?.note)}"></div></div>
    <div id="econf"></div>
    ${e ? `<button type="button" class="btn danger" data-a="askDeleteExpense">${ic("trash")} Masrafı sil</button>` : ""}
  </form>`);
}
function docSheet(){
  ui = {kind:"doc"}; photoTarget = "doc";
  openSheet("Belge ekle", "df", `<form id="df" class="card">
    <div class="field"><label for="f-dcat">Belge türü</label><select id="f-dcat">${DOC_CATS.map(c => `<option>${c}</option>`).join("")}</select></div>
    <div class="field"><label for="f-dtitle">Başlık</label><input id="f-dtitle" maxlength="40" placeholder="İsteğe bağlı, ör. 2026 trafik poliçesi"></div>
    ${photoPicker("Fotoğraf", null)}
  </form>`);
}
function docViewer(v, d){
  ui = {kind:"viewer", id:d.id};
  $("#layer").innerHTML = `<div class="viewer" role="dialog" aria-modal="true" aria-label="${esc(d.title || d.cat)}">
    <div class="vh"><button class="btn sm" data-a="close">Kapat</button><b>${esc(d.title || d.cat)}</b></div>
    <div class="vi"><img data-photo="${d.photo}" alt="${esc(d.title || d.cat)}"></div>
    <div class="vf" id="vconf"><button class="btn" data-a="shareDoc">${ic("share")} Paylaş</button><button class="btn danger" data-a="askDeleteDoc">${ic("trash")} Sil</button></div></div>`;
  document.body.style.overflow = "hidden";
  hydratePhotos($("#layer"));
}
function cardSheet(v){
  ui = {kind:"card"}; const c = v.card;
  const f = ([k,l,mono,type]) => type==="fuel"
    ? `<div class="field"><label for="f-c-${k}">${l}</label><select id="f-c-${k}">${FUELS.map(x => `<option value="${x}"${(c[k]||"")===x ? " selected" : ""}>${x || "Seçilmedi"}</option>`).join("")}</select></div>`
    : `<div class="field"><label for="f-c-${k}">${l}</label><input id="f-c-${k}" ${type==="date" ? 'type="date"' : type==="tel" ? 'type="tel" inputmode="tel"' : ""} ${mono ? 'autocapitalize="characters"' : ""} maxlength="${k==="notlar" ? 200 : 40}" value="${esc(c[k])}"></div>`;
  openSheet("Araç kartı", "cf", `<form id="cf" class="sheet-in">
    <div class="card"><span class="lab">Ruhsat bilgileri</span>${CARD_FIELDS.slice(0,5).map(f).join("")}</div>
    <div class="card"><span class="lab">Poliçeler</span>${CARD_FIELDS.slice(5,7).map(f).join("")}</div>
    <div class="card"><span class="lab">Telefonlar</span>${CARD_FIELDS.slice(7,11).map(f).join("")}</div>
    <div class="card">${f(CARD_FIELDS[11])}</div></form>`);
}
function settingsSheet(){
  ui = {kind:"settings"}; const s = state.settings;
  openSheet("Ayarlar", "sf", `<form id="sf" class="sheet-in">
    <div class="card"><span class="lab">Görünüm</span>
      <div class="field"><span class="lab">Tema</span><div class="chips-in">${[["auto","Telefona göre"],["light","Açık"],["dark","Koyu"]].map(([k,l]) =>
        `<label class="opt"><input type="radio" name="theme" value="${k}" ${s.theme===k ? "checked" : ""}><span>${l}</span></label>`).join("")}</div></div>
      <div class="field"><span class="lab">Vurgu rengi</span><div class="sw">${Object.entries(ACCENTS).map(([k,c]) =>
        `<label class="opt"><input type="radio" name="accent" value="${k}" ${s.accent===k ? "checked" : ""} aria-label="${k}"><span style="--c:${c}"></span></label>`).join("")}</div></div></div>
    <div class="card"><span class="lab">Hatırlatmalar</span>
      <label class="check"><input type="checkbox" id="f-notify" ${s.notify ? "checked" : ""}> Bildirim gönder</label>
      <div class="field"><span class="lab">Ne zaman haber versin</span><div class="chips-in">${[[30,"30 gün önce"],[15,"15 gün önce"],[7,"7 gün önce"],[3,"3 gün önce"],[1,"1 gün önce"],[0,"Son gün"]].map(([d,l]) =>
        `<label class="opt"><input type="checkbox" name="off" value="${d}" ${s.offsets.includes(d) ? "checked" : ""}><span>${l}</span></label>`).join("")}</div></div>
      <div class="field"><label for="f-hour">Bildirim saati</label><select id="f-hour">${[8,9,10,12,14,18,20].map(h => `<option value="${h}"${s.hour===h ? " selected" : ""}>${pad(h)}:00</option>`).join("")}</select></div></div>
  </form>
  <div class="card"><span class="lab">Hesap</span><p>Giriş yapan: <b>${esc(auth?.user)}</b>.</p>
    <label class="check"><input type="checkbox" id="f-remember-s" form="sf" ${remember ? "checked" : ""}> Beni hatırla</label>
    <p style="font-size:13px">Açıksa uygulama şifre sormadan açılır. Kapalıysa her açılışta ve 5 dakikadan uzun arka planda kaldıktan sonra şifre sorulur.</p>
    <div class="btns"><button class="btn" data-a="account">${ic("lock")} Kullanıcı adı ve şifre</button><button class="btn" data-a="lockNow">Çıkış yap</button></div></div>
  <div class="card"><span class="lab">Takvime aktar</span><p>${NATIVE ? "Tarihleri telefonunun takvim uygulamasına da ekleyebilirsin." :
    "iPhone'da web uygulaması bildirim gönderemez. Tarihleri Takvim'e aktar; hatırlatmaları Takvim gönderir. Tarih değiştirdiğinde yeniden aktar."}</p>
    <div class="btns"><button class="btn" data-a="ics">${ic("calendar")} Takvime ekle</button></div></div>
  <div class="card"><span class="lab">Yedek</span><p>Yedek dosyası araçları, masrafları ve belge fotoğraflarını içerir. WhatsApp, e-posta veya Drive'a kaydedebilirsin.</p>
    <div class="btns"><button class="btn" data-a="export">${ic("share")} Yedek al</button><button class="btn" data-a="import">Yedekten yükle</button></div></div>
  <p class="note">Araç Defterim ${window.APP_VERSION || ""}</p>`);
  ui.prevTheme = [s.theme, s.accent];
}
function accountSheet(){
  ui = {kind:"account"};
  openSheet("Hesap bilgileri", "pf", `<form id="pf" class="card">
    <div class="field"><label for="f-nuser">Kullanıcı adı</label><input id="f-nuser" autocomplete="username" autocapitalize="none" maxlength="30" required value="${esc(auth?.user)}"></div>
    ${pwField("f-cur","Mevcut şifre","current-password")}
    ${pwField("f-new","Yeni şifre (en az 4 karakter)","new-password")}
    ${pwField("f-new2","Yeni şifre tekrar","new-password")}
    <div class="err" role="alert" id="perr"></div></form>`);
  document.getElementById("f-new").required = false; document.getElementById("f-new2").required = false;
  document.querySelector('label[for="f-new"]').textContent = "Yeni şifre (değiştirmeyeceksen boş bırak)";
}

/* ---------- tıklamalar ---------- */
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const a = b.dataset.a, v = cur();
  switch (a){
    case "togglePw": { const inp = document.getElementById(b.dataset.for); const show = inp.type === "password";
      inp.type = show ? "text" : "password"; b.innerHTML = ic(show ? "eyeoff" : "eye"); b.setAttribute("aria-label", show ? "Şifreyi gizle" : "Şifreyi göster"); break; }
    case "authMode": session.mode = b.dataset.mode; session.err = ""; render(); break;
    case "doReset": {
      for (const id of photoIds()) await Photos.del(id);
      await kvDel(KEY); await kvDel(AUTH_KEY); await setRemember(false);
      state = {vehicles:[], settings:{...DEFAULT_SETTINGS}}; auth = null; session.mode = "create"; session.err = "";
      try { await P.LocalNotifications?.cancel({notifications:(await P.LocalNotifications.getPending()).notifications.map(n => ({id:n.id}))}); } catch {}
      render(); toast("Uygulama sıfırlandı"); break; }
    case "pick": current = b.dataset.id; animate = true; haptic(); render(); break;
    case "tab": tab = b.dataset.tab; animate = true; haptic(); render(); break;
    case "close":
      if (ui.kind === "settings" && ui.prevTheme) applyTheme(...ui.prevTheme);
      closeAll(); break;
    case "settings": settingsSheet(); break;
    case "account": accountSheet(); break;
    case "lockNow": await setRemember(false); lock(); toast("Çıkış yapıldı"); break;
    case "export": exportBackup(); break;
    case "ics": exportCalendar(); break;
    case "hideIcsTip": state.settings.icsTipHidden = true; save(); break;
    case "import": document.getElementById("importFile").click(); break;
    case "askPerm": await checkPerm(true); render(); scheduleAll();
      if (notifPerm === "denied") toast("Telefon Ayarları › Uygulamalar › Araç Defterim › Bildirimler'den açabilirsin.", false); break;
    case "addVehicle": vehicleSheet(null); break;
    case "editVehicle": vehicleSheet(v); break;
    case "addCustom": itemSheet(null); break;
    case "editItem": itemSheet(itemList(v).find(i => i.id===b.dataset.id)); break;
    case "renew": haptic(); renewSheet(v, b.dataset.id); break;
    case "addExpense": expenseSheet(v, null); break;
    case "editExpense": expenseSheet(v, v.expenses.find(x => x.id===b.dataset.id)); break;
    case "addDoc": docSheet(); break;
    case "viewDoc": docViewer(v, v.docs.find(x => x.id===b.dataset.id)); break;
    case "shareDoc": { const d = v.docs.find(x => x.id===ui.id); try { await Photos.share(d.photo, d.title || d.cat); } catch(err){ if (!/cancel/i.test(String(err?.message||err))) toast("Paylaşılamadı.", false); } break; }
    case "editCard": cardSheet(v); break;
    case "copy": try { await navigator.clipboard.writeText(b.dataset.v); toast("Kopyalandı"); haptic(); } catch { toast(b.dataset.v, false); } break;
    case "pickPhoto": photoTarget = ui.kind === "vehicle" ? "vehicle" : "doc"; document.getElementById(b.dataset.src==="cam" ? "pickCam" : "pickGal").click(); break;
    case "removePhoto": ui.photoData = null; ui.removePhoto = true; $("#photoPrev").innerHTML = "Fotoğraf seçilmedi"; b.hidden = true; break;
    case "askDelete": $("#vconf").innerHTML = `<div class="confirm">${esc(v.plate)}; tarihleri, masrafları ve belgeleriyle silinsin mi?<button type="button" class="btn danger sm" data-a="doDelete">Evet, sil</button></div>`; haptic("warn"); break;
    case "doDelete": { const x = state.vehicles.find(y => y.id===ui.id); await Photos.del(x.photo); for (const d of x.docs) await Photos.del(d.photo);
      state.vehicles = state.vehicles.filter(y => y.id!==ui.id); closeAll(); animate = true; save("Araç silindi"); break; }
    case "askRemoveItem": $("#iconf").innerHTML = `<div class="confirm"><span>${esc(itemName(v.items[ui.id]))} listeden kaldırılsın mı? Geçmiş kayıtları saklanır; istediğinde Düzenle'den geri ekleyebilirsin.</span><button type="button" class="btn danger sm" data-a="doRemoveItem">Evet, kaldır</button></div>`; haptic("warn"); break;
    case "doRemoveItem": { const n = itemName(v.items[ui.id]); v.items[ui.id].off = true; closeAll(); animate = true; save(`${n} kaldırıldı`); break; }
    case "manage": manageSheet(v); break;
    case "manageCustom": closeAll(); itemSheet(null); break;
    case "askDeleteExpense": $("#econf").innerHTML = `<div class="confirm">Bu masraf silinsin mi?<button type="button" class="btn danger sm" data-a="doDeleteExpense">Evet, sil</button></div>`; haptic("warn"); break;
    case "doDeleteExpense": v.expenses = v.expenses.filter(x => x.id!==ui.id); closeAll(); save("Masraf silindi", {noSchedule:true}); break;
    case "askDeleteDoc": $("#vconf").innerHTML = `<span>Belge silinsin mi?</span><button class="btn danger" data-a="doDeleteDoc">Evet, sil</button><button class="btn" data-a="close">Vazgeç</button>`; haptic("warn"); break;
    case "doDeleteDoc": { const d = v.docs.find(x => x.id===ui.id); await Photos.del(d.photo); v.docs = v.docs.filter(x => x.id!==ui.id); closeAll(); save("Belge silindi", {noSchedule:true}); break; }
  }
});
document.addEventListener("change", e => {
  if (ui.kind === "settings" && (e.target.name === "theme" || e.target.name === "accent")){
    const th = document.querySelector('input[name="theme"]:checked')?.value, ac = document.querySelector('input[name="accent"]:checked')?.value;
    applyTheme(th, ac);
  }
  if (ui.kind === "vehicle" && e.target.name === "color") document.querySelector(".kinds").style.setProperty("--vc", COLORS[e.target.value]);
});

/* ---------- formlar ---------- */
document.addEventListener("submit", async e => {
  e.preventDefault();
  const fid = e.target.getAttribute("id"), v = cur();
  if (fid === "f-create"){
    const user = val("f-user"), pw = document.getElementById("f-pw").value, pw2 = document.getElementById("f-pw2").value;
    session.err = !user ? "Kullanıcı adı gir." : pw.length < 4 ? "Şifre en az 4 karakter olmalı." : pw !== pw2 ? "Şifreler aynı değil." : "";
    if (session.err){ render(); document.getElementById("f-user").value = user; haptic("warn"); return; }
    if (!(await setCredentials(user, pw))){ session.err = "Hesap kaydedilemedi, tekrar dene."; render(); return; }
    await setRemember(document.getElementById("f-remember").checked);
    unlock(); toast("Hesap oluşturuldu"); haptic("success");
    if (NATIVE && state.vehicles.length && state.settings.notify && notifPerm !== "granted"){ await checkPerm(true); render(); scheduleAll(); }
    return;
  }
  if (fid === "f-login"){
    const user = val("f-user"), pw = document.getElementById("f-pw").value;
    if (await checkCredentials(user, pw)){ await setRemember(document.getElementById("f-remember").checked); unlock(); haptic("success"); }
    else { session.err = "Kullanıcı adı veya şifre yanlış."; render(); document.getElementById("f-user").value = user; haptic("warn"); }
    return;
  }
  if (fid === "vf"){
    const plate = val("f-plate").toLocaleUpperCase("tr-TR").replace(/\s+/g," "); if (!plate) return;
    const f = {plate, model:val("f-model"), year:val("f-year").replace(/\D/g,""), kind:document.querySelector('input[name="kind"]:checked').value, color:document.querySelector('input[name="color"]:checked').value};
    let x;
    if (ui.id){ x = cur(); const was = x.kind; Object.assign(x, f);
      if (was !== f.kind && x.items.muayene) x.items.muayene.months = KINDS[f.kind].muayene; }
    else { x = newVehicle(f, [...document.querySelectorAll('input[name="track"]:checked')].map(i => i.value)); state.vehicles.push(x); current = x.id; tab = "takvim"; }
    if (ui.photoData){ const pid = uid(); try { await Photos.put(pid, ui.photoData); await Photos.del(x.photo); x.photo = pid; } catch { toast("Fotoğraf kaydedilemedi.", false); } }
    else if (ui.removePhoto && x.photo){ await Photos.del(x.photo); x.photo = null; }
    const isNew = !ui.id; closeAll(); animate = true; await save(isNew ? "Araç eklendi" : "Kaydedildi");
    if (isNew && NATIVE && state.settings.notify && notifPerm !== "granted"){ await checkPerm(true); render(); scheduleAll(); }
    return;
  }
  if (fid === "if"){
    const iid = ui.id || "c_"+uid(); const it = v.items[iid] || {type:"custom", history:[]};
    if (it.type === "custom") it.title = val("f-title");
    it.date = val("f-date");
    const m = document.getElementById("f-months"); if (m) it.months = Number(m.value);
    it.note = val("f-note");
    v.items[iid] = it; flashId = iid; closeAll(); save("Kaydedildi"); return;
  }
  if (fid === "mf"){
    const on = new Set([...document.querySelectorAll('input[name="m"]:checked')].map(i => i.value));
    const changed = [];
    ALL_TYPES.forEach(k => { const it = v.items[k];
      if (on.has(k)){ if (!it){ v.items[k] = newItem(k, v.kind); changed.push(k); } else if (it.off){ it.off = false; changed.push(k); } }
      else if (it && !it.off){ it.off = true; changed.push(k); } });
    Object.entries(v.items).filter(([,it]) => it.type === "custom").forEach(([id,it]) => { const want = on.has(id); if (!!it.off === want){ it.off = !want; changed.push(id); } });
    closeAll(); animate = true;
    if (changed.length === 1){ const it = v.items[changed[0]]; save(`${itemName(it)} ${it.off ? "kaldırıldı" : "eklendi"}`); }
    else save(changed.length ? "Yükümlülükler güncellendi" : "");
    return;
  }
  if (fid === "rf"){
    const it = v.items[ui.id], to = val("f-rdate"); if (!to) return;
    const amount = parseAmount(val("f-ramount")), on = val("f-ron") || iso(today()), note = val("f-rnote");
    it.history = it.history || [];
    it.history.push({on, from:it.date, to, amount, note});
    if (amount > 0) v.expenses.push({id:uid(), cat:TYPES[it.type]?.exp || "diger", amount, date:on, note:`${itemName(it)}${note ? " · "+note : ""}`, created:Date.now()});
    it.date = to; if (note && it.type !== "mtv") it.note = note;
    flashId = ui.id; closeAll(); save(`Yeni tarih: ${fmt(to)}`); return;
  }
  if (fid === "ef"){
    const amount = parseAmount(val("f-amount"));
    if (!amount){ toast("Tutarı gir.", false); document.getElementById("f-amount").focus(); return; }
    const data = {cat:document.querySelector('input[name="cat"]:checked').value, amount, date:val("f-edate") || iso(today()), km:val("f-km").replace(/\D/g,""), note:val("f-enote")};
    if (ui.id) Object.assign(v.expenses.find(x => x.id===ui.id), data);
    else v.expenses.push({id:uid(), created:Date.now(), ...data});
    closeAll(); animate = true; save(ui.id ? "Masraf güncellendi" : "Masraf eklendi", {noSchedule:true}); return;
  }
  if (fid === "df"){
    if (!ui.photoData){ toast("Önce bir fotoğraf çek veya seç.", false); return; }
    const pid = uid();
    try { await Photos.put(pid, ui.photoData); } catch { toast("Fotoğraf kaydedilemedi. Telefonda boş alan olduğundan emin ol.", false); return; }
    v.docs.push({id:uid(), cat:val("f-dcat"), title:val("f-dtitle"), photo:pid, added:Date.now()});
    closeAll(); animate = true; tab = "belge"; save("Belge eklendi", {noSchedule:true}); return;
  }
  if (fid === "cf"){
    CARD_FIELDS.forEach(([k,,mono]) => { let x = val("f-c-"+k); if (mono) x = x.toLocaleUpperCase("tr-TR"); if (x) v.card[k] = x; else delete v.card[k]; });
    closeAll(); animate = true; tab = "kart"; save("Araç kartı kaydedildi", {noSchedule:true}); return;
  }
  if (fid === "sf"){
    const offs = [...document.querySelectorAll('input[name="off"]:checked')].map(x => Number(x.value));
    state.settings = {...state.settings, notify:document.getElementById("f-notify").checked, offsets:offs.length ? offs : [7], hour:Number(val("f-hour")),
      theme:document.querySelector('input[name="theme"]:checked').value, accent:document.querySelector('input[name="accent"]:checked').value};
    await setRemember(document.getElementById("f-remember-s").checked);
    closeAll(); await save("Ayarlar kaydedildi");
    if (state.settings.notify && NATIVE && notifPerm !== "granted"){ await checkPerm(true); render(); scheduleAll(); }
    return;
  }
  if (fid === "pf"){
    const err = document.getElementById("perr");
    const user = val("f-nuser"), curPw = document.getElementById("f-cur").value, n1 = document.getElementById("f-new").value, n2 = document.getElementById("f-new2").value;
    if (!user){ err.textContent = "Kullanıcı adı boş olamaz."; return; }
    if (!(await checkCredentials(auth.user, curPw))){ err.textContent = "Mevcut şifre yanlış."; haptic("warn"); return; }
    if (n1 || n2){ if (n1.length < 4){ err.textContent = "Yeni şifre en az 4 karakter olmalı."; return; } if (n1 !== n2){ err.textContent = "Yeni şifreler aynı değil."; return; } }
    if (!(await setCredentials(user, n1 || curPw))){ err.textContent = "Kaydedilemedi, tekrar dene."; return; }
    closeAll(); render(); toast("Hesap bilgileri güncellendi"); haptic("success"); return;
  }
});

/* ---------- uygulama yaşam döngüsü ---------- */
if (P.App){
  P.App.addListener("backButton", () => {
    if ($("#layer").innerHTML){ if (ui.kind === "settings" && ui.prevTheme) applyTheme(...ui.prevTheme); closeAll(); }
    else if (!session.locked && tab !== "takvim"){ tab = "takvim"; animate = true; render(); }
    else P.App.exitApp();
  });
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden){ session.hiddenAt = Date.now(); return; }
  if (!session.locked && auth && !remember && session.hiddenAt && Date.now() - session.hiddenAt > LOCK_AFTER_MS) lock();
  else if (!session.locked && !$("#layer").innerHTML) render();
});

(async () => {
  try { const info = P.App && await withTimeout(P.App.getInfo(), 3000); if (info) window.APP_VERSION = info.version; } catch {}
  if (!NATIVE){
    try { navigator.storage?.persist?.(); } catch {}
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
    window.APP_VERSION = window.APP_VERSION || "web";
  }
  await load();
  session.mode = auth ? "login" : "create";
  if (auth && remember) session.locked = false;
  await checkPerm(false);
  render();
})();
