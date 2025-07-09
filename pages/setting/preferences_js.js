document.addEventListener("DOMContentLoaded", function() {
    const saveBtn = document.getElementById('savePreferencesBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const currency = document.getElementById('currency').value;
            const timezone = document.getElementById('timezone').value;
            
            const toggle1 = document.getElementById('toggle1').checked;
            const toggle2 = document.getElementById('toggle2').checked;
            const toggle3 = document.getElementById('toggle3').checked;
            
            const preferences = {
                currency,
                timezone,
                notifications: {
                    digitalCurrency: toggle1,
                    merchantOrder: toggle2,
                    accountRecommendations: toggle3
                }
            };
            
            // Simulate saving the preferences
            console.log('Saved Preferences:', preferences);
            alert('Preferences saved successfully!');
        });
    }
});