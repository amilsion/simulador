<template>
  <div class="flex flex-col p-6 min-h-screen bg-gray-50/50">
    <!-- Header -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 text-sm font-semibold tracking-wider text-indigo-600 uppercase">
          <div class="w-1 h-4 bg-indigo-500 rounded-full"></div>
          CRM Rating
        </div>
        <h1 class="text-3xl font-bold text-gray-900">CRM Rating</h1>
        <p class="text-gray-600 text-sm max-w-3xl">
          Acompanhe seus leads reprovados no rating até o relacionamento com o banco aprovar. Arraste os cards conforme evolui.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button 
          @click="viewMode = 'kanban'" 
          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <LayoutDashboard class="w-4 h-4" /> Kanban
        </button>
        <button 
          @click="viewMode = 'lista'" 
          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'lista' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <List class="w-4 h-4" /> Lista
        </button>
        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <Bell class="w-4 h-4" /> Lembretes
        </button>
        <button @click="addTestLead" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <Play class="w-4 h-4" /> Lead de teste
        </button>
        <button @click="openModal" class="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ml-2 shadow-sm">
          <Plus class="w-4 h-4" /> Novo acompanhamento
        </button>
      </div>
    </header>

    <!-- Kanban Board -->
    <div v-if="viewMode === 'kanban'" class="flex-1 flex gap-4 overflow-x-auto pb-4">
      <div 
        v-for="col in columns" 
        :key="col.id"
        class="flex flex-col bg-white border border-gray-200 rounded-xl flex-1 min-w-[280px] h-[600px] shadow-sm relative overflow-hidden"
        @dragover.prevent
        @dragenter.prevent
        @drop="onDrop($event, col.id)"
      >
        <!-- Column Top Border -->
        <div class="h-1 w-full absolute top-0 left-0" :class="col.borderClass"></div>
        
        <!-- Column Header -->
        <div class="p-4 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-bold text-gray-800" :class="col.textClass">{{ col.title }}</h3>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="[col.bgClass, col.textClass]">{{ getLeadsByStatus(col.id).length }}</span>
          </div>
          <p class="text-[11px] text-gray-500">{{ col.desc }}</p>
        </div>

        <!-- Column Body -->
        <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          <div v-if="getLeadsByStatus(col.id).length === 0" class="flex flex-col items-center justify-center h-40 text-gray-400">
            <div class="w-10 h-10 rounded-full flex items-center justify-center mb-2" :class="[col.bgClass, col.textClass]">
              <component :is="col.icon" class="w-5 h-5" />
            </div>
            <p class="font-medium text-sm text-gray-600">Nenhum lead nesta etapa</p>
            <p class="text-[11px] text-center px-4 mt-1">Arraste um lead aqui</p>
          </div>

          <!-- Cards -->
          <div 
            v-for="lead in getLeadsByStatus(col.id)" 
            :key="lead.id"
            draggable="true"
            @dragstart="onDragStart($event, lead.id)"
            class="p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all duration-300 overflow-hidden relative"
            :class="checkLeadDue(lead) ? 'bg-orange-50/50 border-2 border-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white border border-gray-200 hover:border-gray-300'"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-1.5 font-bold text-gray-800">
                <GripVertical class="w-4 h-4 text-gray-400" />
                {{ lead.name }}
              </div>
              <div class="flex items-center gap-0.5">
                <button @click="editLead(lead)" class="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors" title="Editar">
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button @click="confirmDeleteLead(lead.id)" class="p-1 text-gray-400 hover:text-red-500 rounded transition-colors" title="Excluir">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div class="ml-5.5 flex flex-col gap-1.5">
              <div class="text-xs font-bold" :class="getScoreColor(lead.products.length)">
                {{ lead.products.length }}/10 produtos
              </div>
              <div class="text-xs text-gray-500 flex items-center gap-1">
                <Calendar class="w-3 h-3" /> {{ lead.date }}
              </div>
            </div>

            <!-- Card Footer Actions -->
            <div class="mt-3 flex flex-col gap-2">
              <!-- Follow-up Alert Button -->
              <button 
                v-if="checkLeadDue(lead)" 
                @click.stop="renewReminder(lead)" 
                class="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wide rounded shadow-sm transition-colors flex items-center justify-center gap-1.5 animate-pulse"
              >
                <BellRing class="w-3.5 h-3.5" /> Fazer Follow-up
              </button>

              <!-- Close Sale Button (Penultimate Column) -->
              <button 
                v-if="col.id === 'aguardando'" 
                @click.stop="initiateCloseSale(lead)" 
                class="w-full py-1.5 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold uppercase tracking-wide rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 class="w-3.5 h-3.5" /> Fechar venda - aprovar
              </button>

              <!-- Advance Lead Button (Other columns) -->
              <button 
                v-else-if="col.id !== 'aprovado'" 
                @click.stop="advanceLead(lead)" 
                class="w-full py-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 text-[11px] font-bold uppercase tracking-wide rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Lead concluiu - avançar <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <!-- Column Footer -->
        <div class="p-3 border-t border-gray-100 flex-shrink-0">
          <button @click="openModalWithStatus(col.id)" class="w-full py-2 border border-gray-200 border-dashed rounded-md text-sm text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center gap-1">
            <Plus class="w-4 h-4" /> Adicionar card
          </button>
        </div>
      </div>
    </div>

    <!-- List Board -->
    <div v-else-if="viewMode === 'lista'" class="flex-1 overflow-auto bg-white border border-gray-200 rounded-xl shadow-sm mb-4">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
            <th class="p-4 font-semibold">Cliente</th>
            <th class="p-4 font-semibold">Contato</th>
            <th class="p-4 font-semibold">Data</th>
            <th class="p-4 font-semibold">Produtos</th>
            <th class="p-4 font-semibold">Status</th>
            <th class="p-4 font-semibold text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr v-if="leads.length === 0">
            <td colspan="6" class="p-8 text-center text-gray-500">Nenhum acompanhamento de lead criado ainda.</td>
          </tr>
          <tr v-for="lead in leads" :key="lead.id" class="transition-colors" :class="checkLeadDue(lead) ? 'bg-orange-50/50' : 'hover:bg-gray-50'">
            <td class="p-4 font-medium text-gray-900">
              <div class="flex items-center gap-2">
                <div v-if="checkLeadDue(lead)" class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                {{ lead.name }}
              </div>
            </td>
            <td class="p-4 text-gray-600">
              <div v-if="lead.email">{{ lead.email }}</div>
              <div v-if="lead.phone">{{ lead.phone }}</div>
              <span v-if="!lead.email && !lead.phone" class="text-gray-400">Nenhum</span>
            </td>
            <td class="p-4 text-gray-600">{{ lead.date }}</td>
            <td class="p-4">
              <span class="font-semibold" :class="getScoreColor(lead.products.length)">
                {{ lead.products.length }}/10
              </span>
            </td>
            <td class="p-4">
              <select 
                v-model="lead.status" 
                class="text-xs font-bold px-2 py-1.5 rounded-md border border-gray-200 outline-none hover:border-indigo-300 focus:border-indigo-500 transition-colors"
                :class="columns.find(c => c.id === lead.status)?.textClass"
              >
                <option v-for="col in columns" :key="col.id" :value="col.id">{{ col.title }}</option>
              </select>
            </td>
            <td class="p-4 text-right flex items-center justify-end gap-1">
              <button v-if="checkLeadDue(lead)" @click="renewReminder(lead)" class="p-1.5 text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors shadow-sm animate-pulse mr-2" title="Fazer Follow-up">
                <BellRing class="w-4 h-4" />
              </button>
              <button @click="editLead(lead)" class="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition-colors" title="Editar">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="confirmDeleteLead(lead.id)" class="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Excluir">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary Footer -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-around gap-6 mt-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Users class="w-5 h-5" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ leads.length }}</div>
          <div class="text-xs text-gray-500 font-medium whitespace-nowrap">Leads no total</div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Clock class="w-5 h-5" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ getLeadsByStatus('contratando').length + getLeadsByStatus('aguardando').length }}</div>
          <div class="text-xs text-gray-500 font-medium whitespace-nowrap">Em andamento</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ getLeadsByStatus('aprovado').length }}</div>
          <div class="text-xs text-gray-500 font-medium whitespace-nowrap">Aprovados</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Gauge class="w-5 h-5" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ leads.length ? Math.round((getLeadsByStatus('aprovado').length / leads.length) * 100) : 0 }}%</div>
          <div class="text-xs text-gray-500 font-medium whitespace-nowrap">Taxa de aprovação</div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Lead -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-gray-50 rounded-2xl shadow-xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden">
        
        <!-- Modal Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              <UserPlus v-if="!form.id" class="w-6 h-6" />
              <Pencil v-else class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ form.id ? 'Editar acompanhamento' : 'Novo acompanhamento de lead' }}</h2>
              <p class="text-sm text-gray-500">Cadastre o lead e selecione os produtos que ajudarão a construir relacionamento com o banco.</p>
            </div>
          </div>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <!-- Top Section -->
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Left Col: Forms & Products -->
            <div class="flex-1 flex flex-col gap-6">
              
              <!-- Lead Data -->
              <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div class="flex items-center gap-2 font-bold text-gray-800 mb-4">
                  <User class="w-5 h-5 text-indigo-500" /> Dados do lead
                </div>
                <div class="flex flex-col gap-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Nome do cliente <span class="text-red-500">*</span></label>
                    <input v-model="form.name" type="text" placeholder="Ex.: Cacá" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">E-mail <span class="text-gray-400 font-normal">(opcional)</span></label>
                    <input v-model="form.email" type="email" placeholder="Ex.: cliente@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Telefone <span class="text-gray-400 font-normal">(opcional)</span></label>
                    <input v-model="form.phone" type="tel" placeholder="Ex.: (11) 99999-9999" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                  </div>
                </div>
              </div>

              <!-- Products -->
              <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div class="flex items-center gap-2 font-bold text-gray-800 mb-2">
                  <Landmark class="w-5 h-5 text-indigo-500" /> Produtos a indicar
                </div>
                <p class="text-sm text-gray-500 mb-4">Selecione os produtos que serão recomendados para melhorar o relacionamento bancário e reduzir a restrição por rating.</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    v-for="prod in productsList" 
                    :key="prod.id"
                    class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors"
                    :class="form.products.includes(prod.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'"
                  >
                    <div class="flex items-center gap-3">
                      <component :is="prod.icon" class="w-5 h-5" :class="prod.color" />
                      <span class="text-sm font-bold text-gray-700">{{ prod.name }}</span>
                    </div>
                    <div class="w-5 h-5 rounded-md border flex items-center justify-center transition-colors" :class="form.products.includes(prod.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'">
                      <Check v-if="form.products.includes(prod.id)" class="w-3.5 h-3.5 text-white" />
                    </div>
                    <input type="checkbox" :value="prod.id" v-model="form.products" class="hidden" />
                  </label>
                </div>
              </div>

            </div>

            <!-- Right Col: Score -->
            <div class="w-full lg:w-96 shrink-0 flex flex-col gap-6">
              <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
                <h3 class="font-bold text-gray-800 mb-6">Seu score de relacionamento</h3>
                
                <!-- Gauge Chart -->
                <div class="w-48 mb-4 flex flex-col items-center">
                  <div class="w-full h-24">
                    <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible">
                      <path d="M 10 50 A 40 40 0 0 1 30 15.35" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="butt" />
                      <path d="M 30 15.35 A 40 40 0 0 1 50 10" fill="none" stroke="#eab308" stroke-width="12" stroke-linecap="butt" />
                      <path d="M 50 10 A 40 40 0 0 1 70 15.35" fill="none" stroke="#84cc16" stroke-width="12" stroke-linecap="butt" />
                      <path d="M 70 15.35 A 40 40 0 0 1 90 50" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="butt" />
                      
                      <!-- Needle -->
                      <g :style="{ transform: `rotate(${gaugeRotation}deg)`, transformOrigin: '50px 50px', transition: 'transform 0.5s ease-out' }">
                        <circle cx="50" cy="50" r="4" fill="#1f2937" />
                        <path d="M 48 50 L 52 50 L 50 15 Z" fill="#1f2937" />
                      </g>
                    </svg>
                  </div>
                  <div class="flex flex-col items-center mt-2">
                    <span class="text-3xl font-black text-gray-900 leading-none">{{ form.products.length }}</span>
                    <span class="text-sm text-gray-500 font-medium">de 10</span>
                  </div>
                </div>

                <div class="text-center mt-6">
                  <h4 class="font-bold text-lg mb-1" :class="scoreStatus.color">{{ scoreStatus.text }}</h4>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ scoreStatus.desc }}</p>
                </div>
              </div>

              <!-- Faixas de status -->
              <div>
                <h3 class="font-bold text-gray-800 mb-3 text-sm">Faixas de status</h3>
                <div class="flex flex-col gap-3">
                  <div class="p-3 rounded-lg border bg-red-50 border-red-200">
                    <div class="flex items-center gap-1.5 font-bold text-red-600 text-sm mb-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-red-600"></div> 0-2 Relacionamento fraco
                    </div>
                    <p class="text-[11px] text-gray-600 leading-snug">Poucos vínculos com o banco. Maior chance de restrição por rating.</p>
                  </div>
                  <div class="p-3 rounded-lg border bg-amber-50 border-amber-200">
                    <div class="flex items-center gap-1.5 font-bold text-amber-500 text-sm mb-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div> 3-5 Relacionamento em construção
                    </div>
                    <p class="text-[11px] text-gray-600 leading-snug">Já existem sinais positivos, mas ainda há espaço para fortalecer o perfil.</p>
                  </div>
                  <div class="p-3 rounded-lg border bg-lime-50 border-lime-200">
                    <div class="flex items-center gap-1.5 font-bold text-lime-600 text-sm mb-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-lime-600"></div> 6-8 Bom relacionamento
                    </div>
                    <p class="text-[11px] text-gray-600 leading-snug">O cliente demonstra vínculo consistente e melhora de percepção bancária.</p>
                  </div>
                  <div class="p-3 rounded-lg border bg-emerald-50 border-emerald-200">
                    <div class="flex items-center gap-1.5 font-bold text-emerald-600 text-sm mb-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> 9-10 Relacionamento forte
                    </div>
                    <p class="text-[11px] text-gray-600 leading-snug">Perfil robusto, com excelente potencial de aprovação e menor restrição por rating.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Section: Follow-up Reminders -->
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2 font-bold text-gray-800">
                <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Bell class="w-4 h-4" />
                </div>
                Lembretes de follow-up
              </div>
              <button @click="form.reminderPaused = !form.reminderPaused" class="px-3 py-1.5 text-xs font-bold border rounded-md transition-colors" :class="form.reminderPaused ? 'bg-gray-100 text-gray-600 border-gray-300' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'">
                <Pause v-if="!form.reminderPaused" class="w-3.5 h-3.5 inline mr-1" />
                <Play v-else class="w-3.5 h-3.5 inline mr-1" />
                {{ form.reminderPaused ? 'Retomar lembretes' : 'Pausar lembretes' }}
              </button>
            </div>
            <p class="text-sm text-gray-500 mb-5">Você recebe um alerta visual para acionar este lead enquanto ele estiver em etapa ativa.</p>
            
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-1">
                <h4 class="text-xs font-bold text-gray-700 mb-3">Frequência dos lembretes</h4>
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="form.reminderFreqType = 'default'"
                    class="px-4 py-2 text-sm font-medium border rounded-lg transition-colors whitespace-nowrap"
                    :class="form.reminderFreqType === 'default' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                  >
                    Padrão — a cada 3 dia(s)
                  </button>
                  <button 
                    @click="form.reminderFreqType = 'custom'"
                    class="px-4 py-2 text-sm font-medium border rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
                    :class="form.reminderFreqType === 'custom' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                  >
                    Personalizado — a cada 
                    <input 
                      v-if="form.reminderFreqType === 'custom'" 
                      v-model.number="form.reminderCustomDays" 
                      type="number" min="1" 
                      class="w-12 px-1 text-center border-b border-indigo-400 bg-transparent outline-none focus:border-indigo-600"
                      @click.stop
                    />
                    <span v-else class="font-bold">{{ form.reminderCustomDays || 20 }}</span>
                    dia(s)
                  </button>
                </div>
              </div>
              
              <div class="w-full md:w-64 bg-gray-50 p-3 rounded-lg border border-gray-100 shrink-0">
                <h4 class="text-xs font-bold text-gray-700 mb-2">Próximos lembretes previstos</h4>
                <ul v-if="!form.reminderPaused" class="text-sm text-gray-600 space-y-2">
                  <li v-for="(date, i) in nextReminderDatesPreview" :key="i" class="flex items-center gap-2">
                    <Mail class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {{ date.formatted }}
                    <span v-if="i === 0" class="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold leading-none">próximo</span>
                  </li>
                </ul>
                <div v-else class="text-sm text-gray-500 italic py-2">
                  Lembretes pausados.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <button 
              v-if="form.id && form.status === 'aguardando'" 
              @click="advanceAndSaveLead" 
              class="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 class="w-4 h-4" /> Fechar venda - aprovar
            </button>
            <button 
              v-else-if="form.id && form.status !== 'aprovado'" 
              @click="advanceAndSaveLead" 
              class="py-2 px-4 border border-indigo-200 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors flex items-center gap-1.5"
            >
              Lead concluiu - avançar <ArrowRight class="w-4 h-4" />
            </button>
          </div>
          <div class="flex items-center gap-3">
            <button @click="closeModal" class="px-5 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button @click="saveLead" class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
              <UserPlus v-if="!form.id" class="w-4 h-4" />
              <Save v-else class="w-4 h-4" />
              {{ form.id ? 'Salvar alterações' : 'Criar lead' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmação de Exclusão -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 flex flex-col gap-4 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">Excluir lead</h3>
        <p class="text-sm text-gray-500">Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.</p>
        <div class="flex gap-3 mt-4">
          <button @click="cancelDeleteLead" class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button @click="executeDeleteLead" class="flex-1 py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Fechar Venda -->
    <div v-if="showCloseSaleModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 relative">
        <button @click="showCloseSaleModal = false" class="absolute top-4 right-4 p-1 text-gray-400 hover:bg-gray-100 rounded-full">
          <X class="w-5 h-5" />
        </button>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Fechar venda de {{ leadToClose?.name }} 🎉</h3>
        <p class="text-sm text-gray-500 mb-6">Informe o valor do imóvel para concluir o negócio e aprovar o lead.</p>
        
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Valor do imóvel (R$)</label>
            <input v-model.number="saleForm.propertyValue" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Comissão (%)</label>
            <input v-model.number="saleForm.commissionRate" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
        </div>

        <div class="mt-6 bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100">
          <span class="text-sm font-bold text-green-800">Sua comissão</span>
          <span class="text-xl font-black text-green-600">{{ formatCurrency(computedCommission) }}</span>
        </div>

        <button @click="confirmCloseSale" class="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
          <Trophy class="w-5 h-5" /> Concluir venda
        </button>
      </div>
    </div>

    <!-- Modal Parabéns (Sucesso) -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-8 relative text-center">
        <button @click="showSuccessModal = false" class="absolute top-4 right-4 p-1 text-gray-400 hover:bg-gray-100 rounded-full">
          <X class="w-5 h-5" />
        </button>
        
        <div class="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy class="w-10 h-10" />
        </div>
        
        <h3 class="text-2xl font-black text-gray-900 mb-2">Parabéns! 🎊</h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">Você fechou mais uma venda com <strong>{{ closedLead?.name }}</strong> e está fazendo a diferença no mercado imobiliário — ajudando pessoas a realizarem o sonho da casa própria.</p>
        
        <div class="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
          <div class="text-xs font-bold text-green-800 uppercase tracking-widest mb-1">Sua Comissão</div>
          <div class="text-3xl font-black text-green-600">{{ formatCurrency(closedLead?.commission) }}</div>
        </div>
        
        <p class="text-xs text-gray-500 leading-relaxed mb-6">Essa comissão é totalmente merecida. Lembre-se: os seus ganhos são proporcionais ao <strong>conhecimento</strong> que você acumula e às <strong>ferramentas</strong> que você domina para acelerar os seus resultados. Continue subindo! 🚀</p>
        
        <button @click="showSuccessModal = false" class="py-2.5 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import confetti from 'canvas-confetti';
import { 
  LayoutDashboard, List, Bell, Play, Plus, Users, Clock, CheckCircle2, Gauge, 
  UserPlus, X, User, Landmark, Command, Droplet, Shield, ShieldCheck, 
  PiggyBank, Link, TrendingUp, CreditCard, Star, Check, GripVertical, Calendar,
  Mail, FileText, CheckCircle, Pencil, Trash2, Save, AlertTriangle, Pause, BellRing, Menu, ArrowRight, Trophy
} from '@lucide/vue';

// --- State ---
const leads = ref([]);
const viewMode = ref('kanban'); // 'kanban' ou 'lista'
const isModalOpen = ref(false);
const showDeleteConfirm = ref(false);
const leadToDelete = ref(null);
const initialStatus = ref('novo');

const showCloseSaleModal = ref(false);
const showSuccessModal = ref(false);
const leadToClose = ref(null);
const closedLead = ref(null);

const saleForm = reactive({
  propertyValue: null,
  commissionRate: 3
});

const computedCommission = computed(() => {
  return (saleForm.propertyValue || 0) * ((saleForm.commissionRate || 0) / 100);
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

const form = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  products: [],
  status: 'novo',
  reminderFreqType: 'default',
  reminderCustomDays: 20,
  reminderPaused: false,
  lastContactDate: null,
  createdAt: null
});

// --- Constants ---
const productsList = [
  { id: 'conta', name: 'Conta salário', icon: Landmark, color: 'text-indigo-500' },
  { id: 'pix', name: 'PIX CPF', icon: Command, color: 'text-teal-500' },
  { id: 'debito', name: 'Débito de contas (água, luz, telefone)', icon: Droplet, color: 'text-blue-500' },
  { id: 'vida', name: 'Seguro de vida mensal', icon: Shield, color: 'text-emerald-500' },
  { id: 'residencial', name: 'Seguro residencial mensal', icon: ShieldCheck, color: 'text-emerald-500' },
  { id: 'capitalizacao', name: 'Capitalização', icon: PiggyBank, color: 'text-rose-500' },
  { id: 'open', name: 'Open Finance', icon: Link, color: 'text-cyan-500' },
  { id: 'aplicacao', name: 'Aplicação (CDB, LCI)', icon: TrendingUp, color: 'text-purple-500' },
  { id: 'cartao', name: 'Cartão de crédito', icon: CreditCard, color: 'text-blue-500' },
  { id: 'previdencia', name: 'Previdência privada', icon: Star, color: 'text-pink-500' },
];

const columns = [
  { id: 'novo', title: 'Novo lead', desc: 'Leads que ainda não iniciaram o processo.', textClass: 'text-red-500', bgClass: 'bg-red-50', borderClass: 'bg-red-500', icon: Mail },
  { id: 'contratando', title: 'Contratando produtos', desc: 'Produtos em contratação e análise.', textClass: 'text-amber-500', bgClass: 'bg-amber-50', borderClass: 'bg-amber-500', icon: FileText },
  { id: 'aguardando', title: 'Aguardando rating', desc: 'Aguardando retorno do banco para reanálise.', textClass: 'text-blue-500', bgClass: 'bg-blue-50', borderClass: 'bg-blue-500', icon: Clock },
  { id: 'aprovado', title: 'Aprovado', desc: 'Leads aprovados e finalizados.', textClass: 'text-emerald-500', bgClass: 'bg-emerald-50', borderClass: 'bg-emerald-500', icon: CheckCircle },
];

// --- Computed ---
const gaugeRotation = computed(() => {
  // -90 is 0, 90 is 10
  return (form.products.length / 10) * 180 - 90;
});

const scoreStatus = computed(() => {
  const score = form.products.length;
  if (score <= 2) return { text: 'Relacionamento fraco', color: 'text-red-600', desc: 'Poucos vínculos com o banco. Maior chance de restrição por rating.' };
  if (score <= 5) return { text: 'Relacionamento em construção', color: 'text-amber-500', desc: 'Já existem sinais positivos, mas ainda há espaço para fortalecer o perfil.' };
  if (score <= 8) return { text: 'Bom relacionamento', color: 'text-lime-600', desc: 'O cliente demonstra vínculo consistente e melhora de percepção bancária.' };
  return { text: 'Relacionamento forte', color: 'text-emerald-600', desc: 'Perfil robusto, com excelente potencial de aprovação e menor restrição por rating.' };
});

const nextReminderDatesPreview = computed(() => {
  if (form.reminderPaused || form.status === 'aprovado') return [];
  const baseDate = form.lastContactDate ? new Date(form.lastContactDate) : new Date();
  const interval = form.reminderFreqType === 'custom' ? (form.reminderCustomDays || 1) : 3;
  
  const dates = [];
  let current = new Date(baseDate);
  for (let i = 0; i < 4; i++) {
    current.setDate(current.getDate() + interval);
    const dayName = current.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const dateStr = current.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dates.push({
      formatted: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}., ${dateStr}`
    });
  }
  return dates;
});

// --- Methods ---
const checkLeadDue = (lead) => {
  if (lead.reminderPaused || lead.status === 'aprovado') return false;
  const baseDate = lead.lastContactDate ? new Date(lead.lastContactDate) : new Date(lead.createdAt || new Date());
  const interval = lead.reminderFreqType === 'custom' ? (lead.reminderCustomDays || 1) : 3;
  
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + interval);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  nextDate.setHours(0,0,0,0);
  
  return nextDate <= today;
};

const renewReminder = (lead) => {
  lead.lastContactDate = new Date().toISOString();
};
const advanceLead = (lead) => {
  const currentIndex = columns.findIndex(c => c.id === lead.status);
  if (currentIndex < columns.length - 1) {
    lead.status = columns[currentIndex + 1].id;
  }
};

const advanceAndSaveLead = () => {
  if (form.status === 'aguardando') {
    saveLead();
    const savedLead = leads.value.find(l => l.id === form.id);
    initiateCloseSale(savedLead);
    return;
  }
  const currentIndex = columns.findIndex(c => c.id === form.status);
  if (currentIndex < columns.length - 1) {
    form.status = columns[currentIndex + 1].id;
  }
  saveLead();
};

const initiateCloseSale = (lead) => {
  leadToClose.value = lead;
  saleForm.propertyValue = lead.saleValue || null;
  saleForm.commissionRate = lead.commissionRate || 3;
  showCloseSaleModal.value = true;
};

const confirmCloseSale = () => {
  if (!leadToClose.value) return;
  
  leadToClose.value.status = 'aprovado';
  leadToClose.value.saleValue = saleForm.propertyValue;
  leadToClose.value.commissionRate = saleForm.commissionRate;
  leadToClose.value.commission = computedCommission.value;
  
  closedLead.value = leadToClose.value;
  showCloseSaleModal.value = false;
  showSuccessModal.value = true;
  
  fireConfetti();
};

const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999
  });
};

const getLeadsByStatus = (status) => {
  return leads.value.filter(l => l.status === status);
};

const getScoreColor = (score) => {
  if (score <= 2) return 'text-red-600';
  if (score <= 5) return 'text-amber-500';
  if (score <= 8) return 'text-lime-600';
  return 'text-emerald-600';
};

const openModal = () => {
  openModalWithStatus('novo');
};

const openModalWithStatus = (status) => {
  initialStatus.value = status;
  form.id = null;
  form.name = '';
  form.email = '';
  form.phone = '';
  form.products = [];
  form.status = status;
  form.reminderFreqType = 'default';
  form.reminderCustomDays = 20;
  form.reminderPaused = false;
  form.lastContactDate = new Date().toISOString();
  form.createdAt = new Date().toISOString();
  isModalOpen.value = true;
};

const editLead = (lead) => {
  form.id = lead.id;
  form.name = lead.name;
  form.email = lead.email;
  form.phone = lead.phone;
  form.products = [...lead.products];
  form.status = lead.status;
  form.reminderFreqType = lead.reminderFreqType || 'default';
  form.reminderCustomDays = lead.reminderCustomDays || 20;
  form.reminderPaused = lead.reminderPaused || false;
  form.lastContactDate = lead.lastContactDate || lead.createdAt || new Date().toISOString();
  form.createdAt = lead.createdAt || new Date().toISOString();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveLead = () => {
  if (!form.name.trim()) {
    alert("O nome do cliente é obrigatório!");
    return;
  }

  if (form.id) {
    const index = leads.value.findIndex(l => l.id === form.id);
    if (index !== -1) {
      leads.value[index].name = form.name;
      leads.value[index].email = form.email;
      leads.value[index].phone = form.phone;
      leads.value[index].products = [...form.products];
      leads.value[index].status = form.status;
      leads.value[index].reminderFreqType = form.reminderFreqType;
      leads.value[index].reminderCustomDays = form.reminderCustomDays;
      leads.value[index].reminderPaused = form.reminderPaused;
      leads.value[index].lastContactDate = form.lastContactDate;
      leads.value[index].createdAt = form.createdAt;
    }
  } else {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newLead = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      products: [...form.products],
      status: form.status,
      date: dateStr,
      reminderFreqType: form.reminderFreqType,
      reminderCustomDays: form.reminderCustomDays,
      reminderPaused: form.reminderPaused,
      lastContactDate: form.lastContactDate || new Date().toISOString(),
      createdAt: form.createdAt || new Date().toISOString()
    };

    leads.value.push(newLead);
  }
  
  closeModal();
};

const addTestLead = () => {
  const testLead = {
    id: Date.now().toString(),
    name: 'Joaozinho de Teste',
    email: 'joao@teste.com',
    phone: '11999999999',
    products: ['conta', 'pix', 'debito', 'vida'],
    status: 'novo',
    date: '12/07/2026'
  };
  leads.value.push(testLead);
};


const confirmDeleteLead = (id) => {
  leadToDelete.value = id;
  showDeleteConfirm.value = true;
};

const executeDeleteLead = () => {
  if (leadToDelete.value) {
    leads.value = leads.value.filter(l => l.id !== leadToDelete.value);
    showDeleteConfirm.value = false;
    leadToDelete.value = null;
  }
};

const cancelDeleteLead = () => {
  showDeleteConfirm.value = false;
  leadToDelete.value = null;
};

// Drag & Drop
const onDragStart = (e, leadId) => {
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('leadId', leadId);
};

const onDrop = (e, statusId) => {
  const leadId = e.dataTransfer.getData('leadId');
  const lead = leads.value.find(l => l.id === leadId);
  if (lead) {
    lead.status = statusId;
  }
};

// --- Lifecycle & Persistence ---
onMounted(() => {
  const saved = localStorage.getItem('crm_leads');
  if (saved) {
    try {
      leads.value = JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao carregar leads do localStorage", e);
    }
  }
});

watch(leads, (newVal) => {
  localStorage.setItem('crm_leads', JSON.stringify(newVal));
}, { deep: true });

</script>
