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
        
        console.log('Login attempt - Credential:', credential);
        console.log('All users in system:', allUsers.map(u => ({ email: u.email, username: u.username })));
        
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
        
        console.log('User found:', user ? { email: user.email, username: user.username } : 'No match');

        if (user) {
            // make sure accounts exist (migrate old users)
            if (!user.accounts) {
                user.accounts = {
                    checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
                    savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
                };
                // update allUsers entry
                const idx = allUsers.findIndex(u => u.id === user.id);
                if (idx !== -1) {
                    allUsers[idx] = user;
                    localStorage.setItem('allUsers', JSON.stringify(allUsers));
                }
            }
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
            console.log('Login failed - checking credentials...');
            console.log('Email match:', allUsers.some(u => u.email === credential));
            console.log('Username match:', allUsers.some(u => u.username === credential));
            const demoUser = allUsers.find(u => u.email === 'demo@communityfinancialcu.com');
            if (demoUser) {
                console.log('Demo user password on file:', demoUser.password);
                console.log('Password entered:', password);
                console.log('Passwords match:', demoUser.password === password);
            }
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
    const address = document.getElementById('address').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    const messageBox = document.getElementById('messageBox');

    // Validation
    if (!username || !firstName || !lastName || !email || !phone || !address || !age || !password || !confirmPassword) {
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
            address: address,
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
        // prepare default accounts for new social user
            const defaultAccounts = {
                checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
                savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
            };
            const [first, ...rest] = (userData.name || '').split(' ');
            const currentUserObj = {
                name: userData.name,
                firstName: first || '',
                lastName: rest.join(' ') || '',
                username: userData.email ? userData.email.split('@')[0] : userData.name.replace(/\s+/g,'').toLowerCase(),
                email: userData.email,
                picture: userData.picture,
                authProvider: 'google',
                loginTime: new Date().toISOString(),
                accounts: defaultAccounts
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
            // persist to allUsers if not already present
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
            if (!allUsers.some(u => u.email === currentUserObj.email)) {
                allUsers.push(currentUserObj);
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }

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

        // prepare default accounts
        const defaultAccounts2 = {
            checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
            savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
        };
        const [f, ...r] = (userData.name || '').split(' ');
        const newUser = {
            name: userData.name,
            firstName: f || '',
            lastName: r.join(' ') || '',
            username: userData.email ? userData.email.split('@')[0] : userData.name.replace(/\s+/g,'').toLowerCase(),
            email: userData.email,
            picture: userData.picture,
            authProvider: 'google',
            signupTime: new Date().toISOString(),
            accounts: defaultAccounts2
        };
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        // also add to allUsers
        const allUsers2 = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers2.some(u => u.email === newUser.email)) {
            allUsers2.push(newUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers2));
        }

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
        const defaultAccounts3 = {
            checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
            savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
        };
        const msUser = {
            firstName: 'Microsoft',
            lastName: 'User',
            username: 'user',
            email: 'user@microsoft.com',
            authProvider: 'microsoft',
            loginTime: new Date().toISOString(),
            accounts: defaultAccounts3
        };
        localStorage.setItem('currentUser', JSON.stringify(msUser));
        const allUsers3 = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers3.some(u => u.email === msUser.email)) {
            allUsers3.push(msUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers3));
        }
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
        const defaultAccounts4 = {
            checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
            savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
        };
        const newMsUser = {
            firstName: 'Microsoft',
            lastName: 'User',
            username: 'newuser',
            email: 'newuser@microsoft.com',
            authProvider: 'microsoft',
            signupTime: new Date().toISOString(),
            accounts: defaultAccounts4
        };
        localStorage.setItem('currentUser', JSON.stringify(newMsUser));
        const allUsers4 = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers4.some(u => u.email === newMsUser.email)) {
            allUsers4.push(newMsUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers4));
        }
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
        const defaultAccounts5 = {
            checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
            savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
        };
        const appleUser = {
            firstName: 'Apple',
            lastName: 'User',
            username: 'user',
            email: 'user@icloud.com',
            authProvider: 'apple',
            loginTime: new Date().toISOString(),
            accounts: defaultAccounts5
        };
        localStorage.setItem('currentUser', JSON.stringify(appleUser));
        const allUsers5 = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers5.some(u => u.email === appleUser.email)) {
            allUsers5.push(appleUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers5));
        }
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
        const defaultAccounts6 = {
            checking: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'checking', transactions: [] },
            savings: { accountNumber: generateAccountNumber(), routingNumber: '123456789', balance: 0, accountType: 'savings', transactions: [] }
        };
        const newAppleUser = {
            firstName: 'Apple',
            lastName: 'User',
            username: 'newuser',
            email: 'newuser@icloud.com',
            authProvider: 'apple',
            signupTime: new Date().toISOString(),
            accounts: defaultAccounts6
        };
        localStorage.setItem('currentUser', JSON.stringify(newAppleUser));
        const allUsers6 = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers6.some(u => u.email === newAppleUser.email)) {
            allUsers6.push(newAppleUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers6));
        }
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

// helper for chat messages
function addAIMessage(text, sender) {
    if (!aiMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message ' + sender;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
} 

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
        return 'I can help you with account issues! What specific account problem are you experiencing?\n\n• <span class="ai-option" onclick="selectCapability(\'Login/access problems\')">Login/access problems</span>\n• <span class="ai-option" onclick="selectCapability(\'Account balance questions\')">Account balance questions</span>\n• <span class="ai-option" onclick="selectCapability(\'Account verification\')">Account verification</span>\n• <span class="ai-option" onclick="selectCapability(\'Account settings\')">Account settings</span>\n• <span class="ai-option" onclick="selectCapability(\'Profile updates\')">Profile updates</span>\n\nPlease describe your account issue and I\'ll assist you right away.';
    }
    
    if (message.includes('💸 transaction disputes')) {
        return 'I can help you with transaction disputes and investigations. What type of transaction issue are you facing?\n\n• <span class="ai-option" onclick="selectCapability(\'Unauthorized charges\')">Unauthorized charges</span>\n• <span class="ai-option" onclick="selectCapability(\'Incorrect amounts\')">Incorrect amounts</span>\n• <span class="ai-option" onclick="selectCapability(\'Duplicate transactions\')">Duplicate transactions</span>\n• <span class="ai-option" onclick="selectCapability(\'Merchant disputes\')">Merchant disputes</span>\n• <span class="ai-option" onclick="selectCapability(\'Refund issues\')">Refund issues</span>\n\nPlease provide the transaction details and I\'ll start the dispute process for you.';
    }
    
    if (message.includes('🔄 money transfers')) {
        return 'I can assist you with money transfers! What type of transfer would you like to make?\n\n• <span class="ai-option" onclick="selectCapability(\'Transfer between your own accounts\')">Transfer between your own accounts</span>\n• <span class="ai-option" onclick="selectCapability(\'Send money to another person\')">Send money to another person</span>\n• <span class="ai-option" onclick="selectCapability(\'Pay bills automatically\')">Pay bills automatically</span>\n• <span class="ai-option" onclick="selectCapability(\'International transfers\')">International transfers</span>\n\nTell me the details and I\'ll guide you through the process step by step.';
    }
    
    if (message.includes('🏠 loan information')) {
        return 'I can provide information about our loan options! What type of loan are you interested in?\n\n• <span class="ai-option" onclick="selectCapability(\'Personal loans\')">Personal loans</span>\n• <span class="ai-option" onclick="selectCapability(\'Home loans/mortgages\')">Home loans/mortgages</span>\n• <span class="ai-option" onclick="selectCapability(\'Auto loans\')">Auto loans</span>\n• <span class="ai-option" onclick="selectCapability(\'Business loans\')">Business loans</span>\n• <span class="ai-option" onclick="selectCapability(\'Student loans\')">Student loans</span>\n\nI can also help you check pre-qualification or start an application.';
    }
    
    if (message.includes('🔒 security concerns')) {
        return 'Security is our top priority! How can I help with your security concerns?\n\n• <span class="ai-option" onclick="selectCapability(\'Change password\')">Change password</span>\n• <span class="ai-option" onclick="selectCapability(\'Enable two-factor authentication\')">Enable two-factor authentication</span>\n• <span class="ai-option" onclick="selectCapability(\'Review login activity\')">Review login activity</span>\n• <span class="ai-option" onclick="selectCapability(\'Report suspicious activity\')">Report suspicious activity</span>\n• <span class="ai-option" onclick="selectCapability(\'Security best practices\')">Security best practices</span>\n\nLet me know what security issue you\'re facing.';
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

    // Initialize demo data
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Always ensure demo user exists or is migrated
    let hasDemoUser = allUsers.some(u => u.email === 'demo@communityfinancialcu.com');
    
    // Migrate any legacy demo account email to the new domain
    let migrated = false;
    allUsers.forEach(u => {
        if (u.email === 'demo@securebank.com') {
            u.email = 'demo@communityfinancialcu.com';
            migrated = true;
            hasDemoUser = true;
        }
    });
    
    // Check if demo user needs upgrading (has missing properties)
    const demoUserIndex = allUsers.findIndex(u => u.email === 'demo@communityfinancialcu.com');
    if (demoUserIndex !== -1 && (!allUsers[demoUserIndex].pin || !allUsers[demoUserIndex].paymentMethods || !allUsers[demoUserIndex].address)) {
        // Upgrade existing demo user with missing properties
        if (!allUsers[demoUserIndex].address) {
            allUsers[demoUserIndex].address = '123 Banking Street, Financial City, CA 90210';
        }
        allUsers[demoUserIndex].pin = '1234';
        allUsers[demoUserIndex].paymentMethods = [
            { 
                id: 'pm_001',
                type: 'Credit Card',
                last4: '4242',
                expiryDate: '12/26'
            },
            {
                id: 'pm_002', 
                type: 'Bank Account',
                last4: '6789'
            }
        ];
        allUsers[demoUserIndex].cards = [
            {
                type: 'debit',
                last4: '8901',
                holderName: 'Demo User',
                expiry: '12/26',
                isBlocked: false,
                isPrimary: true
            },
            {
                type: 'credit',
                last4: '2345',
                holderName: 'Demo User',
                expiry: '08/25',
                isBlocked: false,
                isPrimary: false
            }
        ];
        allUsers[demoUserIndex].loans = [
            {
                loanId: 'LOAN-2024-001',
                type: 'Personal Loan',
                totalAmount: 10000,
                paidAmount: 3500,
                monthlyPayment: 250,
                apr: 8.5,
                nextPaymentDate: '2025-02-15',
                maturityDate: '2027-12-15'
            }
        ];
        allUsers[demoUserIndex].loanSettings = {
            preferredAmount: '10000-25000',
            preferredTerm: '36',
            autoPayment: false,
            disableOffers: false
        };
        allUsers[demoUserIndex].alerts = {
            email: 'demo@communityfinancialcu.com',
            phone: '(555) 123-4567',
            transaction: true,
            login: true,
            security: true,
            bill: false,
            balance: true
        };
        allUsers[demoUserIndex].securityQuestions = [
            {
                question: "What is your mother's maiden name?",
                answer: 'Smith'
            }
        ];
        migrated = true;
    }
    
    // If no demo user exists, create one
    if (!hasDemoUser) {
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
            address: '123 Banking Street, Financial City, CA 90210',
            age: 28,
            password: 'Demo@123456',
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
            },
            pin: '1234',
            paymentMethods: [
                { 
                    id: 'pm_001',
                    type: 'Credit Card',
                    last4: '4242',
                    expiryDate: '12/26'
                },
                {
                    id: 'pm_002', 
                    type: 'Bank Account',
                    last4: '6789'
                }
            ],
            cards: [
                {
                    type: 'debit',
                    last4: '8901',
                    holderName: 'Demo User',
                    expiry: '12/26',
                    isBlocked: false,
                    isPrimary: true
                },
                {
                    type: 'credit',
                    last4: '2345',
                    holderName: 'Demo User',
                    expiry: '08/25',
                    isBlocked: false,
                    isPrimary: false
                }
            ],
            loans: [
                {
                    loanId: 'LOAN-2024-001',
                    type: 'Personal Loan',
                    totalAmount: 10000,
                    paidAmount: 3500,
                    monthlyPayment: 250,
                    apr: 8.5,
                    nextPaymentDate: '2025-02-15',
                    maturityDate: '2027-12-15'
                }
            ],
            loanSettings: {
                preferredAmount: '10000-25000',
                preferredTerm: '36',
                autoPayment: false,
                disableOffers: false
            },
            alerts: {
                email: 'demo@communityfinancialcu.com',
                phone: '(555) 123-4567',
                transaction: true,
                login: true,
                security: true,
                bill: false,
                balance: true
            },
            securityQuestions: [
                {
                    question: "What is your mother's maiden name?",
                    answer: 'Smith'
                }
            ]
        };
        allUsers.push(demoUser);
        migrated = true;
    }
    
    // Save any changes made
    if (migrated || !hasDemoUser) {
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    console.log('Community Financial Credit Union app loaded');
    console.log('Current allUsers in localStorage:', allUsers.map(u => ({ id: u.id, email: u.email, username: u.username, hasPassword: !!u.password })));
    console.log('Demo account check - exists:', allUsers.find(u => u.email === 'demo@communityfinancialcu.com') ? 'YES' : 'NO');
    
    // Initialize dashboard if on dashboard page
    if (document.querySelector('.dashboard-header') || document.getElementById('checkingBalance')) {
        setTimeout(() => {
            requireLogin();
            loadAccountInfo();
        }, 100);
    }
});

// ========== Dashboard Functions ==========

// Load and display account information
function loadAccountInfo() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Display email
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.textContent = currentUser.email;
    }

    // Display checking account
    const checkingBalance = document.getElementById('checkingBalance');
    const checkingNumber = document.getElementById('checkingNumber');
    if (checkingBalance && currentUser.accounts && currentUser.accounts.checking) {
        checkingBalance.textContent = '$' + currentUser.accounts.checking.balance.toFixed(2);
        checkingNumber.textContent = '**** **** **** ' + currentUser.accounts.checking.accountNumber.slice(-4);
    }

    // Display savings account
    const savingsBalance = document.getElementById('savingsBalance');
    const savingsNumber = document.getElementById('savingsNumber');
    if (savingsBalance && currentUser.accounts && currentUser.accounts.savings) {
        savingsBalance.textContent = '$' + currentUser.accounts.savings.balance.toFixed(2);
        savingsNumber.textContent = '**** **** **** ' + currentUser.accounts.savings.accountNumber.slice(-4);
    }
}

// Update user data in localStorage
function updateCurrentUser(updatedUser) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update in allUsers
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
}

// Open transfer modal
function openTransferModal() {
    const modal = document.getElementById('transferModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close transfer modal
function closeTransferModal() {
    const modal = document.getElementById('transferModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Open internal transfer modal
function openInternalTransferModal() {
    const modal = document.getElementById('internalTransferModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close internal transfer modal
function closeInternalTransferModal() {
    const modal = document.getElementById('internalTransferModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Open external transfer modal
function openExternalTransferModal() {
    const modal = document.getElementById('externalTransferModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close external transfer modal
function closeExternalTransferModal() {
    const modal = document.getElementById('externalTransferModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Open bill pay modal (now navigates to dedicated page)
function openBillPayModal() {
    window.location.href = 'billpay.html';
}

// Close bill pay modal
function closeBillPayModal() {
    const modal = document.getElementById('billPayModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Open wire transfer modal (now navigates to dedicated page)
function openWireTransferModal() {
    window.location.href = 'wire.html';
}

// Close wire transfer modal
function closeWireTransferModal() {
    const modal = document.getElementById('wireTransferModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Process internal transfer
function processInternalTransfer() {
    const amount = document.getElementById('internalTransferAmount').value;
    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const messageBox = document.getElementById('internalTransferMessage');

    if (!amount || !fromAccount || !toAccount) {
        if (messageBox) showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
        if (messageBox) showMessage('Amount must be greater than 0', 'error', messageBox);
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.accounts) {
        if (messageBox) showMessage('Account information not found', 'error', messageBox);
        return;
    }

    const sourceAccount = currentUser.accounts[fromAccount];
    const destAccount = currentUser.accounts[toAccount];

    if (!sourceAccount || !destAccount) {
        if (messageBox) showMessage('Invalid account selection', 'error', messageBox);
        return;
    }

    if (sourceAccount.balance < transferAmount) {
        if (messageBox) showMessage('Insufficient funds', 'error', messageBox);
        return;
    }

    // Process transfer
    sourceAccount.balance -= transferAmount;
    destAccount.balance += transferAmount;

    // Add transactions
    sourceAccount.transactions.push({
        type: 'debit',
        amount: transferAmount,
        description: 'Transfer to ' + (toAccount === 'checking' ? 'Checking' : 'Savings'),
        timestamp: new Date().toISOString(),
        accountType: fromAccount
    });

    destAccount.transactions.push({
        type: 'credit',
        amount: transferAmount,
        description: 'Transfer from ' + (fromAccount === 'checking' ? 'Checking' : 'Savings'),
        timestamp: new Date().toISOString(),
        accountType: toAccount
    });

    updateCurrentUser(currentUser);
    const successMsg = document.getElementById('internalTransferSuccess');
    if (successMsg) {
        successMsg.style.display = 'block';
    }

    setTimeout(() => {
        closeInternalTransferModal();
        loadAccountInfo();
        document.getElementById('internalTransferAmount').value = '';
        if (successMsg) successMsg.style.display = 'none';
    }, 1500);
}

// Process external transfer
function processExternalTransfer() {
    const amount = document.getElementById('externalTransferAmount').value;
    const recipientName = document.getElementById('externalRecipient').value;
    const accountNumber = document.getElementById('externalAccountNumber').value;
    const routingNumber = document.getElementById('externalRoutingNumber').value;
    const messageBox = document.getElementById('externalTransferMessage');

    if (!amount || !recipientName || !accountNumber || !routingNumber) {
        if (messageBox) showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
        if (messageBox) showMessage('Amount must be greater than 0', 'error', messageBox);
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.accounts || !currentUser.accounts.checking) {
        if (messageBox) showMessage('Account information not found', 'error', messageBox);
        return;
    }

    if (currentUser.accounts.checking.balance < transferAmount) {
        if (messageBox) showMessage('Insufficient funds', 'error', messageBox);
        return;
    }

    // Process transfer from checking account
    currentUser.accounts.checking.balance -= transferAmount;
    currentUser.accounts.checking.transactions.push({
        type: 'debit',
        amount: transferAmount,
        description: 'External transfer to ' + recipientName,
        timestamp: new Date().toISOString(),
        accountType: 'checking'
    });

    updateCurrentUser(currentUser);
    const successMsg = document.getElementById('externalTransferSuccess');
    if (successMsg) {
        successMsg.style.display = 'block';
    }

    setTimeout(() => {
        closeExternalTransferModal();
        loadAccountInfo();
        document.getElementById('externalTransferAmount').value = '';
        document.getElementById('externalRecipient').value = '';
        document.getElementById('externalAccountNumber').value = '';
        document.getElementById('externalRoutingNumber').value = '';
        if (successMsg) successMsg.style.display = 'none';
    }, 1500);
}

// Process bill payment
function processBillPayment() {
    const amount = document.getElementById('billAmount').value;
    const payee = document.getElementById('billPayee').value;
    const dueDate = document.getElementById('billDueDate').value;
    const messageBox = document.getElementById('billPayMessage');

    if (!amount || !payee || !dueDate) {
        if (messageBox) showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    const billAmount = parseFloat(amount);
    if (billAmount <= 0) {
        if (messageBox) showMessage('Amount must be greater than 0', 'error', messageBox);
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.accounts || !currentUser.accounts.checking) {
        if (messageBox) showMessage('Account information not found', 'error', messageBox);
        return;
    }

    if (currentUser.accounts.checking.balance < billAmount) {
        if (messageBox) showMessage('Insufficient funds', 'error', messageBox);
        return;
    }

    // Process bill payment
    currentUser.accounts.checking.balance -= billAmount;
    currentUser.accounts.checking.transactions.push({
        type: 'debit',
        amount: billAmount,
        description: 'Bill payment to ' + payee + ' (Due: ' + dueDate + ')',
        timestamp: new Date().toISOString(),
        accountType: 'checking'
    });

    updateCurrentUser(currentUser);
    const successMsg = document.getElementById('billPaySuccess');
    if (successMsg) {
        successMsg.style.display = 'block';
    }

    setTimeout(() => {
        closeBillPayModal();
        loadAccountInfo();
        document.getElementById('billAmount').value = '';
        document.getElementById('billPayee').value = '';
        document.getElementById('billDueDate').value = '';
        if (successMsg) successMsg.style.display = 'none';
    }, 1500);
}

// Add money to account
function addMoney() {
    const amount = document.getElementById('addMoneyAmount').value;
    const accountType = document.getElementById('addMoneyAccount').value;
    const messageBox = document.getElementById('addMoneyMessage');

    if (!amount || !accountType) {
        if (messageBox) showMessage('Please fill in all fields', 'error', messageBox);
        return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
        if (messageBox) showMessage('Amount must be greater than 0', 'error', messageBox);
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.accounts) {
        if (messageBox) showMessage('Account information not found', 'error', messageBox);
        return;
    }

    const account = currentUser.accounts[accountType];
    if (!account) {
        if (messageBox) showMessage('Invalid account selection', 'error', messageBox);
        return;
    }

    // Process deposit
    account.balance += depositAmount;
    account.transactions.push({
        type: 'credit',
        amount: depositAmount,
        description: 'Deposit',
        timestamp: new Date().toISOString(),
        accountType: accountType
    });

    updateCurrentUser(currentUser);
    const successMsg = document.getElementById('addMoneySuccess');
    if (successMsg) {
        successMsg.style.display = 'block';
    }

    setTimeout(() => {
        const modal = document.getElementById('addMoneyModal');
        if (modal) modal.classList.remove('show');
        loadAccountInfo();
        document.getElementById('addMoneyAmount').value = '';
        if (successMsg) successMsg.style.display = 'none';
    }, 1500);
}