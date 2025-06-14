// /chamados-app/js/main.js

// Namespace para evitar conflitos globais
const mainApp = {
    LOGGED_USER_KEY: 'chamados_loggedUser',
    USERS_DB_KEY: 'chamados_usersDB',
    THEME_KEY: 'chamados_theme',
    LAST_TICKET_ID_KEY: 'chamados_lastTicketIdCounter', // Chave para o contador de ID de chamado

    themeToggleButtons: [],

    initTheme: function() {
        this.themeToggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-sidebar');
        
        if (localStorage.getItem(this.THEME_KEY) === 'dark' || 
            (!localStorage.getItem(this.THEME_KEY) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcons();

        this.themeToggleButtons.forEach(button => {
            if(button) {
                button.addEventListener('click', () => {
                    document.documentElement.classList.toggle('dark');
                    localStorage.setItem(this.THEME_KEY, document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                    this.updateThemeIcons();
                });
            }
        });
    },

    updateThemeIcons: function() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const mainDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const mainLightIcon = document.getElementById('theme-toggle-light-icon');
        if (mainDarkIcon && mainLightIcon) {
            mainDarkIcon.style.display = isDarkMode ? 'block' : 'none';
            mainLightIcon.style.display = isDarkMode ? 'none' : 'block';
        }
        
        const sidebarDarkIcon = document.getElementById('theme-toggle-dark-icon-sidebar');
        const sidebarLightIcon = document.getElementById('theme-toggle-light-icon-sidebar');
         if (sidebarDarkIcon && sidebarLightIcon) {
            sidebarDarkIcon.style.display = isDarkMode ? 'block' : 'none';
            sidebarLightIcon.style.display = isDarkMode ? 'none' : 'block';
        }
    },
    
    showMessage: function(message, type = 'success', areaId = 'message-area') {
        const messageArea = document.getElementById(areaId);
        if (!messageArea) {
            // console.warn(`Message area with ID '${areaId}' not found.`);
            return;
        }

        let bgColor, textColor;
        switch (type) {
            case 'error': bgColor = 'bg-danger'; textColor = 'text-white'; break;
            case 'warning': bgColor = 'bg-warning'; textColor = 'text-white'; break;
            case 'success': default: bgColor = 'bg-success'; textColor = 'text-white';
        }
        messageArea.innerHTML = `<div class="${bgColor} ${textColor} p-3 rounded-md shadow">${message}</div>`;
        
        setTimeout(() => { messageArea.innerHTML = ''; }, 5000);
    },

    handleLogin: function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showMessage('Por favor, preencha email e senha.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem(this.USERS_DB_KEY)) || [];
        const user = users.find(u => u.email === email && u.senha === password); 

        if (user) {
            localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
            this.showMessage('Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => { window.location.href = 'chamados.html'; }, 1500);
        } else {
            this.showMessage('Email ou senha inválidos.', 'error');
        }
    },

    checkUserSession: function() {
        const loggedUserString = localStorage.getItem(this.LOGGED_USER_KEY);
        if (!loggedUserString) {
            return null; 
        }
        try {
            return JSON.parse(loggedUserString); 
        } catch (e) {
            console.error("Erro ao parsear usuário logado:", e);
            localStorage.removeItem(this.LOGGED_USER_KEY); 
            return null;
        }
    },
    
    handlePageAccess: function() {
        const currentUser = this.checkUserSession();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is '/'

        if (['index.html', 'cadastro.html'].includes(currentPage)) {
            if (currentUser && currentPage !== 'chamados.html') {
                 // Se usuário está logado e tenta acessar login/cadastro, pode redirecionar para dashboard.
                 // window.location.href = 'chamados.html'; // Descomente se desejar este comportamento.
            }
            return currentUser; 
        }

        if (!currentUser) {
            window.location.href = 'index.html';
            return null; 
        }

        if (currentPage === 'usuario.html' && currentUser.role !== 'admin') {
            // Tenta exibir mensagem na página de chamados, para onde será redirecionado
            localStorage.setItem('redirectMessage', JSON.stringify({ 
                text: 'Acesso negado. Somente administradores podem gerenciar usuários.', 
                type: 'error' 
            }));
            window.location.href = 'chamados.html';
            return null; 
        }
        
        return currentUser; 
    },
    
    updateNavLinks: function(userRole) {
        const navUsuariosLinkContainer = document.getElementById('nav-usuarios-link-container');
        if (navUsuariosLinkContainer) {
            if (userRole === 'admin') {
                navUsuariosLinkContainer.style.display = 'list-item';
            } else {
                navUsuariosLinkContainer.style.display = 'none';
            }
        }
    },

    handleLogout: function() {
        localStorage.removeItem(this.LOGGED_USER_KEY);
        
        const messageAreas = ['message-area', 'message-area-user', 'message-area-profile', 'modal-message-area-chamado', 'modal-message-area-user', 'message-area-cadastro'];
        for (const areaId of messageAreas) {
            const areaElement = document.getElementById(areaId);
            if (areaElement) { this.showMessage('Logout realizado com sucesso!', 'success', areaId); }
        }
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    },
    
    addDefaultUserIfNone: function() {
        let users = JSON.parse(localStorage.getItem(this.USERS_DB_KEY)) || [];
        if (users.length === 0) {
            const defaultUser = {
                id: "usr_admin_001", 
                nome: "Administrador Master", // Nome atualizado
                email: "admin@chamados.com", 
                senha: "admin", 
                role: "admin", 
                dataCadastro: new Date().toISOString()
            };
            users.push(defaultUser);
            localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
            console.log("Usuário administrador padrão adicionado: admin@chamados.com / admin");

            if (localStorage.getItem(this.LAST_TICKET_ID_KEY) === null) {
                localStorage.setItem(this.LAST_TICKET_ID_KEY, '0');
            }
        }
    },

    generateNewTicketId: function() {
        let lastId = parseInt(localStorage.getItem(this.LAST_TICKET_ID_KEY) || '0');
        lastId++;
        localStorage.setItem(this.LAST_TICKET_ID_KEY, lastId.toString());
        return `C${lastId}`;
    },


    init: function() {
        this.initTheme();
        this.addDefaultUserIfNone(); 

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => this.handleLogin(event));
        }

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }
        
        const currentUserSession = this.handlePageAccess(); 
        
        if (currentUserSession && !['index.html', 'cadastro.html', ''].includes(window.location.pathname.split('/').pop()  || 'index.html')) {
            this.updateNavLinks(currentUserSession.role);
            const userNameElement = document.getElementById('logged-user-name');
            if(userNameElement) userNameElement.textContent = currentUserSession.nome;

            const redirectMsgString = localStorage.getItem('redirectMessage');
            if (redirectMsgString) {
                const redirectMsg = JSON.parse(redirectMsgString);
                this.showMessage(redirectMsg.text, redirectMsg.type, 'message-area'); 
                localStorage.removeItem('redirectMessage');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    mainApp.init();
});