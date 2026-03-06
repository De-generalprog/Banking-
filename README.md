# SecureBank - Banking Application

## Overview
SecureBank is a modern, secure banking application built with HTML, CSS, and JavaScript. It features a complete authentication system with client-side storage, an attractive dashboard, and transaction management.

🎯 **New in Version 2.0:**
- ✅ Age field in signup form (18+ requirement)
- ✅ Enhanced dashboard with multiple cards
- ✅ Wallet integration
- ✅ Transaction history with detailed information
- ✅ Add money and transfer functionality
- ✅ Real-time balance tracking
- ✅ User profile display with age information
- ✅ No server required - fully functional with localStorage

## Features
- ✅ **User Authentication**: Secure signup and login system
- ✅ **Age Verification**: Users must be 18+ to create an account
- ✅ **User Profile**: Display user information including name, email, phone, and age
- ✅ **Dashboard**: Attractive, modern dashboard with multiple cards and statistics
- ✅ **Account Balance**: Real-time balance tracking
- ✅ **Transaction History**: Complete transaction history with timestamps
- ✅ **Wallet Integration**: Virtual wallet display with card information
- ✅ **Add Money**: Functionality to add funds to your account
- ✅ **Send Money**: Transfer funds to other users
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Client-Side Authentication**: No server required - all data stored locally

## Getting Started

### Installation
1. Clone or download the project files
2. Ensure all files are in the same directory:
   - `index.html`
   - `login.html`
   - `signup.html`
   - `dashboard.html`
   - `app.js`
   - `styles.css`

### Running the Application
1. Open `index.html` in a web browser
2. Complete the reCAPTCHA verification (in test mode)
3. Navigate to Login or Sign Up pages

## Demo Credentials
For quick testing without signup, use these demo credentials:

**Email**: `demo@securebank.com`  
**Password**: `Demo@123456`

This demo account comes pre-loaded with:
- Balance: $5,234.50
- Sample transactions
- Full user profile (Age: 28)

## User Sign Up
1. Click "Sign Up" on the landing page or login page
2. Fill in all required fields:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: Valid email address
   - **Phone**: Phone number (10-15 digits)
   - **Age**: Must be 18 or older
   - **Password**: At least 8 characters with uppercase, lowercase, and numbers
3. Agree to terms and create account
4. You'll be automatically logged in and redirected to the dashboard

## User Login
1. Enter your email and password
2. Click "Login"
3. You'll be redirected to your dashboard

## Dashboard Features

### Account Overview
- **Account Balance**: Shows your current balance
- **Transaction Count**: Total number of transactions
- **Account Status**: Verification status
- **Member Since**: Account creation date

### User Profile
Complete user information including:
- Full name
- Email address
- Phone number
- Age (newly added)
- Account ID
- Join date

### My Wallet
Virtual wallet displaying:
- Card number
- Current balance
- Quick access to common actions:
  - Add Money
  - Send Money
  - Mobile Top-up
  - Pay Bills

### Add Money
Add funds to your account:
1. Click "Add Money" button
2. Enter amount
3. Select payment method (Credit Card, Debit Card, Bank Transfer, PayPal)
4. Confirm transaction
5. Balance updates in real-time

### Send Money
Transfer money to other users:
1. Click "Send Money" button
2. Enter recipient's email
3. Enter amount
4. Add optional message
5. Confirm transfer
6. Transaction appears in history

### Transaction History
View all your transactions with:
- Transaction type (credit/debit)
- Amount
- Description
- Timestamp
- Real-time updates

## Password Requirements
Passwords must contain:
- ✅ At least 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number

Example valid passwords:
- `Secure@123`
- `Banking#2024`
- `MyPass123`

## Age Requirement
- Minimum age: 18 years old
- Maximum age: 120 years old
- Age cannot be changed after signup (in current version)

## Data Storage
All data is stored locally in your browser using `localStorage`:
- User accounts (in `allUsers` array)
- User balances
- Transaction history
- Login sessions

**Data Structure:**
```javascript
{
  id: "unique_id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  age: 28,
  password: "hashed_password",
  balance: 5234.50,
  transactions: [...]
}
```

**Note**: Data is device-specific and will be cleared if you clear browser cache.

## Authentication
The application implements client-side authentication with:
- Email validation
- Password verification against stored credentials
- Session management via localStorage
- Automatic logout functionality
- Duplicate email prevention

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Responsive Design
The application is fully responsive and works on:
- Desktop computers (1920px and above)
- Tablets (768px - 1024px)
- Mobile phones (< 768px)

## Security Notes
⚠️ **Important**: This is a demonstration/prototype application.
- Passwords are stored in plain text (for demo purposes only)
- No server-side encryption
- No HTTPS communication
- For production use, implement:
  - Backend server
  - Bcrypt password hashing
  - JWT token authentication
  - HTTPS encryption
  - Database storage (PostgreSQL, MongoDB, etc.)
  - PCI compliance
  - Two-factor authentication (2FA)

## Troubleshooting

### Can't Login
- Check that your email and password are correct
- Ensure you've completed the signup process
- Try the demo credentials: `demo@securebank.com` / `Demo@123456`
- Make sure localStorage is enabled in your browser

### Age Validation Error
- Age must be between 18 and 120
- Age is required during signup
- Try entering a valid age

### Balance Not Showing
- Refresh the page (F5)
- Check browser console for errors (F12)
- Ensure localStorage is enabled
- Log out and log back in

### Can't Add Money
- Check that you've entered a valid amount (>0)
- Ensure you're logged in
- Try clearing browser cache

### Transactions Not Appearing
- Refresh the page
- Check that you've completed a transaction
- Ensure localStorage is enabled
- Log out and back in

### reCAPTCHA Not Loading
- Check your internet connection
- Disable browser extensions that might block reCAPTCHA
- Clear browser cache
- Try a different browser

## Features Coming Soon
- 📱 Mobile app version
- 💳 Real payment gateway integration
- 📊 Advanced statistics and reports
- 🔔 Push notifications
- 📞 Customer support chat
- 🌍 Multi-currency support
- 🔐 Two-factor authentication (2FA)
- 📈 Investment options
- 💰 Savings goals
- 📲 QR code payments

## Development Notes

### File Structure
- **index.html**: Landing page with bot verification
- **login.html**: Login form with validation
- **signup.html**: Signup form with age field
- **dashboard.html**: Main user dashboard
- **app.js**: Authentication and utility functions
- **styles.css**: All styling and responsive design

### Key Functions
- `handleEmailLogin()`: Process login
- `handleEmailSignUp()`: Process signup with age validation
- `validateAge()`: Verify age is 18+
- `processAddMoney()`: Add funds to account
- `processTransfer()`: Transfer money between users
- `loadDashboard()`: Load user data and render dashboard

### localStorage Keys
- `allUsers`: Array of all registered users
- `currentUser`: Currently logged in user
- `isLoggedIn`: Login status flag
- `userVerified`: reCAPTCHA verification status

## Contact & Support
For questions or feedback, please contact the development team.

## License
This project is provided as-is for educational and demonstration purposes.

---

**Last Updated**: March 2026  
**Version**: 2.0  
**Status**: Active Development

## File Descriptions

### index.html
- Landing page with navigation
- Feature showcase section
- Hero section with login/signup buttons
- About section
- Footer

### login.html
- Email/Password login form
- Social login options (Google, Microsoft, Facebook)
- "Remember Me" checkbox
- "Forgot Password" link
- Link to sign up page

### signup.html
- Complete sign-up form
- First Name & Last Name fields
- Email & Phone Number fields
- Password with strength requirements
- Password confirmation
- Terms & Conditions agreement
- Social sign-up options
- Link to login page

### dashboard.html
- User dashboard (Protected - requires login)
- Welcome message with user name
- Account balance display
- Recent transactions count
- Card information
- Account information section
- Session details
- Logout button

### styles.css
- Responsive CSS Grid & Flexbox
- Modern color scheme (Purple & Pink gradients)
- Button styles with hover effects
- Form styling
- Navigation bar styling
- Mobile-first responsive design
- Animations and transitions
- Captcha modal styling

### app.js
- Combined authentication and bot verification logic
- Email/password validation and form handling
- Google, Apple, and Microsoft OAuth handlers
- reCAPTCHA v3 bot verification on site access
- User session management
- Form validation functions
- Message display system

## Setup Instructions

### 1. Basic Setup (No OAuth)

1. Clone or download this repository
2. Open `index.html` in your web browser
3. On the landing page, click "Login" or "Create Account"
4. Use the demo forms (email/password login works with any email)

### 2. Google OAuth Setup

To enable Google login, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the "Google+ API"
4. Create an OAuth 2.0 Client ID:
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web Application"
   - Add Authorized JavaScript origins: `http://localhost:8000` (or your domain)
   - Add Authorized redirect URIs
   - Copy the Client ID

5. Update `login.html` and `signup.html`:
   - Find the line: `data-client_id="YOUR_GOOGLE_CLIENT_ID"`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID

6. Example:
```html
<div id="g_id_onload"
     data-client_id="123456789-abcdefg.apps.googleusercontent.com"
     data-callback="handleGoogleLogin">
</div>
```

### 3. Microsoft OAuth Setup

To enable Microsoft login:

1. Go to [Azure Portal](https://portal.azure.com/)
2. Click "Azure Active Directory" → "App registrations" → "New registration"
3. Register your application:
   - Name: "SecureBank"
   - Redirect URI: Select "Web" and enter your domain
4. In the app overview, copy the "Client ID"
5. Create a client secret under "Certificates & secrets"

6. Install Microsoft Authentication Library (MSAL):
```html
<script src="https://alcdn.msauth.net/browser/2.30.0/ms-sign-in-windows.js"></script>
<script src="https://alcdn.msauth.net/browser/2.30.0/ms-sign-in-webauth.js"></script>
```

7. Update `auth.js` with MSAL configuration:
```javascript
const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.com/common"
    }
};
```

### 4. Apple Sign-In Setup

To enable Apple Sign-In:

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new App ID and enable "Sign In with Apple"
3. Create a Services ID for your website
4. Configure your domain and return URLs
5. Download the private key

6. Add Apple Sign-In JS to your HTML:
```html
<script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
```

7. Initialize Apple Sign-In:
```javascript
AppleID.auth.init({
    clientId: 'YOUR_APPLE_CLIENT_ID',
    scope: 'name email',
    redirectURI: 'https://yourdomain.com/auth/apple',
    state: 'origin:web'
});
```

### 5. Bot Verification Setup

To enable reCAPTCHA v3 verification on site access:

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new reCAPTCHA v3 site
3. Add your domain(s) to the allowed domains
4. Copy your Site Key

5. Update `captcha-verify.js`:
```javascript
const RECAPTCHA_SITE_KEY = 'YOUR_ACTUAL_SITE_KEY';
```

6. For backend verification, implement `/api/verify-recaptcha` endpoint:
```javascript
// Example Node.js/Express endpoint
app.post('/api/verify-recaptcha', async (req, res) => {
    const { token, action } = req.body;
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${YOUR_SECRET_KEY}&response=${token}`
    });
    
    const result = await response.json();
    res.json(result);
});
```

### 4. Facebook OAuth Setup

To enable Facebook login:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing app
3. Add "Facebook Login" product
4. In Facebook Login settings, add:
   - Valid OAuth Redirect URIs: Your domain
5. Copy your App ID

6. Add Facebook SDK to `login.html` and `signup.html`:
```html
<script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=YOUR_APP_ID" nonce="abcd1234">
</script>
## Running the Application

### Local Development with Python
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

### Local Development with Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server
```

### Using VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Features in Detail

### Form Validation
- **Email**: Valid email format check
- **Password**: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
- **Phone**: 10-15 digits
- **Password Match**: Confirmation must match password

### User Session
- User data stored in browser's LocalStorage
- Data includes: Name, Email, Phone, Auth Provider, Login Time
- Dashboard requires authentication (redirects to login if not logged in)
- Logout clears user data and redirects to home page

### Message System
- Success messages (green) - Auto-hide after 5 seconds
- Error messages (red) - Stay visible until user interacts
- Info messages (blue) - Auto-hide after 5 seconds

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Browsers

## Security Considerations

⚠️ **Important**: This is a frontend-only demo application. In production:

1. **Never store passwords** in frontend code or LocalStorage
2. **Use HTTPS** for all communications
3. **Implement backend authentication** server
4. **Validate all inputs** on the server side
5. **Use secure session tokens** (JWT or similar)
6. **Implement CSRF protection**
7. **Use secure HTTP-only cookies** for tokens
8. **Implement rate limiting** on authentication endpoints
9. **Add two-factor authentication** (2FA)
10. **Use environment variables** for sensitive data

## Backend Integration

To use this with a real backend, update `auth.js`:

```javascript
// Replace demo code with actual API calls
async function handleEmailLogin() {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'dashboard.html';
    }
}
```

## Customization

### Change Color Scheme
Edit `styles.css`:
```css
/* Original colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #667eea;

/* Change to your preferred colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
color: #YOUR_COLOR;
```

### Add More OAuth Providers
1. Add button in HTML form
2. Add handler function in `auth.js`
3. Implement OAuth flow using provider's SDK

### Modify Form Fields
Edit `signup.html` to add more fields, then update `handleEmailSignUp()` in `auth.js`

## Troubleshooting

### Google Login Not Working
- Check that Client ID is correctly set
- Ensure localhost/domain is in authorized origins
- Clear browser cache and cookies
- Check browser console for errors

### CSS Not Loading
- Make sure `styles.css` is in the same directory as HTML files
- Check file paths in `<link>` tag
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Form Validation Not Working
- Check browser console for JavaScript errors
- Ensure `auth.js` is loaded correctly
- Verify input field names match JavaScript code

### Redirects Not Working
- Create missing pages (e.g., `dashboard.html`)
- Check file paths in JavaScript redirect calls
- Ensure `requireLogin()` function is properly implemented

## API Endpoints (For Backend Implementation)

When implementing backend, use these endpoints:

```
POST /api/signup
POST /api/login
POST /api/logout
POST /api/verify-email
POST /api/google-login
POST /api/apple-login
POST /api/microsoft-login
GET /api/dashboard
```

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Forgot password functionality
- [ ] User profile page
- [ ] Account settings
- [ ] Transaction history
- [ ] Money transfer
- [ ] Bill payments
- [ ] Mobile app (React Native/Flutter)
- [ ] Dark mode theme
- [ ] Multiple language support
- [ ] Admin dashboard
- [ ] User support chatbot

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the setup instructions
3. Check browser console for error messages
4. Verify all files are in the correct location

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Built with ❤️ for secure banking**
