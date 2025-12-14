// Retrospective functions

function setRetroView(view) {
    retroView = view;
    document.getElementById('retro-month-btn').className = `px-6 py-2 rounded-lg font-semibold transition-all ${view === 'month' ? 'bg-amber-500 text-white' : 'text-gray-600 dark:text-gray-300'}`;
    document.getElementById('retro-year-btn').className = `px-6 py-2 rounded-lg font-semibold transition-all ${view === 'year' ? 'bg-amber-500 text-white' : 'text-gray-600 dark:text-gray-300'}`;
    updateRetrospective();
}

function changeRetroPeriod(delta) {
    if (retroView === 'month') {
        retroDate.setMonth(retroDate.getMonth() + delta);
    } else {
        retroDate.setFullYear(retroDate.getFullYear() + delta);
    }
    updateRetrospective();
}

function getRetroPeriodData() {
    const year = retroDate.getFullYear();
    const month = retroDate.getMonth();
    const data = { pages: 0, minutes: 0, days: 0, sessions: [], dates: [] };
    
    Object.keys(readingData).forEach(date => {
        const d = new Date(date);
        let match = false;
        
        if (retroView === 'month') {
            match = d.getMonth() === month && d.getFullYear() === year;
        } else {
            match = d.getFullYear() === year;
        }
        
        if (match && readingData[date].pages > 0) {
            data.pages += readingData[date].pages;
            data.minutes += readingData[date].minutes || 0;
            data.days++;
            data.dates.push({ date, ...readingData[date] });
            if (readingData[date].sessions) {
                data.sessions.push(...readingData[date].sessions);
            }
        }
    });
    
    return data;
}

function getPreviousPeriodData() {
    const prevDate = new Date(retroDate);
    if (retroView === 'month') {
        prevDate.setMonth(prevDate.getMonth() - 1);
    } else {
        prevDate.setFullYear(prevDate.getFullYear() - 1);
    }
    
    const year = prevDate.getFullYear();
    const month = prevDate.getMonth();
    const data = { pages: 0, minutes: 0, days: 0, books: 0 };
    
    Object.keys(readingData).forEach(date => {
        const d = new Date(date);
        let match = false;
        
        if (retroView === 'month') {
            match = d.getMonth() === month && d.getFullYear() === year;
        } else {
            match = d.getFullYear() === year;
        }
        
        if (match && readingData[date].pages > 0) {
            data.pages += readingData[date].pages;
            data.minutes += readingData[date].minutes || 0;
            data.days++;
        }
    });
    
    // Count books completed in previous period
    books.forEach(book => {
        if (book.completedDate) {
            const d = new Date(book.completedDate);
            let match = false;
            if (retroView === 'month') {
                match = d.getMonth() === month && d.getFullYear() === year;
            } else {
                match = d.getFullYear() === year;
            }
            if (match) data.books++;
        }
    });
    
    return data;
}

function updateRetrospective() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const year = retroDate.getFullYear();
    const month = retroDate.getMonth();
    
    // Update title
    if (retroView === 'month') {
        document.getElementById('retroPeriodTitle').textContent = `${getMonthName(month)} ${year}`;
    } else {
        document.getElementById('retroPeriodTitle').textContent = `${t('year')} ${year}`;
    }
    
    const data = getRetroPeriodData();
    const prevData = getPreviousPeriodData();
    
    // Summary cards
    document.getElementById('retroSummaryPages').textContent = data.pages.toLocaleString();
    document.getElementById('retroSummaryMinutes').textContent = data.minutes.toLocaleString();
    document.getElementById('retroSummaryDays').textContent = data.days;
    document.getElementById('retroSummaryAvg').textContent = data.days > 0 ? Math.round(data.pages / data.days) : 0;
    
    // Books completed in period
    const completedBooks = books.filter(book => {
        if (!book.completedDate) return false;
        const d = new Date(book.completedDate);
        if (retroView === 'month') {
            return d.getMonth() === month && d.getFullYear() === year;
        } else {
            return d.getFullYear() === year;
        }
    });
    document.getElementById('retroSummaryBooks').textContent = completedBooks.length;
    
    // Best day
    let bestDay = { pages: 0, date: '' };
    data.dates.forEach(d => {
        if (d.pages > bestDay.pages) {
            bestDay = { pages: d.pages, date: d.date };
        }
    });
    document.getElementById('retroSummaryBest').textContent = bestDay.pages;
    document.getElementById('retroBestDate').textContent = bestDay.date ? new Date(bestDay.date + 'T00:00:00').toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' }) : '-';
    
    // Change indicators
    updateChangeIndicator('retroPagesChange', data.pages, prevData.pages);
    updateChangeIndicator('retroMinutesChange', data.minutes, prevData.minutes);
    updateChangeIndicator('retroDaysChange', data.days, prevData.days);
    updateChangeIndicator('retroAvgChange', 
        data.days > 0 ? Math.round(data.pages / data.days) : 0,
        prevData.days > 0 ? Math.round(prevData.pages / prevData.days) : 0
    );
    updateChangeIndicator('retroBooksChange', completedBooks.length, prevData.books);
    
    // Goal achievement
    let goalMet = 0, goalExceeded = 0, goalMissed = 0;
    let daysInPeriod = retroView === 'month' ? new Date(year, month + 1, 0).getDate() : 365;
    const today = new Date();
    if (retroView === 'month' && year === today.getFullYear() && month === today.getMonth()) {
        daysInPeriod = today.getDate();
    } else if (retroView === 'year' && year === today.getFullYear()) {
        daysInPeriod = Math.floor((today - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
    }
    
    data.dates.forEach(d => {
        if (d.pages >= goals.daily * 1.5) goalExceeded++;
        else if (d.pages >= goals.daily) goalMet++;
        else goalMissed++;
    });
    goalMissed = Math.max(0, daysInPeriod - goalExceeded - goalMet - goalMissed);
    
    const totalGoalDays = goalExceeded + goalMet;
    document.getElementById('retroGoalDays').textContent = `${totalGoalDays} / ${daysInPeriod}`;
    document.getElementById('retroGoalDaysBar').style.width = `${(totalGoalDays / daysInPeriod) * 100}%`;
    document.getElementById('retroGoalExceeded').textContent = goalExceeded;
    document.getElementById('retroGoalMet').textContent = goalMet;
    document.getElementById('retroGoalMissed').textContent = daysInPeriod - goalExceeded - goalMet;
    
    // Streaks
    const periodStreak = calculatePeriodStreak(data.dates.map(d => d.date));
    document.getElementById('retroLongestStreak').textContent = `${periodStreak.longest} ${t('days')}`;
    document.getElementById('retroCurrentStreak').textContent = `${calculateStreak()} ${t('days')}`;
    document.getElementById('retroStreakCount').textContent = periodStreak.count;
    
    // Consistency chart
    updateConsistencyChart(data, isDark, textColor);
    
    // Time distribution chart
    updateTimeDistributionChart(data, isDark, textColor);
    
    // Top 5 days
    const topDays = [...data.dates].sort((a, b) => b.pages - a.pages).slice(0, 5);
    const topDaysContainer = document.getElementById('retroTopDays');
    if (topDays.length > 0) {
        topDaysContainer.innerHTML = topDays.map((d, i) => {
            const dateStr = new Date(d.date + 'T00:00:00').toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return `
                <div class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold">${i + 1}</div>
                    <div class="flex-1">
                        <span class="font-medium text-gray-800 dark:text-white">${d.pages} ${t('pages')}</span>
                        <span class="text-xs text-gray-500 ml-2">${dateStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        topDaysContainer.innerHTML = `<p class="text-gray-400 text-sm italic">${t('noDataPeriod')}</p>`;
    }
    
    // Books completed
    const booksContainer = document.getElementById('retroBooksCompleted');
    if (completedBooks.length > 0) {
        booksContainer.innerHTML = completedBooks.map(book => `
            <div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                ${book.coverUrl ? 
                    `<img src="${book.coverUrl}" class="w-10 h-14 object-cover rounded" alt="">` :
                    `<div class="w-10 h-14 rounded bg-green-100 dark:bg-green-800 text-green-600 flex items-center justify-center">
                        <i class="fas fa-check"></i>
                    </div>`
                }
                <div class="flex-1">
                    <div class="font-medium text-gray-800 dark:text-white">${book.title}</div>
                    <div class="text-xs text-gray-500">${book.author ? book.author + ' · ' : ''}${book.totalPages} ${t('pages')} · ${book.genre}</div>
                    ${book.rating ? `<div class="text-amber-400 text-xs">${'★'.repeat(book.rating)}${'☆'.repeat(5-book.rating)}</div>` : ''}
                </div>
            </div>
        `).join('');
    } else {
        booksContainer.innerHTML = `<p class="text-gray-400 text-sm italic">${t('noBooksCompleted')}</p>`;
    }
    
    // Genre chart
    updateGenreChart(data, completedBooks, isDark, textColor);
    
    // Personal insights
    generateInsights(data, prevData, completedBooks, daysInPeriod);
    
    // Comparison section
    updateComparison(data, prevData, completedBooks.length);
    
    // Notes
    updateRetroNotes(data);
}

function updateChangeIndicator(elementId, current, previous) {
    const element = document.getElementById(elementId);
    if (previous === 0) {
        element.innerHTML = current > 0 ? `<span class="text-green-500">${t('new')}</span>` : '';
        return;
    }
    const change = ((current - previous) / previous * 100).toFixed(0);
    if (change > 0) {
        element.innerHTML = `<span class="text-green-500"><i class="fas fa-arrow-up"></i> ${change}%</span>`;
    } else if (change < 0) {
        element.innerHTML = `<span class="text-red-500"><i class="fas fa-arrow-down"></i> ${Math.abs(change)}%</span>`;
    } else {
        element.innerHTML = `<span class="text-gray-400">${t('noChange')}</span>`;
    }
}

function calculatePeriodStreak(dates) {
    if (dates.length === 0) return { longest: 0, count: 0 };
    
    const sortedDates = [...dates].sort();
    let longest = 1, current = 1, count = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i-1]);
        const curr = new Date(sortedDates[i]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        
        if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
        } else if (diff > 1) {
            current = 1;
            count++;
        }
    }
    
    return { longest, count };
}

function updateConsistencyChart(data, isDark, textColor) {
    if (retroConsistencyChart) retroConsistencyChart.destroy();
    
    const ctx = document.getElementById('retroConsistencyChart').getContext('2d');
    let labels, chartData;
    
    if (retroView === 'month') {
        const year = retroDate.getFullYear();
        const month = retroDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        chartData = labels.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return readingData[dateStr]?.pages || 0;
        });
    } else {
        labels = Array.from({ length: 12 }, (_, i) => getMonthName(i).substring(0, 3));
        chartData = labels.map((_, i) => {
            let total = 0;
            Object.keys(readingData).forEach(date => {
                const d = new Date(date);
                if (d.getFullYear() === retroDate.getFullYear() && d.getMonth() === i) {
                    total += readingData[date].pages;
                }
            });
            return total;
        });
    }
    
    retroConsistencyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: t('pages'),
                data: chartData,
                backgroundColor: chartData.map(v => v >= goals.daily ? 'rgba(34, 197, 94, 0.7)' : 'rgba(99, 102, 241, 0.7)'),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor } },
                x: { ticks: { color: textColor, maxRotation: 0, autoSkip: true, maxTicksLimit: retroView === 'month' ? 10 : 12 } }
            }
        }
    });
}

function updateTimeDistributionChart(data, isDark, textColor) {
    if (retroTimeChart) retroTimeChart.destroy();
    
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    data.dates.forEach(d => {
        const day = new Date(d.date).getDay();
        dayTotals[day] += d.pages;
    });
    
    const dayLabels = [0, 1, 2, 3, 4, 5, 6].map(i => getWeekdayShort(i));
    
    const ctx = document.getElementById('retroTimeChart').getContext('2d');
    retroTimeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dayLabels,
            datasets: [{
                data: dayTotals,
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(20, 184, 166, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } }
            }
        }
    });
}

function updateGenreChart(data, completedBooks, isDark, textColor) {
    if (retroGenreChart) retroGenreChart.destroy();
    
    const genreCounts = {};
    completedBooks.forEach(book => {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    
    // Also count from sessions
    const bookIdsInPeriod = new Set(data.sessions.filter(s => s.bookId).map(s => s.bookId));
    books.filter(b => bookIdsInPeriod.has(b.id)).forEach(book => {
        if (!completedBooks.find(cb => cb.id === book.id)) {
            genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 0.5;
        }
    });
    
    const genres = Object.keys(genreCounts);
    const counts = Object.values(genreCounts);
    
    const ctx = document.getElementById('retroGenreChart').getContext('2d');
    retroGenreChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: genres.length > 0 ? genres : [t('noDataPeriod')],
            datasets: [{
                data: counts.length > 0 ? counts : [1],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(20, 184, 166, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(99, 102, 241, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } }
            }
        }
    });
}

function generateInsights(data, prevData, completedBooks, daysInPeriod) {
    const insights = [];
    
    // Reading consistency insight
    const consistencyRate = (data.days / daysInPeriod * 100).toFixed(0);
    if (consistencyRate >= 80) {
        insights.push({ icon: 'fa-star', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: t('insightAmazingConsistency', { percent: consistencyRate }) });
    } else if (consistencyRate >= 50) {
        insights.push({ icon: 'fa-thumbs-up', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', text: t('insightGoodProgress', { percent: consistencyRate }) });
    } else if (consistencyRate > 0) {
        insights.push({ icon: 'fa-lightbulb', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30', text: t('insightBuildConsistency', { percent: consistencyRate }) });
    }
    
    // Best reading day
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    data.dates.forEach(d => {
        const day = new Date(d.date).getDay();
        dayTotals[day] += d.pages;
    });
    const bestDayIdx = dayTotals.indexOf(Math.max(...dayTotals));
    if (dayTotals[bestDayIdx] > 0) {
        insights.push({ icon: 'fa-calendar-check', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', text: t('insightBestDay', { day: getWeekdayFull(bestDayIdx), pages: dayTotals[bestDayIdx] }) });
    }
    
    // Growth comparison
    if (prevData.pages > 0) {
        const growth = ((data.pages - prevData.pages) / prevData.pages * 100).toFixed(0);
        if (growth > 20) {
            insights.push({ icon: 'fa-rocket', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30', text: t('insightIncredibleGrowth', { percent: growth }) });
        } else if (growth > 0) {
            insights.push({ icon: 'fa-arrow-trend-up', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', text: t('insightImproving', { percent: growth }) });
        } else if (growth < -20) {
            insights.push({ icon: 'fa-exclamation-circle', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', text: t('insightDropped', { percent: Math.abs(growth) }) });
        }
    }
    
    // Books insight
    if (completedBooks.length > 0) {
        const avgPagesPerBook = Math.round(completedBooks.reduce((s, b) => s + b.totalPages, 0) / completedBooks.length);
        insights.push({ icon: 'fa-book', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: t('insightBooksCompleted', { count: completedBooks.length, avg: avgPagesPerBook }) });
    }
    
    // Reading speed insight
    if (data.minutes > 0 && data.pages > 0) {
        const pagesPerHour = (data.pages / (data.minutes / 60)).toFixed(1);
        insights.push({ icon: 'fa-gauge-high', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/30', text: t('insightReadingSpeed', { speed: pagesPerHour }) });
    }
    
    // Recommendation
    if (data.days > 0) {
        const avgPages = Math.round(data.pages / data.days);
        if (avgPages < goals.daily) {
            const needed = goals.daily - avgPages;
            insights.push({ icon: 'fa-target', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30', text: t('insightRecommendation', { needed }) });
        }
    }
    
    const container = document.getElementById('retroInsights');
    if (insights.length > 0) {
        container.innerHTML = insights.map(i => `
            <div class="flex items-start gap-3 p-4 ${i.bg} rounded-xl">
                <div class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <i class="fas ${i.icon} ${i.color}"></i>
                </div>
                <p class="text-gray-700 dark:text-gray-200 text-sm">${i.text}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<p class="text-gray-400 text-sm italic col-span-2">${t('startLoggingInsights')}</p>`;
    }
}

function updateComparison(data, prevData, booksCompleted) {
    const formatChange = (current, previous) => {
        const diff = current - previous;
        if (diff > 0) return `<span class="text-green-500">+${diff}</span>`;
        if (diff < 0) return `<span class="text-red-500">${diff}</span>`;
        return '<span class="text-gray-400">0</span>';
    };
    
    document.getElementById('retroComparePages').innerHTML = formatChange(data.pages, prevData.pages);
    document.getElementById('retroCompareMinutes').innerHTML = formatChange(data.minutes, prevData.minutes);
    document.getElementById('retroCompareDays').innerHTML = formatChange(data.days, prevData.days);
    document.getElementById('retroCompareBooks').innerHTML = formatChange(booksCompleted, prevData.books);
}

function updateRetroNotes(data) {
    const notes = [];
    data.sessions.forEach(s => {
        if (s.notes) {
            const book = books.find(b => b.id === s.bookId);
            notes.push({
                note: s.notes,
                book: book?.title || '',
                date: new Date(s.timestamp).toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })
            });
        }
    });
    
    const container = document.getElementById('retroNotes');
    if (notes.length > 0) {
        container.innerHTML = notes.map(n => `
            <div class="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg border-l-4 border-pink-400">
                <p class="text-gray-700 dark:text-gray-200 text-sm italic">"${n.note}"</p>
                <p class="text-xs text-gray-500 mt-1">${n.book ? n.book + ' · ' : ''}${n.date}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<p class="text-gray-400 text-sm italic">${t('noNotesPeriod')}</p>`;
    }
}
