// /chamados-app/js/chamados.js

const chamadosApp = {
    CHAMADOS_DB_KEY: 'chamados_ticketsDB',
    chamadosListElement: document.getElementById('chamados-list'),
    noChamadosMessageElement: document.getElementById('no-chamados-message'),
    chamadoModalElement: document.getElementById('chamado-modal'),
    chamadoFormElement: document.getElementById('chamado-form'),
    modalTitleElement: document.getElementById('modal-title'),
    createTicketButton: document.getElementById('create-ticket-button'),
    closeModalButton: document.getElementById('close-modal-button'),
    
    // ... outros seletores como antes ...
    detailsModalElement: document.getElementById('chamado-details-modal'),
    closeDetailsModalButton: document.getElementById('close-details-modal-button'),
    detailsIdElement: document.getElementById('details-id'),
    detailsTituloElement: document.getElementById('details-titulo'),
    detailsDescricaoElement: document.getElementById('details-descricao'),
    detailsPrioridadeElement: document.getElementById('details-prioridade'),
    detailsCategoriaElement: document.getElementById('details-categoria'),
    detailsStatusElement: document.getElementById('details-status'),
    detailsResponsavelElement: document.getElementById('details-responsavel'),
    detailsCriadoPorElement: document.getElementById('details-criadoPor'), 
    detailsDataCriacaoElement: document.getElementById('details-dataCriacao'),
    detailsDataFechamentoElement: document.getElementById('details-dataFechamento'),
    detailsSolucaoContainer: document.getElementById('details-solucao-container'), 
    detailsSolucaoElement: document.getElementById('details-solucao'), 
    detailsAnexosListElement: document.getElementById('details-anexos'),
    detailsActionsContainer: document.getElementById('details-actions-container'), 

    editChamadoFromDetailsButton: document.getElementById('edit-chamado-from-details-button'),
    closeChamadoFromDetailsButton: document.getElementById('close-chamado-from-details-button'),

    filterStatusElement: document.getElementById('filter-status'),
    filterPriorityElement: document.getElementById('filter-priority'),
    searchTermElement: document.getElementById('search-term'),

    solucaoModalElement: document.getElementById('solucao-modal'),
    solucaoFormElement: document.getElementById('solucao-form'),
    solucaoChamadoIdInput: document.getElementById('solucao-chamado-id'),
    solucaoTextoTextarea: document.getElementById('solucao-texto'),
    saveSolucaoButton: document.getElementById('save-solucao-button'),
    cancelSolucaoButton: document.getElementById('cancel-solucao-button'),

    currentEditingId: null,
    currentClosingChamadoId: null, 
    anexosTemporarios: [], 
    currentUser: null, 

    init: function() {
        this.currentUser = mainApp.checkUserSession(); 
        if (!this.currentUser) return; // Se não houver usuário, interrompe. mainApp já redirecionou.
        
        const userNameElement = document.getElementById('logged-user-name');
        if(userNameElement) userNameElement.textContent = this.currentUser.nome;

        mainApp.updateNavLinks(this.currentUser.role);
        this.loadChamados();
        this.populateResponsavelOptions();

        if (this.createTicketButton) this.createTicketButton.addEventListener('click', () => this.openModal());
        if (this.closeModalButton) this.closeModalButton.addEventListener('click', () => this.closeModal());
        if (this.chamadoFormElement) this.chamadoFormElement.addEventListener('submit', (e) => this.saveChamado(e));
        if (this.closeDetailsModalButton) this.closeDetailsModalButton.addEventListener('click', () => this.closeDetailsModal());
        
        if(this.filterStatusElement) this.filterStatusElement.addEventListener('change', () => this.filterAndRenderChamados());
        if(this.filterPriorityElement) this.filterPriorityElement.addEventListener('change', () => this.filterAndRenderChamados());
        if(this.searchTermElement) this.searchTermElement.addEventListener('input', () => this.filterAndRenderChamados());

        if (this.chamadosListElement) {
            this.chamadosListElement.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const id = button.dataset.id;
                if (button.classList.contains('view-details-button')) this.viewChamadoDetails(id);
                else if (button.classList.contains('edit-ticket-button')) this.openModal(id);
                else if (button.classList.contains('close-ticket-button')) this.confirmCloseChamado(id);
            });
        }
        
        const anexoInputElement = document.getElementById('anexos');
        if (anexoInputElement) anexoInputElement.addEventListener('change', (e) => this.handleFileUpload(e));
        if (this.solucaoFormElement) this.solucaoFormElement.addEventListener('submit', (e) => this.handleSaveSolucao(e));
        if (this.cancelSolucaoButton) this.cancelSolucaoButton.addEventListener('click', () => this.closeSolucaoModal());
    },
    
    // Função para renderizar as linhas da tabela em vez dos cards
    renderChamados: function(chamadosToRender) {
        if (!this.chamadosListElement || !this.noChamadosMessageElement) return;
        
        // Limpa o corpo da tabela
        this.chamadosListElement.innerHTML = ''; 

        if (chamadosToRender.length === 0) {
            this.noChamadosMessageElement.style.display = 'block';
            this.chamadosListElement.closest('table').style.display = 'none';
        } else {
            this.noChamadosMessageElement.style.display = 'none';
            this.chamadosListElement.closest('table').style.display = ''; // Garante que a tabela está visível
            chamadosToRender.forEach(chamado => {
                // Chama a nova função para criar uma linha da tabela
                const chamadoRow = this.createChamadoRow(chamado);
                this.chamadosListElement.appendChild(chamadoRow);
            });
        }
    },

    // Nova função para criar uma linha <tr> para a tabela
    createChamadoRow: function(chamado) {
        const row = document.createElement('tr');
        row.className = "hover:bg-secondary/50 dark:hover:bg-gray-700/50 transition-colors";
        
        const users = JSON.parse(localStorage.getItem(mainApp.USERS_DB_KEY)) || [];
        const responsavel = users.find(u => u.id === chamado.responsavel);
        const criador = users.find(u => u.id === chamado.criadoPor);
        
        const responsavelNome = responsavel ? responsavel.nome : 'N/A';
        const criadorNome = criador ? criador.nome : 'N/A';

        const canEdit = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'tecnico');
        const canClose = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'tecnico');
        
        let actionButtons = `<button class="text-primary hover:underline text-sm view-details-button" data-id="${chamado.id}">Detalhes</button>`;
        if (chamado.status === 'aberto') {
            if (canEdit) {
                actionButtons += `<button class="text-yellow-500 hover:underline text-sm ml-4 edit-ticket-button" data-id="${chamado.id}">Editar</button>`;
            }
            if (canClose) {
                actionButtons += `<button class="text-red-500 hover:underline text-sm ml-4 close-ticket-button" data-id="${chamado.id}">Fechar</button>`;
            }
        }

        const statusColors = {
            aberto: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
            fechado: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        };
        const statusText = chamado.status.charAt(0).toUpperCase() + chamado.status.slice(1);

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">${chamado.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[chamado.status]}">${statusText}</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark max-w-xs truncate" title="${chamado.titulo}">${chamado.titulo}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${criadorNome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${responsavelNome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${actionButtons}</td>
        `;
        return row;
    },
    
    handleFileUpload: function(event) {
        this.anexosTemporarios = Array.from(event.target.files);
        const previewContainer = document.getElementById('anexos-preview');
        if (!previewContainer) return;
        previewContainer.innerHTML = ''; 
        if (this.anexosTemporarios.length > 0) {
            const list = document.createElement('ul');
            this.anexosTemporarios.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                list.appendChild(listItem);
            });
            previewContainer.appendChild(list);
        }
     },
    processAnexos: async function() { 
        const processedAnexos = [];
        for (const file of this.anexosTemporarios) {
            const anexoData = { name: file.name, type: file.type, size: file.size };
            processedAnexos.push(anexoData);
        }
        return processedAnexos;
     },
    populateResponsavelOptions: function() { 
        const responsavelSelect = document.getElementById('responsavel');
        if (!responsavelSelect) return;

        responsavelSelect.innerHTML = '<option value="">Selecione um responsável</option>'; 
        const users = JSON.parse(localStorage.getItem(mainApp.USERS_DB_KEY)) || [];
        const responsaveisHabilitados = users.filter(user => user.role === 'admin' || user.role === 'tecnico' || user.role === 'padrao'); 
        
        responsaveisHabilitados.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.nome;
            responsavelSelect.appendChild(option);
        });
    },
    getChamados: function() { return JSON.parse(localStorage.getItem(this.CHAMADOS_DB_KEY)) || []; },
    saveChamadosToStorage: function(chamados) { localStorage.setItem(this.CHAMADOS_DB_KEY, JSON.stringify(chamados)); },

    filterAndRenderChamados: function() {
        let chamados = this.getChamados();
        const currentUser = this.currentUser; 

        if (currentUser && currentUser.role === 'padrao') {
            chamados = chamados.filter(c => c.criadoPor === currentUser.id);
        }

        const statusFilter = this.filterStatusElement ? this.filterStatusElement.value : 'todos';
        const priorityFilter = this.filterPriorityElement ? this.filterPriorityElement.value : 'todas';
        const searchTerm = this.searchTermElement ? this.searchTermElement.value.toLowerCase() : '';

        if (statusFilter !== 'todos') {
            chamados = chamados.filter(c => c.status === statusFilter);
        }
        if (priorityFilter !== 'todas') {
            chamados = chamados.filter(c => c.prioridade === priorityFilter);
        }
        if (searchTerm) {
            chamados = chamados.filter(c => 
                c.titulo.toLowerCase().includes(searchTerm) || 
                c.id.toLowerCase().includes(searchTerm) 
            );
        }
        this.renderChamados(chamados.sort((a,b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)));
    },

    loadChamados: function() {
        this.filterAndRenderChamados();
    },

    openModal: function(id = null) {
        if (!this.chamadoModalElement || !this.chamadoFormElement || !this.modalTitleElement) return;

        if (id && this.currentUser && this.currentUser.role === 'padrao') {
            mainApp.showMessage('Você não tem permissão para editar este chamado.', 'error', 'message-area');
            return;
        }
        this.chamadoFormElement.reset();
        this.populateResponsavelOptions(); 
        const anexosPreview = document.getElementById('anexos-preview');
        if(anexosPreview) anexosPreview.innerHTML = '';
        this.anexosTemporarios = [];
        const modalMessageArea = document.getElementById('modal-message-area-chamado');
        if(modalMessageArea) modalMessageArea.innerHTML = '';

        if (id) { 
            this.currentEditingId = id;
            this.modalTitleElement.textContent = 'Editar Chamado';
            const chamados = this.getChamados();
            const chamado = chamados.find(c => c.id === id);
            if (chamado) {
                document.getElementById('chamado-id').value = chamado.id;
                document.getElementById('titulo').value = chamado.titulo;
                document.getElementById('descricao').value = chamado.descricao;
                document.getElementById('prioridade').value = chamado.prioridade;
                document.getElementById('categoria').value = chamado.categoria;
                document.getElementById('responsavel').value = chamado.responsavel;
                if (chamado.anexos && chamado.anexos.length > 0 && anexosPreview) {
                    const list = document.createElement('ul');
                    list.innerHTML = '<li class="font-semibold mt-2">Anexos existentes:</li>';
                    chamado.anexos.forEach(anexo => {
                        const listItem = document.createElement('li');
                        listItem.textContent = anexo.name; 
                        list.appendChild(listItem);
                    });
                    anexosPreview.appendChild(list);
                }
            }
        } else { 
            this.currentEditingId = null;
            this.modalTitleElement.textContent = 'Novo Chamado';
            document.getElementById('chamado-id').value = ''; 
        }
        this.chamadoModalElement.classList.remove('hidden');
        this.chamadoModalElement.classList.add('flex');
    },

    closeModal: function() { 
        if (!this.chamadoModalElement) return;
        this.chamadoModalElement.classList.add('hidden');
        this.chamadoModalElement.classList.remove('flex');
        this.currentEditingId = null;
        this.anexosTemporarios = [];
        const anexosPreview = document.getElementById('anexos-preview');
        if(anexosPreview) anexosPreview.innerHTML = '';
        if (this.chamadoFormElement) this.chamadoFormElement.reset();
        const modalMessageArea = document.getElementById('modal-message-area-chamado');
        if(modalMessageArea) modalMessageArea.innerHTML = '';
     },

    saveChamado: async function(event) {
        event.preventDefault();
        const idInputValue = document.getElementById('chamado-id').value; 
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const prioridade = document.getElementById('prioridade').value;
        const categoria = document.getElementById('categoria').value;
        const responsavel = document.getElementById('responsavel').value;

        if (!titulo || !descricao || !categoria || !responsavel) {
            mainApp.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error', 'modal-message-area-chamado'); 
            return;
        }
        
        const novosAnexosProcessados = await this.processAnexos();
        let chamados = this.getChamados();

        if (this.currentEditingId) { 
            if (this.currentUser && this.currentUser.role === 'padrao') {
                 mainApp.showMessage('Você não tem permissão para editar chamados.', 'error', 'message-area');
                 this.closeModal();
                 return;
            }
            const index = chamados.findIndex(c => c.id === this.currentEditingId);
            if (index > -1) {
                chamados[index].titulo = titulo;
                chamados[index].descricao = descricao;
                chamados[index].prioridade = prioridade;
                chamados[index].categoria = categoria;
                chamados[index].responsavel = responsavel;
                const anexosAntigos = chamados[index].anexos || [];
                chamados[index].anexos = [...anexosAntigos, ...novosAnexosProcessados]; 
            }
        } else { 
            const novoChamado = {
                id: mainApp.generateNewTicketId(), 
                titulo,
                descricao,
                prioridade,
                categoria,
                status: 'aberto',
                responsavel,
                criadoPor: this.currentUser.id, 
                dataCriacao: new Date().toISOString(),
                dataFechamento: null,
                solucao: null, 
                anexos: novosAnexosProcessados
            };
            chamados.push(novoChamado);
        }

        this.saveChamadosToStorage(chamados);
        this.loadChamados();
        this.closeModal();
        mainApp.showMessage(this.currentEditingId ? 'Chamado atualizado com sucesso!' : 'Chamado criado com sucesso!', 'success', 'message-area');
    },

    confirmCloseChamado: function(id) {
        if (!this.currentUser || (this.currentUser.role !== 'admin' && this.currentUser.role !== 'tecnico')) {
            mainApp.showMessage('Você não tem permissão para fechar chamados.', 'error', 'message-area');
            return;
        }

        const chamado = this.getChamados().find(c => c.id === id);
        if (chamado && chamado.status === 'aberto') {
            this.currentClosingChamadoId = id; 
            this.openSolucaoModal(id);
        } else if (chamado) {
            mainApp.showMessage('Este chamado já está fechado.', 'info', 'message-area');
        } else {
            mainApp.showMessage('Chamado não encontrado.', 'error', 'message-area');
        }
    },
    
    openSolucaoModal: function(chamadoId) {
        if (!this.solucaoModalElement || !this.solucaoChamadoIdInput || !this.solucaoFormElement) return;
        this.solucaoChamadoIdInput.value = chamadoId;
        this.solucaoFormElement.reset(); 
        const modalMessageArea = document.getElementById('modal-message-area-solucao');
        if(modalMessageArea) modalMessageArea.innerHTML = '';
        this.solucaoModalElement.classList.remove('hidden');
        this.solucaoModalElement.classList.add('flex');
        this.solucaoTextoTextarea.focus();
    },

    closeSolucaoModal: function() {
        if (!this.solucaoModalElement) return;
        this.solucaoModalElement.classList.add('hidden');
        this.solucaoModalElement.classList.remove('flex');
        this.currentClosingChamadoId = null;
    },

    handleSaveSolucao: function(event) {
        event.preventDefault();
        const chamadoId = this.solucaoChamadoIdInput.value;
        const solucaoTexto = this.solucaoTextoTextarea.value.trim();

        if (!solucaoTexto) {
            mainApp.showMessage('Por favor, descreva a solução aplicada.', 'error', 'modal-message-area-solucao');
            return;
        }

        this.closeChamado(chamadoId, solucaoTexto);
        this.closeSolucaoModal();
    },

    closeChamado: function(id, solucao = null) { 
        let chamados = this.getChamados();
        const index = chamados.findIndex(c => c.id === id);

        if (index > -1 && chamados[index].status === 'aberto') {
            chamados[index].status = 'fechado';
            chamados[index].dataFechamento = new Date().toISOString();
            if (solucao) { 
                chamados[index].solucao = solucao;
            }
            this.saveChamadosToStorage(chamados);
            this.loadChamados();
            
            if(this.detailsModalElement && !this.detailsModalElement.classList.contains('hidden') && document.getElementById('details-id').textContent === id) {
                this.viewChamadoDetails(id); 
            }
            mainApp.showMessage('Chamado fechado com sucesso!', 'success', 'message-area');
        }
    },

    viewChamadoDetails: function(id) {
        const chamados = this.getChamados();
        const chamado = chamados.find(c => c.id === id);
        const users = JSON.parse(localStorage.getItem(mainApp.USERS_DB_KEY)) || [];

        if (chamado && this.detailsModalElement) {
            this.detailsIdElement.textContent = chamado.id;
            this.detailsTituloElement.textContent = chamado.titulo;
            this.detailsDescricaoElement.textContent = chamado.descricao;
            this.detailsPrioridadeElement.textContent = chamado.prioridade.charAt(0).toUpperCase() + chamado.prioridade.slice(1);
            this.detailsCategoriaElement.textContent = chamado.categoria;
            
            const statusText = chamado.status.charAt(0).toUpperCase() + chamado.status.slice(1);
            this.detailsStatusElement.textContent = statusText;
            this.detailsStatusElement.className = `font-semibold ${chamado.status === 'aberto' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;

            const responsavelObj = users.find(u => u.id === chamado.responsavel);
            this.detailsResponsavelElement.textContent = responsavelObj ? `${responsavelObj.nome}` : 'N/A';
            
            const criadorObj = users.find(u => u.id === chamado.criadoPor);
            this.detailsCriadoPorElement.textContent = criadorObj ? `${criadorObj.nome}` : 'N/A';
            
            this.detailsDataCriacaoElement.textContent = new Date(chamado.dataCriacao).toLocaleString('pt-BR');
            this.detailsDataFechamentoElement.textContent = chamado.dataFechamento ? new Date(chamado.dataFechamento).toLocaleString('pt-BR') : 'Ainda aberto';

            if (chamado.solucao) {
                this.detailsSolucaoElement.textContent = chamado.solucao;
                this.detailsSolucaoContainer.classList.remove('hidden');
            } else {
                this.detailsSolucaoContainer.classList.add('hidden');
            }

            this.detailsAnexosListElement.innerHTML = '';
            if (chamado.anexos && chamado.anexos.length > 0) { 
                chamado.anexos.forEach(anexo => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${anexo.name} (${anexo.type}, ${(anexo.size / 1024).toFixed(2)} KB)`;
                    this.detailsAnexosListElement.appendChild(listItem);
                });
            } else { this.detailsAnexosListElement.innerHTML = '<li>Nenhum anexo.</li>'; }

            const canEdit = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'tecnico');
            const canClose = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'tecnico');

            if (this.detailsActionsContainer) { 
                this.editChamadoFromDetailsButton.style.display = (chamado.status === 'aberto' && canEdit) ? 'inline-flex' : 'none';
                this.closeChamadoFromDetailsButton.style.display = (chamado.status === 'aberto' && canClose) ? 'inline-flex' : 'none';
            }

            this.editChamadoFromDetailsButton.onclick = () => { this.closeDetailsModal(); this.openModal(id); };
            this.closeChamadoFromDetailsButton.onclick = () => this.confirmCloseChamado(id);

            this.detailsModalElement.classList.remove('hidden');
            this.detailsModalElement.classList.add('flex');
        }
    },

    closeDetailsModal: function() { 
        if (this.detailsModalElement) {
            this.detailsModalElement.classList.add('hidden');
            this.detailsModalElement.classList.remove('flex');
        }
     }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chamados-list')) { 
        chamadosApp.init();
    }
});