// ========== Bot Verification on Site Access ==========

// Check if user has already been verified
function isUserVerified() {
    return localStorage.getItem('userVerified') === 'true';
}

// Mark user as verified
function markUserVerified() {
    localStorage.setItem('userVerified', 'true');
}

// Show captcha overlay
function showCaptchaOverlay() {
    const overlay = document.getElementById('captchaOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide captcha overlay
function hideCaptchaOverlay() {
    const overlay = document.getElementById('captchaOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Callback function for reCAPTCHA success
function onCaptchaSuccess() {
    const loader = document.getElementById('captchaLoader');
    const message = document.getElementById('captchaMessage');
    const widget = document.querySelector('.captcha-widget');

    if (loader) loader.style.display = 'flex';
    if (message) message.style.display = 'none';
    if (widget) widget.style.display = 'none';

    // Simulate verification process
    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        if (message) {
            message.textContent = 'Verification successful! Welcome to Community Financial Credit Union.';
            message.className = 'captcha-message success';
            message.style.display = 'block';
        }

        markUserVerified();
        setTimeout(() => {
            hideCaptchaOverlay();
        }, 1500);
    }, 2000);
}

// ========== Form Handling ==========

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
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

// ========== Username/Password Login ==========
function handleLogin() {
    let credential = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('messageBox');

    // allow legacy demo email during migration
    if (credential === 'demo@securebank.com') {
        credential = 'demo@communityfinancialcu.com';
    }

    // Validation
    if (!credential || !password) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    // Check if credential is a valid email or username
    const isEmail = validateEmail(credential);
    const isUsername = validateUsername(credential);

    if (!isEmail && !isUsername) {
        showMessage('Please enter a valid email address or username (3–20 letters, numbers, or underscores)', 'error', messageBox);
        return;
    }

    // Simulate login process
    showMessage('Logging in...', 'info', messageBox);

    setTimeout(() => {
        // Find user in allUsers (migrate old demo email if present)
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        let updated = false;
        allUsers.forEach(u => {
            if (u.email === 'demo@securebank.com') {
                u.email = 'demo@communityfinancialcu.com';
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
        const user = allUsers.find(u => (u.email === credential || u.username === credential) && u.password === password);

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
            showMessage('Invalid username or password. Please try again.', 'error', messageBox);
        }
    }, 1500);
}

// ========== Utility Functions ==========
function generateAccountNumber() {
    // Generate a 10-digit account number
    let accountNumber = '';
    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
}

// ========== Email/Password Sign Up ==========
function handleEmailSignUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!username || !firstName || !lastName || !email || !phone || !age || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    if (!validateUsername(username)) {
        showMessage('Username must be 3–20 characters and contain only letters, numbers, or underscores', 'error', messageBox);
        return;
    }

    // Check username/email uniqueness
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.some(u => u.username === username)) {
        showMessage('Username already taken. Please choose another.', 'error', messageBox);
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
    if (allUsers.some(u => u.email === email)) {
        showMessage('This email is already registered. Please login instead.', 'error', messageBox);
        return;
    }

    // Simulate signup process
    showMessage('Creating account...', 'info', messageBox);

    setTimeout(() => {
        // Save user data (in real app, send to backend)
        const checkingAccountNumber = generateAccountNumber();
        const savingsAccountNumber = generateAccountNumber();
        const routingNumber = '123456789'; // Same routing number for all accounts
        
        const user = {
            id: Date.now().toString(),
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            phone: phone,
            age: parseInt(age),
            password: password, // In production, hash this before storing
            signupTime: new Date().toISOString(),
            accounts: {
                checking: {
                    accountNumber: checkingAccountNumber,
                    routingNumber: routingNumber,
                    balance: 0,
                    accountType: 'checking',
                    transactions: []
                },
                savings: {
                    accountNumber: savingsAccountNumber,
                    routingNumber: routingNumber,
                    balance: 0,
                    accountType: 'savings',
                    transactions: []
                }
            }
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
            username: userData.email ? userData.email.split('@')[0] : userData.name.replace(/\s+/g,'').toLowerCase(),
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
            username: userData.email ? userData.email.split('@')[0] : userData.name.replace(/\s+/g,'').toLowerCase(),
            username: userData.email ? userData.email.split('@')[0] : userData.name.replace(/\s+/g,'').toLowerCase(),
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
            username: 'user',
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
            username: 'newuser',
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
            username: 'user',
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
            username: 'newuser',
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

function validateUsername(username) {
    // Username must be 3–20 characters and may contain letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
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
    // Basic phone validation - allow optional + and 10–15 digits
    const clean = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(clean);
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
    addAIMessage('Hello! I\'m your Community Financial Credit Union AI assistant. I can help you with:\n\n• Account issues and balance inquiries\n• Transaction disputes and investigations\n• Money transfers and payments\n• Loan applications and information\n• Security concerns\n• General banking questions\n\nWhat can I help you with today? If I can\'t resolve your issue, I\'ll connect you with a human agent.', 'bot');
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

function selectCapability(capability) {
    // Add user message
    addAIMessage(capability, 'user');

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(capability);
        addAIMessage(response, 'bot');
    }, 1000);
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Handle capability selections
    if (message.includes('🔍 account issues')) {
        return 'I can help you with account issues! What specific account problem are you experiencing?\n\n• Login/access problems\n• Account balance questions\n• Account verification\n• Account settings\n• Profile updates\n\nPlease describe your account issue and I\'ll assist you right away.';
    }
    
    if (message.includes('💸 transaction disputes')) {
        return 'I can help you with transaction disputes and investigations. What type of transaction issue are you facing?\n\n• Unauthorized charges\n• Incorrect amounts\n• Duplicate transactions\n• Merchant disputes\n• Refund issues\n\nPlease provide the transaction details and I\'ll start the dispute process for you.';
    }
    
    if (message.includes('🔄 money transfers')) {
        return 'I can assist you with money transfers! What type of transfer would you like to make?\n\n• Transfer between your own accounts\n• Send money to another person\n• Pay bills automatically\n• International transfers\n\nTell me the details and I\'ll guide you through the process step by step.';
    }
    
    if (message.includes('🏠 loan information')) {
        return 'I can provide information about our loan options! What type of loan are you interested in?\n\n• Personal loans\n• Home loans/mortgages\n• Auto loans\n• Business loans\n• Student loans\n\nI can also help you check pre-qualification or start an application.';
    }
    
    if (message.includes('🔒 security concerns')) {
        return 'Security is our top priority! How can I help with your security concerns?\n\n• Change password\n• Enable two-factor authentication\n• Review login activity\n• Report suspicious activity\n• Security best practices\n\nLet me know what security issue you\'re facing.';
    }
    
    // Check for dispute keywords
    if (message.includes('dispute') || message.includes('chargeback') || message.includes('unauthorized') || message.includes('fraud')) {
        return 'I understand you have a dispute or potential fraud concern. Let me help you with that. Can you please provide:\n\n1. The transaction date\n2. The amount\n3. The merchant name\n4. A brief description of the issue\n\nI can initiate a dispute process for you right now, or would you prefer to speak with a human agent?';
    }
    
    // Check for transaction complaints
    if (message.includes('transaction') && (message.includes('wrong') || message.includes('error') || message.includes('mistake') || message.includes('complaint'))) {
        return 'I\'m sorry to hear about the transaction issue. Let me help resolve this. Please provide:\n\n1. Your account number\n2. Transaction ID or reference number\n3. What went wrong with the transaction\n\nI can investigate this for you immediately. Would you like me to check your recent transactions?';
    }
    
    // Account-related issues
    if (message.includes('account') && (message.includes('locked') || message.includes('suspended') || message.includes('access') || message.includes('login problem'))) {
        return 'I can help with account access issues. Let me verify your identity first. Are you able to provide:\n\n1. Your account number\n2. The last 4 digits of your registered phone number\n3. Your email address\n\nI can unlock your account or reset your password right away.';
    }
    
    // Balance and transaction inquiries
    if (message.includes('balance') || message.includes('account')) {
        return 'To check your account balance or recent transactions, I need to verify your identity. Please provide your account number and the last transaction amount you remember. I can then show you your current balance and transaction history.';
    }

    if (message.includes('transfer') || message.includes('send money')) {
        return 'I can help you with money transfers. What type of transfer would you like to make?\n\n1. Internal transfer (between your accounts)\n2. External transfer (to another person)\n3. Bill payment\n4. International transfer\n\nPlease provide the details and I\'ll guide you through the process.';
    }

    if (message.includes('loan') || message.includes('credit')) {
        return 'We offer various loan options including personal loans, home loans, and business loans. I can help you:\n\n1. Check your pre-qualification status\n2. Compare loan options\n3. Start a loan application\n\nWhat type of loan are you interested in?';
    }

    if (message.includes('security') || message.includes('safe') || message.includes('hack') || message.includes('breach')) {
        return 'Security is our top priority at Community Financial Credit Union. We use bank-level encryption, multi-factor authentication, and 24/7 monitoring. If you suspect any security issues, I can:\n\n1. Help you change your password\n2. Enable additional security features\n3. Review your recent login activity\n4. Connect you with our security team\n\nWhat security concern do you have?';
    }

    if (message.includes('contact') || message.includes('support') || message.includes('agent') || message.includes('speak to human') || message.includes('📞 agent connection')) {
        return 'I understand you\'d like to speak with a human agent. All our agents are currently busy assisting other customers. The current wait time is approximately 5-10 minutes.\n\nHowever, I can assist you in resolving your issue right now! What specific banking concern can I help you with?\n\n• Account access problems\n• Transaction questions\n• Transfer assistance\n• Security concerns\n• Loan information\n\nLet me know what you need help with and I\'ll get it resolved for you.';
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('start')) {
        return 'Hello! I\'m your Community Financial Credit Union AI assistant. I can help you with:\n\n• Account issues and balance inquiries\n• Transaction disputes and investigations\n• Money transfers and payments\n• Loan applications and information\n• Security concerns\n• General banking questions\n\nWhat can I help you with today? If I can\'t resolve your issue, I\'ll connect you with a human agent.';
    }

    if (message.includes('bye') || message.includes('goodbye') || message.includes('thank')) {
        return 'You\'re welcome! If you need any more help with your banking needs, feel free to come back anytime. Have a great day!';
    }

    // Default response with escalation
    return 'I want to make sure I fully understand your question. Could you please provide more details about what you need help with? I can assist with account issues, transactions, disputes, transfers, loans, and security concerns. If this is urgent or complex, I can connect you with a human agent right away.';
}

// ========== Page Load Handler ==========

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is verified, if not show captcha overlay
    if (!isUserVerified()) {
        showCaptchaOverlay();
    }

    // Initialize demo data if no users exist (or migrate old demo email)
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Migrate any legacy demo account email to the new domain
    let migrated = false;
    allUsers.forEach(u => {
        if (u.email === 'demo@securebank.com') {
            u.email = 'demo@communityfinancialcu.com';
            migrated = true;
        }
    });
    if (migrated) {
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    if (allUsers.length === 0) {
        const checkingAccountNumber = generateAccountNumber();
        const savingsAccountNumber = generateAccountNumber();
        const routingNumber = '123456789';
        
        const demoUser = {
            id: '1000000001',
            firstName: 'Demo',
            lastName: 'User',
            username: 'demouser',
            email: 'demo@communityfinancialcu.com',
            phone: '+1 (555) 123-4567',
            age: 28,
            password: 'Demo@123456', // Demo password
            signupTime: new Date().toISOString(),
            accounts: {
                checking: {
                    accountNumber: checkingAccountNumber,
                    routingNumber: routingNumber,
                    balance: 2500.00,
                    accountType: 'checking',
                    transactions: [
                        {
                            type: 'credit',
                            amount: 2500.00,
                            description: 'Initial deposit',
                            timestamp: new Date().toISOString(),
                            accountType: 'checking'
                        }
                    ]
                },
                savings: {
                    accountNumber: savingsAccountNumber,
                    routingNumber: routingNumber,
                    balance: 5000.00,
                    accountType: 'savings',
                    transactions: [
                        {
                            type: 'credit',
                            amount: 5000.00,
                            description: 'Savings deposit',
                            timestamp: new Date().toISOString(),
                            accountType: 'savings'
                        }
                    ]
                }
            }
        };
        allUsers = [demoUser];
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    console.log('Community Financial Credit Union app loaded');
});