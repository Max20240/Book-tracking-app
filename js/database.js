// Database service for all data operations
const DatabaseService = {

    async loadAllData() {
        try {
            await Promise.all([
                this.loadBooks(),
                this.loadReadingSessions(),
                this.loadDailyReading(),
                this.loadGoals(),
                this.loadAchievements()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Error loading data', 'error');
        }
    },

    async loadBooks() {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        books = data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            totalPages: book.total_pages,
            pagesRead: book.current_page,
            genre: book.genre,
            status: book.status,
            isbn: book.isbn,
            publisher: book.publisher,
            publishYear: book.publish_year,
            language: book.language,
            series: book.series,
            seriesNumber: book.series_number,
            format: book.format,
            description: book.description,
            personalNotes: book.personal_notes,
            rating: book.rating,
            coverUrl: book.cover_url,
            startDate: book.start_date,
            completedDate: book.completed_date,
            addedDate: book.created_at?.split('T')[0]
        }));
    },

    async addBook(bookData) {
        const { data, error } = await supabase
            .from('books')
            .insert([{
                user_id: AuthService.currentUser.id,
                title: bookData.title,
                author: bookData.author,
                total_pages: bookData.totalPages,
                current_page: bookData.pagesRead || 0,
                genre: bookData.genre,
                status: bookData.status,
                isbn: bookData.isbn,
                publisher: bookData.publisher,
                publish_year: bookData.publishYear,
                language: bookData.language,
                series: bookData.series,
                series_number: bookData.seriesNumber,
                format: bookData.format,
                description: bookData.description,
                personal_notes: bookData.personalNotes,
                rating: bookData.rating,
                cover_url: bookData.coverUrl,
                start_date: bookData.startDate
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateBook(bookId, updates) {
        const dbUpdates = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.author !== undefined) dbUpdates.author = updates.author;
        if (updates.totalPages !== undefined) dbUpdates.total_pages = updates.totalPages;
        if (updates.pagesRead !== undefined) dbUpdates.current_page = updates.pagesRead;
        if (updates.genre !== undefined) dbUpdates.genre = updates.genre;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
        if (updates.completedDate !== undefined) dbUpdates.completed_date = updates.completedDate;
        if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
        if (updates.personalNotes !== undefined) dbUpdates.personal_notes = updates.personalNotes;

        const { data, error } = await supabase
            .from('books')
            .update(dbUpdates)
            .eq('id', bookId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBook(bookId) {
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', bookId);

        if (error) throw error;
    },

    async loadReadingSessions() {
        const { data, error } = await supabase
            .from('reading_sessions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        data.forEach(session => {
            const dateStr = session.date;
            if (!readingData[dateStr]) {
                readingData[dateStr] = { pages: 0, minutes: 0, sessions: [] };
            }
            readingData[dateStr].sessions.push({
                id: session.id,
                pages: session.pages_read,
                minutes: session.minutes_read,
                bookId: session.book_id,
                notes: session.notes,
                timestamp: session.created_at
            });
        });
    },

    async loadDailyReading() {
        const { data, error } = await supabase
            .from('daily_reading')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        data.forEach(day => {
            const dateStr = day.date;
            if (!readingData[dateStr]) {
                readingData[dateStr] = { pages: 0, minutes: 0, sessions: [] };
            }
            readingData[dateStr].pages = day.total_pages;
            readingData[dateStr].minutes = day.total_minutes;
        });
    },

    async logReadingSession(sessionData) {
        const { date, pages, minutes, bookId, notes } = sessionData;

        const { data: session, error: sessionError } = await supabase
            .from('reading_sessions')
            .insert([{
                user_id: AuthService.currentUser.id,
                book_id: bookId || null,
                date: date,
                pages_read: pages,
                minutes_read: minutes || 0,
                notes: notes || null,
                session_start: new Date().toISOString(),
                session_end: new Date().toISOString()
            }])
            .select()
            .single();

        if (sessionError) throw sessionError;

        const { data: dailyData, error: dailyError } = await supabase
            .from('daily_reading')
            .select('*')
            .eq('date', date)
            .maybeSingle();

        if (dailyError) throw dailyError;

        if (dailyData) {
            const { error: updateError } = await supabase
                .from('daily_reading')
                .update({
                    total_pages: dailyData.total_pages + pages,
                    total_minutes: dailyData.total_minutes + (minutes || 0)
                })
                .eq('date', date);

            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from('daily_reading')
                .insert([{
                    user_id: AuthService.currentUser.id,
                    date: date,
                    total_pages: pages,
                    total_minutes: minutes || 0
                }]);

            if (insertError) throw insertError;
        }

        return session;
    },

    async deleteReadingEntry(date) {
        const { error: sessionsError } = await supabase
            .from('reading_sessions')
            .delete()
            .eq('date', date);

        if (sessionsError) throw sessionsError;

        const { error: dailyError } = await supabase
            .from('daily_reading')
            .delete()
            .eq('date', date);

        if (dailyError) throw dailyError;
    },

    async loadGoals() {
        const { data, error } = await supabase
            .from('user_goals')
            .select('*')
            .maybeSingle();

        if (error) throw error;

        if (data) {
            goals = {
                daily: data.daily_pages,
                dailyTime: data.daily_minutes,
                yearly: data.yearly_pages
            };
        }
    },

    async saveGoals(goalsData) {
        const { data: existing } = await supabase
            .from('user_goals')
            .select('id')
            .maybeSingle();

        const goalRecord = {
            user_id: AuthService.currentUser.id,
            daily_pages: goalsData.daily,
            daily_minutes: goalsData.dailyTime,
            yearly_pages: goalsData.yearly
        };

        if (existing) {
            const { error } = await supabase
                .from('user_goals')
                .update(goalRecord)
                .eq('user_id', AuthService.currentUser.id);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_goals')
                .insert([goalRecord]);

            if (error) throw error;
        }
    },

    async loadAchievements() {
        const { data, error } = await supabase
            .from('user_achievements')
            .select('*');

        if (error) throw error;

        data.forEach(achievement => {
            if (achievement.unlocked) {
                localStorage.setItem(`achievement_${achievement.achievement_key}`, 'true');
            }
        });
    },

    async saveAchievement(achievementKey, unlocked) {
        const { data: existing } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('achievement_key', achievementKey)
            .maybeSingle();

        if (existing) {
            const { error } = await supabase
                .from('user_achievements')
                .update({
                    unlocked: unlocked,
                    unlocked_at: unlocked ? new Date().toISOString() : null
                })
                .eq('achievement_key', achievementKey);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_achievements')
                .insert([{
                    user_id: AuthService.currentUser.id,
                    achievement_key: achievementKey,
                    unlocked: unlocked,
                    unlocked_at: unlocked ? new Date().toISOString() : null
                }]);

            if (error) throw error;
        }
    }
};
