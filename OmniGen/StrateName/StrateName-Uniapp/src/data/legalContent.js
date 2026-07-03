export const REQUIRED_LEGAL_LOCALE_IDS = [
  'en',
  'zh-Hans',
  'zh-Hant',
  'es',
  'fr',
  'de',
  'ja',
  'ko',
  'pt-BR',
  'it',
  'ru',
  'ar',
  'hi',
  'id',
  'tr',
  'vi'
]

export const LEGAL_LOCALES = [
  { id: 'en', label: 'English', description: 'English', rtl: false },
  { id: 'zh-Hans', label: '简体中文', description: 'Chinese Simplified', rtl: false },
  { id: 'zh-Hant', label: '繁體中文', description: 'Chinese Traditional', rtl: false },
  { id: 'es', label: 'Español', description: 'Spanish', rtl: false },
  { id: 'fr', label: 'Français', description: 'French', rtl: false },
  { id: 'de', label: 'Deutsch', description: 'German', rtl: false },
  { id: 'ja', label: '日本語', description: 'Japanese', rtl: false },
  { id: 'ko', label: '한국어', description: 'Korean', rtl: false },
  { id: 'pt-BR', label: 'Português', description: 'Portuguese Brazil', rtl: false },
  { id: 'it', label: 'Italiano', description: 'Italian', rtl: false },
  { id: 'ru', label: 'Русский', description: 'Russian', rtl: false },
  { id: 'ar', label: 'العربية', description: 'Arabic', rtl: true },
  { id: 'hi', label: 'हिन्दी', description: 'Hindi', rtl: false },
  { id: 'id', label: 'Bahasa Indonesia', description: 'Indonesian', rtl: false },
  { id: 'tr', label: 'Türkçe', description: 'Turkish', rtl: false },
  { id: 'vi', label: 'Tiếng Việt', description: 'Vietnamese', rtl: false }
]

const PRIVACY_SECTIONS = {
  en: [
    ['Local storage', 'Generated names, seed values, shortlist notes, default filters and proposal settings stay on this device in browser or app storage.'],
    ['No account or cloud sync', 'This MVP does not create accounts, upload naming sessions, sync notes, or send generated candidates to a remote service.'],
    ['User control', 'Clear local data removes saved names, notes, settings and proposal selection from this device.']
  ],
  'zh-Hans': [
    ['本地存储', '生成名称、种子值、收藏备注、默认筛选和提案设置会保存在本设备的浏览器或应用存储中。'],
    ['无账号或云同步', '当前 MVP 不创建账号，不上传命名会话，不同步备注，也不会把生成候选发送到远程服务。'],
    ['用户控制', '清空本地数据会从本设备移除已保存名称、备注、设置和提案选择。']
  ],
  'zh-Hant': [
    ['本機儲存', '生成名稱、種子值、收藏備註、預設篩選和提案設定會保存在本裝置的瀏覽器或應用儲存中。'],
    ['無帳號或雲端同步', '目前 MVP 不建立帳號、不上傳命名工作階段、不同步備註，也不會把生成候選傳送到遠端服務。'],
    ['使用者控制', '清除本機資料會從本裝置移除已保存名稱、備註、設定和提案選擇。']
  ],
  es: [
    ['Almacenamiento local', 'Los nombres generados, semillas, notas, filtros y ajustes de propuesta permanecen en este dispositivo.'],
    ['Sin cuenta ni sincronización', 'Este MVP no crea cuentas, no sube sesiones, no sincroniza notas ni envía candidatos a un servicio remoto.'],
    ['Control del usuario', 'Borrar datos locales elimina nombres guardados, notas, ajustes y selección de propuesta de este dispositivo.']
  ],
  fr: [
    ['Stockage local', 'Les noms générés, graines, notes, filtres et réglages de proposition restent sur cet appareil.'],
    ['Pas de compte ni de synchronisation', 'Ce MVP ne crée pas de compte, ne téléverse pas de sessions, ne synchronise pas les notes et n’envoie pas les candidats à un service distant.'],
    ['Contrôle utilisateur', 'Effacer les données locales supprime les noms enregistrés, notes, réglages et choix de proposition de cet appareil.']
  ],
  de: [
    ['Lokale Speicherung', 'Generierte Namen, Seed-Werte, Notizen, Standardfilter und Vorschlagseinstellungen bleiben auf diesem Gerät.'],
    ['Kein Konto und keine Cloud-Synchronisierung', 'Dieses MVP erstellt keine Konten, lädt keine Sitzungen hoch, synchronisiert keine Notizen und sendet keine Kandidaten an einen Remote-Dienst.'],
    ['Nutzerkontrolle', 'Lokale Daten löschen entfernt gespeicherte Namen, Notizen, Einstellungen und die Vorschlagsauswahl von diesem Gerät.']
  ],
  ja: [
    ['ローカル保存', '生成名、シード値、候補メモ、既定フィルター、提案設定はこの端末のブラウザーまたはアプリ保存領域に残ります。'],
    ['アカウントやクラウド同期なし', 'この MVP はアカウントを作成せず、命名セッションやメモをアップロードせず、候補名をリモートサービスへ送信しません。'],
    ['ユーザー管理', 'ローカルデータを消去すると、この端末の保存名、メモ、設定、提案選択が削除されます。']
  ],
  ko: [
    ['로컬 저장', '생성된 이름, 시드 값, 후보 메모, 기본 필터와 제안 설정은 이 기기의 브라우저 또는 앱 저장소에 남습니다.'],
    ['계정 및 클라우드 동기화 없음', '이 MVP는 계정을 만들지 않고, 세션이나 메모를 업로드하지 않으며, 생성 후보를 원격 서비스로 보내지 않습니다.'],
    ['사용자 제어', '로컬 데이터를 지우면 이 기기의 저장된 이름, 메모, 설정과 제안 선택이 삭제됩니다.']
  ],
  'pt-BR': [
    ['Armazenamento local', 'Nomes gerados, sementes, notas, filtros padrão e configurações de proposta ficam neste dispositivo.'],
    ['Sem conta ou sincronização em nuvem', 'Este MVP não cria contas, não envia sessões, não sincroniza notas e não envia candidatos a um serviço remoto.'],
    ['Controle do usuário', 'Limpar dados locais remove nomes salvos, notas, configurações e seleção de proposta deste dispositivo.']
  ],
  it: [
    ['Archiviazione locale', 'Nomi generati, seed, note, filtri predefiniti e impostazioni della proposta restano su questo dispositivo.'],
    ['Nessun account o sincronizzazione cloud', 'Questo MVP non crea account, non carica sessioni, non sincronizza note e non invia candidati a un servizio remoto.'],
    ['Controllo utente', 'La cancellazione dei dati locali rimuove nomi salvati, note, impostazioni e selezione della proposta da questo dispositivo.']
  ],
  ru: [
    ['Локальное хранение', 'Сгенерированные названия, seed-значения, заметки, фильтры и настройки предложения остаются на этом устройстве.'],
    ['Без аккаунта и облачной синхронизации', 'Этот MVP не создает аккаунты, не загружает сессии, не синхронизирует заметки и не отправляет варианты на удаленный сервис.'],
    ['Контроль пользователя', 'Очистка локальных данных удаляет сохраненные названия, заметки, настройки и выбор предложения с этого устройства.']
  ],
  ar: [
    ['تخزين محلي', 'تبقى الأسماء المولدة وقيم البذرة والملاحظات والمرشحات وإعدادات العرض على هذا الجهاز داخل المتصفح أو التطبيق.'],
    ['بدون حساب أو مزامنة سحابية', 'لا ينشئ هذا الإصدار حسابات ولا يرفع الجلسات أو يزامن الملاحظات أو يرسل الأسماء إلى خدمة بعيدة.'],
    ['تحكم المستخدم', 'يمحو خيار حذف البيانات المحلية الأسماء والملاحظات والإعدادات واختيار العرض من هذا الجهاز.']
  ],
  hi: [
    ['स्थानीय संग्रहण', 'बनाए गए नाम, seed मान, shortlist नोट, डिफॉल्ट फ़िल्टर और proposal सेटिंग इस डिवाइस पर ही रहते हैं।'],
    ['कोई खाता या क्लाउड सिंक नहीं', 'यह MVP खाता नहीं बनाता, naming sessions या notes अपलोड नहीं करता और candidates को remote service पर नहीं भेजता।'],
    ['उपयोगकर्ता नियंत्रण', 'स्थानीय डेटा साफ करने से इस डिवाइस से saved names, notes, settings और proposal selection हट जाते हैं।']
  ],
  id: [
    ['Penyimpanan lokal', 'Nama yang dibuat, nilai seed, catatan shortlist, filter default, dan pengaturan proposal tetap berada di perangkat ini.'],
    ['Tanpa akun atau sinkronisasi cloud', 'MVP ini tidak membuat akun, tidak mengunggah sesi, tidak menyinkronkan catatan, dan tidak mengirim kandidat ke layanan jarak jauh.'],
    ['Kontrol pengguna', 'Hapus data lokal akan menghapus nama tersimpan, catatan, pengaturan, dan pilihan proposal dari perangkat ini.']
  ],
  tr: [
    ['Yerel depolama', 'Üretilen adlar, seed değerleri, kısa liste notları, varsayılan filtreler ve teklif ayarları bu cihazda kalır.'],
    ['Hesap veya bulut senkronizasyonu yok', 'Bu MVP hesap oluşturmaz, oturumları yüklemez, notları senkronize etmez ve aday adları uzak bir servise göndermez.'],
    ['Kullanıcı kontrolü', 'Yerel verileri temizlemek, kayıtlı adları, notları, ayarları ve teklif seçimini bu cihazdan kaldırır.']
  ],
  vi: [
    ['Lưu trữ cục bộ', 'Tên được tạo, giá trị seed, ghi chú shortlist, bộ lọc mặc định và cài đặt proposal được lưu trên thiết bị này.'],
    ['Không tài khoản hoặc đồng bộ đám mây', 'MVP này không tạo tài khoản, không tải phiên đặt tên lên, không đồng bộ ghi chú và không gửi ứng viên tên tới dịch vụ từ xa.'],
    ['Quyền kiểm soát của người dùng', 'Xóa dữ liệu cục bộ sẽ xóa tên đã lưu, ghi chú, cài đặt và lựa chọn proposal khỏi thiết bị này.']
  ]
}

const DISCLAIMER_SECTIONS = {
  en: [
    ['Creative suggestions only', 'Names are generated as business naming ideas. Scores describe structure, readability and fit; they are not legal or market validation.'],
    ['External checks required', 'StrateName does not check company registry, trademark, domain, social handle, jurisdictional rules, or legal availability.'],
    ['Professional review', 'Before using a name, review it with qualified legal, trademark, tax and business professionals for the target market.']
  ],
  'zh-Hans': [
    ['仅为创意建议', '名称作为商业命名灵感生成。评分只描述结构、可读性和匹配度，不构成法律、商业或市场验证。'],
    ['必须外部核验', 'StrateName 不检查公司登记、商标、域名、社交账号、司法辖区规则或法律可用性。'],
    ['专业审查', '使用名称前，应由目标市场的法律、商标、税务和商业专业人士进行审查。']
  ],
  'zh-Hant': [
    ['僅為創意建議', '名稱作為商業命名靈感生成。評分只描述結構、可讀性和匹配度，不構成法律、商業或市場驗證。'],
    ['必須外部查核', 'StrateName 不檢查公司登記、商標、網域、社群帳號、司法轄區規則或法律可用性。'],
    ['專業審查', '使用名稱前，應由目標市場的法律、商標、稅務和商業專業人士進行審查。']
  ],
  es: [
    ['Solo sugerencias creativas', 'Los nombres son ideas de naming empresarial. Las puntuaciones describen estructura, legibilidad y ajuste; no son validación legal o de mercado.'],
    ['Verificaciones externas necesarias', 'StrateName no comprueba registro mercantil, marcas, dominios, redes sociales, reglas jurisdiccionales ni disponibilidad legal.'],
    ['Revisión profesional', 'Antes de usar un nombre, revíselo con profesionales legales, de marcas, fiscales y comerciales del mercado objetivo.']
  ],
  fr: [
    ['Suggestions créatives uniquement', 'Les noms sont des idées de naming professionnel. Les scores décrivent structure, lisibilité et adéquation; ils ne valident pas le droit ou le marché.'],
    ['Vérifications externes requises', 'StrateName ne vérifie pas registre des sociétés, marques, domaines, réseaux sociaux, règles locales ou disponibilité juridique.'],
    ['Revue professionnelle', 'Avant utilisation, faites examiner le nom par des professionnels juridiques, marques, fiscaux et commerciaux du marché visé.']
  ],
  de: [
    ['Nur kreative Vorschläge', 'Die Namen sind Geschäftsideen. Bewertungen beschreiben Struktur, Lesbarkeit und Passung; sie sind keine rechtliche oder marktbezogene Prüfung.'],
    ['Externe Prüfungen erforderlich', 'StrateName prüft keine Register, Marken, Domains, Social Handles, Rechtsordnungen oder rechtliche Verfügbarkeit.'],
    ['Fachliche Prüfung', 'Vor Nutzung sollte der Name durch qualifizierte Rechts-, Marken-, Steuer- und Geschäftsexperten des Zielmarkts geprüft werden.']
  ],
  ja: [
    ['創造的な候補のみ', '名称はビジネス命名のアイデアとして生成されます。スコアは構造、読みやすさ、適合性を示すもので、法的または市場上の検証ではありません。'],
    ['外部確認が必要', 'StrateName は会社登記、商標、ドメイン、SNS ハンドル、管轄ルール、法的利用可能性を確認しません。'],
    ['専門家レビュー', '使用前に、対象市場の法律、商標、税務、ビジネス専門家による確認を行ってください。']
  ],
  ko: [
    ['창의적 제안일 뿐', '이름은 비즈니스 네이밍 아이디어로 생성됩니다. 점수는 구조, 가독성, 적합성을 설명하며 법적 또는 시장 검증이 아닙니다.'],
    ['외부 확인 필요', 'StrateName은 회사 등록, 상표, 도메인, 소셜 핸들, 관할 규칙 또는 법적 사용 가능성을 확인하지 않습니다.'],
    ['전문가 검토', '이름을 사용하기 전에 대상 시장의 법률, 상표, 세무 및 비즈니스 전문가에게 검토받으십시오.']
  ],
  'pt-BR': [
    ['Apenas sugestões criativas', 'Os nomes são ideias de naming empresarial. As notas descrevem estrutura, legibilidade e aderência; não são validação legal ou de mercado.'],
    ['Verificações externas necessárias', 'StrateName não verifica registro empresarial, marca, domínio, perfis sociais, regras jurisdicionais ou disponibilidade legal.'],
    ['Revisão profissional', 'Antes de usar um nome, revise-o com profissionais jurídicos, de marca, fiscais e comerciais do mercado-alvo.']
  ],
  it: [
    ['Solo suggerimenti creativi', 'I nomi sono idee di naming aziendale. I punteggi descrivono struttura, leggibilità e coerenza; non sono validazione legale o di mercato.'],
    ['Controlli esterni richiesti', 'StrateName non verifica registri societari, marchi, domini, handle social, regole locali o disponibilità legale.'],
    ['Revisione professionale', 'Prima dell’uso, fate valutare il nome da professionisti legali, marchi, fiscali e commerciali del mercato target.']
  ],
  ru: [
    ['Только творческие предложения', 'Названия являются идеями для бизнеса. Оценки описывают структуру, читаемость и соответствие; это не юридическая или рыночная проверка.'],
    ['Нужны внешние проверки', 'StrateName не проверяет реестры компаний, товарные знаки, домены, соцсети, правила юрисдикций или юридическую доступность.'],
    ['Профессиональная проверка', 'Перед использованием названия обратитесь к профильным юристам, специалистам по товарным знакам, налогам и бизнесу целевого рынка.']
  ],
  ar: [
    ['اقتراحات إبداعية فقط', 'الأسماء أفكار للتسمية التجارية. الدرجات تصف البنية وسهولة القراءة والملاءمة ولا تعد تحققًا قانونيًا أو سوقيًا.'],
    ['فحوصات خارجية مطلوبة', 'لا يفحص StrateName السجل التجاري أو العلامات التجارية أو النطاقات أو حسابات التواصل أو القواعد المحلية أو الإتاحة القانونية.'],
    ['مراجعة مهنية', 'قبل استخدام أي اسم، راجعه مع مختصين قانونيين وتجاريين وضريبيين ومختصي علامات تجارية في السوق المستهدف.']
  ],
  hi: [
    ['केवल रचनात्मक सुझाव', 'नाम business naming ideas के रूप में बनाए जाते हैं। Scores संरचना, readability और fit बताते हैं; वे legal या market validation नहीं हैं।'],
    ['बाहरी जाँच आवश्यक', 'StrateName company registry, trademark, domain, social handle, jurisdiction rules या legal availability की जाँच नहीं करता।'],
    ['पेशेवर समीक्षा', 'नाम इस्तेमाल करने से पहले target market के legal, trademark, tax और business professionals से समीक्षा कराएँ।']
  ],
  id: [
    ['Hanya saran kreatif', 'Nama dibuat sebagai ide penamaan bisnis. Skor menjelaskan struktur, keterbacaan, dan kecocokan; bukan validasi hukum atau pasar.'],
    ['Pemeriksaan eksternal diperlukan', 'StrateName tidak memeriksa registrasi perusahaan, merek dagang, domain, akun sosial, aturan yurisdiksi, atau ketersediaan hukum.'],
    ['Tinjauan profesional', 'Sebelum memakai nama, tinjau dengan profesional hukum, merek, pajak, dan bisnis untuk pasar tujuan.']
  ],
  tr: [
    ['Yalnızca yaratıcı öneriler', 'Adlar iş isimlendirme fikirleri olarak üretilir. Puanlar yapı, okunabilirlik ve uyumu açıklar; hukuki veya pazar doğrulaması değildir.'],
    ['Dış kontroller gerekir', 'StrateName şirket sicili, marka, alan adı, sosyal hesap, yerel kurallar veya hukuki uygunluk kontrolü yapmaz.'],
    ['Profesyonel inceleme', 'Bir adı kullanmadan önce hedef pazardaki hukuk, marka, vergi ve iş uzmanlarıyla inceleyin.']
  ],
  vi: [
    ['Chỉ là gợi ý sáng tạo', 'Tên được tạo như ý tưởng đặt tên doanh nghiệp. Điểm số mô tả cấu trúc, độ dễ đọc và mức phù hợp; không phải xác nhận pháp lý hoặc thị trường.'],
    ['Cần kiểm tra bên ngoài', 'StrateName không kiểm tra đăng ký công ty, nhãn hiệu, tên miền, tài khoản mạng xã hội, quy định địa phương hoặc khả năng dùng hợp pháp.'],
    ['Rà soát chuyên môn', 'Trước khi dùng tên, hãy rà soát với chuyên gia pháp lý, nhãn hiệu, thuế và kinh doanh tại thị trường mục tiêu.']
  ]
}

const TITLES = {
  en: ['Privacy Policy', 'Disclaimer', 'Localized legal information'],
  'zh-Hans': ['隐私政策', '免责声明', '本地化法律信息'],
  'zh-Hant': ['隱私政策', '免責聲明', '本地化法律資訊'],
  es: ['Política de privacidad', 'Descargo de responsabilidad', 'Información legal localizada'],
  fr: ['Politique de confidentialité', 'Avertissement', 'Informations juridiques localisées'],
  de: ['Datenschutzerklärung', 'Haftungsausschluss', 'Lokalisierte Rechtsinformationen'],
  ja: ['プライバシーポリシー', '免責事項', 'ローカライズされた法的情報'],
  ko: ['개인정보 처리방침', '면책 고지', '현지화된 법적 정보'],
  'pt-BR': ['Política de privacidade', 'Aviso legal', 'Informações legais localizadas'],
  it: ['Informativa sulla privacy', 'Dichiarazione di esclusione', 'Informazioni legali localizzate'],
  ru: ['Политика конфиденциальности', 'Отказ от ответственности', 'Локализованная правовая информация'],
  ar: ['سياسة الخصوصية', 'إخلاء المسؤولية', 'معلومات قانونية مترجمة'],
  hi: ['गोपनीयता नीति', 'अस्वीकरण', 'स्थानीयकृत कानूनी जानकारी'],
  id: ['Kebijakan privasi', 'Penafian', 'Informasi hukum lokal'],
  tr: ['Gizlilik politikası', 'Sorumluluk reddi', 'Yerelleştirilmiş hukuki bilgi'],
  vi: ['Chính sách quyền riêng tư', 'Tuyên bố miễn trừ', 'Thông tin pháp lý bản địa hóa']
}

function makeDocument(localeId, type) {
  const titles = TITLES[localeId] || TITLES.en
  const sections = type === 'privacy' ? PRIVACY_SECTIONS[localeId] : DISCLAIMER_SECTIONS[localeId]
  return {
    locale: localeId,
    type,
    title: type === 'privacy' ? titles[0] : titles[1],
    summary: titles[2],
    updated: '2026-07-03',
    sections: sections.map(([heading, body]) => ({ heading, body }))
  }
}

const LEGAL_DOCUMENTS = Object.fromEntries(
  LEGAL_LOCALES.map((locale) => [
    locale.id,
    {
      privacy: makeDocument(locale.id, 'privacy'),
      disclaimer: makeDocument(locale.id, 'disclaimer')
    }
  ])
)

export function getLegalLocale(localeId) {
  return LEGAL_LOCALES.find((locale) => locale.id === localeId) || LEGAL_LOCALES[0]
}

export function getLegalDocument(type, localeId = 'en') {
  const safeType = type === 'disclaimer' ? 'disclaimer' : 'privacy'
  const locale = getLegalLocale(localeId)
  return LEGAL_DOCUMENTS[locale.id]?.[safeType] || LEGAL_DOCUMENTS.en[safeType]
}
