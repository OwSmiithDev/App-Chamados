// /chamados-app/js/cadastro.js

const cadastroApp = {
    cadastroForm: document.getElementById('cadastro-form'),
    nomeInput: document.getElementById('cadastro-nome'),
    emailInput: document.getElementById('cadastro-email'),
    passwordInput: document.getElementById('cadastro-password'),
    confirmPasswordInput: document.getElementById('cadastro-confirm-password'),
    messageArea: document.getElementById('message-area-cadastro'),

    init: function() {
        if (this.cadastroForm) {
            this.cadastroForm.addEventListener('submit', (event) => this.handleCadastro(event));
        }
    },

    handleCadastro: function(event) {
        event.preventDefault();

        const nome = this.nomeInput.value.trim();
        const email = this.emailInput.value.trim().toLowerCase();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (!nome || !email || !password || !confirmPassword) {
            mainApp.showMessage('Por favor, preencha todos os campos.', 'error', 'message-area-cadastro');
            return;
        }
        if (password.length < 6) {
            mainApp.showMessage('A senha deve ter no mínimo 6 caracteres.', 'error', 'message-area-cadastro');
            return;
        }
        if (password !== confirmPassword) {
            mainApp.showMessage('As senhas não coincidem.', 'error', 'message-area-cadastro');
            return;
        }

        const users = JSON.parse(localStorage.getItem(mainApp.USERS_DB_KEY)) || [];
        if (users.some(user => user.email === email)) {
            mainApp.showMessage('Este email já está cadastrado.', 'error', 'message-area-cadastro');
            return;
        }

        const novoUsuario = {
            id: `usr_${new Date().getTime()}_${Math.random().toString(36).substring(2, 7)}`,
            nome: nome,
            email: email,
            senha: password, 
            role: 'padrao', 
            dataCadastro: new Date().toISOString()
        };

        users.push(novoUsuario);
        localStorage.setItem(mainApp.USERS_DB_KEY, JSON.stringify(users));
        mainApp.showMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'success', 'message-area-cadastro');
        this.cadastroForm.reset();
        setTimeout(() => { window.location.href = 'index.html'; }, 2500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cadastro-form')) {
        cadastroApp.init();
    }
});