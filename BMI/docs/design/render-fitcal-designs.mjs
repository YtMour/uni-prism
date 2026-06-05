import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwrightRoots = [
  process.env.FITCAL_PLAYWRIGHT_NODE_MODULES,
  'C:/Users/Yt/AppData/Local/Temp/fitcal-render-node/node_modules',
  'C:/Users/Yt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules',
].filter(Boolean);

let chromium;
for (const root of playwrightRoots) {
  try {
    ({ chromium } = require(`${root}/playwright`));
    break;
  } catch {
    // Try the next known non-project dependency location.
  }
}

if (!chromium) {
  throw new Error('Playwright is not available. Install it outside the project and set FITCAL_PLAYWRIGHT_NODE_MODULES.');
}

const outDir = path.resolve('docs/design');

const navItems = [
  { id: 'bmi', label: 'BMI', icon: 'calc' },
  { id: 'calories', label: 'Calories', icon: 'flame' },
  { id: 'guidance', label: 'Guidance', icon: 'compass' },
  { id: 'records', label: 'Records', icon: 'bars' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

const icons = {
  calc: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"></rect><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0"></path></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9-.4 2-1.4 3.5-3 4.7C9.8 8.2 9.5 6 10 3 7 5.5 5 9 5 14.5 5 18.8 8 22 12 22z"></path></svg>',
  compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="m15.2 8.8-2 5.4-5.4 2 2-5.4 5.4-2z"></path></svg>',
  bars: '<svg viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-7"></path><path d="M4 19h16"></path></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 6.5h-4L10.6 9a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1l.4 2.5h4l.4-2.5a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2.1-1.5z"></path></svg>',
  ruler: '<svg viewBox="0 0 24 24"><path d="M4 20 20 4l-4-4L0 16l4 4z" transform="translate(2 0)"></path><path d="m9 15 2 2M12 12l2 2M15 9l2 2"></path></svg>',
  scale: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"></rect><path d="M8 10a5 5 0 0 1 8 0"></path><path d="m12 10 2-2"></path></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3z"></path><path d="m9 12 2 2 4-5"></path></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"></path></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9"></path></svg>',
};

function icon(name, className = 'icon') {
  return icons[name].replace('<svg ', `<svg class="${className}" `);
}

function nav(active) {
  return `<nav class="bottom-nav">${navItems.map((item) => `
    <div class="nav-item ${item.id === active ? 'active' : ''}">
      ${icon(item.icon, 'nav-icon')}
      <span>${item.label}</span>
    </div>`).join('')}</nav>`;
}

function topBar(pill) {
  return `<div class="topbar"><div class="brand">FitCal</div><div class="context-pill">${pill}</div></div>`;
}

function inputCard(label, value, unit, iconName) {
  return `<section class="input-card">
    <div class="input-head">${icon(iconName, 'small-icon')}<span>${label}</span></div>
    <div class="input-value"><strong>${value}</strong><span>${unit}</span></div>
  </section>`;
}

function bmiScreen() {
  return `<article class="phone screen-bmi">
    ${topBar('Metric')}
    <h1>BMI Calculator</h1>
    <p class="subtitle">Check your body mass index in seconds.</p>
    <div class="segmented"><span class="selected">Metric</span><span>Imperial</span></div>
    <div class="two-col">${inputCard('Height', '175', 'cm', 'ruler')}${inputCard('Weight', '69', 'kg', 'scale')}</div>
    <button class="primary">Calculate BMI</button>
    <section class="result-panel">
      <div>
        <p class="eyebrow">Your result</p>
        <div class="result-number">22.5</div>
        <span class="status-badge">Normal weight</span>
      </div>
      <div class="range-meter"><span></span><i></i></div>
      <div class="range-labels"><b>Under</b><b>Normal</b><b>Over</b><b>Obesity</b></div>
    </section>
    <section class="plain-card">
      <div class="metric-row"><span>Healthy range</span><strong>56.7-76.3 kg</strong></div>
      <p class="note">Results are estimates for general wellness reference only.</p>
    </section>
    <div class="spacer"></div>
    ${nav('bmi')}
  </article>`;
}

function caloriesScreen() {
  return `<article class="phone screen-calories">
    ${topBar('Goal')}
    <h1>Calories</h1>
    <p class="subtitle">Estimate BMR, TDEE, and daily target.</p>
    <div class="two-col">
      <section class="input-card"><div class="label">Sex</div><div class="input-value"><strong>Female</strong></div></section>
      <section class="input-card"><div class="label">Age</div><div class="input-value"><strong>29</strong><span>yrs</span></div></section>
    </div>
    <section class="plain-card">
      <div class="label">Activity level</div>
      <div class="chips"><span>Light</span><span class="selected">Moderate</span><span>Active</span></div>
    </section>
    <section class="plain-card">
      <div class="label">Goal</div>
      <div class="segmented compact"><span>Maintain</span><span class="selected">Lose</span><span>Gain</span></div>
    </section>
    <button class="primary">Calculate Calories</button>
    <section class="result-panel">
      <div class="metric-row"><span>BMR</span><strong>1,420</strong></div>
      <div class="metric-row"><span>TDEE</span><strong>2,200</strong></div>
      <div class="metric-row"><span>Daily target</span><strong>2,050 kcal</strong></div>
    </section>
    <div class="ad-slot">Ad placeholder - result page</div>
    <div class="spacer"></div>
    ${nav('calories')}
  </article>`;
}

function guidanceScreen() {
  return `<article class="phone screen-guidance">
    ${topBar('Plan')}
    <h1>Guidance</h1>
    <p class="subtitle">Simple guidance based on your goal.</p>
    <section class="result-panel summary">
      <p class="eyebrow">Weight Loss Plan</p>
      <div class="result-number small">2,050 kcal</div>
      <span class="note">Daily target</span>
    </section>
    <section class="plain-card macro-card">
      <div class="donut"></div>
      <div>
        <div class="metric-row"><span>Protein</span><strong>30%</strong></div>
        <div class="metric-row"><span>Carbs</span><strong>40%</strong></div>
        <div class="metric-row"><span>Fat</span><strong>30%</strong></div>
      </div>
    </section>
    <div class="ad-slot">Ad placeholder - guidance</div>
    <section class="plain-card meals">
      <div class="label">Meal focus</div>
      <div class="meal"><b>B</b><div><strong>Breakfast</strong><span>Protein, fruit, slow carbs.</span></div></div>
      <div class="meal"><b>L</b><div><strong>Lunch</strong><span>Lean protein and vegetables.</span></div></div>
      <div class="meal"><b>D</b><div><strong>Dinner</strong><span>Light carbs, balanced fats.</span></div></div>
    </section>
    <button class="primary">Unlock 7-Day Guide</button>
    <p class="note">General wellness guidance only.</p>
    <div class="spacer"></div>
    ${nav('guidance')}
  </article>`;
}

function recordsScreen() {
  return `<article class="phone screen-records">
    ${topBar('Local')}
    <h1>Records</h1>
    <p class="subtitle">Track weight and BMI trends locally.</p>
    <div class="two-col">
      <section class="result-panel mini"><p class="eyebrow">Current</p><div class="result-number tiny">65.0 kg</div></section>
      <section class="result-panel mini"><p class="eyebrow">BMI</p><div class="result-number tiny">22.5</div></section>
    </div>
    <div class="segmented compact"><span class="selected">Weight Trend</span><span>BMI Trend</span></div>
    <section class="chart"><svg viewBox="0 0 330 190" preserveAspectRatio="none">
      <path class="grid-line" d="M0 40H330M0 85H330M0 130H330"></path>
      <path class="trend-fill" d="M22 146 C90 137 148 123 208 116 S286 98 310 88 L310 190 L22 190Z"></path>
      <path class="trend-line" d="M22 146 C90 137 148 123 208 116 S286 98 310 88"></path>
      <circle cx="42" cy="126" r="7"></circle><circle cx="118" cy="105" r="7"></circle><circle cx="195" cy="88" r="7"></circle><circle cx="276" cy="66" r="7"></circle>
    </svg></section>
    <button class="primary">Add Record</button>
    <section class="plain-card records-list">
      <div class="label">Recent records</div>
      <div class="record-row"><strong>65.0 kg</strong><span>Today · BMI 22.5</span></div>
      <div class="record-row"><strong>65.6 kg</strong><span>Jun 01 · BMI 22.7</span></div>
      <div class="record-row"><strong>66.1 kg</strong><span>May 28 · BMI 22.9</span></div>
    </section>
    <p class="note">Local data only</p>
    <div class="spacer"></div>
    ${nav('records')}
  </article>`;
}

function settingsScreen() {
  return `<article class="phone screen-settings">
    ${topBar('Settings')}
    <h1>Settings</h1>
    <p class="subtitle">Manage units, privacy, and local data.</p>
    <section class="plain-card">
      <div class="setting-row"><div>${icon('ruler', 'small-icon')}<span>Units</span></div><strong>Metric</strong></div>
      <div class="segmented compact"><span class="selected">Metric</span><span>Imperial</span></div>
    </section>
    <section class="plain-card">
      <div class="setting-row"><div>${icon('globe', 'small-icon')}<span>Language</span></div><strong>English</strong></div>
      <p class="note">More languages can be added after launch.</p>
    </section>
    <section class="plain-card link-list">
      <div class="setting-row"><div>${icon('shield', 'small-icon')}<span>Privacy Policy</span></div><strong>View</strong></div>
      <div class="setting-row"><div>${icon('shield', 'small-icon')}<span>Disclaimer</span></div><strong>View</strong></div>
    </section>
    <button class="secondary-danger">${icon('trash', 'small-icon')} Clear local data</button>
    <section class="plain-card app-info">
      <div class="metric-row"><span>App version</span><strong>1.0.0</strong></div>
      <p class="note">FitCal stores records on this device only.</p>
    </section>
    <div class="spacer"></div>
    ${nav('settings')}
  </article>`;
}

const screens = [
  { id: 'bmi', file: 'fitcal-bmi-screen.png', html: bmiScreen() },
  { id: 'calories', file: 'fitcal-calories-screen.png', html: caloriesScreen() },
  { id: 'guidance', file: 'fitcal-guidance-screen.png', html: guidanceScreen() },
  { id: 'records', file: 'fitcal-records-screen.png', html: recordsScreen() },
  { id: 'settings', file: 'fitcal-settings-screen.png', html: settingsScreen() },
];

const style = `
  :root{--teal:#0F9F8F;--text:#172326;--white:#FFFFFF;--mint:#E6F7F4;--surface:#F4F8F8;--border:#D8E6E5;--muted:#65787B;--coral:#F06F5D;--green:#58A85F;--amber:#F4B84F}
  *{box-sizing:border-box} body{margin:0;background:var(--surface);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:var(--text);letter-spacing:0}
  .capture{display:inline-block;background:var(--surface)}
  .overview{width:2400px;height:1440px;padding:48px 56px;background:#f3f8f8}
  .overview-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:34px}
  .overview h2{font-size:58px;line-height:1;margin:0 0 10px;font-weight:800}
  .overview p{font-size:23px;color:var(--muted);margin:0}
  .palette{display:flex;align-items:center;gap:12px;font-size:18px;color:var(--muted);font-weight:600}
  .swatch{width:38px;height:38px;border-radius:8px;border:1px solid rgba(23,35,38,.08)}
  .phone-row{display:grid;grid-template-columns:repeat(5,390px);gap:28px;align-items:start}
  .single{width:390px;height:844px;background:var(--surface)}
  .phone{width:390px;height:844px;background:var(--white);border:1px solid var(--border);border-radius:0;padding:22px 20px 18px;display:flex;flex-direction:column;overflow:hidden}
  .overview .phone{box-shadow:0 18px 38px rgba(23,35,38,.08)}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
  .brand{font-size:24px;font-weight:800;line-height:1}.context-pill{background:var(--mint);color:var(--teal);border-radius:999px;padding:8px 12px;font-size:12px;font-weight:800}
  h1{font-size:30px;line-height:1.08;margin:0 0 7px;font-weight:800}.subtitle{font-size:15px;line-height:1.35;color:var(--muted);margin:0 0 17px}
  .segmented{height:40px;background:#eaf2f2;border-radius:8px;padding:4px;display:flex;gap:4px;margin-bottom:12px}.segmented span{flex:1;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;font-weight:800}.segmented .selected{background:var(--white);color:var(--teal);box-shadow:0 1px 4px rgba(23,35,38,.08)}
  .compact{height:42px;margin-bottom:0}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
  .plain-card,.input-card{border:1px solid var(--border);background:var(--white);border-radius:8px;padding:15px;margin-bottom:14px}.input-card{min-height:106px}
  .input-head{display:flex;gap:8px;align-items:center;color:var(--muted);font-size:13px;font-weight:800;margin-bottom:13px}.label,.eyebrow{font-size:12px;line-height:1.2;color:var(--muted);font-weight:800;margin:0 0 10px;text-transform:none}
  .input-value{height:48px;border:1px solid var(--border);border-radius:8px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:8px}.input-value strong{font-size:20px}.input-value span{color:var(--muted);font-size:13px;font-weight:800}
  .primary{height:52px;border:0;border-radius:8px;background:var(--coral);color:#fff;font-size:17px;font-weight:800;margin:0 0 14px;display:flex;align-items:center;justify-content:center;width:100%}
  .result-panel{border:1px solid #bfe9e3;background:linear-gradient(135deg,#eaf9f6 0%,#fff 100%);border-radius:8px;padding:17px;margin-bottom:14px}.result-number{font-size:50px;line-height:1;font-weight:850}.result-number.small{font-size:36px}.result-number.tiny{font-size:28px;white-space:nowrap}.status-badge{display:inline-flex;margin-top:9px;border-radius:999px;background:#e9f8eb;color:#267d32;padding:7px 10px;font-size:13px;font-weight:850}
  .range-meter{height:11px;border-radius:999px;margin-top:20px;background:linear-gradient(90deg,#42a5d5 0 24%,var(--green) 24% 50%,var(--amber) 50% 74%,var(--coral) 74% 100%);position:relative}.range-meter i{position:absolute;left:39%;top:12px;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:10px solid var(--teal)}.range-labels{display:grid;grid-template-columns:repeat(4,1fr);font-size:11px;color:var(--muted);margin-top:19px;text-align:center}.range-labels b:nth-child(2){color:#2b8a3e}
  .metric-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:15px}.metric-row:last-child{border-bottom:0}.metric-row strong{font-size:20px}.note{font-size:12px;line-height:1.45;color:var(--muted);margin:8px 0 0}.chips{display:flex;gap:8px}.chips span{background:#edf4f4;color:var(--muted);border-radius:999px;padding:8px 11px;font-size:12px;font-weight:800}.chips .selected{background:var(--mint);color:var(--teal)}
  .macro-card{display:grid;grid-template-columns:74px 1fr;gap:15px;align-items:center}.donut{width:70px;height:70px;border-radius:50%;background:conic-gradient(var(--teal) 0 30%,var(--amber) 30% 70%,var(--green) 70% 100%);position:relative}.donut:after{content:"";position:absolute;inset:17px;background:#fff;border-radius:50%}
  .ad-slot{height:50px;border:1px dashed #a9c4c3;border-radius:8px;background:#fbfdfd;color:#7c9598;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;margin:0 0 14px}
  .meals{padding-bottom:5px}.meal{display:flex;gap:12px;align-items:flex-start;border-bottom:1px solid var(--border);padding:10px 0}.meal:last-child{border-bottom:0}.meal b{width:34px;height:34px;border-radius:8px;background:var(--mint);color:var(--teal);display:flex;align-items:center;justify-content:center;font-weight:900;flex:0 0 auto}.meal strong{display:block;font-size:16px;margin-bottom:3px}.meal span{display:block;font-size:12px;color:var(--muted)}
  .mini{padding:15px}.chart{height:194px;border:1px solid var(--border);border-radius:8px;background:#fff;margin:14px 0;overflow:hidden}.chart svg{width:100%;height:100%}.grid-line{stroke:#eaf1f1;stroke-width:1}.trend-fill{fill:#e8f7f4}.trend-line{fill:none;stroke:var(--teal);stroke-width:4;stroke-linecap:round}.chart circle{fill:var(--coral);stroke:#fde1dc;stroke-width:6}
  .records-list{padding-bottom:6px}.record-row{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);padding:10px 0;font-size:13px}.record-row:last-child{border-bottom:0}.record-row strong{font-size:15px}.record-row span{color:var(--muted)}
  .setting-row{display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:15px}.setting-row>div{display:flex;align-items:center;gap:9px;font-weight:800}.setting-row strong{color:var(--teal);font-size:14px}.link-list .setting-row{padding:9px 0;border-bottom:1px solid var(--border)}.link-list .setting-row:last-child{border-bottom:0}
  .secondary-danger{height:48px;border:1px solid #f4b9ae;border-radius:8px;background:#fff6f4;color:#c64f3f;font-size:15px;font-weight:800;margin:0 0 14px;display:flex;align-items:center;justify-content:center;gap:8px;width:100%}.app-info{margin-top:2px}
  .spacer{flex:1}.bottom-nav{height:68px;border-radius:18px;background:#edf4f4;padding:8px;display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.nav-item{border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--muted);font-size:10px;font-weight:800}.nav-item.active{background:#fff;color:var(--teal);box-shadow:0 1px 3px rgba(23,35,38,.05)}
  svg{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.nav-icon{width:20px;height:20px}.small-icon{width:20px;height:20px;color:var(--teal);flex:0 0 auto}
  .screen-settings .plain-card{margin-bottom:13px}
`;

function doc(body, cls = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${style}</style></head><body><main class="capture ${cls}">${body}</main></body></html>`;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const overviewBody = `<section class="overview">
    <header class="overview-head">
      <div><h2>FitCal UI System</h2><p>Clean Wellness Utility style for BMI, calories, guidance, records, and settings.</p></div>
      <div class="palette"><span>Palette</span><i class="swatch" style="background:#0F9F8F"></i><i class="swatch" style="background:#F06F5D"></i><i class="swatch" style="background:#58A85F"></i><i class="swatch" style="background:#F4B84F"></i><i class="swatch" style="background:#E6F7F4"></i></div>
    </header>
    <div class="phone-row">${screens.map((screen) => screen.html).join('')}</div>
  </section>`;

  await page.setViewportSize({ width: 2400, height: 1440 });
  await page.setContent(doc(overviewBody), { waitUntil: 'load' });
  await page.locator('.overview').screenshot({ path: path.join(outDir, 'fitcal-overview-board.png') });

  for (const screen of screens) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(doc(`<section class="single">${screen.html}</section>`), { waitUntil: 'load' });
    await page.locator('.phone').screenshot({ path: path.join(outDir, screen.file) });
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
