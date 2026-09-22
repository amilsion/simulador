<template>
  <div class="flex flex-col items-center gap-6 p-6 min-h-screen bg-[#f8f9fa]">
    
    <!-- Header -->
    <header class="flex flex-col gap-4 w-full max-w-4xl">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-yellow-100 text-orange-500 rounded-xl mt-1 shrink-0">
          <BookOpen class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Glossário de Crédito Imobiliário</h1>
          <p class="text-gray-500 font-medium mt-1">{{ totalTerms }} termos essenciais para corretores e consultores</p>
        </div>
      </div>
      <p class="text-gray-600 text-[15px] leading-relaxed max-w-3xl">
        Material de referência completo para capacitação da equipe. Consulte termos técnicos, siglas e 
        conceitos do universo do crédito habitacional, MCMV, legislação de São Paulo e análise de crédito.
      </p>
    </header>

    <!-- Search Bar -->
    <div class="w-full relative max-w-4xl mt-2">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search class="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" v-model="searchQuery" placeholder="Buscar termo, sigla ou conceito..." 
             class="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[15px] shadow-sm outline-none transition-shadow" />
    </div>

    <!-- Category Accordions -->
    <div class="flex flex-col gap-4 w-full max-w-4xl mt-4">
      <div v-for="category in filteredCategories" :key="category.id" 
           class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        <!-- Category Header -->
        <button @click="toggleCategory(category.id)" 
                class="w-full text-left p-4 flex items-center bg-blue-50/50 hover:bg-blue-50 transition-colors border-b border-blue-100"
                :class="{'border-b border-gray-200': !category.isOpen}">
          <div class="p-2 bg-blue-100/50 text-blue-500 rounded-lg shrink-0 mr-4">
            <component :is="category.icon" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h2 class="text-[17px] font-bold text-blue-600">{{ category.title }}</h2>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{{ category.terms.length }} termos</span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5">{{ category.subtitle }}</p>
          </div>
          <ChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0" 
                       :class="{ 'rotate-180': category.isOpen }" />
        </button>

        <!-- Category Terms List -->
        <div v-show="category.isOpen" class="divide-y divide-gray-100">
          <div v-for="term in category.terms" :key="term.title" 
               class="p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1.5 flex-wrap">
                  <h3 class="text-base font-bold text-gray-900">{{ term.title }}</h3>
                  <span v-if="term.badge" class="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-semibold rounded uppercase tracking-wider">
                    {{ term.badge }}
                  </span>
                </div>
                <p class="text-[14px] text-gray-500 leading-relaxed">{{ term.definition }}</p>
              </div>
              <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0" class="py-12 text-center bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">Nenhum termo encontrado</h3>
        <p class="text-gray-500">Não encontramos nenhum resultado para "{{ searchQuery }}".</p>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BookOpen, Search, Tag, ChevronDown, ChevronRight, Calculator, FileText, Building, Users } from '@lucide/vue';

const searchQuery = ref('');

const categoriesData = ref([
  {
    id: 'financiamento',
    title: 'Financiamento Imobiliário',
    subtitle: 'Conceitos fundamentais do crédito habitacional',
    icon: Tag,
    isOpen: true,
    terms: [
      {
        title: 'Financiamento Imobiliário',
        badge: '',
        definition: 'Operação de crédito em que uma instituição financeira empresta recursos para a compra ou construção de um imóvel. O bem financiado serve como garantia (alienação fiduciária ou hipoteca) até a quitação total da dívida.'
      },
      {
        title: 'SFH',
        badge: 'Sistema Financeiro de Habitação',
        definition: 'Principal sistema de crédito habitacional do Brasil, criado em 1964. Regula os financiamentos com recursos do FGTS e da poupança (SBPE). Tem teto de valor de imóvel e taxa de juros limitada a 12% a.a.'
      },
      {
        title: 'SFI',
        badge: 'Sistema de Financiamento Imobiliário',
        definition: 'Sistema criado em 1997 para imóveis de maior valor, sem limite de taxa de juros e sem restrição de ter outro financiamento ativo. Permite financiar imóveis acima do teto do SFH.'
      },
      {
        title: 'Alienação Fiduciária',
        badge: '',
        definition: 'Modalidade de garantia em que o devedor transfere a propriedade do imóvel ao credor (banco) até quitar a dívida. É mais ágil que a hipoteca em caso de inadimplência — o banco pode retomar o imóvel sem ação judicial.'
      }
    ]
  },
  {
    id: 'sistemas-amortizacao',
    title: 'Sistemas de Amortização e Juros',
    subtitle: 'Entenda como as parcelas são calculadas',
    icon: Calculator,
    isOpen: false,
    terms: [
      {
        title: 'SAC',
        badge: 'Sistema de Amortização Constante',
        definition: 'Sistema de amortização onde o valor da cota de amortização é constante, fazendo com que as prestações sejam decrescentes ao longo do tempo.'
      },
      {
        title: 'Tabela PRICE',
        badge: '',
        definition: 'Sistema de amortização onde todas as prestações têm o mesmo valor do início ao fim do contrato. A parcela de juros diminui enquanto a de amortização aumenta.'
      },
      {
        title: 'CET',
        badge: 'Custo Efetivo Total',
        definition: 'Representa o custo total do financiamento, englobando a taxa de juros, os seguros (MIP e DFI) e as tarifas administrativas.'
      },
      {
        title: 'Taxa de Obra',
        badge: 'Juros de Obra',
        definition: 'Juros cobrados pelo banco sobre o valor que já foi repassado à construtora durante o período de construção do imóvel na planta.'
      }
    ]
  },
  {
    id: 'indices-seguros',
    title: 'Índices e Seguros',
    subtitle: 'Taxas de correção e seguros habitacionais obrigatórios',
    icon: FileText,
    isOpen: false,
    terms: [
      {
        title: 'INCC',
        badge: 'Índice Nacional de Custo da Construção',
        definition: 'Índice usado para reajustar as parcelas e o saldo devedor de imóveis comprados na planta, refletindo o aumento dos custos de materiais e mão de obra.'
      },
      {
        title: 'TR',
        badge: 'Taxa Referencial',
        definition: 'Taxa usada como índice de correção monetária em diversos contratos de financiamento imobiliário (especialmente SFH) e na poupança.'
      },
      {
        title: 'MIP',
        badge: 'Morte e Invalidez Permanente',
        definition: 'Seguro habitacional obrigatório que quita o saldo devedor do financiamento caso o titular venha a falecer ou se torne inválido permanentemente.'
      },
      {
        title: 'DFI',
        badge: 'Danos Físicos ao Imóvel',
        definition: 'Seguro habitacional obrigatório que cobre prejuízos causados ao imóvel por fatores externos, como incêndio, raio, explosão, destelhamento, etc.'
      }
    ]
  },
  {
    id: 'documentacao',
    title: 'Documentação e Registro',
    subtitle: 'Termos jurídicos, impostos e certidões',
    icon: Building,
    isOpen: false,
    terms: [
      {
        title: 'ITBI',
        badge: 'Imposto de Transmissão de Bens Imóveis',
        definition: 'Imposto municipal cobrado na transferência de propriedade de um imóvel. O pagamento é requisito fundamental para o registro da compra e venda no cartório.'
      },
      {
        title: 'Habite-se',
        badge: 'Auto de Conclusão',
        definition: 'Certidão emitida pela prefeitura atestando que o imóvel está pronto para ser habitado e que foi construído em conformidade com as exigências legais e projeto aprovado.'
      },
      {
        title: 'Matrícula do Imóvel',
        badge: '',
        definition: 'O "documento de identidade" do imóvel. Fica registrada no Cartório de Registro de Imóveis e contém todo o histórico do bem, incluindo antigos proprietários, penhoras e hipotecas.'
      }
    ]
  }
]);

const toggleCategory = (id) => {
  const cat = categoriesData.value.find(c => c.id === id);
  if (cat) cat.isOpen = !cat.isOpen;
};

const totalTerms = computed(() => {
  return categoriesData.value.reduce((acc, cat) => acc + cat.terms.length, 0);
});

const filteredCategories = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  
  if (!q) {
    return categoriesData.value;
  }

  const result = [];
  
  for (const cat of categoriesData.value) {
    const matchingTerms = cat.terms.filter(t => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchBadge = t.badge.toLowerCase().includes(q);
      const matchDef = t.definition.toLowerCase().includes(q);
      return matchTitle || matchBadge || matchDef;
    });

    if (matchingTerms.length > 0) {
      // Se houver pesquisa ativa, vamos retornar a categoria SEMPRE aberta
      result.push({
        ...cat,
        isOpen: true,
        terms: matchingTerms
      });
    }
  }

  return result;
});
</script>
