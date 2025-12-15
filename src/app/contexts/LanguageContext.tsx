'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ENGLISH' | 'TAGALOG' | 'BISAYA';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ENGLISH');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ENGLISH', 'TAGALOG', 'BISAYA'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (isClient) {
      localStorage.setItem('language', newLanguage);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['ENGLISH'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
const translations: Record<Language, Record<string, string>> = {
  ENGLISH: {
    // Welcome Screen
    'welcome.title': 'Welcome to E-Sulat',
    'welcome.description': 'Your personal notes and notepad app. Create, organize, and manage your notes with ease. Keep track of your thoughts, ideas, and reminders all in one place.',
    'welcome.dontShowAgain': "Don't show me again",
    'welcome.getStarted': 'Get Started',

    // Main Screen
    'main.title': 'E-Sulat',
    'main.folders': 'Folders',
    'main.noFolders': 'No folders yet',
    'main.noFoldersDesc': 'Create folders to organize your notes',
    'main.createFirstFolder': 'Create First Folder',
    'main.newFolder': 'New Folder',
    'main.folderName': 'Folder name',
    'main.cancel': 'Cancel',
    'main.create': 'Create',
    'main.created': 'Created',

    // Folder Screen
    'folder.all': 'All',
    'folder.pending': 'Pending',
    'folder.done': 'Done',
    'folder.select': 'Select',
    'folder.cancel': 'Cancel',
    'folder.selectAll': 'Select All',
    'folder.unselectAll': 'Unselect All',
    'folder.archive': 'Archive',
    'folder.delete': 'Delete',
    'folder.noNotes': 'No notes yet',
    'folder.noNotesDesc': 'Start creating notes to organize your thoughts',
    'folder.createFirstNote': 'Create First Note',
    'folder.newNote': 'New Note',
    'folder.noteTitle': 'Note title',
    'folder.whatsOnMind': "What's on your mind?",

    // Note Status
    'status.pending': '⏳ Pending',
    'status.completed': '✓ Done',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.helpCenter': 'Help Center',
    'settings.contactSupport': 'Contact Support',
    'settings.version': 'Version',
    'settings.termsOfService': 'Terms of Service',

    // Navigation
    'nav.notes': 'Notes',
    'nav.archive': 'Archive',
    'nav.trash': 'Trash',
    'nav.reminder': 'Reminder',
    'nav.settings': 'Settings',
    'nav.exit': 'Exit App',
    'nav.menu': 'Menu',
    'nav.navigate': 'Navigate your workspace',

    // Archive
    'archive.title': 'Archive',
    'archive.noItems': 'No archived items',
    'archive.noItemsDesc': 'Archived notes and folders will appear here',
    'archive.archived': 'Archived',

    // Trash
    'trash.title': 'Trash',
    'trash.noItems': 'Trash is empty',
    'trash.noItemsDesc': 'Deleted items will appear here',
    'trash.deleted': 'Deleted',
    'trash.restore': 'Restore',
    'trash.permanentDelete': 'Delete Forever',
    'trash.autoDelete': 'Items in trash will be deleted after 30 days',
    'trash.emptyTrash': 'Empty Trash',
    'trash.confirmDelete': 'Are you sure you want to delete',
    'trash.confirmEmptyTrash': 'Are you sure you want to permanently delete all',
    'trash.itemsInTrash': 'items in trash',
    'trash.cannotUndo': 'This action cannot be undone.',
    'trash.daysLeft': 'days left',

    // Reminder
    'reminder.title': 'Reminders',
    'reminder.noReminders': 'No reminders set',
    'reminder.noRemindersDesc': 'Create reminders to stay organized',
    'reminder.createFirstReminder': 'Create First Reminder',

    // Help Center
    'help.title': 'Help Center',
    'help.howToUse': 'How to use E-Sulat',
    'help.creatingNotes': 'Creating Notes',
    'help.creatingNotesDesc': '1. Create a new folder from the main page\n2. Open the folder and tap the + button\n3. Enter a title for your note\n4. Start writing your content',
    'help.organizingNotes': 'Organizing Notes',
    'help.organizingNotesDesc': '• Use folders to organize your notes by topic\n• Mark notes as pending or completed\n• Archive notes you want to keep but don\'t need active\n• Delete notes you no longer need',
    'help.customizingNotes': 'Customizing Notes',
    'help.customizingNotesDesc': '• Change the theme color of individual notes\n• Select different fonts for better readability\n• Upload and manage images in your notes',
    'help.managingData': 'Managing Data',
    'help.managingDataDesc': '• Archived notes can be restored from the Archive page\n• Deleted notes go to Trash and can be restored\n• Permanently delete notes from Trash when no longer needed',

    // Contact Support
    'contact.title': 'Contact Support',
    'contact.getInTouch': 'Get in Touch',
    'contact.emailSupport': 'Email Support',
    'contact.emailSupportDesc': 'For technical issues or general inquiries:',
    'contact.responseTime': 'Response Time',
    'contact.responseTimeDesc': 'We typically respond to support requests within 24-48 hours during business days.',
    'contact.whatToInclude': 'What to Include',
    'contact.whatToIncludeDesc': 'When contacting support, please include:\n• Description of the issue\n• Steps to reproduce the problem\n• Your device and browser information\n• Screenshots if applicable',
    'contact.feedback': 'Feedback',
    'contact.feedbackDesc': 'We love hearing from our users! Send us your suggestions and feedback to help improve E-Sulat.',

    // Version
    'version.title': 'Version',
    'version.appName': 'E-Sulat',
    'version.appDesc': 'Your personal notes and reminder app',
    'version.version': 'Version:',
    'version.build': 'Build:',
    'version.platform': 'Platform:',
    'version.framework': 'Framework:',
    'version.whatsNew': 'What\'s New',
    'version.feature1': '• Create and organize notes in folders',
    'version.feature2': '• Customize note themes and fonts',
    'version.feature3': '• Archive and trash functionality',
    'version.feature4': '• Multi-language support',
    'version.feature5': '• Responsive design for all devices',

    // Terms of Service
    'terms.title': 'Terms of Service',
    'terms.acceptance': '1. Acceptance of Terms',
    'terms.acceptanceDesc': 'By using E-Sulat, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.',
    'terms.description': '2. Description of Service',
    'terms.descriptionDesc': 'E-Sulat is a personal note-taking and reminder application that allows users to create, organize, and manage their notes and reminders.',
    'terms.userData': '3. User Data',
    'terms.userDataDesc': 'Your notes and data are stored locally on your device. We do not collect, store, or transmit your personal notes or content to external servers.',
    'terms.privacy': '4. Privacy',
    'terms.privacyDesc': 'We respect your privacy. All your notes and personal information remain on your device and are not shared with third parties.',
    'terms.acceptableUse': '5. Acceptable Use',
    'terms.acceptableUseDesc': 'You agree to use E-Sulat only for lawful purposes and in accordance with these Terms of Service. You are responsible for all content you create.',
    'terms.limitation': '6. Limitation of Liability',
    'terms.limitationDesc': 'E-Sulat is provided "as is" without warranties of any kind. We are not liable for any loss of data or damages arising from the use of this application.',
    'terms.changes': '7. Changes to Terms',
    'terms.changesDesc': 'We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of any changes.',
    'terms.lastUpdated': 'Last updated: December 14, 2024',

    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.chooseAction': 'Choose an action',
  },

  TAGALOG: {
    // Welcome Screen
    'welcome.title': 'Maligayang pagdating sa E-Sulat',
    'welcome.description': 'Ang inyong personal na notes at notepad app. Lumikha, mag-organisa, at pamahalaan ang inyong mga tala nang madali. Panatilihin ang inyong mga kaisipan, ideya, at mga paalala sa isang lugar.',
    'welcome.dontShowAgain': 'Huwag nang ipakita muli',
    'welcome.getStarted': 'Magsimula',

    // Main Screen
    'main.title': 'E-Sulat',
    'main.folders': 'Mga Folder',
    'main.noFolders': 'Walang mga folder pa',
    'main.noFoldersDesc': 'Lumikha ng mga folder para sa inyong mga tala',
    'main.createFirstFolder': 'Lumikha ng Unang Folder',
    'main.newFolder': 'Bagong Folder',
    'main.folderName': 'Pangalan ng folder',
    'main.cancel': 'Kanselahin',
    'main.create': 'Lumikha',
    'main.created': 'Nilikha',

    // Folder Screen
    'folder.all': 'Lahat',
    'folder.pending': 'Naghihintay',
    'folder.done': 'Tapos na',
    'folder.select': 'Piliin',
    'folder.cancel': 'Kanselahin',
    'folder.selectAll': 'Piliin Lahat',
    'folder.unselectAll': 'Huwag Piliin Lahat',
    'folder.archive': 'I-archive',
    'folder.delete': 'Tanggalin',
    'folder.noNotes': 'Walang mga tala pa',
    'folder.noNotesDesc': 'Magsimulang lumikha ng mga tala para sa inyong kaisipan',
    'folder.createFirstNote': 'Lumikha ng Unang Tala',
    'folder.newNote': 'Bagong Tala',
    'folder.noteTitle': 'Pamagat ng tala',
    'folder.whatsOnMind': 'Ano ang nasa isip ninyo?',

    // Note Status
    'status.pending': '⏳ Naghihintay',
    'status.completed': '✓ Tapos na',

    // Settings
    'settings.title': 'Mga Setting',
    'settings.language': 'Wika',
    'settings.helpCenter': 'Help Center',
    'settings.contactSupport': 'Makipag-ugnayan sa Support',
    'settings.version': 'Bersyon',
    'settings.termsOfService': 'Mga Tuntunin ng Serbisyo',

    // Navigation
    'nav.notes': 'Mga Tala',
    'nav.archive': 'Archive',
    'nav.trash': 'Basurahan',
    'nav.reminder': 'Paalala',
    'nav.settings': 'Mga Setting',
    'nav.exit': 'Lumabas sa App',
    'nav.menu': 'Menu',
    'nav.navigate': 'Mag-navigate sa inyong workspace',

    // Archive
    'archive.title': 'Archive',
    'archive.noItems': 'Walang naka-archive na mga item',
    'archive.noItemsDesc': 'Ang mga naka-archive na tala at folder ay lalabas dito',
    'archive.archived': 'Naka-archive',

    // Trash
    'trash.title': 'Basurahan',
    'trash.noItems': 'Walang laman ang basurahan',
    'trash.noItemsDesc': 'Ang mga tinanggal na item ay lalabas dito',
    'trash.deleted': 'Tinanggal',
    'trash.restore': 'Ibalik',
    'trash.permanentDelete': 'Tanggalin Nang Tuluyan',
    'trash.autoDelete': 'Ang mga item sa basurahan ay matatanggal pagkatapos ng 30 araw',
    'trash.emptyTrash': 'Burahin ang Basurahan',
    'trash.confirmDelete': 'Sigurado ba kayong gusto ninyong tanggalin',
    'trash.confirmEmptyTrash': 'Sigurado ba kayong gusto ninyong tanggalin nang tuluyan ang lahat ng',
    'trash.itemsInTrash': 'mga item sa basurahan',
    'trash.cannotUndo': 'Hindi na ito maaaring ibalik.',
    'trash.daysLeft': 'araw na natitira',

    // Reminder
    'reminder.title': 'Mga Paalala',
    'reminder.noReminders': 'Walang mga paalala',
    'reminder.noRemindersDesc': 'Lumikha ng mga paalala para manatiling organisado',
    'reminder.createFirstReminder': 'Lumikha ng Unang Paalala',

    // Help Center
    'help.title': 'Help Center',
    'help.howToUse': 'Paano gamitin ang E-Sulat',
    'help.creatingNotes': 'Paggawa ng mga Tala',
    'help.creatingNotesDesc': '1. Lumikha ng bagong folder mula sa pangunahing pahina\n2. Buksan ang folder at i-tap ang + button\n3. Maglagay ng pamagat para sa inyong tala\n4. Magsimulang magsulat ng inyong nilalaman',
    'help.organizingNotes': 'Pag-organisa ng mga Tala',
    'help.organizingNotesDesc': '• Gamitin ang mga folder para sa pag-organisa ng inyong mga tala ayon sa paksa\n• Markahan ang mga tala bilang naghihintay o tapos na\n• I-archive ang mga talang gusto ninyong panatilihin pero hindi na kailangan\n• Tanggalin ang mga talang hindi na ninyo kailangan',
    'help.customizingNotes': 'Pag-customize ng mga Tala',
    'help.customizingNotesDesc': '• Baguhin ang kulay ng tema ng bawat tala\n• Pumili ng iba\'t ibang font para sa mas magandang pagbabasa\n• Magdagdag ng mga larawan sa inyong mga tala (malapit na)',
    'help.managingData': 'Pamamahala ng Data',
    'help.managingDataDesc': '• Ang mga naka-archive na tala ay maaaring maibalik mula sa Archive page\n• Ang mga tinanggal na tala ay napupunta sa Basurahan at maaaring maibalik\n• Tanggalin nang tuluyan ang mga tala mula sa Basurahan kapag hindi na kailangan',

    // Contact Support
    'contact.title': 'Makipag-ugnayan sa Support',
    'contact.getInTouch': 'Makipag-ugnayan',
    'contact.emailSupport': 'Email Support',
    'contact.emailSupportDesc': 'Para sa mga teknikal na isyu o pangkalahatang katanungan:',
    'contact.responseTime': 'Oras ng Pagtugon',
    'contact.responseTimeDesc': 'Karaniwang tumutugon kami sa mga support request sa loob ng 24-48 oras sa mga araw ng negosyo.',
    'contact.whatToInclude': 'Ano ang Isasama',
    'contact.whatToIncludeDesc': 'Kapag nakikipag-ugnayan sa support, mangyaring isama:\n• Paglalarawan ng isyu\n• Mga hakbang para maulit ang problema\n• Impormasyon ng inyong device at browser\n• Mga screenshot kung naaangkop',
    'contact.feedback': 'Feedback',
    'contact.feedbackDesc': 'Gusto naming marinig ang mga user namin! Ipadala sa amin ang inyong mga mungkahi at feedback para mapabuti ang E-Sulat.',

    // Version
    'version.title': 'Bersyon',
    'version.appName': 'E-Sulat',
    'version.appDesc': 'Ang inyong personal na notes at reminder app',
    'version.version': 'Bersyon:',
    'version.build': 'Build:',
    'version.platform': 'Platform:',
    'version.framework': 'Framework:',
    'version.whatsNew': 'Ano ang Bago',
    'version.feature1': '• Lumikha at mag-organisa ng mga tala sa mga folder',
    'version.feature2': '• I-customize ang mga tema at font ng tala',
    'version.feature3': '• Archive at trash functionality',
    'version.feature4': '• Multi-language support',
    'version.feature5': '• Responsive design para sa lahat ng device',

    // Terms of Service
    'terms.title': 'Mga Tuntunin ng Serbisyo',
    'terms.acceptance': '1. Pagtanggap ng mga Tuntunin',
    'terms.acceptanceDesc': 'Sa paggamit ng E-Sulat, sumasang-ayon kayo na sundin ang mga Tuntunin ng Serbisyo na ito. Kung hindi kayo sumasang-ayon sa mga tuntuning ito, mangyaring huwag gamitin ang aming application.',
    'terms.description': '2. Paglalarawan ng Serbisyo',
    'terms.descriptionDesc': 'Ang E-Sulat ay isang personal na note-taking at reminder application na nagbibigay-daan sa mga user na lumikha, mag-organisa, at pamahalaan ang kanilang mga tala at paalala.',
    'terms.userData': '3. Data ng User',
    'terms.userDataDesc': 'Ang inyong mga tala at data ay naka-store locally sa inyong device. Hindi namin kinokolekta, naka-store, o pinapadala ang inyong personal na mga tala o nilalaman sa external servers.',
    'terms.privacy': '4. Privacy',
    'terms.privacyDesc': 'Ginagalang namin ang inyong privacy. Lahat ng inyong mga tala at personal na impormasyon ay nananatili sa inyong device at hindi ibinabahagi sa mga third party.',
    'terms.acceptableUse': '5. Katanggap-tanggap na Paggamit',
    'terms.acceptableUseDesc': 'Sumasang-ayon kayong gamitin ang E-Sulat para lamang sa mga layuning legal at ayon sa mga Tuntunin ng Serbisyo na ito. Kayo ang responsable sa lahat ng nilalaman na inyong ginagawa.',
    'terms.limitation': '6. Limitasyon ng Pananagutan',
    'terms.limitationDesc': 'Ang E-Sulat ay ibinibigay "as is" nang walang anumang warranty. Hindi kami mananagot sa anumang pagkawala ng data o pinsala na dulot ng paggamit ng application na ito.',
    'terms.changes': '7. Mga Pagbabago sa mga Tuntunin',
    'terms.changesDesc': 'Nakalaan namin ang karapatan na baguhin ang mga tuntuning ito anumang oras. Ang patuloy na paggamit ng application ay nagpapahiwatig ng pagtanggap sa anumang mga pagbabago.',
    'terms.lastUpdated': 'Huling na-update: Disyembre 14, 2024',

    // Common
    'common.back': 'Bumalik',
    'common.save': 'I-save',
    'common.edit': 'I-edit',
    'common.delete': 'Tanggalin',
    'common.confirm': 'Kumpirmahin',
    'common.loading': 'Naglo-load...',
    'common.chooseAction': 'Pumili ng aksyon',
  },

  BISAYA: {
    // Welcome Screen
    'welcome.title': 'Maayong pag-abot sa E-Sulat',
    'welcome.description': 'Ang inyong personal nga notes ug notepad app. Paghimo, pag-organisa, ug pagdumala sa inyong mga nota nga sayon. Tipigi ang inyong mga hunahuna, ideya, ug mga pahinumdom sa usa ka lugar.',
    'welcome.dontShowAgain': 'Ayaw nang ipakita pag-usab',
    'welcome.getStarted': 'Magsugod',

    // Main Screen
    'main.title': 'E-Sulat',
    'main.folders': 'Mga Folder',
    'main.noFolders': 'Walay mga folder pa',
    'main.noFoldersDesc': 'Paghimo og mga folder para sa inyong mga nota',
    'main.createFirstFolder': 'Paghimo og Una nga Folder',
    'main.newFolder': 'Bag-ong Folder',
    'main.folderName': 'Ngalan sa folder',
    'main.cancel': 'Kanselahon',
    'main.create': 'Himoon',
    'main.created': 'Nahimo',

    // Folder Screen
    'folder.all': 'Tanan',
    'folder.pending': 'Wa pa kahuman',
    'folder.done': 'Nahuman na',
    'folder.select': 'Pilia',
    'folder.cancel': 'Kanselahon',
    'folder.selectAll': 'Pilia Tanan',
    'folder.unselectAll': 'Ayaw Pilia Tanan',
    'folder.archive': 'I-archive',
    'folder.delete': 'Tangtangon',
    'folder.noNotes': 'Walay mga nota pa',
    'folder.noNotesDesc': 'Magsugod og paghimo og mga nota para sa inyong hunahuna',
    'folder.createFirstNote': 'Paghimo og Una nga Nota',
    'folder.newNote': 'Bag-ong Nota',
    'folder.noteTitle': 'Titulo sa nota',
    'folder.whatsOnMind': 'Unsa may naa sa inyong hunahuna?',

    // Note Status
    'status.pending': '⏳ Wa pa kahuman',
    'status.completed': '✓ Nahuman na',

    // Settings
    'settings.title': 'Mga Setting',
    'settings.language': 'Pinulongan',
    'settings.helpCenter': 'Help Center',
    'settings.contactSupport': 'Kontak sa Support',
    'settings.version': 'Bersyon',
    'settings.termsOfService': 'Mga Kondisyon sa Serbisyo',

    // Navigation
    'nav.notes': 'Mga Nota',
    'nav.archive': 'Arkibo',
    'nav.trash': 'Basurahan',
    'nav.reminder': 'Pahinumdom',
    'nav.settings': 'Mga Setting',
    'nav.exit': 'Gawas sa App',
    'nav.menu': 'Menu',
    'nav.navigate': 'Mag-navigate sa inyong workspace',

    // Archive
    'archive.title': 'Arkibo',
    'archive.noItems': 'Walay naka-archive nga mga item',
    'archive.noItemsDesc': 'Ang mga naka-archive nga nota ug folder makita dinhi',
    'archive.archived': 'Naka-archive',

    // Trash
    'trash.title': 'Basurahan',
    'trash.noItems': 'Walay sulod ang basurahan',
    'trash.noItemsDesc': 'Ang mga gitangtang nga item makita dinhi',
    'trash.deleted': 'Gitangtang',
    'trash.restore': 'Ibalik',
    'trash.permanentDelete': 'Tangtangon sa Hingpit',
    'trash.autoDelete': 'Ang mga item sa basurahan matangtang pagkahuman sa 30 ka adlaw',
    'trash.emptyTrash': 'Huwagon ang Basurahan',
    'trash.confirmDelete': 'Sigurado ba mo nga gusto nimo tangtangon',
    'trash.confirmEmptyTrash': 'Sigurado ba mo nga gusto nimo tangtangon sa hingpit ang tanan nga',
    'trash.itemsInTrash': 'mga item sa basurahan',
    'trash.cannotUndo': 'Dili na ni mabalik.',
    'trash.daysLeft': 'ka adlaw na natira',

    // Reminder
    'reminder.title': 'Mga Pahinumdom',
    'reminder.noReminders': 'Walay mga pahinumdom',
    'reminder.noRemindersDesc': 'Paghimo og mga pahinumdom aron magpabilin nga organisado',
    'reminder.createFirstReminder': 'Paghimo og Una nga Pahinumdom',

    // Help Center
    'help.title': 'Help Center',
    'help.howToUse': 'Unsaon paggamit ang E-Sulat',
    'help.creatingNotes': 'Paghimo og mga Nota',
    'help.creatingNotesDesc': '1. Paghimo og bag-ong folder gikan sa panguna nga pahina\n2. Ablihi ang folder ug i-tap ang + button\n3. Ibutang ang titulo para sa inyong nota\n4. Magsugod og pagsulat sa inyong sulod',
    'help.organizingNotes': 'Pag-organisa sa mga Nota',
    'help.organizingNotesDesc': '• Gamita ang mga folder para sa pag-organisa sa inyong mga nota sumala sa hilisgutan\n• Markahi ang mga nota nga naghulat o nahuman na\n• I-archive ang mga nota nga gusto ninyong tipigan pero dili na kinahanglan\n• Tangtanga ang mga nota nga dili na ninyo kinahanglan',
    'help.customizingNotes': 'Pag-customize sa mga Nota',
    'help.customizingNotesDesc': '• Usba ang kolor sa tema sa matag nota\n• Pilia ang lain-laing font para sa mas maayong pagbasa\n• Idugang ang mga hulagway sa inyong mga nota (hapit na)',
    'help.managingData': 'Pagdumala sa Data',
    'help.managingDataDesc': '• Ang mga naka-archive nga nota mahimong maibalik gikan sa Archive page\n• Ang mga gitangtang nga nota moadto sa Basurahan ug mahimong maibalik\n• Tangtanga sa hingpit ang mga nota gikan sa Basurahan kung dili na kinahanglan',

    // Contact Support
    'contact.title': 'Kontak sa Support',
    'contact.getInTouch': 'Makig-uban',
    'contact.emailSupport': 'Email Support',
    'contact.emailSupportDesc': 'Para sa mga teknikal nga isyu o kinatibuk-ang mga pangutana:',
    'contact.responseTime': 'Oras sa Pagtubag',
    'contact.responseTimeDesc': 'Kasagaran motubag mi sa mga support request sulod sa 24-48 ka oras sa mga adlaw sa negosyo.',
    'contact.whatToInclude': 'Unsa ang Iapil',
    'contact.whatToIncludeDesc': 'Kung makig-uban sa support, palihug iapil:\n• Paghulagway sa isyu\n• Mga lakang aron masubli ang problema\n• Impormasyon sa inyong device ug browser\n• Mga screenshot kung angay',
    'contact.feedback': 'Feedback',
    'contact.feedbackDesc': 'Gusto namong madungog ang among mga user! Ipadala ninyo kanamo ang inyong mga sugyot ug feedback aron mapauswag ang E-Sulat.',

    // Version
    'version.title': 'Bersyon',
    'version.appName': 'E-Sulat',
    'version.appDesc': 'Ang inyong personal nga notes ug reminder app',
    'version.version': 'Bersyon:',
    'version.build': 'Build:',
    'version.platform': 'Platform:',
    'version.framework': 'Framework:',
    'version.whatsNew': 'Unsa ang Bag-o',
    'version.feature1': '• Paghimo ug pag-organisa sa mga nota sa mga folder',
    'version.feature2': '• I-customize ang mga tema ug font sa nota',
    'version.feature3': '• Archive ug trash functionality',
    'version.feature4': '• Multi-language support',
    'version.feature5': '• Responsive design para sa tanan nga device',

    // Terms of Service
    'terms.title': 'Mga Kondisyon sa Serbisyo',
    'terms.acceptance': '1. Pagdawat sa mga Kondisyon',
    'terms.acceptanceDesc': 'Sa paggamit sa E-Sulat, mouyon kamo nga sundon ang mga Kondisyon sa Serbisyo. Kung dili kamo mouyon sa mga kondisyon, palihug ayaw gamita ang among application.',
    'terms.description': '2. Paghulagway sa Serbisyo',
    'terms.descriptionDesc': 'Ang E-Sulat usa ka personal nga note-taking ug reminder application nga nagtugot sa mga user nga maghimo, mag-organisa, ug pagdumala sa ilang mga nota ug pahinumdom.',
    'terms.userData': '3. Data sa User',
    'terms.userDataDesc': 'Ang inyong mga nota ug data naka-store locally sa inyong device. Wala mi nagkolekta, nag-store, o nagpadala sa inyong personal nga mga nota o sulod sa external servers.',
    'terms.privacy': '4. Privacy',
    'terms.privacyDesc': 'Gitahod namo ang inyong privacy. Tanan ninyong mga nota ug personal nga impormasyon nagpabilin sa inyong device ug dili gipaambit sa mga third party.',
    'terms.acceptableUse': '5. Dawaton nga Paggamit',
    'terms.acceptableUseDesc': 'Mouyon kamo nga gamiton ang E-Sulat para lamang sa mga legal nga katuyoan ug sumala sa mga Kondisyon sa Serbisyo. Kamo ang responsable sa tanan nga sulod nga inyong gihimo.',
    'terms.limitation': '6. Limitasyon sa Responsibilidad',
    'terms.limitationDesc': 'Ang E-Sulat gihatag "as is" nga walay bisan unsang warranty. Dili mi responsable sa bisan unsang pagkawala sa data o kadaot nga resulta sa paggamit sa application.',
    'terms.changes': '7. Mga Kausaban sa mga Kondisyon',
    'terms.changesDesc': 'Nagtago mi sa katungod nga usbon ang mga kondisyon bisan unsang oras. Ang padayon nga paggamit sa application nagpasabot sa pagdawat sa bisan unsang mga kausaban.',
    'terms.lastUpdated': 'Katapusan nga na-update: Disyembre 14, 2024',

    // Common
    'common.back': 'Balik',
    'common.save': 'I-save',
    'common.edit': 'I-edit',
    'common.delete': 'Tangtangon',
    'common.confirm': 'Kumpirmahon',
    'common.loading': 'Nag-load...',
    'common.chooseAction': 'Pilia ang aksyon',
  },
};