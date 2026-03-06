// ========== Bot Verification on Site Access ==========

// Configuration
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY'; // Replace with your actual site key
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
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide captcha modal
function hideCaptchaModal() {
    const modal = document.getElementById('captchaModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Verify user with reCAPTCHA v3
async function verifyUser() {
    const loader = document.getElementById('captchaLoader');
    const message = document.getElementById('captchaMessage');

    loader.style.display = 'block';
    message.textContent = '';

    try {
        // Get reCAPTCHA token
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'access_site' });

        // Send token to backend for verification
        const response = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                action: 'access_site'
            })
        });

        const result = await response.json();

        if (response.ok && result.success && result.score >= VERIFICATION_THRESHOLD) {
            // User passed verification
            loader.style.display = 'none';
            message.textContent = 'Verification successful! Welcome to SecureBank.';
            message.className = 'captcha-message success';

            markUserVerified();
            setTimeout(() => {
                hideCaptchaModal();
            }, 1500);
        } else {
            // User failed verification
            loader.style.display = 'none';
            message.textContent = 'Verification failed. Please try again or contact support.';
            message.className = 'captcha-message error';

            // Allow retry after 3 seconds
            setTimeout(() => {
                verifyUser();
            }, 3000);
        }
    } catch (error) {
        console.error('Verification error:', error);
        loader.style.display = 'none';
        message.textContent = 'Verification service temporarily unavailable. Please try again.';
        message.className = 'captcha-message error';

        // Allow retry after 5 seconds
        setTimeout(() => {
            verifyUser();
        }, 5000);
    }
}

// Initialize verification on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if reCAPTCHA is loaded
    if (typeof grecaptcha !== 'undefined') {
        // If user is not verified, show captcha modal
        if (!isUserVerified()) {
            showCaptchaModal();
            verifyUser();
        }
    } else {
        // If reCAPTCHA fails to load, show error and allow access
        console.warn('reCAPTCHA failed to load. Allowing access for demo purposes.');
        markUserVerified();
    }
});

// ========== Fallback for Demo Mode ==========
if (typeof grecaptcha === 'undefined') {
    // Demo mode - simulate verification
    document.addEventListener('DOMContentLoaded', function() {
        if (!isUserVerified()) {
            showCaptchaModal();

            const loader = document.getElementById('captchaLoader');
            const message = document.getElementById('captchaMessage');

            setTimeout(() => {
                loader.style.display = 'none';
                message.textContent = 'Demo mode: Verification successful!';
                message.className = 'captcha-message success';

                markUserVerified();
                setTimeout(() => {
                    hideCaptchaModal();
                }, 1500);
            }, 2000);
        }
    });
}