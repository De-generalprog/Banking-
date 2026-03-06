// ========== Bot Verification on Site Access ==========

// Configuration
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key - replace with your actual key
const VERIFICATION_THRESHOLD = 0.5; // Minimum score to pass verification

// Check if user has already been verified
function isUserVerified() {
    return localStorage.getItem('userVerified') === 'true';
}

// Mark user as verified
function markUserVerified() {
    localStorage.setItem('userVerified', 'true');
}

// Show captcha modal
function showCaptchaModal() {
    const modal = document.getElementById('captchaModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide captcha modal
function hideCaptchaModal() {
    const modal = document.getElementById('captchaModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Verify user with reCAPTCHA v3
async function verifyUser() {
    const loader = document.getElementById('captchaLoader');
    const message = document.getElementById('captchaMessage');

    if (loader) loader.style.display = 'block';
    if (message) message.textContent = '';

    try {
        // Get reCAPTCHA token
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'access_site' });

        // For demo purposes, simulate verification with random score
        // In production, send to backend for verification
        const mockScore = Math.random(); // Random score between 0-1

        setTimeout(() => {
            if (mockScore >= VERIFICATION_THRESHOLD) {
                // User passed verification
                if (loader) loader.style.display = 'none';
                if (message) {
                    message.textContent = 'Verification successful! Welcome to SecureBank.';
                    message.className = 'captcha-message success';
                }

                markUserVerified();
                setTimeout(() => {
                    hideCaptchaModal();
                }, 1500);
            } else {
                // User failed verification - show retry option
                if (loader) loader.style.display = 'none';
                if (message) {
                    message.innerHTML = `
                        Verification failed. You may be a bot.<br>
                        <button onclick="verifyUser()" class="btn btn-primary" style="margin-top: 10px; padding: 8px 16px; font-size: 14px;">Try Again</button>
                    `;
                    message.className = 'captcha-message error';
                }
            }
        }, 2000);

    } catch (error) {
        console.error('Verification error:', error);
        if (loader) loader.style.display = 'none';
        if (message) {
            message.innerHTML = `
                Verification service error.<br>
                <button onclick="verifyUser()" class="btn btn-primary" style="margin-top: 10px; padding: 8px 16px; font-size: 14px;">Retry</button>
            `;
            message.className = 'captcha-message error';
        }
    }
}

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

    setTimeout(() => {
        // Find user in allUsers
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const user = allUsers.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user data in localStorage
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('isLoggedIn', 'true');
            showMessage('Login successful! Redirecting...', 'success', messageBox);

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage('Invalid email or password. Please try again.', 'error', messageBox);
        }
    }, 1500);
}

// ========== Email/Password Sign Up ==========
function handleEmailSignUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!firstName || !lastName || !email || !phone || !age || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error', messageBox);
        return;
    }

    if (!validateAge(age)) {
        showMessage('You must be at least 18 years old to open an account', 'error', messageBox);
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

    // Check if email already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.some(u => u.email === email)) {
        showMessage('This email is already registered. Please login instead.', 'error', messageBox);
        return;
    }

    // Simulate signup process
    showMessage('Creating account...', 'info', messageBox);

    setTimeout(() => {
        // Save user data (in real app, send to backend)
        const user = {
            id: Date.now().toString(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            age: parseInt(age),
            password: password, // In production, hash this before storing
            signupTime: new Date().toISOString(),
            balance: 0,
            transactions: []
        };
        
        // Store in allUsers list
        allUsers.push(user);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        // Automatically log in the new user
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        showMessage('Account created successfully! Redirecting to dashboard...', 'success', messageBox);

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
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
        showMessage('Microsoft login successful! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
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
        showMessage('Account created with Microsoft! Redirecting...', 'success', messageBox);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
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

function validateAge(age) {
    return parseInt(age) >= 18 && parseInt(age) <= 120;
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
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Redirect to login if not authenticated
function requireLogin() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// ========== Contact Form Handler ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactForm();
    });
}

function handleContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!name || !email || !message) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error', messageBox);
        return;
    }

    if (message.length > 100) {
        showMessage('Message must be 100 characters or less', 'error', messageBox);
        return;
    }

    // Simulate sending message
    showMessage('Sending your message...', 'info', messageBox);

    setTimeout(() => {
        // Store contact message (in production, this would be sent to backend)
        const contactMessage = {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage for demo
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(contactMessage);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        showMessage('Thank you for your message! We\'ll get back to you soon.', 'success', messageBox);

        // Clear form
        contactForm.reset();
    }, 1500);
}

// ========== AI Chat Handler ==========
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiMessages = document.getElementById('aiMessages');

if (aiInput && aiSendBtn && aiMessages) {
    aiSendBtn.addEventListener('click', handleAISend);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAISend();
        }
    });

    // Initialize with welcome message
    addAIMessage('Hello! I\'m your SecureBank AI assistant. How can I help you today?', 'bot');
}

function handleAISend() {
    const message = aiInput.value.trim();
    if (!message) return;

    // Add user message
    addAIMessage(message, 'user');

    // Clear input
    aiInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addAIMessage(response, 'bot');
    }, 1000);
}

function addAIMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    messageDiv.textContent = text;
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Simple keyword-based responses
    if (message.includes('balance') || message.includes('account')) {
        return 'To check your account balance, please log in to your dashboard. If you need help with login, I can guide you through that!';
    }

    if (message.includes('transfer') || message.includes('send money')) {
        return 'You can transfer money securely through our online banking platform. Log in to your account and navigate to the transfers section.';
    }

    if (message.includes('loan') || message.includes('credit')) {
        return 'We offer various loan options. Please visit our loans page or contact customer support for personalized assistance.';
    }

    if (message.includes('security') || message.includes('safe')) {
        return 'Security is our top priority at SecureBank. We use bank-level encryption and multi-factor authentication to protect your data.';
    }

    if (message.includes('contact') || message.includes('support')) {
        return 'You can reach our customer support at support@securebank.com or call 1-800-225-4764. We\'re here 24/7!';
    }

    if (message.includes('hello') || message.includes('hi')) {
        return 'Hello! How can I assist you with your banking needs today?';
    }

    if (message.includes('bye') || message.includes('goodbye')) {
        return 'Goodbye! Have a great day. Remember, SecureBank is always here to help.';
    }

    // Default response
    return 'I\'m here to help with your banking questions. You can ask me about account balances, transfers, loans, security, or contact information. How else can I assist you?';
}

// ========== Page Load Handler ==========

document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo data if no users exist
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.length === 0) {
        const demoUser = {
            id: '1000000001',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@securebank.com',
            phone: '+1 (555) 123-4567',
            age: 28,
            password: 'Demo@123456', // Demo password
            signupTime: new Date().toISOString(),
            balance: 5234.50,
            transactions: [
                {
                    type: 'credit',
                    amount: 5000,
                    description: 'Initial Deposit',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'debit',
                    amount: 150,
                    description: 'Transfer to john@example.com',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'credit',
                    amount: 400,
                    description: 'Salary Deposit',
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'debit',
                    amount: 15.50,
                    description: 'Online Purchase at Amazon',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        };
        localStorage.setItem('allUsers', JSON.stringify([demoUser]));
    }

    // Initialize captcha verification on index page
    if (document.getElementById('captchaModal')) {
        // Check if reCAPTCHA is loaded
        if (typeof grecaptcha !== 'undefined') {
            // If user is not verified, show captcha modal
            if (!isUserVerified()) {
                showCaptchaModal();
                verifyUser();
            }
        } else {
            // If reCAPTCHA fails to load after 5 seconds, show error
            setTimeout(() => {
                if (typeof grecaptcha === 'undefined' && !isUserVerified()) {
                    showCaptchaModal();
                    const loader = document.getElementById('captchaLoader');
                    const message = document.getElementById('captchaMessage');

                    if (loader) loader.style.display = 'none';
                    if (message) {
                        message.innerHTML = `
                            reCAPTCHA failed to load. Please check your internet connection.<br>
                            <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 10px; padding: 8px 16px; font-size: 14px;">Reload Page</button>
                        `;
                        message.className = 'captcha-message error';
                    }
                }
            }, 5000);
        }
    }

    console.log('SecureBank app loaded');
});