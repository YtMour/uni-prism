export const messages = {
  'en-US': {
    nav: {
      convert: 'Convert',
      travel: 'Travel',
      more: 'More'
    },
    common: {
      back: 'Back',
      settings: 'Settings',
      refreshRates: 'Refresh rates',
      updated: 'Updated',
      live: 'Live',
      offline: 'Offline'
    },
    currencies: {
      USD: 'US Dollar',
      EUR: 'Euro',
      JPY: 'Japanese Yen',
      CNY: 'Chinese Yuan',
      GBP: 'Pound Sterling',
      HKD: 'Hong Kong Dollar',
      AUD: 'Australian Dollar',
      CAD: 'Canadian Dollar',
      SGD: 'Singapore Dollar',
      CHF: 'Swiss Franc',
      KRW: 'South Korean Won',
      THB: 'Thai Baht',
      MYR: 'Malaysian Ringgit',
      TWD: 'New Taiwan Dollar',
      INR: 'Indian Rupee',
      AED: 'UAE Dirham'
    },
    home: {
      ratesReady: 'Rates ready for travel',
      usingCached: 'Using cached rates',
      from: 'From',
      to: 'To',
      convertedAmount: 'Converted amount',
      swapCurrencies: 'Swap currencies'
    },
    travel: {
      eyebrow: 'Travel Calculator',
      title: 'Dinner split',
      tax: 'Tax',
      tip: 'Tip',
      split: 'Split',
      people: 'people',
      total: 'Total',
      each: 'Each',
      approxHome: 'Approx. CNY {amount} per person'
    },
    settings: {
      eyebrow: 'Preferences',
      title: 'Travel defaults',
      homeCurrency: 'Home Currency',
      watchedCurrencies: 'Watched Currencies',
      language: 'Language',
      selectHomeCurrency: 'Select home currency',
      selectWatchedCurrencies: 'Choose watched currencies',
      selectLanguage: 'Select language',
      selected: 'Selected',
      notSelected: 'Not selected',
      languageEnglish: 'English',
      languageChinese: 'Simplified Chinese',
      offlineRates: 'Offline Rates',
      liveRefresh: 'Live refresh enabled',
      cachedRates: 'Cached rates enabled',
      appearance: 'Appearance',
      appearanceSystem: 'System',
      privacyPolicy: 'Privacy Policy',
      privacySummary: 'Local processing and minimal data use',
      disclaimer: 'Disclaimer',
      disclaimerSummary: 'Rates are estimates, not financial advice',
      localFirstTitle: 'Local-first estimates',
      localFirstBody: 'Amounts stay on this device.'
    },
    legal: {
      eyebrow: 'Legal',
      backToSettings: 'Back to settings',
      updated: 'Updated for prototype review: 2026-06-24',
      privacy: {
        title: 'Privacy Policy',
        sections: [
          {
            heading: 'Local-first calculations',
            body: 'Amounts, tax, tip and split calculations are processed on this device in the current prototype. RateLens does not require an account for these estimates.'
          },
          {
            heading: 'Cached exchange rates',
            body: 'The app may keep the latest available exchange-rate table on device so travel calculations remain usable offline. Cached rates are used only for display and calculation inside the app.'
          },
          {
            heading: 'Permissions',
            body: 'The MVP should not request contacts, precise location, camera or microphone permissions. Future OCR or scanner features must add a separate permission notice before release.'
          }
        ]
      },
      disclaimer: {
        title: 'Disclaimer',
        sections: [
          {
            heading: 'Estimate-only rates',
            body: 'Exchange rates shown in RateLens are informational estimates. Actual card, bank, cash exchange and platform settlement rates may differ.'
          },
          {
            heading: 'No financial advice',
            body: 'RateLens is a travel and shopping calculator. It does not provide investment, tax, legal or financial advice.'
          },
          {
            heading: 'User responsibility',
            body: 'Before making purchases, transfers or financial decisions, users should verify final prices, fees and rates with the relevant provider.'
          }
        ]
      }
    }
  },
  'zh-CN': {
    nav: {
      convert: '换算',
      travel: '旅行',
      more: '更多'
    },
    common: {
      back: '返回',
      settings: '设置',
      refreshRates: '刷新汇率',
      updated: '更新于',
      live: '在线',
      offline: '离线'
    },
    currencies: {
      USD: '美元',
      EUR: '欧元',
      JPY: '日元',
      CNY: '人民币',
      GBP: '英镑',
      HKD: '港元',
      AUD: '澳元',
      CAD: '加元',
      SGD: '新加坡元',
      CHF: '瑞士法郎',
      KRW: '韩元',
      THB: '泰铢',
      MYR: '马来西亚林吉特',
      TWD: '新台币',
      INR: '印度卢比',
      AED: '阿联酋迪拉姆'
    },
    home: {
      ratesReady: '旅行汇率已就绪',
      usingCached: '正在使用缓存汇率',
      from: '从',
      to: '到',
      convertedAmount: '换算结果',
      swapCurrencies: '交换货币'
    },
    travel: {
      eyebrow: '旅行计算器',
      title: '餐费分摊',
      tax: '税费',
      tip: '小费',
      split: '分摊',
      people: '人',
      total: '总计',
      each: '人均',
      approxHome: '约 CNY {amount} / 人'
    },
    settings: {
      eyebrow: '偏好设置',
      title: '旅行默认值',
      homeCurrency: '本币',
      watchedCurrencies: '关注币种',
      language: '语言',
      selectHomeCurrency: '选择本币',
      selectWatchedCurrencies: '选择关注币种',
      selectLanguage: '选择语言',
      selected: '已选择',
      notSelected: '未选择',
      languageEnglish: '英文',
      languageChinese: '简体中文',
      offlineRates: '离线汇率',
      liveRefresh: '已启用在线刷新',
      cachedRates: '已启用缓存汇率',
      appearance: '外观',
      appearanceSystem: '跟随系统',
      privacyPolicy: '隐私政策',
      privacySummary: '本地处理与最小化数据使用',
      disclaimer: '免责声明',
      disclaimerSummary: '汇率仅供估算，不构成金融建议',
      localFirstTitle: '本地优先估算',
      localFirstBody: '金额输入仅保留在当前设备。'
    },
    legal: {
      eyebrow: '合规说明',
      backToSettings: '返回设置',
      updated: '原型评审更新：2026-06-24',
      privacy: {
        title: '隐私政策',
        sections: [
          {
            heading: '本地优先计算',
            body: '当前原型中的金额、税费、小费和分摊计算都在本设备完成。RateLens 不要求用户创建账号才能使用这些估算功能。'
          },
          {
            heading: '缓存汇率',
            body: '应用可能在设备上保存最近一次可用汇率表，以便旅行场景离线计算。缓存汇率仅用于应用内展示与计算。'
          },
          {
            heading: '权限边界',
            body: 'MVP 不应请求通讯录、精确定位、相机或麦克风权限。未来若加入 OCR 或扫描能力，发布前必须补充独立权限说明。'
          }
        ]
      },
      disclaimer: {
        title: '免责声明',
        sections: [
          {
            heading: '汇率仅供估算',
            body: 'RateLens 展示的汇率仅为信息估算。银行卡、银行、现金兑换和平台结算的实际汇率可能不同。'
          },
          {
            heading: '不构成金融建议',
            body: 'RateLens 是旅行与购物计算工具，不提供投资、税务、法律或金融建议。'
          },
          {
            heading: '用户自行核实',
            body: '在购物、转账或做出财务决策前，用户应向相关服务提供方确认最终价格、手续费和汇率。'
          }
        ]
      }
    }
  }
}

export const supportedLocales = [
  { code: 'en-US', labelKey: 'settings.languageEnglish' },
  { code: 'zh-CN', labelKey: 'settings.languageChinese' }
]

export function getMessage(locale, key) {
  const dictionary = messages[locale] || messages['en-US']
  return key.split('.').reduce((value, part) => value && value[part], dictionary) || key
}

export function interpolate(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '')
}
