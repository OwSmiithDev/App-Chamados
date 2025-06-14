module.exports = {
  content: [
    "./*.html",         // Busca arquivos HTML na raiz do projeto (index.html, chamados.html, etc.)
    "./js/**/*.js",     // Busca arquivos JavaScript dentro da pasta js e suas subpastas
    // Se você tiver HTML ou JS em outras pastas, adicione os caminhos aqui.
    // Por exemplo, se tivesse uma pasta 'components': "./components/**/*.{html,js}"
  ],
  darkMode: 'class', // ou 'media', conforme sua preferência (já estamos usando 'class')
  theme: {
    extend: {
      // Suas customizações de tema que estão atualmente inline nos HTMLs viriam para cá.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#4A90E2',
          DEFAULT: '#357ABD',
          dark: '#2A629A'
        },
        secondary: {
          light: '#F3F4F6',
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB'
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937'
        },
        text: {
          light: '#111827',
          dark: '#F3F4F6'
        },
        card: {
          light: '#FFFFFF',
          dark: '#2D3748'
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      }
      // ... quaisquer outras extensões de tema
    },
  },
  plugins: [
    // Adicione plugins do Tailwind aqui, se necessário.
    require('@tailwindcss/forms'), require('@tailwindcss/typography')
  ],
}

module.exports = {

  plugins: {

    tailwindcss: {},

    autoprefixer: {},

  },

}