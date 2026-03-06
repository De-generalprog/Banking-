// ========== Form Handling ==========

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleEmailLogin();
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleEmailSignUp();
    });
}

// ========== Email/Password Login ==========
function handleEmailLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error', messageBox);
        return;
    }

    // Simulate login process
    showMessage('Logging in...', 'info', messageBox);

    // In a real application, you would send this to a backend server
    setTimeout(() => {
        // Store user data in localStorage (for demo purposes)
        const user = {
            email: email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success', messageBox);
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html'; // You can create a dashboard page
        }, 1500);
    }, 1500);
}

// ========== Email/Password Sign Up ==========
function handleEmailSignUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error', messageBox);
        return;
    }

    if (!validatePassword(password)) {
        showMessage('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error', messageBox);
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error', messageBox);
        return;
    }

    if (!terms) {
        showMessage('You must agree to the terms and conditions', 'error', messageBox);
        return;
    }

    // Validate phone number
    if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number', 'error', messageBox);
        return;
    }

    // Simulate signup process
    showMessage('Creating account...', 'info', messageBox);

    setTimeout(() => {
        // Save user data (in real app, send to backend)
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            signupTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Account created successfully! Redirecting to login...', 'success', messageBox);
        
        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1500);
}

// ========== Google OAuth Handler ==========
function handleGoogleLogin(response) {
    const messageBox = document.getElementById('messageBox');
    try {
        // The response contains the JWT token
        const userToken = response.credential;
        
        // Decode JWT (you can use a library like jwt-decode for production)
        const base64Url = userToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            authProvider: 'google',
            loginTime: new Date().toISOString()
        }));
        
        showMessage('Google login successful! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        showMessage('Google login failed. Please try again.', 'error', messageBox);
        console.error('Google login error:', error);
    }
}

function handleGoogleSignUp(response) {
    const messageBox = document.getElementById('messageBox');
    try {
        const userToken = response.credential;
        const base64Url = userToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        
        localStorage.setItem('currentUser', JSON.stringify({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            authProvider: 'google',
            signupTime: new Date().toISOString()
        }));
        
        showMessage('Account created with Google! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        showMessage('Google sign up failed. Please try again.', 'error', messageBox);
        console.error('Google signup error:', error);
    }
}

// ========== Microsoft OAuth Handler ==========
function handleMicrosoftLogin() {
    const messageBox = document.getElementById('messageBox');
    showMessage('Integrating with Microsoft... (Demo mode)', 'info', messageBox);
    
    // In production, implement Microsoft login using MSAL library
    // https://github.com/AzureAD/microsoft-authentication-library-for-js
    console.log('Microsoft login integration required');
    
    // Demo: Simulate Microsoft login
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify({
            email: 'user@microsoft.com',
            authProvider: 'microsoft',
            loginTime: new Date().toISOString()
        }));
        window.location.href = 'dashboard.html';
    }, 2000);
}

function handleMicrosoftSignUp() {
    const messageBox = document.getElementById('messageBox');
    showMessage('Creating account with Microsoft... (Demo mode)', 'info', messageBox);
    
    // In production, implement Microsoft signup using MSAL library
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify({
            email: 'newuser@microsoft.com',
            authProvider: 'microsoft',
            signupTime: new Date().toISOString()
        }));
        window.location.href = 'dashboard.html';
    }, 2000);
}

// ========== Apple OAuth Handler ==========
function handleAppleLogin() {
    const messageBox = document.getElementById('messageBox');
    showMessage('Integrating with Apple... (Demo mode)', 'info', messageBox);
    
    // In production, implement Apple Sign-In using Apple's Sign-In JS
    // https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js
    console.log('Apple login integration required');
    
    // Demo: Simulate Apple login
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify({
            email: 'user@icloud.com',
            authProvider: 'apple',
            loginTime: new Date().toISOString()
        }));
        showMessage('Apple login successful! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

function handleAppleSignUp() {
    const messageBox = document.getElementById('messageBox');
    showMessage('Creating account with Apple... (Demo mode)', 'info', messageBox);
    
    // In production, implement Apple Sign-In using Apple's Sign-In JS
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify({
            email: 'newuser@icloud.com',
            authProvider: 'apple',
            signupTime: new Date().toISOString()
        }));
        showMessage('Account created with Apple! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

// ========== Quick Access Handlers ==========
function handleEmailAccess() {
    // Redirect to login page with email focus
    window.location.href = 'login.html#email';
}

function handleAppleAccess() {
    // Redirect to login page and trigger Apple login
    window.location.href = 'login.html';
    setTimeout(() => {
        handleAppleLogin();
    }, 500);
}

function handleGoogleAccess() {
    // Redirect to login page and trigger Google login
    window.location.href = 'login.html';
    setTimeout(() => {
        // Google login will be handled by the Google button on the login page
        const googleButton = document.querySelector('.g_id_signin');
        if (googleButton) {
            googleButton.click();
        }
    }, 500);
}

// ========== Validation Functions ==========

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validatePhone(phone) {
    // Basic phone validation - remove spaces and special characters
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// ========== Message Display ==========

function showMessage(message, type, messageBox) {
    if (!messageBox) return;
    
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
    
    // Auto-hide success/info messages after 5 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            messageBox.className = 'message-box';
        }, 5000);
    }
}

// ========== Utility Functions ==========

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Redirect to login if not authenticated
function requireLogin() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// ========== Page Load Handler ==========

document.addEventListener('DOMContentLoaded', function() {
    // You can add additional initialization code here
    console.log('Auth script loaded');
});
