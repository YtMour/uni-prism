const EN_UI = {
  tabs: {
    generate: 'Generate',
    shortlist: 'Shortlist',
    proposal: 'Proposal',
    settings: 'Settings'
  },
  generate: {
    eyebrow: 'StrateName',
    title: 'Business Name Generator',
    industryLabel: 'Industry',
    styleLabel: 'Style',
    entityLabel: 'Entity',
    toneLabel: 'Tone',
    lengthLabel: 'Length',
    editFilters: 'Edit filters',
    hideFilters: 'Hide filters',
    generateNames: 'Generate Names',
    generateAgain: 'Generate Again',
    seedOn: 'Seed on',
    seedOff: 'Seed off',
    seed: 'Seed',
    emptyTitle: 'Choose filters, then generate a shortlist.',
    emptyCopy: 'Names are generated locally and still require registry, trademark and domain review.',
    candidates: (count) => `${count} candidates`,
    riskNotice: 'Creative suggestions only. Verify registry, trademark and domain availability before use.'
  },
  candidate: {
    copyCandidate: 'Copy candidate',
    saveCandidate: 'Save candidate',
    totalScore: 'Total Score',
    scoreOutOf: '/100',
    nameStructure: 'Name structure',
    scoreBreakdown: 'Score breakdown',
    whyItWorks: 'Why it works',
    copy: 'Copy',
    save: 'Save',
    saved: 'Saved',
    proposal: 'Proposal',
    closeDetail: 'Close candidate detail',
    riskNeedsVerification: 'Needs verification',
    riskLow: 'Low structural risk',
    disclaimer: 'Creative naming suggestion only. Verify company registration, trademark and domain availability before use.',
    structureLabels: {
      root: 'Root',
      bridge: 'Bridge',
      modifier: 'Modifier',
      semanticSuffix: 'Semantic suffix',
      legalSuffix: 'Legal suffix'
    },
    none: 'None',
    previewOnly: 'preview only',
    scoreLabels: {
      professionalFit: 'Professional Fit',
      trustSignal: 'Trust Signal',
      industryMatch: 'Industry Match',
      readability: 'Readability',
      distinctiveness: 'Distinctiveness',
      riskControl: 'Risk Control'
    },
    rationaleRoot: (root) => `${root} suggests enterprise clarity and strategic intent.`,
    rationaleSuffix: (suffix) => `${suffix} gives the name a familiar corporate role.`,
    rationaleNoSuffix: 'The coined form keeps the name compact while staying enterprise-oriented.',
    rationaleStyle: (style, industry) => `${style} aligns the candidate with ${String(industry).toLowerCase()} contexts.`
  },
  shortlist: {
    title: 'Shortlist',
    copyAll: 'Copy all',
    clear: 'Clear',
    clearAria: 'Clear shortlist',
    removeAria: 'Remove from shortlist',
    count: (count) => `${count} saved names for review`,
    emptyTitle: 'No saved names yet.',
    emptyCopy: 'Save candidates from Generate to compare them here.',
    notePlaceholder: 'Add note',
    decisionSignals: 'Decision signals',
    bestForAdvisory: 'Best for advisory',
    mostStable: 'Most stable',
    bestForAssets: 'Best for assets',
    localNotice: 'Shortlist is stored locally on this device.'
  },
  proposal: {
    title: 'Boardroom Proposal',
    copyCurrentAria: 'Copy current proposal',
    emptyTitle: 'Select a candidate first.',
    emptyCopy: 'Generate or save a name, then return here for proposal previews.',
    proposalName: 'Proposal name',
    exportSummary: 'Export summary',
    copyProposalText: 'Copy proposal text',
    addToShortlist: 'Add to Shortlist',
    tagline: 'Tagline',
    riskNotice: 'Preview only. Verify registry and trademark before use.',
    score: 'Score',
    defaultTagline: 'Strategic advisory for long-term enterprise growth.',
    templates: {
      letterhead: 'Letterhead',
      lobby: 'Lobby Wall',
      card: 'Card',
      cover: 'Cover'
    }
  },
  options: {
    industries: {
      finance: { label: 'Finance & Capital', tag: 'Capital-ready', description: 'Capital, investment, advisory and asset-platform naming.' },
      consulting: { label: 'Consulting & Service', tag: 'Professional Services', description: 'Advisory, strategy, service and operating partner naming.' },
      realEstate: { label: 'Real Estate & Construction', tag: 'Built Environment', description: 'Development, property, civic and construction naming.' },
      logistics: { label: 'Logistics & Trade', tag: 'Trading / Logistics', description: 'Cross-border trade, transport, distribution and route naming.' }
    },
    styles: {
      globalVenture: { label: 'Global Venture', fullLabel: 'Global Venture & Capital', description: 'Precise, capital-aware and internationally credible.' },
      heritageIndustrial: { label: 'Heritage Industrial', fullLabel: 'Heritage Industrial', description: 'Grounded, durable and asset-backed.' },
      neoEnterprise: { label: 'Neo-Enterprise', fullLabel: 'Neo-Enterprise Blend', description: 'Modern enterprise tone without consumer-app playfulness.' }
    },
    tones: {
      conservative: { label: 'Conservative', description: 'Quiet, established and low-risk.' },
      boardroom: { label: 'Boardroom', description: 'Formal enough for investor and board materials.' },
      modern: { label: 'Modern', description: 'Clean and contemporary while staying corporate.' },
      premium: { label: 'Premium', description: 'Elevated, selective and proposal-ready.' }
    },
    lengths: {
      short: { label: 'Short', description: 'One compact root with a semantic suffix.' },
      standard: { label: 'Standard', description: 'Balanced compound or root-plus-suffix structure.' },
      formal: { label: 'Formal Compound', description: 'Longer institutional names for formal contexts.' }
    },
    semanticSuffixes: {
      auto: { label: 'Auto' },
      Group: { label: 'Group' },
      Holdings: { label: 'Holdings' },
      Capital: { label: 'Capital' },
      Partners: { label: 'Partners' },
      Industries: { label: 'Industries' },
      Trading: { label: 'Trading' },
      Trust: { label: 'Trust' },
      Advisory: { label: 'Advisory' },
      Global: { label: 'Global' }
    },
    legalSuffixes: {
      none: { label: 'None' },
      LLC: { label: 'LLC' },
      'Ltd.': { label: 'Ltd.' },
      'Inc.': { label: 'Inc.' },
      'Corp.': { label: 'Corp.' }
    }
  },
  settings: {
    title: 'Settings',
    generationDefaults: 'Generation defaults',
    defaultIndustry: 'Default industry',
    defaultStyle: 'Default style',
    legalSuffixPreview: 'Legal suffix preview',
    resultCount: 'Result count',
    filterHighRisk: 'Filter high-risk names',
    showScoreDetails: 'Show score details',
    on: 'On',
    off: 'Off',
    legalAndPrivacy: 'Legal and privacy',
    languageLabel: 'App and legal language',
    privacyPolicy: 'Privacy policy',
    disclaimer: 'Disclaimer',
    open: 'Open',
    legalSuffixNote: 'Legal suffix note',
    previewFormatting: 'Preview formatting',
    previewFormattingBody: 'LLC, Inc., Ltd. and Corp. are visual suffix previews for proposal context only.',
    noFormationStatus: 'No formation status',
    noFormationStatusBody: 'Showing a suffix does not represent formation, registration, compliance, qualification, or permission to use that suffix in any jurisdiction.',
    riskNotice: 'Creative naming suggestions only. StrateName does not check company registry, trademark, domain, or legal availability.',
    localData: 'Local data',
    clearLocalData: 'Clear local data'
  },
  legal: {
    backToSettings: 'Back to settings',
    reviewNotice: 'Localized legal copy is provided for product clarity and still requires qualified review before public release.'
  }
}

const UI_OVERRIDES = {
  'zh-Hans': {
    tabs: { generate: '生成', shortlist: '收藏', proposal: '提案', settings: '设置' },
    generate: {
      eyebrow: 'STRATENAME',
      title: '商业名称生成器',
      industryLabel: '行业',
      styleLabel: '风格',
      entityLabel: '实体',
      toneLabel: '语气',
      lengthLabel: '长度',
      editFilters: '编辑筛选',
      hideFilters: '收起筛选',
      generateNames: '生成名称',
      generateAgain: '再次生成',
      seedOn: '种子开启',
      seedOff: '种子关闭',
      seed: '种子',
      emptyTitle: '选择筛选条件，然后生成收藏候选。',
      emptyCopy: '名称在本地生成，仍需进行公司登记、商标和域名核验。',
      candidates: (count) => `${count} 个候选`,
      riskNotice: '仅为创意建议。使用前请核验登记、商标和域名可用性。'
    },
    candidate: {
      copyCandidate: '复制候选名称',
      saveCandidate: '保存候选名称',
      totalScore: '总分',
      scoreOutOf: '/100',
      nameStructure: '名称结构',
      scoreBreakdown: '评分拆解',
      whyItWorks: '为什么可用',
      copy: '复制',
      save: '保存',
      saved: '已保存',
      proposal: '提案',
      closeDetail: '关闭候选详情',
      riskNeedsVerification: '需要核验',
      riskLow: '低结构风险',
      disclaimer: '仅为创意命名建议。使用前请核验公司登记、商标和域名可用性。',
      structureLabels: {
        root: '词根',
        bridge: '连接词',
        modifier: '修饰词',
        semanticSuffix: '语义后缀',
        legalSuffix: '法律后缀'
      },
      none: '无',
      previewOnly: '仅预览',
      scoreLabels: {
        professionalFit: '专业匹配',
        trustSignal: '信任信号',
        industryMatch: '行业匹配',
        readability: '可读性',
        distinctiveness: '区分度',
        riskControl: '风险控制'
      },
      rationaleRoot: (root) => `${root} 传达企业命名中的清晰定位和战略意图。`,
      rationaleSuffix: (suffix) => `${suffix} 让名称具备熟悉的公司角色。`,
      rationaleNoSuffix: '造词形式让名称保持简洁，同时保留企业感。',
      rationaleStyle: (style, industry) => `${style} 与${industry}场景相匹配。`
    },
    shortlist: {
      title: '收藏',
      copyAll: '复制全部',
      clear: '清空',
      clearAria: '清空收藏',
      removeAria: '从收藏中移除',
      count: (count) => `${count} 个已保存名称待审核`,
      emptyTitle: '还没有保存名称。',
      emptyCopy: '从生成页保存候选后，可在这里进行比较。',
      notePlaceholder: '添加备注',
      decisionSignals: '决策信号',
      bestForAdvisory: '最适合顾问业务',
      mostStable: '最稳健',
      bestForAssets: '最适合资产业务',
      localNotice: '收藏仅保存在本设备。'
    },
    proposal: {
      title: '董事会提案',
      copyCurrentAria: '复制当前提案',
      emptyTitle: '请先选择候选名称。',
      emptyCopy: '生成或保存一个名称后，回到这里预览提案。',
      proposalName: '提案名称',
      exportSummary: '导出摘要',
      copyProposalText: '复制提案文本',
      addToShortlist: '加入收藏',
      tagline: '标语',
      riskNotice: '仅为预览。使用前请核验登记和商标。',
      score: '评分',
      defaultTagline: '面向长期企业增长的战略顾问。',
      templates: {
        letterhead: '信笺',
        lobby: '大厅墙面',
        card: '名片',
        cover: '封面'
      }
    },
    options: {
      industries: {
        finance: { label: '金融与资本', tag: '资本适配', description: '资本、投资、顾问和资产平台命名。' },
        consulting: { label: '咨询与服务', tag: '专业服务', description: '顾问、战略、服务和运营伙伴命名。' },
        realEstate: { label: '地产与建设', tag: '建成环境', description: '开发、物业、城市和建设命名。' },
        logistics: { label: '物流与贸易', tag: '贸易/物流', description: '跨境贸易、运输、分销和路线命名。' }
      },
      styles: {
        globalVenture: { label: '全球企业', fullLabel: '全球企业与资本', description: '精准、具备资本感，并适合国际语境。' },
        heritageIndustrial: { label: '传统工业', fullLabel: '传统工业', description: '稳重、耐久，并带有资产支撑感。' },
        neoEnterprise: { label: '新企业风格', fullLabel: '新企业混合风格', description: '现代企业感，但避免消费应用式轻浮。' }
      },
      tones: {
        conservative: { label: '保守', description: '低调、成熟、低风险。' },
        boardroom: { label: '董事会风格', description: '足够正式，适合投资人与董事会材料。' },
        modern: { label: '现代', description: '清爽当代，同时保持企业感。' },
        premium: { label: '高端', description: '更有层次、选择性和提案感。' }
      },
      lengths: {
        short: { label: '短名称', description: '一个紧凑词根加语义后缀。' },
        standard: { label: '标准', description: '复合词或词根加后缀的平衡结构。' },
        formal: { label: '正式复合', description: '更长的机构化名称，适合正式场景。' }
      },
      semanticSuffixes: {
        auto: { label: '自动' },
        Group: { label: '集团' },
        Holdings: { label: '控股' },
        Capital: { label: '资本' },
        Partners: { label: '伙伴' },
        Industries: { label: '实业' },
        Trading: { label: '贸易' },
        Trust: { label: '信托' },
        Advisory: { label: '顾问' },
        Global: { label: '全球' }
      },
      legalSuffixes: {
        none: { label: '无' }
      }
    },
    settings: {
      title: '设置',
      generationDefaults: '生成默认值',
      defaultIndustry: '默认行业',
      defaultStyle: '默认风格',
      legalSuffixPreview: '法律后缀预览',
      resultCount: '结果数量',
      filterHighRisk: '过滤高风险名称',
      showScoreDetails: '显示评分细节',
      on: '开',
      off: '关',
      legalAndPrivacy: '法律与隐私',
      languageLabel: '应用和法律语言',
      privacyPolicy: '隐私政策',
      disclaimer: '免责声明',
      open: '打开',
      legalSuffixNote: '法律后缀说明',
      previewFormatting: '预览格式',
      previewFormattingBody: 'LLC、Inc.、Ltd. 和 Corp. 仅作为提案语境中的视觉后缀预览。',
      noFormationStatus: '不代表成立状态',
      noFormationStatusBody: '显示后缀不表示已成立、注册、合规、具备资质或获准在任何司法辖区使用该后缀。',
      riskNotice: '仅提供创意命名建议。StrateName 不检查公司登记、商标、域名或法律可用性。',
      localData: '本地数据',
      clearLocalData: '清空本地数据'
    },
    legal: {
      backToSettings: '返回设置',
      reviewNotice: '本地化法律文案仅用于产品清晰度，公开发布前仍需合格专业审查。'
    }
  },
  'zh-Hant': {
    tabs: { generate: '生成', shortlist: '收藏', proposal: '提案', settings: '設定' },
    settings: {
      title: '設定',
      generationDefaults: '生成預設值',
      defaultIndustry: '預設產業',
      defaultStyle: '預設風格',
      legalSuffixPreview: '法律後綴預覽',
      resultCount: '結果數量',
      filterHighRisk: '過濾高風險名稱',
      showScoreDetails: '顯示評分細節',
      on: '開',
      off: '關',
      legalAndPrivacy: '法律與隱私',
      languageLabel: '應用與法律語言',
      privacyPolicy: '隱私政策',
      disclaimer: '免責聲明',
      open: '開啟',
      legalSuffixNote: '法律後綴說明',
      previewFormatting: '預覽格式',
      previewFormattingBody: 'LLC、Inc.、Ltd. 和 Corp. 僅作為提案語境中的視覺後綴預覽。',
      noFormationStatus: '不代表成立狀態',
      noFormationStatusBody: '顯示後綴不表示已成立、註冊、合規、具備資格或獲准在任何司法轄區使用該後綴。',
      riskNotice: '僅提供創意命名建議。StrateName 不檢查公司登記、商標、網域或法律可用性。',
      localData: '本機資料',
      clearLocalData: '清除本機資料'
    },
    legal: {
      backToSettings: '返回設定',
      reviewNotice: '本地化法律文案僅用於產品清晰度，公開發布前仍需合格專業審查。'
    }
  },
  es: {
    tabs: { generate: 'Generar', shortlist: 'Lista', proposal: 'Propuesta', settings: 'Ajustes' },
    settings: {
      title: 'Ajustes',
      generationDefaults: 'Valores de generación',
      defaultIndustry: 'Industria predeterminada',
      defaultStyle: 'Estilo predeterminado',
      legalSuffixPreview: 'Vista de sufijo legal',
      resultCount: 'Cantidad de resultados',
      filterHighRisk: 'Filtrar nombres de alto riesgo',
      showScoreDetails: 'Mostrar detalles de puntuación',
      on: 'Sí',
      off: 'No',
      legalAndPrivacy: 'Legal y privacidad',
      languageLabel: 'Idioma de app y legal',
      privacyPolicy: 'Política de privacidad',
      disclaimer: 'Descargo de responsabilidad',
      open: 'Abrir',
      legalSuffixNote: 'Nota de sufijo legal',
      previewFormatting: 'Formato de vista previa',
      previewFormattingBody: 'LLC, Inc., Ltd. y Corp. son solo sufijos visuales para el contexto de propuesta.',
      noFormationStatus: 'Sin estado de constitución',
      noFormationStatusBody: 'Mostrar un sufijo no representa constitución, registro, cumplimiento, calificación ni permiso de uso en ninguna jurisdicción.',
      riskNotice: 'Solo sugerencias creativas. StrateName no verifica registros, marcas, dominios ni disponibilidad legal.',
      localData: 'Datos locales',
      clearLocalData: 'Borrar datos locales'
    },
    legal: {
      backToSettings: 'Volver a ajustes',
      reviewNotice: 'El texto legal localizado ayuda a la claridad del producto y aún requiere revisión calificada antes del lanzamiento público.'
    }
  },
  fr: {
    tabs: { generate: 'Générer', shortlist: 'Favoris', proposal: 'Proposition', settings: 'Réglages' },
    settings: { title: 'Réglages', legalAndPrivacy: 'Juridique et confidentialité', languageLabel: 'Langue app et juridique', privacyPolicy: 'Politique de confidentialité', disclaimer: 'Avertissement', open: 'Ouvrir' },
    legal: { backToSettings: 'Retour aux réglages', reviewNotice: 'Le texte juridique localisé améliore la clarté du produit et nécessite encore une revue qualifiée avant publication.' }
  },
  de: {
    tabs: { generate: 'Erzeugen', shortlist: 'Auswahl', proposal: 'Vorschlag', settings: 'Einstellungen' },
    settings: { title: 'Einstellungen', legalAndPrivacy: 'Rechtliches und Datenschutz', languageLabel: 'App- und Rechtssprache', privacyPolicy: 'Datenschutzerklärung', disclaimer: 'Haftungsausschluss', open: 'Öffnen' },
    legal: { backToSettings: 'Zurück zu Einstellungen', reviewNotice: 'Lokalisierte Rechtstexte dienen der Produktklarheit und benötigen vor Veröffentlichung eine qualifizierte Prüfung.' }
  },
  ja: {
    tabs: { generate: '生成', shortlist: '保存', proposal: '提案', settings: '設定' },
    settings: { title: '設定', legalAndPrivacy: '法務とプライバシー', languageLabel: 'アプリと法務の言語', privacyPolicy: 'プライバシーポリシー', disclaimer: '免責事項', open: '開く' },
    legal: { backToSettings: '設定へ戻る', reviewNotice: 'ローカライズされた法的文面は製品上の明確化のためであり、公開前に有資格者の確認が必要です。' }
  },
  ko: {
    tabs: { generate: '생성', shortlist: '저장', proposal: '제안', settings: '설정' },
    settings: { title: '설정', legalAndPrivacy: '법률 및 개인정보', languageLabel: '앱 및 법률 언어', privacyPolicy: '개인정보 처리방침', disclaimer: '면책 고지', open: '열기' },
    legal: { backToSettings: '설정으로 돌아가기', reviewNotice: '현지화된 법률 문구는 제품 이해를 돕기 위한 것이며 공개 전 전문 검토가 필요합니다.' }
  },
  'pt-BR': {
    tabs: { generate: 'Gerar', shortlist: 'Lista', proposal: 'Proposta', settings: 'Configurações' },
    settings: { title: 'Configurações', legalAndPrivacy: 'Legal e privacidade', languageLabel: 'Idioma do app e legal', privacyPolicy: 'Política de privacidade', disclaimer: 'Aviso legal', open: 'Abrir' },
    legal: { backToSettings: 'Voltar às configurações', reviewNotice: 'O texto legal localizado melhora a clareza do produto e ainda exige revisão qualificada antes do lançamento público.' }
  },
  it: {
    tabs: { generate: 'Genera', shortlist: 'Lista', proposal: 'Proposta', settings: 'Impostazioni' },
    settings: { title: 'Impostazioni', legalAndPrivacy: 'Legale e privacy', languageLabel: 'Lingua app e legale', privacyPolicy: 'Informativa sulla privacy', disclaimer: 'Dichiarazione di esclusione', open: 'Apri' },
    legal: { backToSettings: 'Torna alle impostazioni', reviewNotice: 'Il testo legale localizzato serve alla chiarezza del prodotto e richiede revisione qualificata prima della pubblicazione.' }
  },
  ru: {
    tabs: { generate: 'Создать', shortlist: 'Список', proposal: 'Предложение', settings: 'Настройки' },
    settings: { title: 'Настройки', legalAndPrivacy: 'Право и конфиденциальность', languageLabel: 'Язык приложения и права', privacyPolicy: 'Политика конфиденциальности', disclaimer: 'Отказ от ответственности', open: 'Открыть' },
    legal: { backToSettings: 'Назад к настройкам', reviewNotice: 'Локализованный правовой текст нужен для ясности продукта и требует квалифицированной проверки перед публикацией.' }
  },
  ar: {
    tabs: { generate: 'توليد', shortlist: 'المحفوظة', proposal: 'عرض', settings: 'الإعدادات' },
    settings: { title: 'الإعدادات', legalAndPrivacy: 'القانونية والخصوصية', languageLabel: 'لغة التطبيق والمستندات', privacyPolicy: 'سياسة الخصوصية', disclaimer: 'إخلاء المسؤولية', open: 'فتح' },
    legal: { backToSettings: 'العودة إلى الإعدادات', reviewNotice: 'النص القانوني المترجم يوضح المنتج ولا يزال يحتاج إلى مراجعة مؤهلة قبل النشر العام.' }
  },
  hi: {
    tabs: { generate: 'बनाएँ', shortlist: 'सूची', proposal: 'प्रस्ताव', settings: 'सेटिंग' },
    settings: { title: 'सेटिंग', legalAndPrivacy: 'कानूनी और गोपनीयता', languageLabel: 'ऐप और कानूनी भाषा', privacyPolicy: 'गोपनीयता नीति', disclaimer: 'अस्वीकरण', open: 'खोलें' },
    legal: { backToSettings: 'सेटिंग पर वापस', reviewNotice: 'स्थानीयकृत कानूनी पाठ उत्पाद स्पष्टता के लिए है और सार्वजनिक रिलीज़ से पहले योग्य समीक्षा चाहिए।' }
  },
  id: {
    tabs: { generate: 'Buat', shortlist: 'Daftar', proposal: 'Proposal', settings: 'Pengaturan' },
    settings: { title: 'Pengaturan', legalAndPrivacy: 'Legal dan privasi', languageLabel: 'Bahasa app dan legal', privacyPolicy: 'Kebijakan privasi', disclaimer: 'Penafian', open: 'Buka' },
    legal: { backToSettings: 'Kembali ke pengaturan', reviewNotice: 'Teks legal lokal membantu kejelasan produk dan tetap memerlukan tinjauan ahli sebelum rilis publik.' }
  },
  tr: {
    tabs: { generate: 'Üret', shortlist: 'Liste', proposal: 'Teklif', settings: 'Ayarlar' },
    settings: { title: 'Ayarlar', legalAndPrivacy: 'Hukuk ve gizlilik', languageLabel: 'Uygulama ve hukuk dili', privacyPolicy: 'Gizlilik politikası', disclaimer: 'Sorumluluk reddi', open: 'Aç' },
    legal: { backToSettings: 'Ayarlara dön', reviewNotice: 'Yerelleştirilmiş hukuki metin ürün açıklığı içindir ve yayın öncesi nitelikli inceleme gerektirir.' }
  },
  vi: {
    tabs: { generate: 'Tạo', shortlist: 'Danh sách', proposal: 'Đề xuất', settings: 'Cài đặt' },
    settings: { title: 'Cài đặt', legalAndPrivacy: 'Pháp lý và quyền riêng tư', languageLabel: 'Ngôn ngữ app và pháp lý', privacyPolicy: 'Chính sách quyền riêng tư', disclaimer: 'Tuyên bố miễn trừ', open: 'Mở' },
    legal: { backToSettings: 'Quay lại cài đặt', reviewNotice: 'Nội dung pháp lý bản địa hóa giúp rõ ràng sản phẩm và vẫn cần rà soát chuyên môn trước khi phát hành công khai.' }
  }
}

function mergeUiText(localeId) {
  const override = UI_OVERRIDES[localeId] || {}
  return {
    tabs: { ...EN_UI.tabs, ...override.tabs },
    generate: { ...EN_UI.generate, ...override.generate },
    candidate: {
      ...EN_UI.candidate,
      ...override.candidate,
      structureLabels: { ...EN_UI.candidate.structureLabels, ...override.candidate?.structureLabels },
      scoreLabels: { ...EN_UI.candidate.scoreLabels, ...override.candidate?.scoreLabels }
    },
    shortlist: { ...EN_UI.shortlist, ...override.shortlist },
    proposal: {
      ...EN_UI.proposal,
      ...override.proposal,
      templates: { ...EN_UI.proposal.templates, ...override.proposal?.templates }
    },
    options: mergeOptions(EN_UI.options, override.options),
    settings: { ...EN_UI.settings, ...override.settings },
    legal: { ...EN_UI.legal, ...override.legal }
  }
}

export function getUiText(localeId = 'en') {
  return mergeUiText(localeId)
}

function mergeOptions(base, override = {}) {
  return Object.fromEntries(
    Object.entries(base).map(([group, values]) => [
      group,
      Object.fromEntries(
        Object.entries(values).map(([id, value]) => [
          id,
          { ...value, ...override[group]?.[id] }
        ])
      )
    ])
  )
}

function optionMeta(ui, group, id) {
  return ui.options?.[group]?.[id] || {}
}

export function localizeNamingOptions(namingOptions, ui) {
  const groups = {
    industries: 'industries',
    styles: 'styles',
    tones: 'tones',
    lengths: 'lengths',
    semanticSuffixes: 'semanticSuffixes',
    legalSuffixes: 'legalSuffixes'
  }
  return Object.fromEntries(
    Object.entries(namingOptions).map(([key, value]) => {
      const group = groups[key]
      if (!group || !Array.isArray(value)) return [key, value]
      return [
        key,
        value.map((item) => ({
          ...item,
          ...optionMeta(ui, group, item.id)
        }))
      ]
    })
  )
}

export function localizeCandidate(candidate, ui) {
  if (!candidate) return candidate
  const industry = optionMeta(ui, 'industries', candidate.industry)
  const style = optionMeta(ui, 'styles', candidate.style)
  const tone = optionMeta(ui, 'tones', candidate.tone)
  const length = optionMeta(ui, 'lengths', candidate.length)
  const suffix = optionMeta(ui, 'semanticSuffixes', candidate.semanticSuffix)
  const suffixLabel = suffix.label || candidate.semanticSuffix || ''
  return {
    ...candidate,
    industryLabel: industry.label || candidate.industryLabel,
    styleLabel: style.label || candidate.styleLabel,
    toneLabel: tone.label || candidate.toneLabel,
    lengthLabel: length.label || candidate.length,
    tags: [
      industry.tag || candidate.tags?.[0],
      tone.label || candidate.tags?.[1],
      length.label || candidate.tags?.[2]
    ].filter(Boolean),
    riskLevel: candidate.riskLevel === 'Low structural risk' ? ui.candidate.riskLow : ui.candidate.riskNeedsVerification,
    rationale: [
      ui.candidate.rationaleRoot(candidate.structure?.root || candidate.name),
      candidate.semanticSuffix ? ui.candidate.rationaleSuffix(suffixLabel) : ui.candidate.rationaleNoSuffix,
      ui.candidate.rationaleStyle(style.label || candidate.styleLabel, industry.label || candidate.industryLabel)
    ],
    disclaimer: ui.candidate.disclaimer,
    structure: {
      ...candidate.structure,
      semanticSuffix: suffixLabel || ui.candidate.none,
      legalSuffix: candidate.structure?.legalSuffix === 'None' ? ui.candidate.none : candidate.structure?.legalSuffix
    }
  }
}
