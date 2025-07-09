document.addEventListener("DOMContentLoaded", function() {
    const saveBtn = document.getElementById('saveSecurityBtn');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordStrengthIndicator = document.getElementById('password-strength');
    const strengthFill = passwordStrengthIndicator ? passwordStrengthIndicator.querySelector('.strength-fill') : null;
    const strengthText = passwordStrengthIndicator ? passwordStrengthIndicator.querySelector('.strength-text') : null;
    
    // Password strength validation
    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const errors = [];
        if (password.length < minLength) errors.push(`At least ${minLength} characters`);
        if (!hasUpperCase) errors.push('One uppercase letter');
        if (!hasLowerCase) errors.push('One lowercase letter');
        if (!hasNumbers) errors.push('One number');
        if (!hasSpecialChar) errors.push('One special character');
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#17a2b8';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Clear password fields
    function clearPasswordFields() {
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    }
    
    // Update save button state
    function updateSaveButtonState() {
        const hasCurrentPassword = currentPassword.value.trim() !== '';
        const hasNewPassword = newPassword.value.trim() !== '';
        const hasConfirmPassword = confirmPassword.value.trim() !== '';
        
        saveBtn.disabled = !(hasCurrentPassword && hasNewPassword && hasConfirmPassword);
        saveBtn.style.opacity = saveBtn.disabled ? '0.6' : '1';
    }
    
    // Password strength indicator
    function updatePasswordStrength(password) {
        if (!passwordStrengthIndicator || !strengthFill || !strengthText) return;
        
        if (!password) {
            passwordStrengthIndicator.style.display = 'none';
            return;
        }
        
        passwordStrengthIndicator.style.display = 'block';
        
        const validation = validatePassword(password);
        const strength = validation.errors.length;
        
        // Remove existing classes
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (strength >= 4) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (strength >= 2) {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Medium strength password';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
    }
    
    // Add event listeners for real-time validation
    [currentPassword, newPassword, confirmPassword].forEach(input => {
        input.addEventListener('input', updateSaveButtonState);
    });
    
    // Add password strength indicator for new password
    if (newPassword) {
        newPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!currentPassword.value.trim()) {
                showNotification('❌ Please enter your current password', 'error');
                currentPassword.focus();
                return;
            }
            
            if (!newPassword.value.trim()) {
                showNotification('❌ Please enter a new password', 'error');
                newPassword.focus();
                return;
            }
            
            if (!confirmPassword.value.trim()) {
                showNotification('❌ Please confirm your new password', 'error');
                confirmPassword.focus();
                return;
            }
            
            // Check if passwords match
            if (newPassword.value !== confirmPassword.value) {
                showNotification('❌ New passwords do not match. Please re-enter.', 'error');
                confirmPassword.focus();
                return;
            }
            
            // Validate password strength
            const passwordValidation = validatePassword(newPassword.value);
            if (!passwordValidation.isValid) {
                showNotification(`❌ Password must contain: ${passwordValidation.errors.join(', ')}`, 'error');
                newPassword.focus();
                return;
            }
            
            // Disable save button during request
            saveBtn.disabled = true;
            saveBtn.textContent = 'Updating...';
            
            // Prepare form data
            const formData = new FormData();
            formData.append('current_password', currentPassword.value);
            formData.append('new_password', newPassword.value);
            
            // Send AJAX request
            fetch('http://localhost/project-un/php/changePasswd.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('✅ ' + data.message, 'success');
                    clearPasswordFields();
                    updateSaveButtonState();
                } else {
                    showNotification('❌ ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('❌ An error occurred while updating password. Please try again.', 'error');
            })
            .finally(() => {
                // Re-enable save button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
                updateSaveButtonState();
            });
        });
    }
    
    // Initialize button state
    updateSaveButtonState();
});