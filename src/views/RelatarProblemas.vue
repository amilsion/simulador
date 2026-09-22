<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex flex-col gap-1">
      <div class="flex items-center gap-2 text-sm font-semibold tracking-wider text-indigo-600 uppercase">
        <div class="w-1 h-4 bg-indigo-500 rounded-full"></div>
        Utilitários
      </div>
      <h1 class="text-3xl font-bold text-gray-900">Relatar Problema</h1>
      <p class="text-gray-600">
        Encontrou algum erro no sistema ou tem alguma sugestão de melhoria? Envie para nós.
      </p>
    </header>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">Tipo de Contato <span class="text-red-500">*</span></label>
          <select v-model="form.type" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="bug">Reportar um erro (Bug)</option>
            <option value="suggestion">Sugestão de melhoria</option>
            <option value="doubt">Dúvida</option>
          </select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">Assunto <span class="text-red-500">*</span></label>
          <input type="text" v-model="form.subject" required placeholder="Ex: Erro ao gerar PDF no simulador PPP" 
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">Mensagem <span class="text-red-500">*</span></label>
          <textarea v-model="form.message" required rows="5" placeholder="Descreva com detalhes o que aconteceu..." 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"></textarea>
        </div>

        <div v-if="success" class="p-4 bg-green-50 text-green-700 rounded-md border border-green-200 flex items-center gap-2">
          <CheckCircle class="w-5 h-5" />
          Sua mensagem foi enviada com sucesso! Obrigado pelo feedback.
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" :disabled="isSubmitting" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
            <Send class="w-4 h-4" />
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Send, CheckCircle } from '@lucide/vue';

const form = reactive({
  type: 'bug',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const success = ref(false);

const handleSubmit = () => {
  isSubmitting.value = true;
  success.value = false;
  
  // Fake API call
  setTimeout(() => {
    isSubmitting.value = false;
    success.value = true;
    form.subject = '';
    form.message = '';
    
    setTimeout(() => {
      success.value = false;
    }, 5000);
  }, 1000);
};
</script>
