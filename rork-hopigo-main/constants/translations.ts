export type Language = 'en' | 'es' | 'nl';

export type TranslationKey = 
  | 'hello'
  | 'whatServiceToday'
  | 'noSuggestionsFound'
  | 'currentRide'
  | 'findingDriver'
  | 'driverAssigned'
  | 'driverArriving'
  | 'driverArrived'
  | 'onTheWay'
  | 'needRide'
  | 'bookTaxiSubtitle'
  | 'bookNow'
  | 'scheduleLater'
  | 'scheduleRide'
  | 'popularServices'
  | 'viewAll'
  | 'more'
  | 'onDemand'
  | 'yourWallet'
  | 'availableBalance'
  | 'addMoney'
  | 'sendMoney'
  | 'splitBill'
  | 'recentActivity'
  | 'becomeServiceProvider'
  | 'offerServicesEarn'
  | 'getStarted'
  | 'featuredServices'
  | 'otherServices'
  | 'hopiGoPlus'
  | 'premiumMembership'
  | 'monthlyPrice'
  | 'priorityBooking'
  | 'exclusiveDiscounts'
  | 'premiumSupport'
  | 'freeCancellation'
  | 'upgradeToHopiGoPlus'
  | 'inviteFriendsEarn'
  | 'inviteDescription'
  | 'inviteFriends'
  | 'searchServices'
  | 'categories'
  | 'services'
  | 'clearFilter'
  | 'providersFor'
  | 'allServiceProviders'
  | 'noProvidersFound'
  | 'taxiServices'
  | 'taxiServicesDescription'
  | 'bookTaxi'
  | 'bookATaxi'
  | 'sortBy'
  | 'default'
  | 'highestRated'
  | 'nameAZ'
  | 'settings'
  | 'appPreferences'
  | 'darkMode'
  | 'locationServices'
  | 'reduceDataUsage'
  | 'regionalSettings'
  | 'language'
  | 'currency'
  | 'about'
  | 'termsOfService'
  | 'privacyPolicy'
  | 'appVersion'
  | 'logOut'
  | 'deleteAccount'
  | 'english'
  | 'spanish'
  | 'dutch'
  | 'success'
  | 'error'
  | 'ok'
  | 'cancel'
  | 'delete'
  | 'languageUpdated'
  | 'failedToUpdateLanguage'
  | 'currencyUpdated'
  | 'failedToUpdateCurrency'
  | 'confirmLogout'
  | 'confirmDeleteAccount'
  | 'selectLanguage'
  | 'choosePreferredLanguage'
  | 'selectCurrency'
  | 'choosePreferredCurrency'
  | 'hopiTaxi'
  | 'hopiTaxiDescription'
  | 'notLoggedIn'
  | 'logIn'
  | 'editProfile'
  | 'profile'
  | 'bookings'
  | 'serviceProviderDashboard'
  | 'manageServicesBookings'
  | 'goToDashboard'
  | 'personalInformation'
  | 'paymentMethods'
  | 'notifications'
  | 'security'
  | 'helpSupport'
  | 'version'
  | 'add'
  | 'send'
  | 'split'
  | 'cards'
  | 'recentTransactions'
  | 'noTransactionsYet'
  | 'addFundsToGetStarted';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    hello: 'Hello',
    whatServiceToday: 'What service do you need today?',
    noSuggestionsFound: 'No suggestions found',
    currentRide: 'Current Ride',
    findingDriver: 'Finding driver...',
    driverAssigned: 'Driver assigned',
    driverArriving: 'Driver arriving',
    driverArrived: 'Driver arrived',
    onTheWay: 'On the way',
    needRide: 'Need a ride?',
    bookTaxiSubtitle: 'Quick and reliable taxi service',
    bookNow: 'Book Now',
    scheduleLater: 'Schedule Later',
    scheduleRide: 'Schedule Ride',
    popularServices: 'Popular Services',
    viewAll: 'View All',
    more: 'More',
    onDemand: 'On Demand',
    yourWallet: 'Your Wallet',
    availableBalance: 'Available Balance',
    addMoney: 'Add Money',
    sendMoney: 'Send Money',
    splitBill: 'Split Bill',
    recentActivity: 'Recent Activity',
    becomeServiceProvider: 'Become a Service Provider',
    offerServicesEarn: 'Offer your services and earn money',
    getStarted: 'Get Started',
    featuredServices: 'Featured Services',
    otherServices: 'Other Services',
    hopiGoPlus: 'HopiGo+',
    premiumMembership: 'Premium Membership',
    monthlyPrice: '/month',
    priorityBooking: 'Priority booking',
    exclusiveDiscounts: 'Exclusive discounts',
    premiumSupport: '24/7 premium support',
    freeCancellation: 'Free cancellation',
    upgradeToHopiGoPlus: 'Upgrade to HopiGo+',
    inviteFriendsEarn: 'Invite friends & earn',
    inviteDescription: 'Get rewards for every friend you invite',
    inviteFriends: 'Invite Friends',
    searchServices: 'Search services...',
    categories: 'Categories',
    services: 'Services',
    clearFilter: 'Clear Filter',
    providersFor: 'Providers',
    allServiceProviders: 'All Service Providers',
    noProvidersFound: 'No providers found',
    taxiServices: 'Taxi Services',
    taxiServicesDescription: 'Book a ride with our reliable taxi service. Choose from different vehicle types and enjoy safe, comfortable transportation.',
    bookTaxi: 'Book Taxi',
    bookATaxi: 'Book a Taxi',
    sortBy: 'Sort By',
    default: 'Default',
    highestRated: 'Highest Rated',
    nameAZ: 'Name A-Z',
    settings: 'Settings',
    appPreferences: 'App Preferences',
    darkMode: 'Dark Mode',
    locationServices: 'Location Services',
    reduceDataUsage: 'Reduce Data Usage',
    regionalSettings: 'Regional Settings',
    language: 'Language',
    currency: 'Currency',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    appVersion: 'App Version',
    logOut: 'Log Out',
    deleteAccount: 'Delete Account',
    english: 'English',
    spanish: 'Spanish',
    dutch: 'Dutch',
    success: 'Success',
    error: 'Error',
    ok: 'OK',
    cancel: 'Cancel',
    delete: 'Delete',
    languageUpdated: 'Language updated successfully',
    failedToUpdateLanguage: 'Failed to update language',
    currencyUpdated: 'Currency updated to {currency}',
    failedToUpdateCurrency: 'Failed to update currency',
    confirmLogout: 'Are you sure you want to log out?',
    confirmDeleteAccount: 'Are you sure you want to delete your account? This action cannot be undone.',
    selectLanguage: 'Select Language',
    choosePreferredLanguage: 'Choose your preferred language',
    selectCurrency: 'Select Currency',
    choosePreferredCurrency: 'Choose your preferred currency',
    hopiTaxi: 'Hopi Taxi',
    hopiTaxiDescription: 'Quick and reliable taxi service',
    notLoggedIn: 'You are not logged in',
    logIn: 'Log In',
    editProfile: 'Edit Profile',
    profile: 'Profile',
    bookings: 'Bookings',
    serviceProviderDashboard: 'Service Provider Dashboard',
    manageServicesBookings: 'Manage your services and bookings',
    goToDashboard: 'Go to Dashboard',
    personalInformation: 'Personal Information',
    paymentMethods: 'Payment Methods',
    notifications: 'Notifications',
    security: 'Security',
    helpSupport: 'Help & Support',
    version: 'Version 1.0.0',
    add: 'Add',
    send: 'Send',
    split: 'Split',
    cards: 'Cards',
    recentTransactions: 'Recent Transactions',
    noTransactionsYet: 'No transactions yet',
    addFundsToGetStarted: 'Add funds to get started',
  },
  es: {
    hello: 'Hola',
    whatServiceToday: '¿Qué servicio necesitas hoy?',
    noSuggestionsFound: 'No se encontraron sugerencias',
    currentRide: 'Viaje Actual',
    findingDriver: 'Buscando conductor...',
    driverAssigned: 'Conductor asignado',
    driverArriving: 'Conductor llegando',
    driverArrived: 'Conductor llegó',
    onTheWay: 'En camino',
    needRide: '¿Necesitas un viaje?',
    bookTaxiSubtitle: 'Servicio de taxi rápido y confiable',
    bookNow: 'Reservar Ahora',
    scheduleLater: 'Programar Después',
    scheduleRide: 'Programar Viaje',
    popularServices: 'Servicios Populares',
    viewAll: 'Ver Todo',
    more: 'Más',
    onDemand: 'A Demanda',
    yourWallet: 'Tu Billetera',
    availableBalance: 'Saldo Disponible',
    addMoney: 'Agregar Dinero',
    sendMoney: 'Enviar Dinero',
    splitBill: 'Dividir Cuenta',
    recentActivity: 'Actividad Reciente',
    becomeServiceProvider: 'Conviértete en Proveedor de Servicios',
    offerServicesEarn: 'Ofrece tus servicios y gana dinero',
    getStarted: 'Comenzar',
    featuredServices: 'Servicios Destacados',
    otherServices: 'Otros Servicios',
    hopiGoPlus: 'HopiGo+',
    premiumMembership: 'Membresía Premium',
    monthlyPrice: '/mes',
    priorityBooking: 'Reserva prioritaria',
    exclusiveDiscounts: 'Descuentos exclusivos',
    premiumSupport: 'Soporte premium 24/7',
    freeCancellation: 'Cancelación gratuita',
    upgradeToHopiGoPlus: 'Actualizar a HopiGo+',
    inviteFriendsEarn: 'Invita amigos y gana',
    inviteDescription: 'Obtén recompensas por cada amigo que invites',
    inviteFriends: 'Invitar Amigos',
    searchServices: 'Buscar servicios...',
    categories: 'Categorías',
    services: 'Servicios',
    clearFilter: 'Limpiar Filtro',
    providersFor: 'Proveedores',
    allServiceProviders: 'Todos los Proveedores de Servicios',
    noProvidersFound: 'No se encontraron proveedores',
    taxiServices: 'Servicios de Taxi',
    taxiServicesDescription: 'Reserva un viaje con nuestro servicio de taxi confiable. Elige entre diferentes tipos de vehículos y disfruta de transporte seguro y cómodo.',
    bookTaxi: 'Reservar Taxi',
    bookATaxi: 'Reservar un Taxi',
    sortBy: 'Ordenar Por',
    default: 'Predeterminado',
    highestRated: 'Mejor Calificado',
    nameAZ: 'Nombre A-Z',
    settings: 'Configuración',
    appPreferences: 'Preferencias de la App',
    darkMode: 'Modo Oscuro',
    locationServices: 'Servicios de Ubicación',
    reduceDataUsage: 'Reducir Uso de Datos',
    regionalSettings: 'Configuración Regional',
    language: 'Idioma',
    currency: 'Moneda',
    about: 'Acerca de',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    appVersion: 'Versión de la App',
    logOut: 'Cerrar Sesión',
    deleteAccount: 'Eliminar Cuenta',
    english: 'Inglés',
    spanish: 'Español',
    dutch: 'Holandés',
    success: 'Éxito',
    error: 'Error',
    ok: 'OK',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    languageUpdated: 'Idioma actualizado exitosamente',
    failedToUpdateLanguage: 'Error al actualizar idioma',
    currencyUpdated: 'Moneda actualizada a {currency}',
    failedToUpdateCurrency: 'Error al actualizar moneda',
    confirmLogout: '¿Estás seguro de que quieres cerrar sesión?',
    confirmDeleteAccount: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
    selectLanguage: 'Seleccionar Idioma',
    choosePreferredLanguage: 'Elige tu idioma preferido',
    selectCurrency: 'Seleccionar Moneda',
    choosePreferredCurrency: 'Elige tu moneda preferida',
    hopiTaxi: 'Hopi Taxi',
    hopiTaxiDescription: 'Servicio de taxi rápido y confiable',
    notLoggedIn: 'No has iniciado sesión',
    logIn: 'Iniciar Sesión',
    editProfile: 'Editar Perfil',
    profile: 'Perfil',
    bookings: 'Reservas',
    serviceProviderDashboard: 'Panel de Proveedor de Servicios',
    manageServicesBookings: 'Gestiona tus servicios y reservas',
    goToDashboard: 'Ir al Panel',
    personalInformation: 'Información Personal',
    paymentMethods: 'Métodos de Pago',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    helpSupport: 'Ayuda y Soporte',
    version: 'Versión 1.0.0',
    add: 'Agregar',
    send: 'Enviar',
    split: 'Dividir',
    cards: 'Tarjetas',
    recentTransactions: 'Transacciones Recientes',
    noTransactionsYet: 'Aún no hay transacciones',
    addFundsToGetStarted: 'Agrega fondos para comenzar',
  },
  nl: {
    hello: 'Hallo',
    whatServiceToday: 'Welke service heb je vandaag nodig?',
    noSuggestionsFound: 'Geen suggesties gevonden',
    currentRide: 'Huidige Rit',
    findingDriver: 'Chauffeur zoeken...',
    driverAssigned: 'Chauffeur toegewezen',
    driverArriving: 'Chauffeur komt eraan',
    driverArrived: 'Chauffeur is gearriveerd',
    onTheWay: 'Onderweg',
    needRide: 'Een rit nodig?',
    bookTaxiSubtitle: 'Snelle en betrouwbare taxiservice',
    bookNow: 'Nu Boeken',
    scheduleLater: 'Later Plannen',
    scheduleRide: 'Rit Plannen',
    popularServices: 'Populaire Services',
    viewAll: 'Alles Bekijken',
    more: 'Meer',
    onDemand: 'Op Aanvraag',
    yourWallet: 'Je Portemonnee',
    availableBalance: 'Beschikbaar Saldo',
    addMoney: 'Geld Toevoegen',
    sendMoney: 'Geld Versturen',
    splitBill: 'Rekening Splitsen',
    recentActivity: 'Recente Activiteit',
    becomeServiceProvider: 'Word Serviceverlener',
    offerServicesEarn: 'Bied je diensten aan en verdien geld',
    getStarted: 'Aan de Slag',
    featuredServices: 'Uitgelichte Services',
    otherServices: 'Andere Services',
    hopiGoPlus: 'HopiGo+',
    premiumMembership: 'Premium Lidmaatschap',
    monthlyPrice: '/maand',
    priorityBooking: 'Prioriteit boeking',
    exclusiveDiscounts: 'Exclusieve kortingen',
    premiumSupport: '24/7 premium ondersteuning',
    freeCancellation: 'Gratis annulering',
    upgradeToHopiGoPlus: 'Upgrade naar HopiGo+',
    inviteFriendsEarn: 'Nodig vrienden uit en verdien',
    inviteDescription: 'Krijg beloningen voor elke vriend die je uitnodigt',
    inviteFriends: 'Vrienden Uitnodigen',
    searchServices: 'Services zoeken...',
    categories: 'Categorieën',
    services: 'Services',
    clearFilter: 'Filter Wissen',
    providersFor: 'Aanbieders',
    allServiceProviders: 'Alle Serviceverleners',
    noProvidersFound: 'Geen aanbieders gevonden',
    taxiServices: 'Taxi Services',
    taxiServicesDescription: 'Boek een rit met onze betrouwbare taxiservice. Kies uit verschillende voertuigtypes en geniet van veilig, comfortabel vervoer.',
    bookTaxi: 'Taxi Boeken',
    bookATaxi: 'Een Taxi Boeken',
    sortBy: 'Sorteren Op',
    default: 'Standaard',
    highestRated: 'Hoogst Beoordeeld',
    nameAZ: 'Naam A-Z',
    settings: 'Instellingen',
    appPreferences: 'App Voorkeuren',
    darkMode: 'Donkere Modus',
    locationServices: 'Locatieservices',
    reduceDataUsage: 'Datagebruik Verminderen',
    regionalSettings: 'Regionale Instellingen',
    language: 'Taal',
    currency: 'Valuta',
    about: 'Over',
    termsOfService: 'Servicevoorwaarden',
    privacyPolicy: 'Privacybeleid',
    appVersion: 'App Versie',
    logOut: 'Uitloggen',
    deleteAccount: 'Account Verwijderen',
    english: 'Engels',
    spanish: 'Spaans',
    dutch: 'Nederlands',
    success: 'Succes',
    error: 'Fout',
    ok: 'OK',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    languageUpdated: 'Taal succesvol bijgewerkt',
    failedToUpdateLanguage: 'Taal bijwerken mislukt',
    currencyUpdated: 'Valuta bijgewerkt naar {currency}',
    failedToUpdateCurrency: 'Valuta bijwerken mislukt',
    confirmLogout: 'Weet je zeker dat je wilt uitloggen?',
    confirmDeleteAccount: 'Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.',
    selectLanguage: 'Taal Selecteren',
    choosePreferredLanguage: 'Kies je voorkeurstaal',
    selectCurrency: 'Valuta Selecteren',
    choosePreferredCurrency: 'Kies je voorkeursvaluta',
    hopiTaxi: 'Hopi Taxi',
    hopiTaxiDescription: 'Snelle en betrouwbare taxiservice',
    notLoggedIn: 'Je bent niet ingelogd',
    logIn: 'Inloggen',
    editProfile: 'Profiel Bewerken',
    profile: 'Profiel',
    bookings: 'Boekingen',
    serviceProviderDashboard: 'Serviceverlener Dashboard',
    manageServicesBookings: 'Beheer je services en boekingen',
    goToDashboard: 'Ga naar Dashboard',
    personalInformation: 'Persoonlijke Informatie',
    paymentMethods: 'Betaalmethoden',
    notifications: 'Meldingen',
    security: 'Beveiliging',
    helpSupport: 'Hulp & Ondersteuning',
    version: 'Versie 1.0.0',
    add: 'Toevoegen',
    send: 'Versturen',
    split: 'Splitsen',
    cards: 'Kaarten',
    recentTransactions: 'Recente Transacties',
    noTransactionsYet: 'Nog geen transacties',
    addFundsToGetStarted: 'Voeg geld toe om te beginnen',
  },
};