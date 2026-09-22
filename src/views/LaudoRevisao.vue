<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex items-start gap-4 mb-2">
      <div class="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0 mt-1">
        <Scale class="w-7 h-7" />
      </div>
      <div class="flex flex-col">
        <h1 class="text-[22px] font-bold text-gray-900 leading-tight">Laudo de Revisão de Valores</h1>
        <p class="text-gray-600 text-[15px] mt-1">Calcule o impacto de avaliações baixas e gerencie suas solicitações de recurso na Caixa.</p>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-gray-200">
      <button 
        @click="activeTab = 'simulador'"
        :class="['px-6 py-3 font-semibold text-sm transition-colors border-b-2', activeTab === 'simulador' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
        Calculadora e Recurso
      </button>
      <button 
        @click="activeTab = 'kanban'"
        :class="['px-6 py-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2', activeTab === 'kanban' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
        <Kanban class="w-4 h-4" />
        Gestão de Revisões (Kanban)
      </button>
    </div>

    <!-- Tab 1: Simulador -->
    <div v-if="activeTab === 'simulador'" class="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[420px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 h-fit">
        <h2 class="text-lg font-bold text-gray-900">Dados da Negociação e Avaliação</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Valor de Compra e Venda <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.valorCompra" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-[15px]" />
            <p class="text-xs text-gray-500">O valor real negociado com o vendedor.</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Valor Avaliado pela Engenharia <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.valorAvaliado" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-[15px]" />
            <p class="text-xs text-gray-500">O valor apontado no laudo do banco.</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Cota de Financiamento (%)</label>
            <select v-model.number="form.cota" class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-[15px] text-gray-700 cursor-pointer">
              <option :value="0.8">80% (Padrão SAC)</option>
              <option :value="0.9">90%</option>
              <option :value="0.7">70%</option>
              <option :value="0.5">50%</option>
            </select>
          </div>

          <button @click="handleCalculate" class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm text-[15px] flex items-center justify-center gap-2">
            <Calculator class="w-5 h-5" /> Calcular Impacto
          </button>
        </div>
      </div>

      <!-- Right Column: Results -->
      <div class="flex-1 flex flex-col gap-6">
        <template v-if="isCalculated">
          
          <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-600 font-medium">Salve esta análise no seu quadro de gestão de revisões para acompanhamento.</p>
            <div class="flex gap-2">
              <button @click="salvarNoKanban" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                <Plus class="w-4 h-4" />
                Adicionar ao Kanban
              </button>
              <button @click="showPdfModal = true" class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm">
                <Download class="w-4 h-4" />
                Baixar PDF
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="bg-gray-50/50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <FileText class="w-5 h-5" />
                <h3 class="font-bold text-lg">Entrada Original</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Esperada (Plano Ideal)</div>
              <div class="text-2xl font-black text-gray-700 mb-2">{{ formatCurrency(calc.entradaOriginal) }}</div>
              <p class="text-sm text-gray-600">Baseado no valor de compra de {{ formatCurrency(form.valorCompra) }}.</p>
            </div>
            
            <div class="bg-orange-50/50 border border-orange-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-orange-600 mb-2">
                <AlertCircle class="w-5 h-5" />
                <h3 class="font-bold text-lg">Nova Entrada</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Após Laudo de Engenharia</div>
              <div class="text-2xl font-black text-orange-600 mb-2">{{ formatCurrency(calc.novaEntrada) }}</div>
              <p class="text-sm text-gray-600">O banco só financia até {{ form.cota * 100 }}% de {{ formatCurrency(form.valorAvaliado) }}.</p>
            </div>

            <div class="bg-red-50/50 border border-red-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-red-600 mb-2">
                <TrendingUp class="w-5 h-5" />
                <h3 class="font-bold text-lg">Impacto Final</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Diferença a pagar</div>
              <div class="text-3xl font-black text-red-600 mb-2">+ {{ formatCurrency(calc.diferencaAumento) }}</div>
              <p class="text-sm text-gray-600">Valor extra que o cliente precisará desembolsar.</p>
            </div>
          </div>

          <!-- Texto Base para Recurso -->
          <div v-if="calc.diferencaAumento > 0" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-2 relative">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileSignature class="w-5 h-5 text-gray-500" />
              Argumentação Sugerida para Recurso / Contestação de Valor
            </h3>
            <div class="bg-gray-50 border border-gray-100 p-4 rounded-lg text-sm text-gray-700 leading-relaxed font-mono whitespace-pre-wrap select-all">
Prezados responsáveis pelo Setor de Engenharia / Avaliação,

Solicitamos a revisão do Laudo de Avaliação do imóvel em questão. 
O valor de Compra e Venda acordado em contrato é de {{ formatCurrency(form.valorCompra) }}, refletindo o atual preço praticado no mercado imobiliário para esta região e tipologia.

O laudo emitido apontou o valor de {{ formatCurrency(form.valorAvaliado) }}, gerando uma defasagem de {{ formatCurrency(form.valorCompra - form.valorAvaliado) }}.
Devido a essa avaliação abaixo do mercado, a cota máxima de financiamento ({{ form.cota * 100 }}%) cobriu apenas {{ formatCurrency(calc.financiamentoMaximo) }}.

Isso onera desproporcionalmente o comprador, aumentando a exigência de recursos próprios (Entrada) de {{ formatCurrency(calc.entradaOriginal) }} para {{ formatCurrency(calc.novaEntrada) }}, inviabilizando a operação.

Pedimos a reavaliação utilizando amostras de mercado recentes e comparáveis. 
(Anexar links e PDFs de imóveis similares na mesma região, mesmo padrão e metragem).</div>
            <p class="text-xs text-gray-400 mt-3 text-right">
              Dica: Copie este texto e adapte conforme os documentos anexados.
            </p>
          </div>
          
          <div v-else class="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-emerald-800 text-center font-medium mt-2">
            Excelente! A avaliação acompanhou ou superou o valor de compra. Não há prejuízo na entrada do cliente.
          </div>

        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
            <Scale class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha os valores e clique em <strong class="text-gray-500">Calcular Impacto</strong></p>
          </div>
        </template>
      </div>
    </div>

    <!-- Tab 2: Kanban Board -->
    <div v-if="activeTab === 'kanban'" class="flex-1 min-h-[600px] overflow-x-auto pb-4 animate-in fade-in duration-300">
      <div class="flex gap-4 min-w-max h-full items-start">
        <!-- Colunas -->
        <div 
          v-for="coluna in kanbanColumns" 
          :key="coluna.id" 
          class="flex flex-col bg-gray-100 rounded-xl w-80 max-h-full shrink-0 border border-gray-200"
          @dragover.prevent
          @drop="handleDrop($event, coluna.id)"
        >
          <div class="p-4 flex items-center justify-between border-b border-gray-200">
            <h3 class="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span class="w-2.5 h-2.5 rounded-full" :class="coluna.color"></span>
              {{ coluna.title }}
            </h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ getItemsByStatus(coluna.id).length }}</span>
          </div>

          <div class="p-3 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[200px]">
            <!-- Card -->
            <div 
              v-for="item in getItemsByStatus(coluna.id)" 
              :key="item.id"
              class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-red-300 transition-colors group relative"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
            >
              <button @click="removerKanban(item.id)" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 hidden group-hover:block transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
              
              <div class="font-bold text-gray-800 text-sm mb-1">{{ item.clientName || 'Cliente sem nome' }}</div>
              
              <div class="flex flex-col gap-1.5 mt-3 text-[13px]">
                <div class="flex justify-between">
                  <span class="text-gray-500">Valor Compra:</span>
                  <span class="font-semibold text-gray-700">{{ formatCurrency(item.valorCompra) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Valor Avaliado:</span>
                  <span class="font-semibold text-gray-700">{{ formatCurrency(item.valorAvaliado) }}</span>
                </div>
                <div class="flex justify-between pt-1 border-t border-gray-100 mt-1">
                  <span class="text-gray-500">Defasagem:</span>
                  <span class="font-bold text-red-600">{{ formatCurrency(item.valorCompra - item.valorAvaliado) }}</span>
                </div>
              </div>
            </div>

            <div v-if="getItemsByStatus(coluna.id).length === 0" class="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Solte os cards aqui
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Cliente Kanban -->
    <div v-if="showKanbanModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Adicionar ao Kanban</h3>
        <p class="text-sm text-gray-500 mb-4">Insira o nome do cliente ou identificação do imóvel para salvar esta análise.</p>
        
        <input 
          v-model="newKanbanName" 
          type="text" 
          placeholder="Ex: Cliente João ou Ap 402" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-6"
          @keyup.enter="confirmarKanban"
          autofocus
        />

        <div class="flex items-center gap-3 justify-end">
          <button @click="showKanbanModal = false" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="confirmarKanban" class="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
            Salvar no Kanban
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nome do Cliente PDF -->
    <div v-if="showPdfModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Identificar Relatório</h3>
        <p class="text-sm text-gray-500 mb-4">Insira o nome do cliente para personalizar o Laudo de Revisão.</p>
        
        <input 
          v-model="clientName" 
          type="text" 
          placeholder="Nome do cliente" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none mb-6"
          @keyup.enter="gerarPdf"
          autofocus
        />

        <div class="flex items-center gap-3 justify-end">
          <button @click="showPdfModal = false" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="gerarPdf" class="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2">
            <Download class="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue';
import { Money3Component } from 'v-money3';
import { Scale, Calculator, AlertCircle, TrendingUp, Download, FileText, FileSignature, Kanban, Plus, Trash2 } from '@lucide/vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const money3 = Money3Component;
const isCalculated = ref(false);
const activeTab = ref('simulador');

const showPdfModal = ref(false);
const clientName = ref('');

const form = reactive({
  valorCompra: 300000,
  valorAvaliado: 260000,
  cota: 0.8
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
  // Plan A: Bank finances based on Purchase Price
  const financiamentoOriginal = form.valorCompra * form.cota;
  const entradaOriginal = form.valorCompra - financiamentoOriginal;

  // Plan B: Bank finances based on Appraisal Price (if lower)
  const valorBase = Math.min(form.valorCompra, form.valorAvaliado);
  const financiamentoMaximo = valorBase * form.cota;
  
  // The buyer still has to pay the seller the full purchase price
  const novaEntrada = form.valorCompra - financiamentoMaximo;
  
  const diferencaAumento = Math.max(0, novaEntrada - entradaOriginal);

  return {
    entradaOriginal,
    novaEntrada,
    diferencaAumento,
    financiamentoMaximo
  };
});

const handleCalculate = () => {
  isCalculated.value = true;
};

// --- Kanban Logic ---

const kanbanColumns = [
  { id: 'solicitar', title: 'Para Solicitar', color: 'bg-yellow-400' },
  { id: 'analise', title: 'Em Análise', color: 'bg-blue-400' },
  { id: 'deferido', title: 'Deferido', color: 'bg-emerald-400' },
  { id: 'indeferido', title: 'Indeferido', color: 'bg-red-400' }
];

const kanbanItems = ref([]);
const showKanbanModal = ref(false);
const newKanbanName = ref('');

onMounted(() => {
  const saved = localStorage.getItem('simulador_kanban_revisao');
  if (saved) {
    try {
      kanbanItems.value = JSON.parse(saved);
    } catch(e) {}
  } else {
    // Dummy data for visualization
    kanbanItems.value = [
      { id: 1, clientName: 'João da Silva (Apt 402)', valorCompra: 300000, valorAvaliado: 260000, status: 'solicitar' },
      { id: 2, clientName: 'Maria Souza', valorCompra: 250000, valorAvaliado: 220000, status: 'analise' },
      { id: 3, clientName: 'Carlos e Ana', valorCompra: 400000, valorAvaliado: 380000, status: 'deferido' }
    ];
  }
});

watch(kanbanItems, (newVal) => {
  localStorage.setItem('simulador_kanban_revisao', JSON.stringify(newVal));
}, { deep: true });

const getItemsByStatus = (status) => {
  return kanbanItems.value.filter(item => item.status === status);
};

const handleDragStart = (e, item) => {
  e.dataTransfer.setData('itemId', item.id);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDrop = (e, targetStatus) => {
  const itemId = e.dataTransfer.getData('itemId');
  if (!itemId) return;
  const item = kanbanItems.value.find(i => i.id == itemId);
  if (item && item.status !== targetStatus) {
    item.status = targetStatus;
  }
};

const salvarNoKanban = () => {
  newKanbanName.value = '';
  showKanbanModal.value = true;
};

const confirmarKanban = () => {
  if (!newKanbanName.value) return;
  
  kanbanItems.value.push({
    id: Date.now(),
    clientName: newKanbanName.value,
    valorCompra: form.valorCompra,
    valorAvaliado: form.valorAvaliado,
    status: 'solicitar'
  });
  
  showKanbanModal.value = false;
  activeTab.value = 'kanban';
};

const removerKanban = (id) => {
  if(confirm('Remover este item do Kanban?')) {
    kanbanItems.value = kanbanItems.value.filter(i => i.id !== id);
  }
};

// --- PDF Logic ---

const gerarPdf = () => {
  showPdfModal.value = false;
  
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38); // red-600
  doc.text('Laudo de Revisão de Avaliação', 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Demonstrativo de Impacto no Financiamento', 14, 28);
  
  if (clientName.value) {
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`Cliente: ${clientName.value.toUpperCase()}`, 14, 40);
  }

  const startTableY = clientName.value ? 45 : 35;

  autoTable(doc, {
    startY: startTableY,
    head: [['Dados da Operação', 'Valor (R$)']],
    body: [
      ['Valor de Compra e Venda', formatCurrency(form.valorCompra)],
      ['Valor de Avaliação (Engenharia)', formatCurrency(form.valorAvaliado)],
      ['Cota de Financiamento Permitida', `${form.cota * 100}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });

  const finalY = doc.lastAutoTable.finalY || startTableY;

  autoTable(doc, {
    startY: finalY + 10,
    head: [['Impacto Financeiro na Entrada', 'Valor']],
    body: [
      ['Entrada Original (Ideal)', formatCurrency(calc.value.entradaOriginal)],
      ['Nova Entrada (Após Laudo)', formatCurrency(calc.value.novaEntrada)],
      ['Diferença a Desembolsar', `+ ${formatCurrency(calc.value.diferencaAumento)}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontStyle: 'bold' },
    didParseCell: function(data) {
      if (data.row.index === 2 && data.section === 'body') {
         data.cell.styles.textColor = [220, 38, 38];
      }
    }
  });
  
  const finalY2 = doc.lastAutoTable.finalY || 100;
  
  if (calc.value.diferencaAumento > 0) {
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('Base para Solicitação de Recurso:', 14, finalY2 + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const textoRecurso = `O laudo emitido apontou o valor de ${formatCurrency(form.valorAvaliado)}, gerando uma defasagem. Devido a essa avaliação abaixo do mercado, a cota máxima cobriu apenas ${formatCurrency(calc.value.financiamentoMaximo)}. Isso onera desproporcionalmente o comprador, aumentando a exigência de recursos próprios de ${formatCurrency(calc.value.entradaOriginal)} para ${formatCurrency(calc.value.novaEntrada)}. Solicitamos reavaliação.`;
    
    const lines = doc.splitTextToSize(textoRecurso, 180);
    doc.text(lines, 14, finalY2 + 22);
  }
  
  const fileName = clientName.value 
    ? `laudo_revisao_${clientName.value.replace(/\s+/g, '_').toLowerCase()}.pdf`
    : `laudo_revisao.pdf`;
    
  doc.save(fileName);
  
  clientName.value = '';
};
</script>
