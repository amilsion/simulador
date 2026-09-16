# Simulador de Financiamento Habitacional 🏠💸

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

Uma aplicação web completa e responsiva para simular financiamentos imobiliários. Com cálculos precisos que refletem sistemas reais (como o da Caixa Econômica Federal), o simulador permite comparar opções de amortização, calcular abatimentos com FGTS e visualizar a evolução do saldo devedor graficamente.

**🌐 Live Demo:** [https://simulador-caixa.netlify.app/](https://simulador-caixa.netlify.app/)

## ✨ Funcionalidades

*   **Sistemas de Amortização (SAC e PRICE)**: Simulação precisa da tabela de parcelas de acordo com a modalidade escolhida.
*   **Amortizações Extras**: Configure aportes manuais esporádicos ou fixos.
*   **Uso do FGTS**: Planeje abatimentos a cada 2 anos (ou no período que desejar) utilizando o saldo do FGTS.
*   **Visão de Impacto e Economia**: Veja na hora quanto tempo e dinheiro (juros) você economizará com as amortizações.
*   **Gráficos Interativos**: Evolução visual do saldo devedor original vs. saldo amortizado utilizando `Chart.js`.
*   **Exportação em PDF**: Gere relatórios profissionais em PDF com resumo do contrato, gráfico e tabela completa de parcelas, pronto para impressão ou envio.
*   **Máscaras Financeiras**: Campos de entrada formatados automaticamente para Reais (R$) para facilitar a leitura e digitação.
*   **Responsividade**: Design amigável e limpo que se adapta a celulares, tablets e desktops, estilizado com Tailwind CSS.
*   **Otimizado para SEO**: Tags Open Graph, meta descrições e schema JSON-LD implementados para garantir excelente ranqueamento no Google.

## 🛠️ Tecnologias Utilizadas

*   [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
*   [Vite](https://vitejs.dev/) - Build Tool super rápida
*   [Tailwind CSS v4](https://tailwindcss.com/) - Estilização utilitária e design system
*   [Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/) - Para renderização dos gráficos
*   [jsPDF](https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Para geração do relatório em PDF
*   [v-money3](https://github.com/jonathanmoore/v-money3) - Máscaras de input monetário
*   [Lucide Icons](https://lucide.dev/) - Ícones SVG modernos

## 🚀 Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. **Navegue até o diretório:**
   ```bash
   cd simulador
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. Acesse no navegador: `http://localhost:5173/`

## 📦 Build para Produção

Para gerar a versão minificada e otimizada pronta para deploy (como no Netlify):
```bash
npm run build
```
Os arquivos gerados estarão disponíveis na pasta `dist/`.

## 🤝 Contribuindo
Sinta-se livre para abrir *issues* e *pull requests*. Toda contribuição é bem-vinda para tornar a ferramenta ainda mais precisa e rica em recursos.
