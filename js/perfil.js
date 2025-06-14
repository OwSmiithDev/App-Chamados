// /chamados-app/js/perfil.js

const perfilApp = {
    profileForm: document.getElementById('profile-form'),
    nomeInput: document.getElementById('profile-nome'),
    emailInput: document.getElementById('profile-email'),
    senhaAtualInput: document.getElementById('profile-senha-atual'),
    novaSenhaInput: document.getElementById('profile-nova-senha'),
    confirmaNovaSenhaInput: document.getElementById('profile-confirma-nova-senha'),
    currentUser: null, 

    init: function() {
        this.currentUser = mainApp.checkUserSession(); 
        if (!this.currentUser && !['index.html', 'cadastro.html', ''].includes(window.location.pathname.split('/').pop()) ) {
            return; 
        }
        
        if (this.currentUser) { 
            mainApp.updateNavLinks(this.currentUser.role);
            this.loadProfileData(this.currentUser);
        }


        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e, this.currentUser));
        }
    },

    loadProfileData: function(user) {
        if (this.nomeInput) this.nomeInput.value = user.nome;
        if (this.emailInput) this.emailInput.value = user.email;
    },

    handleProfileUpdate: function(event, loggedUser) {
        if (!loggedUser) {
            mainApp.showMessage('Sessão inválida. Por favor, faça login novamente.', 'error', 'message-area-profile');
            return;
        }
        event.preventDefault();
        
        const nome = this.nomeInput.value;
        const email = this.emailInput.value;
        const senhaAtual = this.senhaAtualInput.value;
        const novaSenha = this.novaSenhaInput.value;
        const confirmaNovaSenha = this.confirmaNovaSenhaInput.value;

        if (!nome || !email) {
            mainApp.showMessage('Nome e Email são obrigatórios.', 'error', 'message-area-profile');
            return;
        }

        let users = JSON.parse(localStorage.getItem(mainApp.USERS_DB_KEY)) || [];
        const userIndex = users.findIndex(u => u.id === loggedUser.id);

        if (userIndex === -1) {
            mainApp.showMessage('Usuário não encontrado. Por favor, faça login novamente.', 'error', 'message-area-profile');
            setTimeout(() => mainApp.handleLogout(), 2000);
            return;
        }

        const emailExists = users.some(user => user.email === email && user.id !== loggedUser.id);
        if (emailExists) {
            mainApp.showMessage('Este email já está cadastrado por outro usuário.', 'error', 'message-area-profile');
            return;
        }
        
        const currentUserDataInStorage = { ...users[userIndex] }; 
        let passwordChanged = false;

        if (novaSenha || confirmaNovaSenha || senhaAtual) { 
            if (!senhaAtual) {
                mainApp.showMessage('Por favor, insira sua senha atual para alterar a senha.', 'error', 'message-area-profile');
                return;
            }
            if (senhaAtual !== currentUserDataInStorage.senha) { 
                mainApp.showMessage('Senha atual incorreta.', 'error', 'message-area-profile');
                return;
            }
            if (!novaSenha) {
                 mainApp.showMessage('Nova senha não pode ser vazia se a senha atual foi fornecida.', 'error', 'message-area-profile');
                return;
            }
            if (novaSenha.length < 6) {
                mainApp.showMessage('A nova senha deve ter no mínimo 6 caracteres.', 'error', 'message-area-profile');
                return;
            }
            if (novaSenha !== confirmaNovaSenha) {
                mainApp.showMessage('A nova senha e a confirmação não coincidem.', 'error', 'message-area-profile');
                return;
            }
            currentUserDataInStorage.senha = novaSenha; 
            passwordChanged = true;
        }

        currentUserDataInStorage.nome = nome;
        currentUserDataInStorage.email = email;

        users[userIndex] = currentUserDataInStorage;
        localStorage.setItem(mainApp.USERS_DB_KEY, JSON.stringify(users));
        localStorage.setItem(mainApp.LOGGED_USER_KEY, JSON.stringify(currentUserDataInStorage)); 
        
        this.currentUser = currentUserDataInStorage;
        
        if(this.senhaAtualInput) this.senhaAtualInput.value = '';
        if(this.novaSenhaInput) this.novaSenhaInput.value = '';
        if(this.confirmaNovaSenhaInput) this.confirmaNovaSenhaInput.value = '';

        mainApp.showMessage('Perfil atualizado com sucesso!' + (passwordChanged ? ' Sua senha foi alterada.' : ''), 'success', 'message-area-profile');
        
        const userNameOnDashboard = document.getElementById('logged-user-name');
        if(userNameOnDashboard) { 
            userNameOnDashboard.textContent = currentUserDataInStorage.nome;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profile-form')) { 
        perfilApp.init();
    }
});