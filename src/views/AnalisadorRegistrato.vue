<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex items-start gap-4 mb-2">
      <div class="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shrink-0 mt-1">
        <AlertCircle class="w-7 h-7" />
      </div>
      <div class="flex flex-col">
        <h1 class="text-[22px] font-bold text-gray-900 leading-tight">Analisador de Registrato (BACEN)</h1>
        <p class="text-gray-600 text-[15px] mt-1">Avalie rapidamente o risco do cliente com base no relatório SCR do Banco Central.</p>
        <p class="text-gray-400 text-[13px] italic mt-1">
          (Previna reprovações automáticas na Caixa identificando prejuízos ou alto grau de endividamento)
        </p>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[420px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 h-fit">
        <h2 class="text-lg font-bold text-gray-900">Dados do Relatório SCR</h2>

        <div class="flex flex-col gap-4">
          
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Total em Prejuízo <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.prejuizo" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[15px]" />
            <p class="text-xs text-gray-500">Valores lançados como prejuízo pelos bancos.</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Total Vencido (Atrasado) <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.vencido" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[15px]" />
            <p class="text-xs text-gray-500">Contratos com parcelas em atraso no momento da consulta.</p>
          </div>

          <div class="w-full h-px bg-gray-100 my-2"></div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Total a Vencer (Dívida Ativa)</label>
            <money3 v-model.number="form.aVencer" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[15px]" />
            <p class="text-xs text-gray-500">Soma de todo o saldo devedor (cartões, financiamentos).</p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Parcelas Mensais Estimadas</label>
            <money3 v-model.number="form.parcelasMensais" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[15px]" />
            <p class="text-xs text-gray-500">O que o cliente paga por mês destas dívidas ativas.</p>
          </div>

          <button @click="handleAnalyze" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm text-[15px] flex items-center justify-center gap-2">
            <ShieldAlert class="w-5 h-5" /> Analisar Risco
          </button>
        </div>
      </div>

      <!-- Right Column: Results -->
      <div class="flex-1 flex flex-col gap-6">
        <template v-if="isCalculated">
          
          <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <Activity class="w-5 h-5 text-gray-500" /> Diagnóstico de Crédito
            </h3>
            <button @click="gerarPdf" class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm">
              <Download class="w-4 h-4" />
              Exportar Parecer
            </button>
          </div>

          <!-- Risco Card -->
          <div :class="[calc.risco.bg, calc.risco.border]" class="border rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div class="absolute top-0 w-full h-1" :class="calc.risco.line"></div>
            
            <component :is="calc.risco.icon" class="w-16 h-16 mb-4" :class="calc.risco.text" />
            <h2 class="text-3xl font-black mb-2" :class="calc.risco.text">{{ calc.risco.titulo }}</h2>
            <p class="text-lg font-medium text-gray-700 max-w-2xl leading-relaxed">{{ calc.risco.mensagem }}</p>
          </div>

          <!-- Cards Detalhados -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Prejuízo/Vencido -->
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
              <h4 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Status de Inadimplência</h4>
              
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-600">Lançado em Prejuízo:</span>
                <span class="font-bold" :class="form.prejuizo > 0 ? 'text-red-600' : 'text-emerald-600'">{{ formatCurrency(form.prejuizo) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Dívidas Vencidas (Atraso):</span>
                <span class="font-bold" :class="form.vencido > 0 ? 'text-orange-600' : 'text-emerald-600'">{{ formatCurrency(form.vencido) }}</span>
              </div>
            </div>
            
            <!-- Endividamento -->
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
              <h4 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Status de Endividamento</h4>
              
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-600">Total a Vencer (Dívida):</span>
                <span class="font-semibold text-gray-700">{{ formatCurrency(form.aVencer) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Impacto Mensal Estimado:</span>
                <span class="font-bold text-indigo-600">{{ formatCurrency(form.parcelasMensais) }} /mês</span>
              </div>
            </div>

          </div>

          <!-- Ações Recomendadas -->
          <div class="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6">
            <h4 class="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <CheckSquare class="w-5 h-5 text-indigo-600" />
              Ações Recomendadas para Aprovação
            </h4>
            <ul class="flex flex-col gap-2">
              <li v-for="(acao, idx) in calc.acoes" :key="idx" class="flex items-start gap-2 text-sm text-indigo-800">
                <ChevronRight class="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                <span v-html="acao"></span>
              </li>
            </ul>
          </div>

        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
            <Search class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha os dados do Registrato e clique em <strong class="text-gray-500">Analisar Risco</strong></p>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { Money3Component } from 'v-money3';
import { AlertCircle, ShieldAlert, Activity, CheckSquare, ChevronRight, Download, Search, XCircle, AlertTriangle, CheckCircle } from '@lucide/vue';
import { jsPDF } from 'jspdf';

const money3 = Money3Component;
const isCalculated = ref(false);

const form = reactive({
  prejuizo: 0,
  vencido: 0,
  aVencer: 15000,
  parcelasMensais: 850
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
  let risco = {};
  let acoes = [];

  if (form.prejuizo > 0) {
    risco = {
      titulo: 'Risco Gravíssimo (Reprovação)',
      mensagem: 'O cliente possui dívidas ativas marcadas como PREJUÍZO pelo sistema financeiro. A Caixa e outros bancos rejeitam automaticamente qualquer operação de crédito habitacional nestas condições.',
      bg: 'bg-red-50',
      border: 'border-red-200',
      line: 'bg-red-600',
      text: 'text-red-700',
      icon: XCircle
    };
    
    acoes.push(`<strong>Negociar a dívida de ${formatCurrency(form.prejuizo)}:</strong> O cliente precisa contatar a instituição credora imediatamente e quitar o valor.`);
    acoes.push(`<strong>Aguardar prazo do BACEN:</strong> Após o pagamento, leva de 15 a 30 dias para o Banco Central limpar o apontamento no Registrato.`);
    acoes.push(`Não envie para a Caixa sob hipótese alguma antes do Registrato atualizar, para evitar bloqueio do CPF por 6 meses.`);

  } else if (form.vencido > 0) {
    risco = {
      titulo: 'Risco Alto (Inadimplência)',
      mensagem: 'Há parcelas vencidas e não pagas. O Rating do cliente será severamente rebaixado e a aprovação pode ser condicionada ou negada.',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      line: 'bg-orange-500',
      text: 'text-orange-700',
      icon: AlertTriangle
    };
    
    acoes.push(`<strong>Pagar atrasos (${formatCurrency(form.vencido)}):</strong> O cliente deve colocar todas as faturas e boletos em dia imediatamente.`);
    acoes.push(`Se possível, pague antes do fechamento do mês para que o próximo relatório do Registrato venha zerado.`);
    acoes.push(`Envie os comprovantes de quitação junto à pasta para a Caixa para justificar e provar a regularização.`);

  } else {
    risco = {
      titulo: 'Risco Controlado (Aprovável)',
      mensagem: 'O cliente não possui apontamentos negativos (Prejuízo/Vencido). A análise dependerá apenas da capacidade de pagamento (comprometimento de renda).',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      line: 'bg-emerald-500',
      text: 'text-emerald-700',
      icon: CheckCircle
    };
    
    if (form.parcelasMensais > 0) {
      acoes.push(`<strong>Alerta de Renda:</strong> O cliente já possui <strong>${formatCurrency(form.parcelasMensais)}</strong> comprometidos mensalmente. Esse valor reduzirá a capacidade da parcela habitacional.`);
      acoes.push(`Se o financiamento não aprovar o valor total, considere liquidar parte das dívidas de cartão de crédito/empréstimo para liberar margem na renda.`);
    } else {
      acoes.push(`O cliente possui o cenário ideal para avaliação na Caixa.`);
      acoes.push(`Avance para a Apuração de Renda.`);
    }
  }

  return { risco, acoes };
});

const handleAnalyze = () => {
  isCalculated.value = true;
};

const gerarPdf = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text('Parecer Técnico - Registrato (BACEN)', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status do Risco: ${calc.value.risco.titulo}`, 14, 35);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  
  const msgLines = doc.splitTextToSize(calc.value.risco.mensagem, 180);
  doc.text(msgLines, 14, 42);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Financeiro (Ativo)', 14, 65);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prejuízo Bancário: ${formatCurrency(form.prejuizo)}`, 14, 73);
  doc.text(`Dívidas Vencidas em Atraso: ${formatCurrency(form.vencido)}`, 14, 80);
  doc.text(`Total de Dívidas a Vencer: ${formatCurrency(form.aVencer)}`, 14, 87);
  doc.text(`Comprometimento Mensal Estimado: ${formatCurrency(form.parcelasMensais)}`, 14, 94);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ações Recomendadas (Plano de Ação):', 14, 110);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let currentY = 118;
  calc.value.acoes.forEach(acao => {
    // Strip HTML tags for PDF
    const cleanText = acao.replace(/<\/?[^>]+(>|$)/g, "");
    const lines = doc.splitTextToSize(`- ${cleanText}`, 180);
    doc.text(lines, 14, currentY);
    currentY += (lines.length * 5);
  });
  
  doc.save('parecer_registrato.pdf');
};
</script>
