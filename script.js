document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('auth_form');
  const emailField = document.getElementById('email_field');
  const passwordField = document.getElementById('password_field');
  const nameContainer = document.getElementById('name_container');
  const formTitle = document.getElementById('form_title');
  const formSubtitle = document.getElementById('form_subtitle');
  const toggleForm = document.getElementById('toggle_form');
  const toggleLink = document.getElementById('toggle_link');
  const submitBtn = document.getElementById('submit_btn');
  const loadingSpinner = document.getElementById('loading_spinner');
  const nameField = document.getElementById('name_field');

  let isLoginForm = true;

  // Basic email validation
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Basic password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  function toggleFormMode() {
    isLoginForm = !isLoginForm;
    
    if (isLoginForm) {
      formTitle.textContent = 'Iniciar Sesión';
      formSubtitle.textContent = 'Bienvenido a Saturn360, Disfruta de Nuestros Servicios.';
      nameContainer.style.display = 'none';
      submitBtn.textContent = 'Iniciar Sesión';
      toggleLink.textContent = 'Registrarse';
    } else {
      formTitle.textContent = 'Registrarse';
      formSubtitle.textContent = 'Crea tu cuenta en Saturn360 y accede a todos los servicios.';
      nameContainer.style.display = 'flex';
      submitBtn.textContent = 'Registrarse';
      toggleLink.textContent = 'Iniciar Sesión';
    }
  }

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleFormMode();
  });

  // Simulated user database (in a real app, this would be server-side)
  const users = JSON.parse(localStorage.getItem('saturn360Users')) || [];

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailField.value.trim();
    const password = passwordField.value;
    const name = isLoginForm ? '' : nameField.value.trim();

    // Validate inputs
    if (!validateEmail(email)) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    if (!validatePassword(password)) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!isLoginForm && !name) {
      alert('Por favor, ingrese su nombre completo.');
      return;
    }

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    submitBtn.disabled = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLoginForm) {
        // Login logic
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          // Successful login
          localStorage.setItem('currentUser', JSON.stringify(user));
          window.location.href = 'dashboard.html';
        } else {
          alert('Correo electrónico o contraseña incorrectos.');
        }
      } else {
        // Registration logic
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          alert('Ya existe una cuenta con este correo electrónico.');
        } else {
          // Create new user
          const newUser = { email, password, name };
          users.push(newUser);
          localStorage.setItem('saturn360Users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          window.location.href = 'dashboard.html';
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Ocurrió un error. Por favor, intente nuevamente.');
    } finally {
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  // Auto-fill for testing purposes (can be removed in production)
  emailField.value = 'test@example.com';
  passwordField.value = 'password123';
});