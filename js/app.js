// Data storage
let readingData = JSON.parse(localStorage.getItem('readingData')) || {};
let books = JSON.parse(localStorage.getItem('books')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || { daily: 30, dailyTime: 30, yearly: 10000 };
let currentViewDate = new Date();
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let weeklyChart = null;
let dayOfWeekChart = null;
let monthlyTrendChart = null;
let retroConsistencyChart = null;
let retroTimeChart = null;
let retroGenreChart = null;
let retroView = 'month';
let retroDate = new Date();

// Achievements definition
function getAchievements() {
    return [
        { id: 'first_page', name: t('achFirstPage'), desc: t('achFirstPageDesc'), icon: 'fa-book-open', check: () => Object.keys(readingData).length > 0 },
        { id: 'week_streak', name: t('achWeekWarrior'), desc: t('achWeekWarriorDesc'), icon: 'fa-fire', check: () => calculateStreak() >= 7 },
        { id: 'month_streak', name: t('achMonthMaster'), desc: t('achMonthMasterDesc'), icon: 'fa-fire-flame-curved', check: () => calculateStreak() >= 30 },
        { id: 'hundred_pages', name: t('achCenturyReader'), desc: t('achCenturyReaderDesc'), icon: 'fa-file-lines', check: () => getTotalPages() >= 100 },
        { id: 'thousand_pages', name: t('achBookworm'), desc: t('achBookwormDesc'), icon: 'fa-worm', check: () => getTotalPages() >= 1000 },
        { id: 'five_thousand', name: t('achPageTurner'), desc: t('achPageTurnerDesc'), icon: 'fa-bolt', check: () => getTotalPages() >= 5000 },
        { id: 'first_book', name: t('achFirstFinish'), desc: t('achFirstFinishDesc'), icon: 'fa-flag-checkered', check: () => books.filter(b => b.status === 'completed').length >= 1 },
        { id: 'five_books', name: t('achShelfBuilder'), desc: t('achShelfBuilderDesc'), icon: 'fa-layer-group', check: () => books.filter(b => b.status === 'completed').length >= 5 },
        { id: 'ten_books', name: t('achLibraryCurator'), desc: t('achLibraryCuratorDesc'), icon: 'fa-landmark', check: () => books.filter(b => b.status === 'completed').length >= 10 },
        { id: 'hour_session', name: t('achDeepReader'), desc: t('achDeepReaderDesc'), icon: 'fa-hourglass', check: () => checkLongSession() },
        { id: 'fifty_pages_day', name: t('achSpeedReader'), desc: t('achSpeedReaderDesc'), icon: 'fa-gauge-high', check: () => checkBigDay(50) },
        { id: 'hundred_pages_day', name: t('achMarathonReader'), desc: t('achMarathonReaderDesc'), icon: 'fa-person-running', check: () => checkBigDay(100) },
    ];
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('readingDate').valueAsDate = new Date();

    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    // Set language buttons
    updateLanguageButtons();
    updateAllTranslations();

    // Initialize auth
    const isAuthenticated = await AuthService.init();

    if (isAuthenticated) {
        document.getElementById('userMenuBtn').classList.remove('hidden');
        await DatabaseService.loadAllData();

        document.getElementById('dailyGoal').value = goals.daily;
        document.getElementById('dailyTimeGoal').value = goals.dailyTime;
        document.getElementById('yearlyGoal').value = goals.yearly;

        updateAll();
        updateBookSelects();
        updateLibraryStats();
        initCharts();
    } else {
        showAuthModal();
    }

    updateAuthModal();
});

// Update all translations
function updateAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update select options
    updateGenreOptions();
    updateFormatOptions();
    updateLanguageOptions();
    updateStatusOptions();
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
}

function updateGenreOptions() {
    const genres = [
        { value: 'Fiction', key: 'genreFiction' },
        { value: 'Non-Fiction', key: 'genreNonFiction' },
        { value: 'Science Fiction', key: 'genreSciFi' },
        { value: 'Fantasy', key: 'genreFantasy' },
        { value: 'Mystery', key: 'genreMystery' },
        { value: 'Biography', key: 'genreBiography' },
        { value: 'Self-Help', key: 'genreSelfHelp' },
        { value: 'History', key: 'genreHistory' },
        { value: 'Romance', key: 'genreRomance' },
        { value: 'Thriller', key: 'genreThriller' },
        { value: 'Horror', key: 'genreHorror' },
        { value: 'Poetry', key: 'genrePoetry' },
        { value: 'Philosophy', key: 'genrePhilosophy' },
        { value: 'Science', key: 'genreScience' },
        { value: 'Other', key: 'genreOther' }
    ];
    
    document.querySelectorAll('.genre-select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = genres.map(g => 
            `<option value="${g.value}">${t(g.key)}</option>`
        ).join('');
        select.value = currentValue || 'Fiction';
    });
}

function updateFormatOptions() {
    const formats = [
        { value: 'Paperback', key: 'formatPaperback' },
        { value: 'Hardcover', key: 'formatHardcover' },
        { value: 'Ebook', key: 'formatEbook' },
        { value: 'Audiobook', key: 'formatAudiobook' }
    ];
    
    document.querySelectorAll('.format-select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = formats.map(f => 
            `<option value="${f.value}">${t(f.key)}</option>`
        ).join('');
        select.value = currentValue || 'Paperback';
    });
}

function updateLanguageOptions() {
    const languages = [
        { value: 'English', key: 'langEnglish' },
        { value: 'French', key: 'langFrench' },
        { value: 'Spanish', key: 'langSpanish' },
        { value: 'German', key: 'langGerman' },
        { value: 'Italian', key: 'langItalian' },
        { value: 'Portuguese', key: 'langPortuguese' },
        { value: 'Other', key: 'langOther' }
    ];
    
    document.querySelectorAll('.language-select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = languages.map(l => 
            `<option value="${l.value}">${t(l.key)}</option>`
        ).join('');
        select.value = currentValue || 'English';
    });
}

function updateStatusOptions() {
    const statuses = [
        { value: 'reading', key: 'currentlyReading' },
        { value: 'to-read', key: 'toRead' },
        { value: 'completed', key: 'completed' }
    ];
    
    document.querySelectorAll('.status-select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = statuses.map(s => 
            `<option value="${s.value}">${t(s.key)}</option>`
        ).join('');
        select.value = currentValue || 'reading';
    });
}

// Tab navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('tab-active'));
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    document.getElementById(`tab-${tabName}`).classList.add('tab-active');
    
    if (tabName === 'insights') {
        updateInsights();
    }
    if (tabName === 'achievements') {
        updateAchievements();
    }
    if (tabName === 'retrospective') {
        updateRetrospective();
    }
}

// Dark mode
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    updateCharts();
}

// Log reading
async function logReading() {
    const date = document.getElementById('readingDate').value;
    const pages = parseInt(document.getElementById('pagesRead').value);
    const minutes = parseInt(document.getElementById('minutesRead').value) || 0;
    const bookId = document.getElementById('bookSelect').value;
    const notes = document.getElementById('readingNotes').value.trim();

    if (!date || !pages || pages < 1) {
        showToast(t('enterValidDatePages'), 'error');
        return;
    }

    try {
        await DatabaseService.logReadingSession({ date, pages, minutes, bookId, notes });

        if (!readingData[date]) {
            readingData[date] = { pages: 0, minutes: 0, sessions: [] };
        }

        readingData[date].pages += pages;
        readingData[date].minutes = (readingData[date].minutes || 0) + minutes;
        readingData[date].sessions.push({
            pages,
            minutes,
            bookId,
            notes,
            timestamp: new Date().toISOString()
        });

        if (bookId) {
            const book = books.find(b => b.id === bookId);
            if (book) {
                book.pagesRead = (book.pagesRead || 0) + pages;
                if (book.pagesRead >= book.totalPages) {
                    book.status = 'completed';
                    book.completedDate = date;
                    await DatabaseService.updateBook(bookId, {
                        pagesRead: book.pagesRead,
                        status: 'completed',
                        completedDate: date
                    });
                    showToast(t('congratsFinished', { title: book.title }), 'success');
                } else {
                    await DatabaseService.updateBook(bookId, {
                        pagesRead: book.pagesRead
                    });
                }
            }
        }

        updateAll();

        document.getElementById('pagesRead').value = '';
        document.getElementById('minutesRead').value = '';
        document.getElementById('readingNotes').value = '';

        showToast(t(minutes ? 'loggedPagesMinutes' : 'loggedPages', { pages, minutes }), 'success');
        checkNewAchievements();
    } catch (error) {
        console.error('Error logging reading:', error);
        showToast('Error logging reading session', 'error');
    }
}

// Save goals
async function saveGoals() {
    goals.daily = parseInt(document.getElementById('dailyGoal').value) || 30;
    goals.dailyTime = parseInt(document.getElementById('dailyTimeGoal').value) || 30;
    goals.yearly = parseInt(document.getElementById('yearlyGoal').value) || 10000;

    try {
        await DatabaseService.saveGoals(goals);
        updateAll();
        showToast(t('goalsSaved'), 'success');
    } catch (error) {
        console.error('Error saving goals:', error);
        showToast('Error saving goals', 'error');
    }
}

// Save data
function saveData() {
    localStorage.setItem('readingData', JSON.stringify(readingData));
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Update all displays
function updateAll() {
    updateStats();
    updateCalendar();
    updateDashboardRetro();
    updateRecentActivity();
    updateGoalProgress();
    updateWeeklyChart();
    updateBookList();
    updateTodaySessions();
    updateQuote();
}

// Update stats
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayData = readingData[today] || { pages: 0, minutes: 0 };
    document.getElementById('todayPages').textContent = todayData.pages;
    document.getElementById('todayMinutes').textContent = todayData.minutes || 0;

    // Month pages
    const now = new Date();
    let monthTotal = 0;
    Object.keys(readingData).forEach(date => {
        const d = new Date(date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            monthTotal += readingData[date].pages;
        }
    });
    document.getElementById('monthPages').textContent = monthTotal;

    // Year pages
    let yearTotal = 0;
    Object.keys(readingData).forEach(date => {
        const d = new Date(date);
        if (d.getFullYear() === now.getFullYear()) {
            yearTotal += readingData[date].pages;
        }
    });
    document.getElementById('yearPages').textContent = yearTotal;

    // Calculate streak
    const streak = calculateStreak();
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('streakIcon').style.display = streak > 0 ? 'inline' : 'none';
}

// Calculate streak
function calculateStreak() {
    let streak = 0;
    let checkDate = new Date();
    
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!readingData[todayStr] || readingData[todayStr].pages === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (readingData[dateStr] && readingData[dateStr].pages > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// Calculate longest streak
function calculateLongestStreak() {
    const dates = Object.keys(readingData).filter(d => readingData[d].pages > 0).sort();
    if (dates.length === 0) return 0;
    
    let longest = 1;
    let current = 1;
    
    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i-1]);
        const curr = new Date(dates[i]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        
        if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }
    return longest;
}

// Update calendar
function updateCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    document.getElementById('currentMonth').textContent = `${getMonthName(month)} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        grid.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = readingData[dateStr] || { pages: 0 };
        const level = getReadingLevel(dayData.pages);

        const cell = document.createElement('div');
        cell.className = `calendar-day rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-110 reading-level-${level}`;
        cell.textContent = day;
        cell.title = `${dayData.pages} ${t('pages')}${dayData.minutes ? `, ${dayData.minutes} ${t('mins')}` : ''}`;
        
        if (level >= 3) {
            cell.classList.add('text-white');
        }

        cell.onclick = () => {
            document.getElementById('readingDate').value = dateStr;
            showTab('dashboard');
            if (dayData.pages > 0) {
                showToast(`${dateStr}: ${dayData.pages} ${t('pages')}`, 'info');
            }
        };

        grid.appendChild(cell);
    }
    
    // Update weekday headers
    const weekdayHeaders = document.querySelectorAll('.weekday-header');
    const weekdays = ['weekdaysSun', 'weekdaysMon', 'weekdaysTue', 'weekdaysWed', 'weekdaysThu', 'weekdaysFri', 'weekdaysSat'];
    weekdayHeaders.forEach((el, i) => {
        el.textContent = t(weekdays[i]);
    });
}

function getReadingLevel(pages) {
    if (pages === 0) return 0;
    if (pages < goals.daily * 0.5) return 1;
    if (pages < goals.daily) return 2;
    if (pages < goals.daily * 1.5) return 3;
    return 4;
}

function changeMonth(delta) {
    currentViewDate.setMonth(currentViewDate.getMonth() + delta);
    updateCalendar();
    updateDashboardRetro();
}

// Update dashboard monthly summary
function updateDashboardRetro() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    let total = 0, days = 0, best = 0, totalMinutes = 0;
    let bookIds = new Set();

    Object.keys(readingData).forEach(date => {
        const d = new Date(date);
        if (d.getMonth() === month && d.getFullYear() === year) {
            const pages = readingData[date].pages;
            total += pages;
            totalMinutes += readingData[date].minutes || 0;
            if (pages > 0) days++;
            if (pages > best) best = pages;
            (readingData[date].sessions || []).forEach(s => {
                if (s.bookId) bookIds.add(s.bookId);
            });
        }
    });

    document.getElementById('retroTotal').textContent = total;
    document.getElementById('retroDays').textContent = days;
    document.getElementById('retroBest').textContent = best;
    document.getElementById('retroMinutes').textContent = totalMinutes;

    const booksContainer = document.getElementById('booksThisMonth');
    const monthBooks = books.filter(b => bookIds.has(b.id));
    if (monthBooks.length > 0) {
        booksContainer.innerHTML = monthBooks.map(book => 
            `<div class="bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                ${book.coverUrl ? `<img src="${book.coverUrl}" class="w-6 h-8 object-cover rounded" alt="">` : '<i class="fas fa-book"></i>'}
                <span>${book.title}</span>
            </div>`
        ).join('');
    } else {
        booksContainer.innerHTML = `<p class="text-gray-400 text-sm italic">${t('noBooksLogged')}</p>`;
    }
}

// Update recent activity
function updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    const sortedDates = Object.keys(readingData).sort().reverse().slice(0, 10);

    if (sortedDates.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-sm italic">${t('noReadingLogged')}</p>`;
        return;
    }

    container.innerHTML = sortedDates.map(date => {
        const data = readingData[date];
        const displayDate = new Date(date + 'T00:00:00').toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { 
            weekday: 'short', month: 'short', day: 'numeric' 
        });
        const goalMet = data.pages >= goals.daily;
        const bookNames = [...new Set((data.sessions || []).map(s => {
            const book = books.find(b => b.id === s.bookId);
            return book ? book.title : null;
        }).filter(Boolean))];
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${goalMet ? 'bg-green-100 dark:bg-green-900 text-green-600' : 'bg-blue-100 dark:bg-blue-900 text-blue-600'} flex items-center justify-center">
                        <i class="fas ${goalMet ? 'fa-check' : 'fa-book'}"></i>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800 dark:text-white">${data.pages} ${t('pages')}${data.minutes ? ` · ${data.minutes} ${t('mins')}` : ''}</div>
                        <div class="text-xs text-gray-500">${displayDate}${bookNames.length ? ` — ${bookNames.join(', ')}` : ''}</div>
                    </div>
                </div>
                <button onclick="deleteEntry('${date}')" class="text-red-400 hover:text-red-600 p-2">
                    <i class="fas fa-trash-alt text-sm"></i>
                </button>
            </div>
        `;
    }).join('');
}

async function deleteEntry(date) {
    if (confirm(t('deleteEntry'))) {
        try {
            await DatabaseService.deleteReadingEntry(date);
            delete readingData[date];
            updateAll();
            showToast(t('entryDeleted'), 'info');
        } catch (error) {
            console.error('Error deleting entry:', error);
            showToast('Error deleting entry', 'error');
        }
    }
}

// Update goal progress
function updateGoalProgress() {
    const today = new Date().toISOString().split('T')[0];
    const todayData = readingData[today] || { pages: 0, minutes: 0 };
    
    const pageProgress = Math.min(100, Math.round((todayData.pages / goals.daily) * 100));
    document.getElementById('goalProgress').textContent = `${pageProgress}%`;
    document.getElementById('goalProgressBar').style.width = `${pageProgress}%`;
    
    const timeProgress = Math.min(100, Math.round(((todayData.minutes || 0) / goals.dailyTime) * 100));
    document.getElementById('timeGoalProgress').textContent = `${timeProgress}%`;
    document.getElementById('timeGoalProgressBar').style.width = `${timeProgress}%`;
    
    // Yearly progress
    const yearTotal = getTotalYearPages();
    const yearProgress = Math.min(100, Math.round((yearTotal / goals.yearly) * 100));
    document.getElementById('yearlyProgress').textContent = `${yearProgress}%`;
    document.getElementById('yearlyProgressBar').style.width = `${yearProgress}%`;
}

function getTotalPages() {
    return Object.values(readingData).reduce((sum, d) => sum + d.pages, 0);
}

function getTotalYearPages() {
    const year = new Date().getFullYear();
    return Object.keys(readingData)
        .filter(d => new Date(d).getFullYear() === year)
        .reduce((sum, d) => sum + readingData[d].pages, 0);
}

// Weekly chart
function initCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    
    // Weekly chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: t('pages'),
                data: [],
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor } },
                x: { ticks: { color: textColor } }
            }
        }
    });
    updateWeeklyChart();
}

function updateWeeklyChart() {
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push(getWeekdayShort(d.getDay()));
        data.push(readingData[dateStr]?.pages || 0);
    }
    
    if (weeklyChart) {
        weeklyChart.data.labels = labels;
        weeklyChart.data.datasets[0].data = data;
        weeklyChart.data.datasets[0].label = t('pages');
        weeklyChart.update();
    }
}

function updateCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    
    if (weeklyChart) {
        weeklyChart.options.scales.y.ticks.color = textColor;
        weeklyChart.options.scales.x.ticks.color = textColor;
        weeklyChart.update();
    }
    if (dayOfWeekChart) {
        dayOfWeekChart.options.scales.y.ticks.color = textColor;
        dayOfWeekChart.options.scales.x.ticks.color = textColor;
        dayOfWeekChart.update();
    }
    if (monthlyTrendChart) {
        monthlyTrendChart.options.scales.y.ticks.color = textColor;
        monthlyTrendChart.options.scales.x.ticks.color = textColor;
        monthlyTrendChart.update();
    }
}

// Book management
async function addBook() {
    const title = document.getElementById('newBookTitle').value.trim();
    const author = document.getElementById('newBookAuthor').value.trim();
    const totalPages = parseInt(document.getElementById('newBookPages').value);
    const genre = document.getElementById('newBookGenre').value;
    const status = document.getElementById('newBookStatus').value;
    const isbn = document.getElementById('newBookISBN').value.trim();
    const publisher = document.getElementById('newBookPublisher').value.trim();
    const publishYear = document.getElementById('newBookYear').value.trim();
    const bookLanguage = document.getElementById('newBookLanguage').value;
    const series = document.getElementById('newBookSeries').value.trim();
    const seriesNumber = document.getElementById('newBookSeriesNum').value.trim();
    const format = document.getElementById('newBookFormat').value;
    const description = document.getElementById('newBookDescription').value.trim();
    const personalNotes = document.getElementById('newBookNotes').value.trim();
    const rating = parseInt(document.getElementById('newBookRating').value) || 0;
    const coverUrl = document.getElementById('newBookCover').value.trim();
    const startDate = document.getElementById('newBookStartDate').value;

    if (!title || !totalPages) {
        showToast(t('enterTitlePages'), 'error');
        return;
    }

    try {
        const bookData = {
            title,
            author,
            totalPages,
            pagesRead: 0,
            genre,
            status,
            isbn,
            publisher,
            publishYear,
            language: bookLanguage,
            series,
            seriesNumber,
            format,
            description,
            personalNotes,
            rating,
            coverUrl,
            startDate
        };

        const newBook = await DatabaseService.addBook(bookData);

        books.push({
            id: newBook.id,
            ...bookData,
            addedDate: newBook.created_at?.split('T')[0]
        });

        updateBookList();
        updateBookSelects();
        updateLibraryStats();

        document.getElementById('newBookTitle').value = '';
        document.getElementById('newBookAuthor').value = '';
        document.getElementById('newBookPages').value = '';
        document.getElementById('newBookISBN').value = '';
        document.getElementById('newBookPublisher').value = '';
        document.getElementById('newBookYear').value = '';
        document.getElementById('newBookSeries').value = '';
        document.getElementById('newBookSeriesNum').value = '';
        document.getElementById('newBookDescription').value = '';
        document.getElementById('newBookNotes').value = '';
        document.getElementById('newBookCover').value = '';
        document.getElementById('newBookStartDate').value = '';
        document.getElementById('newBookRating').value = '0';
        updateStarDisplay(0);

        showToast(t('bookAdded', { title }), 'success');
    } catch (error) {
        console.error('Error adding book:', error);
        showToast('Error adding book', 'error');
    }
}

function updateBookList(filter = 'all') {
    const container = document.getElementById('bookList');
    let filteredBooks = books;
    
    if (filter !== 'all') {
        filteredBooks = books.filter(b => b.status === filter);
    }

    if (filteredBooks.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-8">${t('noBooksFound')}</p>`;
        return;
    }

    const statusLabels = {
        'reading': t('currentlyReading'),
        'to-read': t('toRead'),
        'completed': t('completed')
    };

    container.innerHTML = filteredBooks.map(book => {
        const progress = Math.round((book.pagesRead / book.totalPages) * 100);
        const statusColors = {
            'reading': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'to-read': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
        
        const stars = book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : '';
        
        return `
            <div class="book-card bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div class="flex gap-4">
                    ${book.coverUrl ? 
                        `<img src="${book.coverUrl}" class="book-cover flex-shrink-0" alt="${book.title}">` : 
                        `<div class="book-cover flex-shrink-0 bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                            <i class="fas fa-book text-amber-700 text-xl"></i>
                        </div>`
                    }
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="font-bold text-gray-800 dark:text-white truncate">${book.title}</h3>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColors[book.status]} flex-shrink-0 ml-2">${statusLabels[book.status]}</span>
                        </div>
                        ${book.author ? `<p class="text-sm text-gray-500 truncate">${book.author}</p>` : ''}
                        ${book.series ? `<p class="text-xs text-gray-400">${book.series}${book.seriesNumber ? ` #${book.seriesNumber}` : ''}</p>` : ''}
                        ${stars ? `<div class="text-amber-400 text-sm mt-1">${stars}</div>` : ''}
                        <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
                            <span class="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">${book.genre}</span>
                            ${book.format ? `<span class="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">${book.format}</span>` : ''}
                            <span>${book.pagesRead} / ${book.totalPages} ${t('pages')}</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-3">
                            <div class="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full book-progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button onclick="showBookDetails('${book.id}')" class="flex-1 text-sm py-1 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all">
                                <i class="fas fa-info-circle mr-1"></i>${t('status')}
                            </button>
                            <button onclick="changeBookStatus('${book.id}')" class="flex-1 text-sm py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
                                <i class="fas fa-exchange-alt mr-1"></i>
                            </button>
                            <button onclick="deleteBook('${book.id}')" class="px-3 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterBooks(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('bg-amber-200', 'dark:bg-amber-900'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('bg-amber-200', 'dark:bg-amber-900');
    updateBookList(filter);
}

async function changeBookStatus(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const statuses = ['to-read', 'reading', 'completed'];
    const currentIndex = statuses.indexOf(book.status);
    book.status = statuses[(currentIndex + 1) % statuses.length];

    const updates = { status: book.status };

    if (book.status === 'completed') {
        book.completedDate = new Date().toISOString().split('T')[0];
        updates.completedDate = book.completedDate;
    } else if (book.status === 'reading' && !book.startDate) {
        book.startDate = new Date().toISOString().split('T')[0];
        updates.startDate = book.startDate;
    }

    try {
        await DatabaseService.updateBook(bookId, updates);
        updateBookList();
        updateBookSelects();
        updateLibraryStats();
        checkNewAchievements();
    } catch (error) {
        console.error('Error updating book status:', error);
        showToast('Error updating book', 'error');
    }
}

async function deleteBook(bookId) {
    if (confirm(t('deleteBook'))) {
        try {
            await DatabaseService.deleteBook(bookId);
            books = books.filter(b => b.id !== bookId);
            updateBookList();
            updateBookSelects();
            updateLibraryStats();
        } catch (error) {
            console.error('Error deleting book:', error);
            showToast('Error deleting book', 'error');
        }
    }
}

function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // For now, just toggle status - could expand to show modal with full details
    changeBookStatus(bookId);
}

function updateBookSelects() {
    const readingBooks = books.filter(b => b.status === 'reading');
    const options = `<option value="">${t('selectBook')}</option>` + 
        readingBooks.map(b => `<option value="${b.id}">${b.title}${b.author ? ` - ${b.author}` : ''}</option>`).join('');
    
    document.getElementById('bookSelect').innerHTML = options;
    document.getElementById('timerBook').innerHTML = options;
}

function updateLibraryStats() {
    document.getElementById('statReading').textContent = books.filter(b => b.status === 'reading').length;
    document.getElementById('statToRead').textContent = books.filter(b => b.status === 'to-read').length;
    document.getElementById('statCompleted').textContent = books.filter(b => b.status === 'completed').length;
    document.getElementById('statTotal').textContent = books.length;
}

// Star rating
function setRating(rating) {
    document.getElementById('newBookRating').value = rating;
    updateStarDisplay(rating);
}

function updateStarDisplay(rating) {
    const container = document.getElementById('starRating');
    container.innerHTML = [1, 2, 3, 4, 5].map(i => 
        `<i class="fas fa-star cursor-pointer text-2xl ${i <= rating ? 'text-amber-400' : 'text-gray-300'}" onclick="setRating(${i})"></i>`
    ).join('');
}

// Search books online
async function searchBooksOnline() {
    const query = document.getElementById('bookSearchQuery').value.trim();
    if (!query) return;
    
    const resultsContainer = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.innerHTML = `<span class="spinner"></span> ${t('searching')}`;
    searchBtn.disabled = true;
    resultsContainer.innerHTML = '<div class="text-center py-4"><span class="spinner"></span></div>';
    
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            resultsContainer.innerHTML = data.docs.map(book => {
                const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '';
                return `
                    <div class="search-result-item flex items-center gap-3 p-3 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 mb-2" 
                         onclick="addBookFromSearch('${encodeURIComponent(JSON.stringify({
                             title: book.title,
                             author: book.author_name ? book.author_name[0] : '',
                             pages: book.number_of_pages_median || 0,
                             coverUrl: coverUrl,
                             isbn: book.isbn ? book.isbn[0] : '',
                             publishYear: book.first_publish_year || '',
                             publisher: book.publisher ? book.publisher[0] : ''
                         }))}')">
                        ${coverUrl ? `<img src="${coverUrl}" class="w-12 h-16 object-cover rounded" alt="">` : 
                            `<div class="w-12 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center"><i class="fas fa-book text-gray-400"></i></div>`}
                        <div class="flex-1">
                            <div class="font-medium text-gray-800 dark:text-white">${book.title}</div>
                            <div class="text-sm text-gray-500">${book.author_name ? book.author_name[0] : t('author')}</div>
                            <div class="text-xs text-gray-400">${book.first_publish_year || ''}</div>
                        </div>
                        <button class="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `;
            }).join('');
        } else {
            resultsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">${t('noResults')}</p>`;
        }
    } catch (error) {
        resultsContainer.innerHTML = `<p class="text-red-400 text-center py-4">Error searching books</p>`;
    }
    
    searchBtn.innerHTML = `<i class="fas fa-search mr-2"></i>${t('search')}`;
    searchBtn.disabled = false;
}

function addBookFromSearch(encodedBook) {
    const bookData = JSON.parse(decodeURIComponent(encodedBook));
    
    document.getElementById('newBookTitle').value = bookData.title || '';
    document.getElementById('newBookAuthor').value = bookData.author || '';
    document.getElementById('newBookPages').value = bookData.pages || '';
    document.getElementById('newBookISBN').value = bookData.isbn || '';
    document.getElementById('newBookPublisher').value = bookData.publisher || '';
    document.getElementById('newBookYear').value = bookData.publishYear || '';
    document.getElementById('newBookCover').value = bookData.coverUrl || '';
    
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('bookSearchQuery').value = '';
    
    showToast(t('bookAdded', { title: bookData.title }), 'info');
}

// Timer functions
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        document.getElementById('startBtn').classList.add('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    timerRunning = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function logTimerSession() {
    const pages = parseInt(document.getElementById('timerPages').value);
    const bookId = document.getElementById('timerBook').value;
    const minutes = Math.floor(timerSeconds / 60);

    if (!pages || pages < 1) {
        showToast(t('enterPagesRead'), 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    try {
        await DatabaseService.logReadingSession({
            date: today,
            pages,
            minutes,
            bookId,
            notes: null
        });

        if (!readingData[today]) {
            readingData[today] = { pages: 0, minutes: 0, sessions: [] };
        }

        readingData[today].pages += pages;
        readingData[today].minutes = (readingData[today].minutes || 0) + minutes;
        readingData[today].sessions.push({
            pages,
            minutes,
            bookId,
            timestamp: new Date().toISOString()
        });

        if (bookId) {
            const book = books.find(b => b.id === bookId);
            if (book) {
                book.pagesRead = (book.pagesRead || 0) + pages;
                if (book.pagesRead >= book.totalPages) {
                    book.status = 'completed';
                    book.completedDate = today;
                    await DatabaseService.updateBook(bookId, {
                        pagesRead: book.pagesRead,
                        status: 'completed',
                        completedDate: today
                    });
                    showToast(t('congratsFinished', { title: book.title }), 'success');
                } else {
                    await DatabaseService.updateBook(bookId, {
                        pagesRead: book.pagesRead
                    });
                }
            }
        }

        updateAll();
        resetTimer();
        document.getElementById('timerPages').value = '';
        showToast(t('loggedPagesMinutes', { pages, minutes }), 'success');
        checkNewAchievements();
    } catch (error) {
        console.error('Error logging timer session:', error);
        showToast('Error logging session', 'error');
    }
}

function updateTodaySessions() {
    const today = new Date().toISOString().split('T')[0];
    const todayData = readingData[today];
    const container = document.getElementById('todaySessions');

    if (!todayData || !todayData.sessions || todayData.sessions.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-4">${t('noSessionsToday')}</p>`;
        return;
    }

    container.innerHTML = todayData.sessions.map((s, i) => {
        const book = books.find(b => b.id === s.bookId);
        const time = new Date(s.timestamp).toLocaleTimeString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 flex items-center justify-center text-sm">
                        ${i + 1}
                    </div>
                    <div>
                        <div class="font-medium text-gray-800 dark:text-white">${s.pages} ${t('pages')}${s.minutes ? ` · ${s.minutes} ${t('mins')}` : ''}</div>
                        <div class="text-xs text-gray-500">${time}${book ? ` — ${book.title}` : ''}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Achievements
function updateAchievements() {
    const achievements = getAchievements();
    const container = document.getElementById('achievementsGrid');
    let unlocked = 0;

    container.innerHTML = achievements.map(a => {
        const isUnlocked = a.check();
        if (isUnlocked) unlocked++;
        
        return `
            <div class="text-center p-4 rounded-xl ${isUnlocked ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'} ${isUnlocked ? '' : 'achievement-locked'}">
                <div class="w-16 h-16 mx-auto mb-3 rounded-full ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gray-300 dark:bg-gray-600'} flex items-center justify-center">
                    <i class="fas ${a.icon} text-2xl ${isUnlocked ? 'text-white' : 'text-gray-500'}"></i>
                </div>
                <h3 class="font-bold text-gray-800 dark:text-white">${a.name}</h3>
                <p class="text-xs text-gray-500 mt-1">${a.desc}</p>
                ${isUnlocked ? `<span class="inline-block mt-2 text-xs text-green-600 dark:text-green-400"><i class="fas fa-check-circle mr-1"></i>${t('unlocked')}</span>` : ''}
            </div>
        `;
    }).join('');

    document.getElementById('achievementProgress').textContent = `${unlocked} / ${achievements.length}`;
    document.getElementById('achievementProgressBar').style.width = `${(unlocked / achievements.length) * 100}%`;
}

async function checkNewAchievements() {
    const achievements = getAchievements();
    for (const a of achievements) {
        const wasUnlocked = localStorage.getItem(`achievement_${a.id}`);
        if (!wasUnlocked && a.check()) {
            localStorage.setItem(`achievement_${a.id}`, 'true');
            try {
                await DatabaseService.saveAchievement(a.id, true);
            } catch (error) {
                console.error('Error saving achievement:', error);
            }
            showToast(t('achievementUnlocked', { name: a.name }), 'success');
        }
    }
}

function checkLongSession() {
    return Object.values(readingData).some(d => 
        (d.sessions || []).some(s => s.minutes >= 60)
    );
}

function checkBigDay(pages) {
    return Object.values(readingData).some(d => d.pages >= pages);
}

// Insights
function updateInsights() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    
    // All-time stats
    document.getElementById('allTimePages').textContent = getTotalPages();
    document.getElementById('allTimeMinutes').textContent = Object.values(readingData).reduce((s, d) => s + (d.minutes || 0), 0);
    document.getElementById('allTimeDays').textContent = Object.keys(readingData).filter(d => readingData[d].pages > 0).length;
    document.getElementById('longestStreak').textContent = calculateLongestStreak();
    document.getElementById('allTimeBooks').textContent = books.filter(b => b.status === 'completed').length;
    document.getElementById('bestDay').textContent = Math.max(...Object.values(readingData).map(d => d.pages), 0);

    // Day of week chart
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    Object.keys(readingData).forEach(date => {
        const day = new Date(date).getDay();
        dayTotals[day] += readingData[date].pages;
        if (readingData[date].pages > 0) dayCounts[day]++;
    });
    const dayAvgs = dayTotals.map((t, i) => dayCounts[i] ? Math.round(t / dayCounts[i]) : 0);
    const dayLabels = [0, 1, 2, 3, 4, 5, 6].map(i => getWeekdayShort(i));

    if (dayOfWeekChart) dayOfWeekChart.destroy();
    const dowCtx = document.getElementById('dayOfWeekChart').getContext('2d');
    dayOfWeekChart = new Chart(dowCtx, {
        type: 'bar',
        data: {
            labels: dayLabels,
            datasets: [{
                label: t('pages'),
                data: dayAvgs,
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor } },
                x: { ticks: { color: textColor } }
            }
        }
    });

    // Monthly trend
    const monthlyData = {};
    Object.keys(readingData).forEach(date => {
        const month = date.substring(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + readingData[date].pages;
    });
    const sortedMonths = Object.keys(monthlyData).sort().slice(-12);

    if (monthlyTrendChart) monthlyTrendChart.destroy();
    const mtCtx = document.getElementById('monthlyTrendChart').getContext('2d');
    monthlyTrendChart = new Chart(mtCtx, {
        type: 'line',
        data: {
            labels: sortedMonths.map(m => {
                const [y, mo] = m.split('-');
                return `${getMonthName(parseInt(mo) - 1).substring(0, 3)} ${y.substring(2)}`;
            }),
            datasets: [{
                label: t('pages'),
                data: sortedMonths.map(m => monthlyData[m]),
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor } },
                x: { ticks: { color: textColor } }
            }
        }
    });

    // Top reading days
    const topDays = Object.keys(readingData)
        .map(d => ({ date: d, pages: readingData[d].pages }))
        .sort((a, b) => b.pages - a.pages)
        .slice(0, 5);

    const topContainer = document.getElementById('topReadingDays');
    if (topDays.length > 0) {
        topContainer.innerHTML = topDays.map((d, i) => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                    ${i + 1}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-gray-800 dark:text-white">${d.pages} ${t('pages')}</div>
                    <div class="text-xs text-gray-500">${new Date(d.date + 'T00:00:00').toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
            </div>
        `).join('');
    } else {
        topContainer.innerHTML = `<p class="text-gray-400 text-center py-4">${t('startReadingToSee')}</p>`;
    }
}

// Export/Import
function showExportImportModal() {
    document.getElementById('exportImportModal').classList.remove('hidden');
    document.getElementById('exportImportModal').classList.add('flex');
}

function closeExportImportModal() {
    document.getElementById('exportImportModal').classList.add('hidden');
    document.getElementById('exportImportModal').classList.remove('flex');
}

function exportData() {
    const data = {
        readingData,
        books,
        goals,
        language: currentLang,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast(t('dataExported'), 'success');
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        showToast(t('selectFileImport'), 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.readingData) readingData = data.readingData;
            if (data.books) books = data.books;
            if (data.goals) goals = data.goals;
            if (data.language) setLanguage(data.language);
            
            saveData();
            saveBooks();
            localStorage.setItem('goals', JSON.stringify(goals));
            
            updateAll();
            updateBookSelects();
            updateLibraryStats();
            closeExportImportModal();
            showToast(t('dataImported'), 'success');
        } catch (err) {
            showToast(t('invalidFile'), 'error');
        }
    };
    reader.readAsText(file);
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Motivational quotes
function updateQuote() {
    const quotes = [
        { text: t('quote1'), author: t('quote1Author') },
        { text: t('quote2'), author: t('quote2Author') },
        { text: t('quote3'), author: t('quote3Author') },
        { text: t('quote4'), author: t('quote4Author') },
        { text: t('quote5'), author: t('quote5Author') },
        { text: t('quote6'), author: t('quote6Author') },
        { text: t('quote7'), author: t('quote7Author') },
        { text: t('quote8'), author: t('quote8Author') }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivationalQuote').textContent = `"${randomQuote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${randomQuote.author}`;
}
