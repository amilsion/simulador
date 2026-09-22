<template>
  <aside class="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
    <div class="p-4 flex flex-col gap-6 flex-1">
      <nav class="space-y-1">
        <router-link @click="$emit('navigate')" to="/" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <Home class="w-5 h-5" />
          Início
        </router-link>
        
        <router-link @click="$emit('navigate')" to="/planilha-amort" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/planilha-amort' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <TrendingDown class="w-5 h-5" />
          Planilha Amort.
        </router-link>

        <router-link @click="$emit('navigate')" to="/evolucao-obra" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/evolucao-obra' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <Building class="w-5 h-5" />
          Evolução de Obra
        </router-link>

        <router-link @click="$emit('navigate')" to="/ppp" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/ppp' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <PiggyBank class="w-5 h-5" />
          P.P.P.
        </router-link>

        <router-link @click="$emit('navigate')" to="/analisador-registrato" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/analisador-registrato' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <AlertCircle class="w-5 h-5" />
          Analisador de Registrato
        </router-link>

        <router-link @click="$emit('navigate')" to="/apuracao-renda" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/apuracao-renda' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <DollarSign class="w-5 h-5" />
          Apuração de Renda
        </router-link>

        <router-link @click="$emit('navigate')" to="/financ-aluguel" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/financ-aluguel' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <Wrench class="w-5 h-5" />
          Financ. vs Aluguel
        </router-link>

        <router-link @click="$emit('navigate')" to="/crm-rating" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/crm-rating' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <Users class="w-5 h-5" />
          CRM Rating
        </router-link>

        <router-link @click="$emit('navigate')" to="/laudo-revisao" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/laudo-revisao' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
          <Ruler class="w-5 h-5" />
          Laudo de Revisão de Valores
        </router-link>
      </nav>

      <div class="mt-4">
        <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Utilitários</h3>
        <nav class="space-y-1">
          <router-link @click="$emit('navigate')" to="/links-uteis" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/links-uteis' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
            <ShieldAlert class="w-5 h-5" />
            Links Úteis
          </router-link>

          <router-link @click="$emit('navigate')" to="/glossario" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/glossario' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
            <BookOpen class="w-5 h-5" />
            Glossário
          </router-link>

          <router-link @click="$emit('navigate')" to="/relatar-problemas" class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md" :class="$route.path === '/relatar-problemas' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'">
            <Bug class="w-5 h-5" />
            Relatar problemas
          </router-link>
        </nav>
      </div>

    </div>

    <!-- Footer Information -->
    <div class="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
      <div class="flex flex-col gap-1 text-[11px] text-gray-400 leading-tight">
        <p>Esta aplicação é <strong>100% gratuita</strong> e utiliza o <strong class="text-gray-500">localStorage</strong> do seu navegador para armazenar os dados localmente, garantindo total privacidade.</p>
        <div class="flex items-center gap-2 mt-2 font-medium">
          <router-link @click="$emit('navigate')" to="/privacidade" class="hover:text-indigo-600 transition-colors">Privacidade</router-link>
          <span>&middot;</span>
          <router-link @click="$emit('navigate')" to="/termos" class="hover:text-indigo-600 transition-colors">Termos de Uso</router-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineEmits(['navigate']);
import { 
  Home, 
  LayoutDashboard, 
  TrendingDown, 
  Building, 
  PiggyBank, 
  AlertCircle, 
  DollarSign, 
  Wrench, 
  Users, 
  Ruler,
  ShieldAlert,
  BookOpen,
  Bug
} from '@lucide/vue';
</script>
