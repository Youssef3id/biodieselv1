function checkAdminRole() {
    return fetch('http://localhost/project-un/php/check_role.php')
        .then(response => response.json())
        .then(data => data.isAdmin)
        .catch(error => {
            console.error('Error checking admin role:', error);
            return false;
        });
}

checkAdminRole().then(isAdmin => {
   
    if (!isAdmin) {
        window.location.href = "/user/index.html";
    }
});