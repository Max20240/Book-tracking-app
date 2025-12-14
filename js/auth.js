// Authentication service
const AuthService = {
    currentUser: null,

    async init() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
        }

        supabase.auth.onAuthStateChange((event, session) => {
            (async () => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    this.currentUser = session.user;
                    await this.onAuthChange(true);
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    await this.onAuthChange(false);
                }
            })();
        });

        return this.isAuthenticated();
    },

    isAuthenticated() {
        return this.currentUser !== null;
    },

    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        this.currentUser = data.user;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.currentUser = null;
    },

    async resetPassword(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        if (error) throw error;
    },

    async updatePassword(newPassword) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
    },

    async onAuthChange(isSignedIn) {
        if (isSignedIn) {
            await DatabaseService.loadAllData();
            updateAll();
            hideAuthModal();
        } else {
            showAuthModal();
        }
    }
};
