document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.querySelector('form');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const avatarUpdateToast = document.getElementById('avatarUpdateToast');
    const profileMainAvatar = document.querySelector('.profile-main-avatar');
    const userImg = document.querySelector('.user-img');

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(avatarUpdateToast);

    // Fetch user data when page loads
    fetchUserData();

    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('http://localhost/project-un/pages/setting/edit-profile/index.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    showToast('Success', 'Profile updated successfully!', 'success');
                    // Update form with new values
                    updateFormValues(result.userData);
                    // Update profile images if provided
                    if (result.userData.profile_image) {
                        updateProfileImages(result.userData.profile_image);
                    }
                } else {
                    showToast('Error', result.message || 'Failed to update profile', 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error', 'An unexpected error occurred', 'danger');
            }
        });
    }

    // Handle avatar preview
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle avatar update
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', async function() {
            const fileInput = document.getElementById('avatarUpload');
            if (!fileInput.files.length) {
                showToast('Error', 'Please select an image first', 'danger');
                return;
            }

            const formData = new FormData();
            formData.append('profile_image', fileInput.files[0]);

            try {
                const response = await fetch('/pages/setting/edit-profile/update_avatar.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    // Update profile images
                    updateProfileImages(result.imageUrl);
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('avatarEditModal'));
                    modal.hide();
                    
                    showToast('Success', 'Profile picture updated successfully!', 'success');
                } else {
                    showToast('Error', result.message || 'Failed to update profile picture', 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error', 'An unexpected error occurred', 'danger');
            }
        });
    }

    // Helper function to show toast messages
    function showToast(title, message, type = 'success') {
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}:</strong> ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.querySelector('.toast-container').appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
        // Remove toast after it's hidden
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    // Helper function to update form values
    function updateFormValues(userData) {
        if (!userData) return;
        
        const fields = [
            'yourName', 'userName', 'email', 'dateOfBirth', 
            'presentAddress', 'permanentAddress', 'country', 
            'city', 'postalCode'
        ];
        
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && userData[field] !== undefined) {
                input.value = userData[field] || '';
            }
        });
    }

    // Helper function to update profile images
    function updateProfileImages(imageUrl) {
        if (!imageUrl) return;
        
        // Update main profile avatar
        if (profileMainAvatar) {
            profileMainAvatar.src = imageUrl;
        }
        
        // Update avatar preview in modal
        if (avatarPreview) {
            avatarPreview.src = imageUrl;
        }
        
        // Update header user image
        if (userImg) {
            userImg.src = imageUrl;
        }
    }

    // Function to fetch user data
    async function fetchUserData() {
        try {
            const response = await fetch('http://localhost/project-un/pages/setting/edit-profile/index.php', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                updateFormValues(result.userData);
                if (result.userData.profile_image) {
                    updateProfileImages(result.userData.profile_image);
                }
            } else {
                showToast('Error', result.message || 'Failed to fetch user data', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error', 'Failed to load user data', 'danger');
        }
    }
});