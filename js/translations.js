// Translations - English and French
const translations = {
    en: {
        // Header
        appTitle: "Reading Tracker Pro",
        appSubtitle: "Build your reading habit, one page at a time",
        
        // Navigation
        navDashboard: "Dashboard",
        navLibrary: "Library",
        navTimer: "Timer",
        navAchievements: "Achievements",
        navInsights: "Insights",
        navRetrospective: "Retrospective",
        
        // Dashboard Stats
        todayPages: "Today's Pages",
        todayMinutes: "Today's Minutes",
        thisMonth: "This Month",
        dayStreak: "Day Streak",
        thisYear: "This Year",
        
        // Log Reading
        logReading: "Log Reading",
        date: "Date",
        pagesRead: "Pages Read",
        enterPages: "Enter pages",
        minutesRead: "Minutes Read (optional)",
        enterMinutes: "Enter minutes",
        book: "Book",
        selectBook: "Select a book...",
        searchOrSelect: "Search or select a book...",
        notes: "Notes (optional)",
        notesPlaceholder: "Any thoughts about your reading?",
        logSession: "Log Reading Session",
        
        // Goals
        goals: "Goals",
        dailyPageGoal: "Daily Page Goal",
        dailyTimeGoal: "Daily Time Goal",
        yearlyPageGoal: "Yearly Page Goal",
        pages: "pages",
        mins: "mins",
        saveGoals: "Save Goals",
        todaysPagesProgress: "Today's Pages",
        todaysTimeProgress: "Today's Time",
        yearlyProgress: "Yearly Progress",
        
        // Calendar
        weekdaysSun: "Sun",
        weekdaysMon: "Mon",
        weekdaysTue: "Tue",
        weekdaysWed: "Wed",
        weekdaysThu: "Thu",
        weekdaysFri: "Fri",
        weekdaysSat: "Sat",
        less: "Less",
        more: "More",
        
        // Monthly Retrospective (Dashboard)
        monthlyRetrospective: "Monthly Retrospective",
        totalPages: "Total Pages",
        daysRead: "Days Read",
        bestDay: "Best Day",
        totalMinutes: "Total Minutes",
        booksThisMonth: "Books This Month",
        noBooksLogged: "No books logged yet",
        
        // Recent Activity
        recentActivity: "Recent Activity",
        noReadingLogged: "No reading logged yet. Start your journey!",
        
        // Library
        addNewBook: "Add New Book",
        bookTitle: "Book Title",
        enterBookTitle: "Enter book title",
        author: "Author",
        enterAuthor: "Enter author name",
        totalPagesBook: "Total Pages",
        genre: "Genre",
        status: "Status",
        currentlyReading: "Currently Reading",
        toRead: "To Read",
        completed: "Completed",
        addBook: "Add Book",
        
        // Book Details
        isbn: "ISBN",
        publisher: "Publisher",
        publishYear: "Publication Year",
        language: "Language",
        series: "Series",
        seriesNumber: "Series Number",
        format: "Format",
        description: "Description",
        personalNotes: "Personal Notes",
        rating: "Rating",
        startDate: "Start Date",
        endDate: "End Date",
        
        // Book Formats
        formatPaperback: "Paperback",
        formatHardcover: "Hardcover",
        formatEbook: "E-book",
        formatAudiobook: "Audiobook",
        
        // Genres
        genreFiction: "Fiction",
        genreNonFiction: "Non-Fiction",
        genreSciFi: "Science Fiction",
        genreFantasy: "Fantasy",
        genreMystery: "Mystery",
        genreBiography: "Biography",
        genreSelfHelp: "Self-Help",
        genreHistory: "History",
        genreRomance: "Romance",
        genreThriller: "Thriller",
        genreHorror: "Horror",
        genrePoetry: "Poetry",
        genrePhilosophy: "Philosophy",
        genreScience: "Science",
        genreOther: "Other",
        
        // Languages
        langEnglish: "English",
        langFrench: "French",
        langSpanish: "Spanish",
        langGerman: "German",
        langItalian: "Italian",
        langPortuguese: "Portuguese",
        langOther: "Other",
        
        // Library Stats
        libraryStats: "Library Stats",
        myLibrary: "My Library",
        all: "All",
        reading: "Reading",
        noBooksFound: "No books found",
        noBooksInLibrary: "No books in your library yet. Add your first book!",
        
        // Search
        searchBooks: "Search Books Online",
        searchPlaceholder: "Search by title or author...",
        search: "Search",
        searching: "Searching...",
        noResults: "No results found",
        addToLibrary: "Add to Library",
        
        // Timer
        readingTimer: "Reading Timer",
        timerDescription: "Track your reading sessions in real-time",
        start: "Start",
        pause: "Pause",
        reset: "Reset",
        logThisSession: "Log This Session",
        todaysSessions: "Today's Reading Sessions",
        noSessionsToday: "No sessions today yet",
        
        // Achievements
        achievements: "Achievements",
        achievementsDesc: "Unlock achievements as you build your reading habit!",
        progress: "Progress",
        achievementsUnlocked: "Achievements Unlocked",
        unlocked: "Unlocked",
        
        // Achievement Names
        achFirstPage: "First Page",
        achFirstPageDesc: "Log your first reading session",
        achWeekWarrior: "Week Warrior",
        achWeekWarriorDesc: "Maintain a 7-day streak",
        achMonthMaster: "Month Master",
        achMonthMasterDesc: "Maintain a 30-day streak",
        achCenturyReader: "Century Reader",
        achCenturyReaderDesc: "Read 100 pages total",
        achBookworm: "Bookworm",
        achBookwormDesc: "Read 1,000 pages total",
        achPageTurner: "Page Turner",
        achPageTurnerDesc: "Read 5,000 pages total",
        achFirstFinish: "First Finish",
        achFirstFinishDesc: "Complete your first book",
        achShelfBuilder: "Shelf Builder",
        achShelfBuilderDesc: "Complete 5 books",
        achLibraryCurator: "Library Curator",
        achLibraryCuratorDesc: "Complete 10 books",
        achDeepReader: "Deep Reader",
        achDeepReaderDesc: "Read for 60+ minutes in one session",
        achSpeedReader: "Speed Reader",
        achSpeedReaderDesc: "Read 50+ pages in one day",
        achMarathonReader: "Marathon Reader",
        achMarathonReaderDesc: "Read 100+ pages in one day",
        
        // Insights
        readingByDayOfWeek: "Reading by Day of Week",
        monthlyTrends: "Monthly Trends",
        allTimeStats: "All-Time Stats",
        longestStreak: "Longest Streak",
        booksRead: "Books Read",
        bestDayPages: "Best Day (pages)",
        topReadingDays: "Top Reading Days",
        startReadingToSee: "Start reading to see your best days!",
        
        // Retrospective
        monthly: "Monthly",
        yearly: "Yearly",
        avgPagesDay: "Avg Pages/Day",
        booksCompleted: "Books Completed",
        goalAchievement: "Goal Achievement",
        daysGoalMet: "Days Goal Met",
        exceeded: "Exceeded",
        met: "Met",
        missed: "Missed",
        readingConsistency: "Reading Consistency",
        streaks: "Streaks",
        currentStreak: "Current Streak",
        streakCount: "Streak Count",
        days: "days",
        timeDistribution: "Time Distribution",
        top5Days: "Top 5 Days",
        noDataPeriod: "No data for this period",
        genreDistribution: "Genre Distribution",
        personalInsights: "Personal Insights & Recommendations",
        startLoggingInsights: "Start logging your reading to get personalized insights!",
        comparisonPrevious: "Comparison with Previous Period",
        readingNotes: "Reading Notes",
        noNotesPeriod: "No notes for this period. Add notes when logging your reading!",
        noBooksCompleted: "No books completed in this period",
        
        // Export/Import
        backupRestore: "Backup & Restore",
        exportData: "Export Data",
        importData: "Import Data",
        close: "Close",
        
        // Messages
        dataExported: "Data exported successfully!",
        dataImported: "Data imported successfully!",
        invalidFile: "Invalid file format!",
        selectFileImport: "Please select a file to import!",
        enterValidDatePages: "Please enter a valid date and pages!",
        loggedPages: "Logged {pages} pages",
        loggedPagesMinutes: "Logged {pages} pages and {minutes} minutes!",
        goalsSaved: "Goals saved!",
        entryDeleted: "Entry deleted",
        bookAdded: "Added \"{title}\" to your library!",
        enterTitlePages: "Please enter book title and total pages!",
        enterPagesRead: "Please enter pages read!",
        congratsFinished: "🎉 Congratulations! You finished \"{title}\"!",
        achievementUnlocked: "🏆 Achievement Unlocked: {name}!",
        deleteEntry: "Delete this reading entry?",
        deleteBook: "Delete this book from your library?",
        
        // Quotes
        quote1: "A reader lives a thousand lives before he dies.",
        quote1Author: "George R.R. Martin",
        quote2: "The more that you read, the more things you will know.",
        quote2Author: "Dr. Seuss",
        quote3: "Reading is to the mind what exercise is to the body.",
        quote3Author: "Joseph Addison",
        quote4: "Today a reader, tomorrow a leader.",
        quote4Author: "Margaret Fuller",
        quote5: "Books are a uniquely portable magic.",
        quote5Author: "Stephen King",
        quote6: "Reading gives us someplace to go when we have to stay where we are.",
        quote6Author: "Mason Cooley",
        quote7: "One glance at a book and you hear the voice of another person.",
        quote7Author: "Carl Sagan",
        quote8: "Reading is an exercise in empathy.",
        quote8Author: "Malorie Blackman",
        
        // Insights text
        insightAmazingConsistency: "Amazing consistency! You read on {percent}% of days this period.",
        insightGoodProgress: "Good progress! You read on {percent}% of days. Try to increase to 80%!",
        insightBuildConsistency: "You read on {percent}% of days. Setting a daily reminder could help build consistency.",
        insightBestDay: "{day} are your most productive reading days with {pages} total pages.",
        insightIncredibleGrowth: "Incredible growth! You read {percent}% more pages than the previous period!",
        insightImproving: "You're improving! {percent}% more pages than the previous period.",
        insightDropped: "Reading dropped {percent}% from last period. Consider setting smaller daily goals.",
        insightBooksCompleted: "You completed {count} book(s) with an average of {avg} pages each.",
        insightReadingSpeed: "Your reading speed: approximately {speed} pages per hour.",
        insightRecommendation: "To hit your daily goal, try reading {needed} more pages on reading days, or add more reading days.",
        
        // Weekdays full
        sunday: "Sundays",
        monday: "Mondays",
        tuesday: "Tuesdays",
        wednesday: "Wednesdays",
        thursday: "Thursdays",
        friday: "Fridays",
        saturday: "Saturdays",
        
        // Months
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
        
        // Weekly Overview
        weeklyOverview: "Weekly Overview",
        
        // Misc
        year: "Year",
        noChange: "No change",
        new: "New!"
    },
    
    fr: {
        // Header
        appTitle: "Suivi de Lecture Pro",
        appSubtitle: "Construisez votre habitude de lecture, une page à la fois",
        
        // Navigation
        navDashboard: "Tableau de bord",
        navLibrary: "Bibliothèque",
        navTimer: "Minuteur",
        navAchievements: "Succès",
        navInsights: "Statistiques",
        navRetrospective: "Rétrospective",
        
        // Dashboard Stats
        todayPages: "Pages aujourd'hui",
        todayMinutes: "Minutes aujourd'hui",
        thisMonth: "Ce mois",
        dayStreak: "Jours consécutifs",
        thisYear: "Cette année",
        
        // Log Reading
        logReading: "Enregistrer une lecture",
        date: "Date",
        pagesRead: "Pages lues",
        enterPages: "Entrez les pages",
        minutesRead: "Minutes de lecture (optionnel)",
        enterMinutes: "Entrez les minutes",
        book: "Livre",
        selectBook: "Sélectionner un livre...",
        searchOrSelect: "Rechercher ou sélectionner...",
        notes: "Notes (optionnel)",
        notesPlaceholder: "Vos impressions sur votre lecture ?",
        logSession: "Enregistrer la session",
        
        // Goals
        goals: "Objectifs",
        dailyPageGoal: "Objectif quotidien (pages)",
        dailyTimeGoal: "Objectif quotidien (temps)",
        yearlyPageGoal: "Objectif annuel (pages)",
        pages: "pages",
        mins: "min",
        saveGoals: "Enregistrer les objectifs",
        todaysPagesProgress: "Pages aujourd'hui",
        todaysTimeProgress: "Temps aujourd'hui",
        yearlyProgress: "Progression annuelle",
        
        // Calendar
        weekdaysSun: "Dim",
        weekdaysMon: "Lun",
        weekdaysTue: "Mar",
        weekdaysWed: "Mer",
        weekdaysThu: "Jeu",
        weekdaysFri: "Ven",
        weekdaysSat: "Sam",
        less: "Moins",
        more: "Plus",
        
        // Monthly Retrospective (Dashboard)
        monthlyRetrospective: "Rétrospective mensuelle",
        totalPages: "Pages totales",
        daysRead: "Jours de lecture",
        bestDay: "Meilleur jour",
        totalMinutes: "Minutes totales",
        booksThisMonth: "Livres ce mois",
        noBooksLogged: "Aucun livre enregistré",
        
        // Recent Activity
        recentActivity: "Activité récente",
        noReadingLogged: "Aucune lecture enregistrée. Commencez votre aventure !",
        
        // Library
        addNewBook: "Ajouter un livre",
        bookTitle: "Titre du livre",
        enterBookTitle: "Entrez le titre",
        author: "Auteur",
        enterAuthor: "Entrez le nom de l'auteur",
        totalPagesBook: "Nombre de pages",
        genre: "Genre",
        status: "Statut",
        currentlyReading: "En cours de lecture",
        toRead: "À lire",
        completed: "Terminé",
        addBook: "Ajouter le livre",
        
        // Book Details
        isbn: "ISBN",
        publisher: "Éditeur",
        publishYear: "Année de publication",
        language: "Langue",
        series: "Série",
        seriesNumber: "Numéro dans la série",
        format: "Format",
        description: "Description",
        personalNotes: "Notes personnelles",
        rating: "Note",
        startDate: "Date de début",
        endDate: "Date de fin",
        
        // Book Formats
        formatPaperback: "Poche",
        formatHardcover: "Relié",
        formatEbook: "E-book",
        formatAudiobook: "Livre audio",
        
        // Genres
        genreFiction: "Fiction",
        genreNonFiction: "Non-fiction",
        genreSciFi: "Science-fiction",
        genreFantasy: "Fantasy",
        genreMystery: "Policier",
        genreBiography: "Biographie",
        genreSelfHelp: "Développement personnel",
        genreHistory: "Histoire",
        genreRomance: "Romance",
        genreThriller: "Thriller",
        genreHorror: "Horreur",
        genrePoetry: "Poésie",
        genrePhilosophy: "Philosophie",
        genreScience: "Science",
        genreOther: "Autre",
        
        // Languages
        langEnglish: "Anglais",
        langFrench: "Français",
        langSpanish: "Espagnol",
        langGerman: "Allemand",
        langItalian: "Italien",
        langPortuguese: "Portugais",
        langOther: "Autre",
        
        // Library Stats
        libraryStats: "Statistiques de la bibliothèque",
        myLibrary: "Ma bibliothèque",
        all: "Tous",
        reading: "En cours",
        noBooksFound: "Aucun livre trouvé",
        noBooksInLibrary: "Votre bibliothèque est vide. Ajoutez votre premier livre !",
        
        // Search
        searchBooks: "Rechercher des livres en ligne",
        searchPlaceholder: "Rechercher par titre ou auteur...",
        search: "Rechercher",
        searching: "Recherche...",
        noResults: "Aucun résultat",
        addToLibrary: "Ajouter à la bibliothèque",
        
        // Timer
        readingTimer: "Minuteur de lecture",
        timerDescription: "Suivez vos sessions de lecture en temps réel",
        start: "Démarrer",
        pause: "Pause",
        reset: "Réinitialiser",
        logThisSession: "Enregistrer cette session",
        todaysSessions: "Sessions de lecture aujourd'hui",
        noSessionsToday: "Aucune session aujourd'hui",
        
        // Achievements
        achievements: "Succès",
        achievementsDesc: "Débloquez des succès en développant votre habitude de lecture !",
        progress: "Progression",
        achievementsUnlocked: "Succès débloqués",
        unlocked: "Débloqué",
        
        // Achievement Names
        achFirstPage: "Première page",
        achFirstPageDesc: "Enregistrez votre première session de lecture",
        achWeekWarrior: "Guerrier de la semaine",
        achWeekWarriorDesc: "Maintenez une série de 7 jours",
        achMonthMaster: "Maître du mois",
        achMonthMasterDesc: "Maintenez une série de 30 jours",
        achCenturyReader: "Lecteur centenaire",
        achCenturyReaderDesc: "Lisez 100 pages au total",
        achBookworm: "Rat de bibliothèque",
        achBookwormDesc: "Lisez 1 000 pages au total",
        achPageTurner: "Dévoreur de pages",
        achPageTurnerDesc: "Lisez 5 000 pages au total",
        achFirstFinish: "Premier livre terminé",
        achFirstFinishDesc: "Terminez votre premier livre",
        achShelfBuilder: "Constructeur d'étagère",
        achShelfBuilderDesc: "Terminez 5 livres",
        achLibraryCurator: "Conservateur de bibliothèque",
        achLibraryCuratorDesc: "Terminez 10 livres",
        achDeepReader: "Lecteur profond",
        achDeepReaderDesc: "Lisez pendant 60+ minutes en une session",
        achSpeedReader: "Lecteur rapide",
        achSpeedReaderDesc: "Lisez 50+ pages en un jour",
        achMarathonReader: "Lecteur marathon",
        achMarathonReaderDesc: "Lisez 100+ pages en un jour",
        
        // Insights
        readingByDayOfWeek: "Lecture par jour de la semaine",
        monthlyTrends: "Tendances mensuelles",
        allTimeStats: "Statistiques globales",
        longestStreak: "Plus longue série",
        booksRead: "Livres lus",
        bestDayPages: "Meilleur jour (pages)",
        topReadingDays: "Meilleurs jours de lecture",
        startReadingToSee: "Commencez à lire pour voir vos meilleurs jours !",
        
        // Retrospective
        monthly: "Mensuel",
        yearly: "Annuel",
        avgPagesDay: "Moy. pages/jour",
        booksCompleted: "Livres terminés",
        goalAchievement: "Atteinte des objectifs",
        daysGoalMet: "Jours objectif atteint",
        exceeded: "Dépassé",
        met: "Atteint",
        missed: "Manqué",
        readingConsistency: "Régularité de lecture",
        streaks: "Séries",
        currentStreak: "Série actuelle",
        streakCount: "Nombre de séries",
        days: "jours",
        timeDistribution: "Distribution du temps",
        top5Days: "Top 5 des jours",
        noDataPeriod: "Aucune donnée pour cette période",
        genreDistribution: "Distribution par genre",
        personalInsights: "Analyses et recommandations personnelles",
        startLoggingInsights: "Commencez à enregistrer vos lectures pour obtenir des analyses personnalisées !",
        comparisonPrevious: "Comparaison avec la période précédente",
        readingNotes: "Notes de lecture",
        noNotesPeriod: "Aucune note pour cette période. Ajoutez des notes lors de l'enregistrement !",
        noBooksCompleted: "Aucun livre terminé durant cette période",
        
        // Export/Import
        backupRestore: "Sauvegarde et restauration",
        exportData: "Exporter les données",
        importData: "Importer les données",
        close: "Fermer",
        
        // Messages
        dataExported: "Données exportées avec succès !",
        dataImported: "Données importées avec succès !",
        invalidFile: "Format de fichier invalide !",
        selectFileImport: "Veuillez sélectionner un fichier à importer !",
        enterValidDatePages: "Veuillez entrer une date et un nombre de pages valides !",
        loggedPages: "{pages} pages enregistrées",
        loggedPagesMinutes: "{pages} pages et {minutes} minutes enregistrées !",
        goalsSaved: "Objectifs enregistrés !",
        entryDeleted: "Entrée supprimée",
        bookAdded: "« {title} » ajouté à votre bibliothèque !",
        enterTitlePages: "Veuillez entrer le titre et le nombre de pages !",
        enterPagesRead: "Veuillez entrer le nombre de pages lues !",
        congratsFinished: "🎉 Félicitations ! Vous avez terminé « {title} » !",
        achievementUnlocked: "🏆 Succès débloqué : {name} !",
        deleteEntry: "Supprimer cette entrée de lecture ?",
        deleteBook: "Supprimer ce livre de votre bibliothèque ?",
        
        // Quotes
        quote1: "Un lecteur vit mille vies avant de mourir.",
        quote1Author: "George R.R. Martin",
        quote2: "Plus tu lis, plus tu sauras de choses.",
        quote2Author: "Dr. Seuss",
        quote3: "La lecture est à l'esprit ce que l'exercice est au corps.",
        quote3Author: "Joseph Addison",
        quote4: "Lecteur aujourd'hui, leader demain.",
        quote4Author: "Margaret Fuller",
        quote5: "Les livres sont une magie uniquement portable.",
        quote5Author: "Stephen King",
        quote6: "La lecture nous donne un endroit où aller quand nous devons rester où nous sommes.",
        quote6Author: "Mason Cooley",
        quote7: "Un coup d'œil à un livre et vous entendez la voix d'une autre personne.",
        quote7Author: "Carl Sagan",
        quote8: "Lire est un exercice d'empathie.",
        quote8Author: "Malorie Blackman",
        
        // Insights text
        insightAmazingConsistency: "Régularité incroyable ! Vous avez lu {percent}% des jours cette période.",
        insightGoodProgress: "Bonne progression ! Vous avez lu {percent}% des jours. Essayez d'atteindre 80% !",
        insightBuildConsistency: "Vous avez lu {percent}% des jours. Un rappel quotidien pourrait aider à construire la régularité.",
        insightBestDay: "Les {day} sont vos jours les plus productifs avec {pages} pages au total.",
        insightIncredibleGrowth: "Croissance incroyable ! Vous avez lu {percent}% de pages de plus que la période précédente !",
        insightImproving: "Vous progressez ! {percent}% de pages de plus que la période précédente.",
        insightDropped: "La lecture a chuté de {percent}% par rapport à la dernière période. Envisagez des objectifs plus modestes.",
        insightBooksCompleted: "Vous avez terminé {count} livre(s) avec une moyenne de {avg} pages chacun.",
        insightReadingSpeed: "Votre vitesse de lecture : environ {speed} pages par heure.",
        insightRecommendation: "Pour atteindre votre objectif quotidien, essayez de lire {needed} pages de plus les jours de lecture, ou ajoutez plus de jours.",
        
        // Weekdays full
        sunday: "Dimanches",
        monday: "Lundis",
        tuesday: "Mardis",
        wednesday: "Mercredis",
        thursday: "Jeudis",
        friday: "Vendredis",
        saturday: "Samedis",
        
        // Months
        january: "Janvier",
        february: "Février",
        march: "Mars",
        april: "Avril",
        may: "Mai",
        june: "Juin",
        july: "Juillet",
        august: "Août",
        september: "Septembre",
        october: "Octobre",
        november: "Novembre",
        december: "Décembre",
        
        // Weekly Overview
        weeklyOverview: "Aperçu hebdomadaire",
        
        // Misc
        year: "Année",
        noChange: "Aucun changement",
        new: "Nouveau !"
    }
};

// Current language
let currentLang = localStorage.getItem('readingTrackerLang') || 'en';

// Get translation
function t(key, replacements = {}) {
    let text = translations[currentLang][key] || translations['en'][key] || key;
    
    // Replace placeholders like {pages}, {minutes}, etc.
    Object.keys(replacements).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), replacements[k]);
    });
    
    return text;
}

// Set language
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('readingTrackerLang', lang);
    updateAllTranslations();
    updateAll();
}

// Get month name
function getMonthName(index) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    return t(months[index]);
}

// Get weekday name
function getWeekdayShort(index) {
    const days = ['weekdaysSun', 'weekdaysMon', 'weekdaysTue', 'weekdaysWed', 'weekdaysThu', 'weekdaysFri', 'weekdaysSat'];
    return t(days[index]);
}

// Get weekday full name
function getWeekdayFull(index) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(days[index]);
}
