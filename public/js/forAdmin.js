    const loginBlock = document.getElementById('login-block');
    const registerBlock = document.getElementById('register-block');
    const toRegister = document.getElementById('to-register');
    const toLogin = document.getElementById('to-login');

    toRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginBlock.classList.add('hidden');
      registerBlock.classList.remove('hidden');
    });

    toLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerBlock.classList.add('hidden');
      loginBlock.classList.remove('hidden');
    });