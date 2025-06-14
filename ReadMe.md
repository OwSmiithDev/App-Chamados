# 🚀 Sistema de Chamados Interativo

![Badge de Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Licença](https://img.shields.io/badge/license-MIT-green)

Este projeto é uma aplicação frontend completa para gerenciamento de tickets de suporte, construída com tecnologias web modernas. Todos os dados são armazenados localmente no navegador usando `localStorage`, com a estrutura de dados preparada para uma futura migração para um backend como o Supabase.

## ✨ Sobre o Projeto

O objetivo deste sistema é fornecer uma interface intuitiva e eficiente para criar, visualizar, gerenciar e acompanhar chamados de suporte. Ele foi desenvolvido com foco na interatividade do frontend, oferecendo uma experiência de usuário fluida e responsiva, incluindo um tema escuro e funcionalidades baseadas em cargos de usuário.

## 🛠️ Tech Stack & Ferramentas

O sistema é construído utilizando as seguintes tecnologias e ferramentas:

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS (CDN)" />
</p>

* **HTML5:** Estrutura semântica das páginas.
* **CSS3:** Estilização customizada complementar.
    * **Tailwind CSS (via CDN):** Framework CSS utilitário para desenvolvimento rápido e design responsivo.
* **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM, interatividade e gerenciamento de dados.
* **LocalStorage do Navegador:** Para persistência de dados no frontend.
* **Google Fonts:** Para a fonte "Inter".
* **Heroicons & SVG:** Para iconografia.

## 📋 Funcionalidades Implementadas

* **Autenticação e Cargos de Usuário:**
    * Página de Login (`index.html`).
    * Página de Cadastro (`cadastro.html`) para novos usuários (cargo padrão: "padrão").
    * Usuário administrador padrão (`admin@chamados.com` / `admin` com cargo `admin`) criado na primeira execução.
    * Cargos de usuário: `admin`, `tecnico`, `padrao` com diferentes níveis de permissão.
* **Dashboard de Chamados (`chamados.html`):**
    * Listagem de chamados com visualização em cards.
    * Filtros por status (aberto, fechado, todos), prioridade e termo de busca (título ou ID).
    * Botão para criar novo chamado.
    * **IDs de Chamado Sequenciais:** Geração de IDs no formato `C1`, `C2`, etc.
    * Visualização de chamados restrita para usuários `padrao` (apenas os que ele criou).
* **Gerenciamento de Chamados:**
    * **Criação de Chamado:**
        * Formulário com Título, Descrição, Prioridade, Categoria, Anexo (metadados) e Responsável.
        * Registro do `criadoPor` (ID do usuário que criou o chamado).
    * **Visualização de Detalhes do Chamado:**
        * Modal com informações completas: ID, Título, Descrição, Prioridade, Categoria, Status, Responsável, Criado por, Datas e Solução (se fechado).
    * **Edição de Chamado:** (Disponível para `admin` e `tecnico`).
    * **Fechamento de Chamado:** (Disponível para `admin` e `tecnico`)
        * Solicita uma **descrição da solução aplicada** ao fechar.
        * Altera status para "Fechado" e registra data/hora do fechamento e a solução.
* **Gerenciamento de Usuários (`usuario.html`):** (Apenas para `admin`)
    * Listagem de usuários (Nome, Email, Cargo, Data de Cadastro).
    * Criação e edição de usuários, incluindo definição de cargo.
    * Exclusão de usuários (com restrições).
* **Perfil do Usuário (`perfil.html`):**
    * Edição de nome, email e senha do usuário logado.
* **Tema Escuro:**
    * Alternância manual com persistência da escolha.
* **Armazenamento Local:**
    * Dados de chamados e usuários no `localStorage`.

## 💾 Estrutura de Dados (localStorage)

Os dados são armazenados no `localStorage` do navegador usando as seguintes chaves principais:

* `chamados_usersDB`: Um array de objetos, onde cada objeto representa um usuário.
    ```json
    // Exemplo de objeto de Usuário
    {
      "id": "usr_admin_001",
      "nome": "Administrador Master",
      "email": "admin@chamados.com",
      "senha": "admin", // ATENÇÃO: Senha em texto plano para fins de desenvolvimento
      "role": "admin", // Pode ser 'admin', 'tecnico', ou 'padrao'
      "dataCadastro": "2024-05-17T10:00:00.000Z"
    }
    ```
* `chamados_ticketsDB`: Um array de objetos, onde cada objeto representa um chamado.
    ```json
    // Exemplo de objeto de Chamado
    {
      "id": "C1",
      "titulo": "Erro na emissão de nota fiscal",
      "descricao": "O sistema apresenta erro X ao tentar emitir NF para cliente Y.",
      "prioridade": "alta",
      "categoria": "Financeiro",
      "status": "aberto", // Pode ser 'aberto' ou 'fechado'
      "responsavel": "usr_tecnico_002", // ID do usuário técnico responsável
      "criadoPor": "usr_padrao_003", // ID do usuário que criou o chamado
      "dataCriacao": "2024-05-17T11:00:00.000Z",
      "dataFechamento": null, // Preenchido ao fechar
      "solucao": null, // Preenchido ao fechar
      "anexos": [
        { "name": "log_erro.txt", "type": "text/plain", "size": 1024 }
      ]
    }
    ```
* `chamados_loggedUser`: Objeto do usuário atualmente logado.
* `chamados_theme`: String (`'light'` ou `'dark'`) para a preferência de tema.
* `chamados_lastTicketIdCounter`: Número que representa o último ID de chamado gerado (para `C<numero>`).

## ⚙️ Configuração e Instalação (Execução Local)

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Pré-requisitos:**
    * Um navegador web moderno (Chrome, Firefox, Edge, etc.).
    * (Opcional, mas recomendado para desenvolvimento) Git instalado: [git-scm.com](https://git-scm.com/downloads)
    * (Opcional, mas recomendado para desenvolvimento) Um editor de código como [VS Code](https://code.visualstudio.com/).

2.  **Clonar o Repositório:**
    Abra seu terminal ou Git Bash e execute o seguinte comando para clonar o projeto:
    ```bash
    git clone https://SEU_LINK_DO_REPOSITORIO_AQUI.git
    ```
    Substitua `https://SEU_LINK_DO_REPOSITORIO_AQUI.git` pelo URL do seu repositório no GitHub.

3.  **Navegar para a Pasta do Projeto:**
    ```bash
    cd chamados-app
    ```
    (Ou o nome que você deu à pasta do repositório).

4.  **Abrir no Navegador:**
    * **Método Simples:** Navegue até a pasta do projeto no seu explorador de arquivos e clique duas vezes no arquivo `index.html`.
    * **Método Recomendado (Live Server):** Se você usa o VS Code, instale a extensão "Live Server". Após instalar, clique com o botão direito no arquivo `index.html` dentro do VS Code e selecione "Open with Live Server". Isso iniciará um servidor local e abrirá a página no seu navegador, atualizando-a automaticamente quando você salvar alterações nos arquivos.

5.  **Primeiro Acesso e Admin Padrão:**
    * Ao abrir o `index.html` pela primeira vez (ou após limpar o `localStorage`), um usuário **Administrador Master** será criado automaticamente com as seguintes credenciais:
        * **Email:** `admin@chamados.com`
        * **Senha:** `admin`
    * Use essas credenciais para o primeiro login e para acessar as funcionalidades administrativas.

6.  **Limpar Dados Locais (se necessário):**
    Se você precisar resetar os dados do sistema (usuários e chamados):
    1.  Abra as Ferramentas de Desenvolvedor do navegador (geralmente F12).
    2.  Vá para a aba "Application" (ou "Aplicativo").
    3.  No menu à esquerda, em "Storage" (ou "Armazenamento"), expanda "Local Storage".
    4.  Selecione o endereço do seu arquivo (ex: `file://...` ou `http://localhost...`).
    5.  Clique com o botão direito nas chaves (`chamados_usersDB`, `chamados_ticketsDB`, `chamados_loggedUser`, `chamados_lastTicketIdCounter`) e selecione "Delete" (ou "Excluir"), ou use a opção para limpar todo o armazenamento local do site.
    6.  Atualize a página.

## 🧑‍💻 Guia do Administrador

O usuário com o cargo "admin" (inicialmente `admin@chamados.com`) tem acesso a funcionalidades adicionais para gerenciar o sistema.

### 1. Acesso e Credenciais
* Faça login com as credenciais de administrador (`admin@chamados.com` / `admin`).
* O administrador terá acesso a todos os chamados e a uma seção de "Usuários" na barra lateral de navegação.

### 2. Gerenciamento de Usuários (`usuario.html`)
Esta página é acessível apenas para administradores.

* **Listagem de Usuários:** Exibe uma tabela com todos os usuários cadastrados, incluindo seus nomes, emails, cargos (Admin, Técnico, Padrão) e data de cadastro.
* **Criar Novo Usuário:**
    * Clique no botão "Novo Usuário".
    * Preencha o nome, email, defina um cargo e uma senha.
    * O novo usuário será adicionado à lista.
* **Editar Usuário:**
    * Clique no botão "Editar" ao lado do usuário desejado.
    * Modifique nome, email, cargo ou senha (deixar senha em branco para não alterar).
    * Salve as alterações.
* **Excluir Usuário:**
    * Clique no botão "Excluir" ao lado do usuário.
    * **Restrições:**
        * Um administrador não pode excluir a si mesmo.
        * Um usuário não pode ser excluído se ele for o responsável por algum chamado existente. É necessário reatribuir os chamados primeiro.
    * Uma confirmação será solicitada antes da exclusão.

### 3. Gerenciamento de Chamados (Visão Geral das Ações de Admin/Técnico)
Administradores e Técnicos possuem permissões expandidas na página de `chamados.html`:

* **Visualização Completa:** Podem visualizar todos os chamados registrados no sistema, independentemente de quem os criou.
* **Edição de Chamados:** Podem editar qualquer chamado que esteja com status "aberto".
* **Fechamento de Chamados:** Podem fechar qualquer chamado "aberto". Ao fechar, será solicitado que informem a **solução aplicada**, que ficará registrada no histórico do chamado.

### 4. Criação de Chamados
Administradores (assim como outros usuários) podem criar novos chamados através do botão "Novo Chamado" no dashboard.

### 5. Perfil do Usuário (`perfil.html`)
Administradores também podem editar suas próprias informações de perfil (nome, email, senha) como qualquer outro usuário.

## 🚀 Implantação (Deployment)

Atualmente, o projeto é puramente frontend e utiliza `localStorage`, o que significa que ele roda diretamente no navegador do usuário.

Para "implantar" este projeto de forma simples para demonstração ou uso pessoal, você pode usar plataformas de hospedagem para sites estáticos:

* **GitHub Pages:**
    1.  Certifique-se de que seu projeto está em um repositório GitHub.
    2.  Vá para as configurações do seu repositório (`Settings`).
    3.  Na seção "Pages" (ou "GitHub Pages"), selecione a branch que você quer usar (geralmente `main` ou `master`) e a pasta raiz (`/root`).
    4.  Salve. O GitHub fornecerá um link público para o seu projeto.
    *Nota: Certifique-se que todos os caminhos para arquivos CSS e JS são relativos e corretos.*

* **Netlify:**
    1.  Crie uma conta no [Netlify](https://www.netlify.com/).
    2.  Conecte seu repositório GitHub.
    3.  Configure as opções de build (para este projeto, como não há build, as configurações padrão devem funcionar, apenas aponte para a pasta onde estão seus arquivos).
    4.  O Netlify fará o deploy e fornecerá um link.

* **Vercel:**
    1.  Similar ao Netlify, crie uma conta no [Vercel](https://vercel.com/).
    2.  Importe seu projeto do GitHub.
    3.  O Vercel geralmente detecta projetos estáticos e faz o deploy automaticamente.

**Importante:** Como o `localStorage` é específico do navegador e do domínio, cada usuário que acessar o site implantado terá seu próprio conjunto de dados isolado. Não haverá compartilhamento de dados entre diferentes usuários ou navegadores. Para isso, a migração para um backend com banco de dados (como Supabase) seria necessária.

## 🔮 Funcionalidades Futuras (Roadmap)

* [ ] **Migração para Backend:**
    * [ ] Integração com [Supabase](https://supabase.com/) (ou outro BaaS/backend).
    * [ ] Autenticação segura e gerenciamento de sessão via backend.
    * [ ] Banco de dados real para chamados e usuários.
* [ ] **Sistema de Notificações.**
* [ ] **Upload Real de Anexos.**
* [ ] **Atribuição e Reatribuição de Chamados.**
* [ ] **Dashboard Mais Detalhado com Estatísticas.**
* [ ] **Testes Unitários e de Integração.**

## 🤝 Como Contribuir

Contribuições são bem-vindas! Se você tem sugestões ou quer melhorar o projeto:

1.  Faça um Fork do projeto.
2.  Crie sua Feature Branch (`git checkout -b feature/MinhaFuncionalidade`).
3.  Commit suas mudanças (`git commit -m 'Adiciona MinhaFuncionalidade'`).
4.  Push para a Branch (`git push origin feature/MinhaFuncionalidade`).
5.  Abra um Pull Request.

Você também pode abrir uma *issue* para reportar bugs ou sugerir novas funcionalidades.

## 📜 Licença

Este projeto é distribuído sob a Licença MIT. Sinta-se livre para usar, modificar e distribuir o código.
(Você pode criar um arquivo `LICENSE.txt` na raiz do seu projeto e colar o texto da licença MIT nele).

---

Desenvolvido com ❤️ e ☕ por **[Marcos Dev]**

[![Meu Perfil no GitHub](https://img.shields.io/badge/GitHub-MarcosDev-blue?style=for-the-badge&logo=github)](https://github.com/OwSmiithDev)
