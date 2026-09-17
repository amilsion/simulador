<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <div class="p-2 bg-gray-100 rounded-md">
        <TrendingDown class="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <h1 class="font-bold text-gray-800 text-lg leading-tight">Planilha de Amortização</h1>
        <p class="text-xs text-gray-500">Simule o impacto das amortizações no seu financiamento</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <div class="relative w-full sm:w-auto">
        <User class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          :value="clientName"
          @input="$emit('update:clientName', $event.target.value)"
          placeholder="Nome do Cliente" 
          class="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex bg-gray-100 p-0.5 rounded-md border border-gray-200">
        <button 
          @click="$emit('update:system', 'SAC')"
          :class="['px-4 py-1 text-sm font-medium rounded-sm transition-colors', system === 'SAC' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-800']"
        >
          SAC
        </button>
        <button 
          @click="$emit('update:system', 'PRICE')"
          :class="['px-4 py-1 text-sm font-medium rounded-sm transition-colors', system === 'PRICE' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-800']"
        >
          PRICE
        </button>
      </div>

      <button @click="$emit('open-manual')" class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        <ArrowRightLeft class="w-4 h-4" />
        Aportes Manuais
      </button>

      <button @click="$emit('open-fgts')" class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        <Briefcase class="w-4 h-4" />
        Configurar FGTS
      </button>

      <button class="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
        <HelpCircle class="w-4 h-4" />
      </button>

      <button @click="$emit('generate-pdf')" class="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">
        <FileText class="w-4 h-4" />
        Gerar PDF
      </button>
    </div>
  </header>
</template>

<script setup>
import { 
  TrendingDown, 
  User, 
  ArrowRightLeft, 
  Briefcase, 
  HelpCircle, 
  FileText 
} from '@lucide/vue';

defineProps({
  system: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    default: ''
  }
});
defineEmits(['update:system', 'update:clientName', 'open-manual', 'open-fgts', 'generate-pdf']);
</script>
