// /chamados-app/js/usuarios.js

const usuariosApp = {
    USERS_DB_KEY: mainApp.USERS_DB_KEY, 
    userListTableBody: document.getElementById('user-list-table'),
    noUsersMessageElement: document.getElementById('no-users-message'),
    userModalElement: document.getElementById('user-modal'),
    userFormElement: document.getElementById('user-form'),
    userModalTitleElement: document.getElementById('user-modal-title'),
    createUserButton: document.getElementById('create-user-button'),
    closeUserModalButton: document.getElementById('close-user-modal-button'),
    senhaHelpTextElement: document.getElementById('senha-help-text'),
    userRoleSelect: document.getElementById('user-role'), 

    currentEditingUserId: null,
    currentUser: null, 

    init: function() {
        this.currentUser = mainApp.checkUserSession(); 

        if (!this.currentUser || this.currentUser.role !== 'admin') {
            const mainContent = document.querySelector('main'); 
            if(mainContent && window.location.pathname.endsWith('/usuario.html')) { 
                mainContent.innerHTML = `<p class="text-center text-danger p-8 text-lg">Acesso Negado</p><p class="text-center text-gray-600 dark:text-gray-400">Você não tem permissão para acessar esta página. Você será redirecionado para o dashboard.</p>`;
            }
            return; 
        }
        
        if (this.currentUser) { 
            mainApp.updateNavLinks(this.currentUser.role);
        }

        this.loadUsers();

        if (this.createUserButton) {
            this.createUserButton.addEventListener('click', () => this.openUserModal());
        }
        if (this.closeUserModalButton) {
            this.closeUserModalButton.addEventListener('click', () => this.closeUserModal());
        }
        if (this.userFormElement) {
            this.userFormElement.addEventListener('submit', (e) => this.saveUser(e));
        }
        
        if (this.userListTableBody) {
            this.userListTableBody.addEventListener('click', (e) => {
                const target = e.target;
                const button = target.closest('button');
                if (!button) return;

                const userId = button.dataset.id;
                if (button.classList.contains('edit-user-button')) {
                    this.openUserModal(userId);
                } else if (button.classList.contains('delete-user-button')) {
                    this.confirmDeleteUser(userId);
                }
            });
        }
    },

    getUsers: function() { return JSON.parse(localStorage.getItem(this.USERS_DB_KEY)) || []; },
    saveUsersToStorage: function(users) { localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users)); },
    
    renderUsers: function() {
        if (!this.userListTableBody || !this.noUsersMessageElement) {
            return; 
        }
        
        this.userListTableBody.innerHTML = ''; 
        const users = this.getUsers();
        const onUserPage = window.location.pathname.endsWith('/usuario.html');

        if (users.length === 0 && onUserPage) { 
            this.noUsersMessageElement.style.display = 'block';
            if(this.userListTableBody.closest('table')) this.userListTableBody.closest('table').style.display = 'none';
        } else if (users.length > 0) {
            this.noUsersMessageElement.style.display = 'none';
            if(this.userListTableBody.closest('table')) this.userListTableBody.closest('table').style.display = '';
            users.forEach(user => {
                const userRow = this.createUserRow(user);
                this.userListTableBody.appendChild(userRow);
            });
        } else {
            this.noUsersMessageElement.style.display = 'none';
            if(this.userListTableBody.closest('table')) this.userListTableBody.closest('table').style.display = 'none';
        }
    },
    loadUsers: function() { this.renderUsers(); },

    createUserRow: function(user) {
        const row = document.createElement('tr');
        row.className = "hover:bg-secondary dark:hover:bg-gray-700/50 transition-colors";
        
        const loggedUser = this.currentUser; 
        const isCurrentUser = loggedUser && loggedUser.id === user.id;

        const roleDisplay = { 'admin': 'Admin', 'tecnico': 'Técnico', 'padrao': 'Padrão' };

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">${user.nome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${roleDisplay[user.role] || user.role}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${new Date(user.dataCadastro).toLocaleDateString('pt-BR')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:underline mr-3 edit-user-button" data-id="${user.id}">Editar</button>
                ${!isCurrentUser ? `<button class="text-danger hover:underline delete-user-button" data-id="${user.id}">Excluir</button>` : '<span class="text-xs text-gray-400">(Usuário Atual)</span>'}
            </td>
        `;
        return row;
    },

    openUserModal: function(id = null) { 
        if (!this.userModalElement || !this.userFormElement || !this.userModalTitleElement) return;

        this.userFormElement.reset();
        this.currentEditingUserId = null; 
        
        const senhaInput = document.getElementById('user-senha');
        const modalMessageArea = document.getElementById('modal-message-area-user');
        if(modalMessageArea) modalMessageArea.innerHTML = ''; 

        if (id) { 
            this.currentEditingUserId = id;
            this.userModalTitleElement.textContent = 'Editar Usuário';
            if(this.senhaHelpTextElement) this.senhaHelpTextElement.textContent = 'Deixe em branco para não alterar a senha.';
            if(senhaInput) senhaInput.required = false;

            const users = this.getUsers();
            const user = users.find(u => u.id === id);
            if (user) {
                document.getElementById('user-id').value = user.id;
                document.getElementById('user-nome').value = user.nome;
                document.getElementById('user-email').value = user.email;
                if(this.userRoleSelect) this.userRoleSelect.value = user.role || 'padrao'; 
            }
        } else { 
            this.userModalTitleElement.textContent = 'Novo Usuário';
            document.getElementById('user-id').value = '';
            if(this.senhaHelpTextElement) this.senhaHelpTextElement.textContent = 'Mínimo 6 caracteres. Obrigatório para novos usuários.';
            if(senhaInput) senhaInput.required = true;
            if(this.userRoleSelect) this.userRoleSelect.value = 'padrao'; 
        }
        
        this.userModalElement.classList.remove('hidden');
        this.userModalElement.classList.add('flex');
    },

    closeUserModal: function() { 
        if (!this.userModalElement) return;
        this.userModalElement.classList.add('hidden');
        this.userModalElement.classList.remove('flex');
        this.currentEditingUserId = null;
        if (this.userFormElement) this.userFormElement.reset();
        const modalMessageArea = document.getElementById('modal-message-area-user');
        if(modalMessageArea) modalMessageArea.innerHTML = ''; 
     },

    saveUser: function(event) { 
        event.preventDefault();
        const id = document.getElementById('user-id').value;
        const nome = document.getElementById('user-nome').value;
        const email = document.getElementById('user-email').value;
        const senha = document.getElementById('user-senha').value;
        const role = this.userRoleSelect ? this.userRoleSelect.value : 'padrao';

        if (!nome || !email) {
            mainApp.showMessage('Nome e Email são obrigatórios.', 'error', 'modal-message-area-user');
            return;
        }

        let users = this.getUsers();
        const isEditing = !!this.currentEditingUserId;

        const emailExists = users.some(user => user.email === email && user.id !== this.currentEditingUserId);
        if (emailExists) {
            mainApp.showMessage('Este email já está cadastrado.', 'error', 'modal-message-area-user');
            return;
        }
        
        if (isEditing) { 
            const index = users.findIndex(u => u.id === this.currentEditingUserId);
            if (index > -1) {
                users[index].nome = nome;
                users[index].email = email;
                users[index].role = role; 
                if (senha) { 
                    if (senha.length < 6) {
                         mainApp.showMessage('A senha deve ter no mínimo 6 caracteres.', 'error', 'modal-message-area-user');
                         return;
                    }
                    users[index].senha = senha; 
                }
            }
        } else { 
            if (!senha || senha.length < 6) {
                mainApp.showMessage('A senha é obrigatória e deve ter no mínimo 6 caracteres para novos usuários.', 'error', 'modal-message-area-user');
                return;
            }
            const novoUsuario = {
                id: `usr_${new Date().getTime()}_${Math.random().toString(36).substring(2, 7)}`,
                nome, email, senha, role, 
                dataCadastro: new Date().toISOString()
            };
            users.push(novoUsuario);
        }

        this.saveUsersToStorage(users);
        this.loadUsers(); 
        this.closeUserModal(); 
        mainApp.showMessage(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', 'success', 'message-area-user');
    },

    confirmDeleteUser: function(id) { 
        const userToDelete = this.getUsers().find(u => u.id === id);
        if (userToDelete) {
            if (window.confirm(`Tem certeza que deseja excluir o usuário ${userToDelete.nome}? Esta ação não pode ser desfeita.`)) {
                this.deleteUser(id);
            }
        } else {
            mainApp.showMessage('Usuário não encontrado.', 'error', 'message-area-user');
        }
     },
    deleteUser: function(id) { 
        let users = this.getUsers();
        const loggedUser = this.currentUser;

        if (loggedUser && loggedUser.id === id) {
            mainApp.showMessage('Você não pode excluir seu próprio usuário.', 'error', 'message-area-user');
            return;
        }
        
        const chamadosKey = (typeof chamadosApp !== 'undefined' && chamadosApp.CHAMADOS_DB_KEY) ? chamadosApp.CHAMADOS_DB_KEY : 'chamados_ticketsDB';
        const chamados = JSON.parse(localStorage.getItem(chamadosKey)) || [];
        const isResponsavel = chamados.some(chamado => chamado.responsavel === id);

        if (isResponsavel) {
            mainApp.showMessage('Este usuário é responsável por um ou mais chamados e não pode ser excluído. Reatribua os chamados primeiro.', 'error', 'message-area-user');
            return;
        }

        users = users.filter(u => u.id !== id);
        this.saveUsersToStorage(users);
        this.loadUsers(); 
        mainApp.showMessage('Usuário excluído com sucesso!', 'success', 'message-area-user');
        
        if (typeof chamadosApp !== 'undefined' && typeof chamadosApp.populateResponsavelOptions === 'function') {
            chamadosApp.populateResponsavelOptions();
        }
     }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-list-table')) { 
        usuariosApp.init();
    }
});