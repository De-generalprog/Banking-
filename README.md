# SecureBank - Modern Banking Platform

A modern, secure banking web application with sign-up, login, and social authentication features using Google, Microsoft, and Facebook OAuth.

## Features

✨ **Authentication**
- Email/Password Login & Sign Up
- Google OAuth Integration
- Apple Sign-In Support
- Microsoft OAuth Support
- Facebook OAuth Support
- Password Strength Validation
- Email Validation
- Remember Me Option
- Forgot Password Link

🔒 **Security**
- Bot Verification on Site Access (reCAPTCHA v3)
- Client-side Form Validation
- Secure OAuth Implementation
- LocalStorage for Session Management

🎨 **User Interface**
- Responsive Design (Mobile, Tablet, Desktop)
- Modern Gradient UI Theme
- Smooth Animations & Transitions
- Feature Showcase on Landing Page
- Professional Dashboard
- Quick Access Options (Email, Apple, Google)

🔐 **Security**
- Client-side Form Validation
- Password Strength Requirements
- Secure OAuth Implementation
- LocalStorage for Session Management

## Project Structure

```
Banking-/
├── index.html          # Landing page with features
├── login.html          # Login page
├── signup.html         # Sign up page
├── dashboard.html      # User dashboard (after login)
├── styles.css          # All styling
├── auth.js             # Authentication logic
├── README.md           # This file
└── .git/               # Git repository
```

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

### auth.js
- Email/Password validation
- Form submission handlers
- Google OAuth implementation
- Microsoft OAuth placeholder
- Facebook OAuth placeholder
- LocalStorage management
- User session handling
- Logout functionality

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
```

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
POST /api/microsoft-login
POST /api/facebook-login
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
