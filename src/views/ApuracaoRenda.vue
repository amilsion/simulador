<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex items-start gap-4 mb-2">
      <div class="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-1">
        <Wallet class="w-7 h-7" />
      </div>
      <div class="flex flex-col">
        <h1 class="text-[22px] font-bold text-gray-900 leading-tight">Apuração de Renda e Capacidade</h1>
        <p class="text-gray-600 text-[15px] mt-1">Descubra a renda bruta familiar, limite máximo de parcela e enquadramento de crédito.</p>
        <p class="text-gray-400 text-[13px] italic mt-1">
          (Cálculo baseado na regra padrão de comprometimento máximo de 30% da renda bruta para financiamentos habitacionais)
        </p>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[420px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 h-fit">
        <h2 class="text-lg font-bold text-gray-900">Composição de Renda</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Renda Bruta (Proponente 1) <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.renda1" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-[15px]" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Renda Bruta (Proponente 2)</label>
            <money3 v-model.number="form.renda2" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-[15px]" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Rendas Adicionais / Variáveis</label>
            <money3 v-model.number="form.rendaAdicional" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-[15px]" />
            <p class="text-xs text-gray-500">Média de horas extras, comissões, aluguéis comprovados.</p>
          </div>

          <div class="w-full h-px bg-gray-100 my-2"></div>

          <h2 class="text-lg font-bold text-gray-900">Comprometimento Atual</h2>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800 flex items-center gap-1">
              Outros Financiamentos / Empréstimos
              <div class="group relative flex items-center justify-center">
                <Info class="w-4 h-4 text-gray-400 cursor-help" />
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 text-center">
                  Soma das parcelas ativas (Ex: CDC, Financiamento de Veículo, Consórcio). Isso deduz diretamente da capacidade de aprovação.
                </div>
              </div>
            </label>
            <money3 v-model.number="form.despesas" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-[15px]" />
          </div>

          <button @click="handleCalculate" class="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm text-[15px] flex items-center justify-center gap-2">
            <Calculator class="w-5 h-5" /> Apurar Capacidade
          </button>
        </div>
      </div>

      <!-- Right Column: Results -->
      <div class="flex-1 flex flex-col gap-6">
        <template v-if="isCalculated">
          
          <div class="flex justify-end">
            <button @click="showPdfModal = true" class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm">
              <Download class="w-4 h-4" />
              Baixar relatório (PDF)
            </button>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Renda Bruta -->
            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-blue-600 mb-2">
                <Users class="w-5 h-5" />
                <h3 class="font-bold text-lg">Renda Bruta Familiar</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Soma das Receitas</div>
              <div class="text-3xl font-black text-blue-600 mb-2">{{ formatCurrency(calc.rendaBrutaTotal) }}</div>
              <p class="text-sm text-gray-600">Total considerado para o cálculo de aprovação de crédito.</p>
            </div>
            
            <!-- Parcela Máxima -->
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle class="w-5 h-5" />
                <h3 class="font-bold text-lg">Capacidade de Parcela</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Livre para financiamento</div>
              <div class="text-3xl font-black text-emerald-600 mb-2">{{ formatCurrency(calc.parcelaMaximaLivre) }}</div>
              <p class="text-sm text-gray-600">Até 30% da renda, descontando os empréstimos atuais.</p>
            </div>

            <!-- Enquadramento -->
            <div :class="[calc.enquadramento.bg, calc.enquadramento.border]" class="rounded-xl p-6 shadow-sm flex flex-col justify-center border">
              <div class="flex items-center gap-2 mb-2" :class="calc.enquadramento.text">
                <Home class="w-5 h-5" />
                <h3 class="font-bold text-lg">Enquadramento</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Programa Habitacional</div>
              <div class="text-2xl font-black mb-2" :class="calc.enquadramento.text">{{ calc.enquadramento.nome }}</div>
              <p class="text-sm text-gray-600">{{ calc.enquadramento.desc }}</p>
            </div>
          </div>

          <!-- Charts and Details -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Breakdown Chart -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <h3 class="font-bold text-gray-800 mb-4 self-start">Comprometimento de Renda (Regra dos 30%)</h3>
              <div class="w-64 h-64 relative">
                <Doughnut :data="chartData" :options="chartOptions" />
              </div>
            </div>

            <!-- Breakdown Details -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
               <h3 class="font-bold text-gray-800 mb-4">Detalhamento da Capacidade</h3>
               
               <div class="flex flex-col gap-4">
                 <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                   <span class="text-gray-600">Capacidade Total Bruta (30%)</span>
                   <span class="font-bold text-gray-900">{{ formatCurrency(calc.limiteTrintaPorcento) }}</span>
                 </div>
                 
                 <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                   <span class="text-gray-600 flex items-center gap-2">
                     <span class="w-3 h-3 rounded-full bg-red-400"></span> Despesas Ativas (Comprometido)
                   </span>
                   <span class="font-bold text-red-600">- {{ formatCurrency(form.despesas) }}</span>
                 </div>

                 <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                   <span class="text-gray-600 flex items-center gap-2">
                     <span class="w-3 h-3 rounded-full bg-emerald-400"></span> Parcela Habitacional Máxima
                   </span>
                   <span class="font-bold text-emerald-600">{{ formatCurrency(calc.parcelaMaximaLivre) }}</span>
                 </div>

                 <div class="flex justify-between items-center pt-2">
                   <span class="text-gray-600 flex items-center gap-2">
                     <span class="w-3 h-3 rounded-full bg-gray-200"></span> Sobra para Subsistência (70%)
                   </span>
                   <span class="font-bold text-gray-500">{{ formatCurrency(calc.sobraSubsistencia) }}</span>
                 </div>
               </div>
            </div>
          </div>

        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
            <Wallet class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha as rendas e despesas e clique em <strong class="text-gray-500">Apurar Capacidade</strong></p>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Nome do Cliente -->
    <div v-if="showPdfModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Identificar Relatório</h3>
        <p class="text-sm text-gray-500 mb-4">Insira o nome do cliente para personalizar o PDF de Apuração.</p>
        
        <input 
          v-model="clientName" 
          type="text" 
          placeholder="Nome do cliente" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-6"
          @keyup.enter="gerarPdf"
          autofocus
        />

        <div class="flex items-center gap-3 justify-end">
          <button @click="showPdfModal = false" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="gerarPdf" class="px-4 py-2 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2">
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
import { Wallet, Calculator, Info, Users, CheckCircle, Home, Download } from '@lucide/vue';
import { Doughnut } from 'vue-chartjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const money3 = Money3Component;
const isCalculated = ref(false);
const showPdfModal = ref(false);
const clientName = ref('');

const form = reactive({
  renda1: 3500,
  renda2: 0,
  rendaAdicional: 0,
  despesas: 0
});

const moneyConfig = {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2,
  masked: false,
  disableNegative: true
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const calc = computed(() => {
  const rendaBrutaTotal = (form.renda1 || 0) + (form.renda2 || 0) + (form.rendaAdicional || 0);
  const limiteTrintaPorcento = rendaBrutaTotal * 0.30;
  
  // Parcela maxima is the 30% minus any active expenses (empréstimos)
  const parcelaMaximaLivre = Math.max(0, limiteTrintaPorcento - (form.despesas || 0));
  
  // 70% left for living expenses
  const sobraSubsistencia = rendaBrutaTotal * 0.70;

  // Determine MCMV / SBPE bracket based on 2024 general rules
  let enquadramento = {
    nome: 'MCMV - Faixa 1',
    desc: 'Renda até R$ 2.850. Subsídio máximo, menores taxas.',
    bg: 'bg-teal-50/50',
    border: 'border-teal-100',
    text: 'text-teal-600'
  };

  if (rendaBrutaTotal > 2850 && rendaBrutaTotal <= 4700) {
    enquadramento = {
      nome: 'MCMV - Faixa 2',
      desc: 'Renda até R$ 4.700. Subsídio intermediário.',
      bg: 'bg-cyan-50/50',
      border: 'border-cyan-100',
      text: 'text-cyan-600'
    };
  } else if (rendaBrutaTotal > 4700 && rendaBrutaTotal <= 8000) {
    enquadramento = {
      nome: 'MCMV - Faixa 3',
      desc: 'Renda até R$ 8.000. Sem subsídio, mas com taxa reduzida.',
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-100',
      text: 'text-indigo-600'
    };
  } else if (rendaBrutaTotal > 8000 && rendaBrutaTotal <= 13000) {
    enquadramento = {
      nome: 'MCMV - Faixa 4',
      desc: 'Renda até R$ 13.000. Condições específicas de financiamento.',
      bg: 'bg-violet-50/50',
      border: 'border-violet-100',
      text: 'text-violet-600'
    };
  } else if (rendaBrutaTotal > 13000) {
    enquadramento = {
      nome: 'SBPE / Pró-Cotista',
      desc: 'Renda acima de R$ 13.000. Fora do MCMV.',
      bg: 'bg-purple-50/50',
      border: 'border-purple-100',
      text: 'text-purple-600'
    };
  }

  return {
    rendaBrutaTotal,
    limiteTrintaPorcento,
    parcelaMaximaLivre,
    sobraSubsistencia,
    enquadramento
  };
});

const chartData = computed(() => {
  return {
    labels: ['Parcela Habitacional Máxima', 'Outras Despesas (Ativas)', 'Sobra Subsistência (70%)'],
    datasets: [
      {
        data: [calc.value.parcelaMaximaLivre, (form.despesas || 0), calc.value.sobraSubsistencia],
        backgroundColor: ['#10b981', '#ef4444', '#e5e7eb'],
        hoverBackgroundColor: ['#059669', '#dc2626', '#d1d5db'],
        borderWidth: 0,
        cutout: '75%'
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.label || '';
          if (label) label += ': ';
          label += formatCurrency(context.raw);
          return label;
        }
      }
    }
  }
};

const handleCalculate = () => {
  isCalculated.value = true;
};

const gerarPdf = () => {
  showPdfModal.value = false;
  
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('Relatório de Apuração de Renda', 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Resumo da Capacidade de Financiamento Habitacional', 14, 28);
  
  if (clientName.value) {
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`Cliente: ${clientName.value.toUpperCase()}`, 14, 40);
  }

  // Dados da Renda
  autoTable(doc, {
    startY: clientName.value ? 45 : 35,
    head: [['Composição da Renda', 'Valor (R$)']],
    body: [
      ['Renda Bruta (Proponente 1)', formatCurrency(form.renda1)],
      ['Renda Bruta (Proponente 2)', formatCurrency(form.renda2)],
      ['Rendas Adicionais/Variáveis', formatCurrency(form.rendaAdicional)],
      ['Despesas Ativas (Comprometimentos)', formatCurrency(form.despesas)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [5, 150, 105] },
  });

  const finalY = doc.lastAutoTable.finalY || 45;

  // Resultados
  autoTable(doc, {
    startY: finalY + 10,
    head: [['Resultado da Apuração', 'Valor']],
    body: [
      ['Renda Bruta Familiar Total', formatCurrency(calc.value.rendaBrutaTotal)],
      ['Limite Bruto de 30%', formatCurrency(calc.value.limiteTrintaPorcento)],
      ['Capacidade MÁXIMA de Parcela', formatCurrency(calc.value.parcelaMaximaLivre)],
      ['Enquadramento Estimado', calc.value.enquadramento.nome],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontStyle: 'bold' }
  });
  
  const finalY2 = doc.lastAutoTable.finalY || 100;
  
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Nota: Esta é uma simulação baseada na regra geral de comprometimento de 30% da renda bruta.', 14, finalY2 + 10);
  doc.text('A aprovação final está sujeita à análise de crédito da instituição financeira.', 14, finalY2 + 15);
  
  const fileName = clientName.value 
    ? `apuracao_renda_${clientName.value.replace(/\s+/g, '_').toLowerCase()}.pdf`
    : `apuracao_renda.pdf`;
    
  doc.save(fileName);
  
  clientName.value = '';
};
</script>
