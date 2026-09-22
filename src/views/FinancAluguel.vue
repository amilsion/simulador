<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex flex-col gap-1">
      <div class="flex items-center gap-2 text-sm font-semibold tracking-wider text-emerald-600 uppercase">
        <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
        Simuladores
      </div>
      <h1 class="text-3xl font-bold text-gray-900">Financiamento vs Aluguel</h1>
      <p class="text-gray-600">
        <strong class="font-semibold text-gray-800">Compare e prove</strong> para o seu cliente que comprar um imóvel e construir patrimônio é muito melhor do que pagar aluguel.
      </p>
    </header>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[400px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6 h-fit">
        <h2 class="text-lg font-bold text-gray-800">Dados da comparação</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700">Valor do Imóvel <span class="text-emerald-500">*</span></label>
            <money3 v-model.number="form.valorImovel" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700">Valor do Aluguel Atual <span class="text-emerald-500">*</span></label>
            <money3 v-model.number="form.valorAluguel" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-sm font-semibold text-gray-700">Parcela do Financ.</label>
              <money3 v-model.number="form.valorParcela" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-sm font-semibold text-gray-700">Prazo (meses)</label>
              <select v-model.number="form.meses" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option v-for="n in [120, 180, 240, 300, 360, 420]" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 mt-2">
            <label class="text-sm font-semibold text-gray-700">Reajuste Anual do Aluguel (%)</label>
            <input type="number" step="0.5" v-model.number="form.reajusteAluguel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700">Valorização Anual do Imóvel (%)</label>
            <input type="number" step="0.5" v-model.number="form.valorizacaoImovel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <button @click="handleCalculate" class="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2">
            <Calculator class="w-5 h-5" /> Calcular Comparativo
          </button>
        </div>
      </div>

      <!-- Right Column: Results & Table -->
      <div class="flex-1 flex flex-col gap-6">
        <template v-if="isCalculated">
          
          <div class="flex justify-end">
            <button @click="showPdfModal = true" class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
              <Download class="w-4 h-4" />
              Baixar comparativo (PDF)
            </button>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Aluguel Card -->
            <div class="bg-red-50/50 border border-red-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-red-600 mb-2">
                <TrendingDown class="w-5 h-5" />
                <h3 class="font-bold text-lg">Cenário Aluguel</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Dinheiro gasto em {{ form.meses / 12 }} anos</div>
              <div class="text-3xl font-black text-red-600 mb-2">{{ formatCurrency(calc.gastoTotalAluguel) }}</div>
              <p class="text-sm text-gray-600">Com reajuste anual de {{ form.reajusteAluguel }}%. <br/><strong class="text-gray-800">No final, o imóvel não é seu.</strong></p>
            </div>
            
            <!-- Compra Card -->
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-emerald-600 mb-2">
                <Home class="w-5 h-5" />
                <h3 class="font-bold text-lg">Cenário Financiamento</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Patrimônio acumulado</div>
              <div class="text-3xl font-black text-emerald-600 mb-2">{{ formatCurrency(calc.valorFinalImovel) }}</div>
              <p class="text-sm text-gray-600">Valor estimado do imóvel após {{ form.meses / 12 }} anos (valorização de {{ form.valorizacaoImovel }}% a.a).</p>
            </div>
          </div>

          <!-- Chart Area -->
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-bold text-gray-800 mb-4">Gasto Acumulado com Aluguel vs Valorização do Imóvel</h3>
            <div class="h-72 w-full relative">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Insight Box -->
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm flex gap-4 items-start">
            <Lightbulb class="w-8 h-8 text-indigo-500 shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-indigo-900 text-lg mb-1">Conclusão para o Cliente</h3>
              <p class="text-indigo-800 leading-relaxed">
                Ao optar pelo aluguel, você gastará <strong>{{ formatCurrency(calc.gastoTotalAluguel) }}</strong> e sairá de mãos vazias. 
                Se investir no financiamento, você aplicará o seu dinheiro no que é seu, construindo um patrimônio estimado em 
                <strong>{{ formatCurrency(calc.valorFinalImovel) }}</strong> ao final do prazo. Construa o seu futuro, não o do proprietário!
              </p>
            </div>
          </div>

        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12">
            <Home class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha os dados e clique em <strong class="text-gray-500">Calcular Comparativo</strong></p>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Nome do Cliente -->
    <div v-if="showPdfModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Identificar Relatório</h3>
        <p class="text-sm text-gray-500 mb-4">Insira o nome do cliente para personalizar o PDF.</p>
        
        <input 
          v-model="clientName" 
          type="text" 
          placeholder="Nome do cliente" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
          @keyup.enter="gerarPdf"
          autofocus
        />

        <div class="flex items-center gap-3 justify-end">
          <button @click="showPdfModal = false" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="gerarPdf" class="px-4 py-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
            <Download class="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { Money3Component } from 'v-money3';
import { Home, Calculator, TrendingDown, Lightbulb, Download } from '@lucide/vue';
import { Line } from 'vue-chartjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const money3 = Money3Component;
const isCalculated = ref(false);

const showPdfModal = ref(false);
const clientName = ref('');

const form = reactive({
  valorImovel: 300000,
  valorAluguel: 1500,
  valorParcela: 2800,
  meses: 360,
  reajusteAluguel: 5, // %
  valorizacaoImovel: 4 // %
});

const calc = computed(() => {
  let gastoAluguelTotal = 0;
  let aluguelMensal = form.valorAluguel;
  const anos = form.meses / 12;
  
  const labels = [];
  const aluguelAcumulado = [];
  const valorImovelEvolucao = [];

  let valorAtualImovel = form.valorImovel;
  
  for (let ano = 1; ano <= anos; ano++) {
    // 12 months of rent
    gastoAluguelTotal += aluguelMensal * 12;
    // apply annual rent adjustment for next year
    aluguelMensal *= (1 + (form.reajusteAluguel / 100));
    
    // property appreciation
    valorAtualImovel *= (1 + (form.valorizacaoImovel / 100));

    // every 3 years or last year add to chart
    if (ano % 3 === 0 || ano === anos) {
      labels.push(`Ano ${ano}`);
      aluguelAcumulado.push(gastoAluguelTotal);
      valorImovelEvolucao.push(valorAtualImovel);
    }
  }

  return {
    gastoTotalAluguel: gastoAluguelTotal,
    valorFinalImovel: valorAtualImovel,
    labels,
    aluguelAcumulado,
    valorImovelEvolucao
  };
});

const chartData = computed(() => {
  if (!isCalculated.value) return null;
  return {
    labels: calc.value.labels,
    datasets: [
      {
        label: 'Gasto Acumulado com Aluguel (R$ Perdido)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        data: calc.value.aluguelAcumulado,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Patrimônio Construído (Imóvel)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10b981',
        data: calc.value.valorImovelEvolucao,
        fill: true,
        tension: 0.4
      }
    ]
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatCurrency(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return 'R$ ' + (value / 1000) + 'k';
        }
      }
    }
  }
};

const handleCalculate = () => {
  if (!form.valorImovel || !form.valorAluguel) {
    alert("Preencha o valor do imóvel e o valor do aluguel.");
    return;
  }
  isCalculated.value = true;
};

const moneyConfig = {
  masked: false,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: true,
  disabled: false,
  min: null,
  max: null,
  allowBlank: true,
  minimumNumberOfCharacters: 0,
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

const gerarPdf = () => {
  if (!isCalculated.value) return;

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Comparativo: Financiamento vs Aluguel', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  if (clientName.value.trim()) {
    doc.text(`Cliente: ${clientName.value.trim()}`, 14, 30);
  }

  const startY = clientName.value.trim() ? 36 : 30;

  doc.text(`Valor do imóvel: ${formatCurrency(form.valorImovel)}`, 14, startY);
  doc.text(`Valor do aluguel inicial: ${formatCurrency(form.valorAluguel)} / mês`, 14, startY + 6);
  doc.text(`Parcela do financiamento: ${formatCurrency(form.valorParcela)}`, 14, startY + 12);
  doc.text(`Prazo: ${form.meses} meses (${form.meses/12} anos)`, 14, startY + 18);
  
  doc.text(`Reajuste anual do aluguel: ${form.reajusteAluguel}%`, 114, startY);
  doc.text(`Valorização anual do imóvel: ${form.valorizacaoImovel}%`, 114, startY + 6);

  // Big results
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Resumo do Cenário em ' + (form.meses/12) + ' anos:', 14, startY + 30);

  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // red
  doc.text(`Gasto total perdido com Aluguel: ${formatCurrency(calc.value.gastoTotalAluguel)}`, 14, startY + 38);
  
  doc.setTextColor(16, 185, 129); // emerald
  doc.text(`Patrimônio construído (Valor do Imóvel): ${formatCurrency(calc.value.valorFinalImovel)}`, 14, startY + 44);

  // Table Data
  const tableData = calc.value.labels.map((label, index) => [
    label,
    formatCurrency(calc.value.aluguelAcumulado[index]),
    formatCurrency(calc.value.valorImovelEvolucao[index])
  ]);

  autoTable(doc, {
    startY: startY + 54,
    head: [['Período', 'Gasto Acumulado (Aluguel)', 'Patrimônio Acumulado (Imóvel)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [243, 244, 246], textColor: [75, 85, 99], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'right', textColor: [220, 38, 38] }, // red
      2: { halign: 'right', textColor: [16, 185, 129] } // emerald
    }
  });
  
  const fileName = clientName.value.trim() 
    ? `comparativo-financ-aluguel-${clientName.value.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`
    : 'comparativo-financ-aluguel.pdf';

  doc.save(fileName);

  // Fechar modal
  showPdfModal.value = false;
  clientName.value = '';
};
</script>
