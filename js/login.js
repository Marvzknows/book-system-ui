import {baseURL} from '../js/main.js';

$(document).ready(function () {

    const loginBtn = $('#loginBtn');
    
    let username = $('#username');
    let password = $('#password');

    // Clear token onload
    window.localStorage.clear('access_token');
    
    // Handle Login
    function handleLogin() {

        const payLoad = {
            username: username.val(),
            password: password.val()
        }

        $.ajax({
            type: "POST",
            url: `${baseURL}/api/login.php`,
            data: payLoad,
            success: function (response) {
                console.log(response);
                if(response.status_code === 200) {
                    window.localStorage.setItem('access_token', response.access_token);
                    window.location.href = '../pages/home.html';
                }
            },error: function(error) {
                console.error(error);
            }
        });
    }

    loginBtn.on('click',function(e) {
        e.preventDefault();
        handleLogin();
    })

});