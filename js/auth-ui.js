// Authentication UI
let authMode = 'signin';

function showAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('authModal').classList.add('flex');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('authModal').classList.remove('flex');
}

function toggleAuthMode() {
    authMode = authMode === 'signin' ? 'signup' : 'signin';
    updateAuthModal();
}

function updateAuthModal() {
    const isSignIn = authMode === 'signin';
    document.getElementById('authTitle').textContent = isSignIn ?
        (currentLang === 'fr' ? 'Connexion' : 'Sign In') :
        (currentLang === 'fr' ? 'Créer un compte' : 'Sign Up');
    document.getElementById('authSubmitBtn').textContent = isSignIn ?
        (currentLang === 'fr' ? 'Se connecter' : 'Sign In') :
        (currentLang === 'fr' ? 'Créer un compte' : 'Sign Up');
    document.getElementById('authToggleText').innerHTML = isSignIn ?
        (currentLang === 'fr' ? 'Pas encore de compte? <button onclick="toggleAuthMode()" class="text-amber-500 hover:text-amber-600 font-semibold">Créer un compte</button>' :
         'Don\'t have an account? <button onclick="toggleAuthMode()" class="text-amber-500 hover:text-amber-600 font-semibold">Sign Up</button>') :
        (currentLang === 'fr' ? 'Déjà un compte? <button onclick="toggleAuthMode()" class="text-amber-500 hover:text-amber-600 font-semibold">Se connecter</button>' :
         'Already have an account? <button onclick="toggleAuthMode()" class="text-amber-500 hover:text-amber-600 font-semibold">Sign In</button>');
}

async function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const submitBtn = document.getElementById('authSubmitBtn');
    const errorDiv = document.getElementById('authError');

    if (!email || !password) {
        errorDiv.textContent = currentLang === 'fr' ?
            'Veuillez remplir tous les champs' :
            'Please fill in all fields';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = currentLang === 'fr' ?
            'Le mot de passe doit contenir au moins 6 caractères' :
            'Password must be at least 6 characters';
        errorDiv.classList.remove('hidden');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> ' + (currentLang === 'fr' ? 'Chargement...' : 'Loading...');
    errorDiv.classList.add('hidden');

    try {
        if (authMode === 'signin') {
            await AuthService.signIn(email, password);
            showToast(currentLang === 'fr' ? 'Connexion réussie!' : 'Successfully signed in!', 'success');
        } else {
            await AuthService.signUp(email, password);
            showToast(currentLang === 'fr' ?
                'Compte créé! Veuillez vérifier votre email.' :
                'Account created! Please check your email.', 'success');
        }

        document.getElementById('authEmail').value = '';
        document.getElementById('authPassword').value = '';
    } catch (error) {
        console.error('Auth error:', error);
        let errorMessage = error.message;

        if (error.message.includes('Invalid login credentials')) {
            errorMessage = currentLang === 'fr' ?
                'Email ou mot de passe incorrect' :
                'Invalid email or password';
        } else if (error.message.includes('User already registered')) {
            errorMessage = currentLang === 'fr' ?
                'Cet email est déjà utilisé' :
                'Email already in use';
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage = currentLang === 'fr' ?
                'Veuillez confirmer votre email' :
                'Please confirm your email';
        }

        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = authMode === 'signin' ?
            (currentLang === 'fr' ? 'Se connecter' : 'Sign In') :
            (currentLang === 'fr' ? 'Créer un compte' : 'Sign Up');
    }
}

async function handleSignOut() {
    try {
        await AuthService.signOut();
        readingData = {};
        books = [];
        goals = { daily: 30, dailyTime: 30, yearly: 10000 };
        updateAll();
        showToast(currentLang === 'fr' ? 'Déconnexion réussie' : 'Successfully signed out', 'success');
    } catch (error) {
        console.error('Sign out error:', error);
        showToast(currentLang === 'fr' ? 'Erreur de déconnexion' : 'Error signing out', 'error');
    }
}
