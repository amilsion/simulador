<template>
  <div class="flex flex-col items-center gap-6 p-6 min-h-screen bg-[#f8f9fa]">
    
    <div class="w-full max-w-5xl flex flex-col gap-6">
      
      <!-- Top Alert Banner -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <p class="text-amber-800 text-sm font-medium leading-relaxed">
          <strong class="font-bold">Dica profissional:</strong> Realize todas as consultas antes de enviar o cliente para análise da Caixa. Pendências identificadas previamente aumentam significativamente a taxa de aprovação e evitam reprovações desnecessárias.
        </p>
      </div>

      <!-- Categories Loop -->
      <div v-for="(category, idx) in categories" :key="idx" class="flex flex-col gap-3">
        <!-- Category Header -->
        <div class="flex items-center gap-2 mt-4">
          <component :is="category.icon" class="w-5 h-5" :class="category.iconColor" />
          <h2 class="text-lg font-bold text-gray-800">{{ category.title }}</h2>
        </div>

        <!-- Grid of Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a v-for="(link, lIdx) in category.links" :key="lIdx" 
             :href="link.url" target="_blank" rel="noopener noreferrer"
             class="group relative flex flex-col p-5 rounded-xl border transition-all hover:shadow-md cursor-pointer h-full"
             :class="link.cardClass || 'bg-white border-gray-200 hover:border-gray-300'">
             
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold text-gray-900" :class="link.titleClass">{{ link.title }}</h3>
                <span v-if="link.badge" 
                      class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full"
                      :class="link.badgeClass">
                  {{ link.badge }}
                </span>
              </div>
              <ExternalLink class="w-4 h-4 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>

            <p class="text-[13px] text-gray-600 leading-relaxed mb-4" :class="link.textClass">
              {{ link.description }}
            </p>

            <!-- Optional Steps section -->
            <div v-if="link.steps && link.steps.length > 0" class="mt-auto pt-3 border-t border-black/5">
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Passo a passo:</span>
              <ul class="flex flex-col gap-1.5">
                <li v-for="(step, sIdx) in link.steps" :key="sIdx" class="flex items-start gap-2 text-[12px] text-gray-600">
                  <span class="flex items-center justify-center w-4 h-4 rounded-full bg-black/10 text-[10px] font-bold shrink-0 mt-0.5">{{ sIdx + 1 }}</span>
                  <span class="leading-tight">{{ step }}</span>
                </li>
              </ul>
            </div>
          </a>
        </div>
      </div>

      <!-- Checklist Footer Section -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5 text-amber-600" />
          <h3 class="font-bold text-amber-900">Checklist de consultas recomendadas</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div v-for="(item, i) in checklist" :key="i" class="flex items-center gap-2 text-sm text-amber-800">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
            {{ item }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  ExternalLink, 
  Calculator, 
  FileText, 
  Shield, 
  User, 
  Home, 
  Scale, 
  BookOpen, 
  Building,
  FolderOpen
} from '@lucide/vue';

const categories = [
  {
    title: 'Simulação e Financiamento',
    icon: Calculator,
    iconColor: 'text-blue-500',
    links: [
      {
        title: 'Simulador Habitacional Caixa',
        badge: 'Essencial',
        badgeClass: 'bg-blue-200 text-blue-800',
        cardClass: 'bg-blue-50 border-blue-200',
        titleClass: 'text-blue-900',
        textClass: 'text-blue-800/80',
        description: 'Simulador oficial da Caixa Econômica Federal para financiamento habitacional. Calcule parcelas, prazo e valor financiável.',
        url: 'https://simuladorhabitacao.caixa.gov.br/simulacao'
      },
      {
        title: 'BACEN — Registrato',
        badge: 'Essencial',
        badgeClass: 'bg-blue-200 text-blue-800',
        cardClass: 'bg-blue-50 border-blue-200',
        titleClass: 'text-blue-900',
        textClass: 'text-blue-800/80',
        description: 'Consulte todos os seus relacionamentos financeiros com bancos: dívidas, financiamentos, cheques sem fundo e operações de crédito ativas.',
        url: 'https://registrato.bcb.gov.br/registrato/'
      }
    ]
  },
  {
    title: 'Receita Federal e CPF',
    icon: FileText,
    iconColor: 'text-green-500',
    links: [
      {
        title: 'Consulta de Imposto de Renda (Situação Fiscal)',
        description: 'Verifique a situação do CPF e pendências de declaração de IR na Receita Federal.',
        url: 'https://servicos.receita.fazenda.gov.br/Servicos/consrest/Atual.app/paginas/index.asp'
      },
      {
        title: 'Certidão Negativa de Débitos (CND Conjunta)',
        badge: 'Essencial',
        badgeClass: 'bg-green-200 text-green-800',
        cardClass: 'bg-green-50 border-green-200',
        titleClass: 'text-green-900',
        textClass: 'text-green-800/80',
        description: 'Emita a Certidão Negativa de Débitos Federais (Receita Federal + PGFN). Exigida pela Caixa para financiamentos.',
        url: 'https://servicos.receitafederal.gov.br/servico/certidoes/#/home'
      },
      {
        title: 'e-CAC — Centro Virtual de Atendimento',
        description: 'Acesse serviços da Receita Federal: regularização de CPF, declarações em atraso, parcelamento de débitos.',
        url: 'https://cav.receita.fazenda.gov.br/'
      }
    ]
  },
  {
    title: 'INSS e Benefícios',
    icon: Shield,
    iconColor: 'text-purple-500',
    links: [
      {
        title: 'Consulta PIS/NIT — CNIS',
        description: 'Consulte o número do PIS/NIT do cliente. Necessário para análise de FGTS e benefícios previdenciários.',
        url: 'https://cnisnet.inss.gov.br/',
        steps: [
          'Clique em Cidadão',
          'Clique em Inscrição',
          'Clique em Filiado',
          'Digite os dados do cliente e clique em Continuar → o NIT/PIS aparecerá'
        ]
      },
      {
        title: 'Meu INSS — Extrato e Carta de Concessão',
        badge: 'Essencial',
        badgeClass: 'bg-purple-200 text-purple-800',
        cardClass: 'bg-purple-50 border-purple-200',
        titleClass: 'text-purple-900',
        textClass: 'text-purple-800/80',
        description: 'Acesse o extrato de pagamento de benefícios, carta de concessão e dados cadastrais do cliente. Alguns clientes possuem mais de um benefício ativo.',
        url: 'https://meu.inss.gov.br/',
        steps: [
          'Realize o cadastro do cliente',
          'Baixe os dados cadastrais (necessários para análise bancária)',
          'Verifique todos os benefícios ativos — alguns clientes têm mais de um',
          'Emita a carta de concessão e o extrato de pagamento'
        ]
      }
    ]
  },
  {
    title: 'Trabalho e Renda',
    icon: User,
    iconColor: 'text-orange-500',
    links: [
      {
        title: 'Carteira de Trabalho Digital',
        badge: 'Essencial',
        badgeClass: 'bg-orange-200 text-orange-800',
        cardClass: 'bg-orange-50 border-orange-200',
        titleClass: 'text-orange-900',
        textClass: 'text-orange-800/80',
        description: 'Acesse a Carteira de Trabalho Digital do cliente. Comprova vínculos empregatícios, tempo de serviço e histórico de empregos.',
        url: 'https://servicos.mte.gov.br/'
      },
      {
        title: 'Portal do Empreendedor — MEI',
        description: 'Abertura e regularização de MEI. Formaliza renda autônoma para fins de comprovação de renda na Caixa.',
        url: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor'
      }
    ]
  },
  {
    title: 'Documentos e Registros',
    icon: Home,
    iconColor: 'text-teal-500',
    links: [
      {
        title: 'Certidão de Nascimento / Casamento / Óbito',
        cardClass: 'bg-teal-50 border-teal-200',
        titleClass: 'text-teal-900',
        textClass: 'text-teal-800/80',
        description: 'Emita certidões de estado civil online. Necessárias para análise de crédito, composição familiar e financiamento.',
        url: 'https://registrocivil.org.br/'
      },
      {
        title: 'Matrícula de Imóveis Atualizada',
        cardClass: 'bg-teal-50 border-teal-200',
        titleClass: 'text-teal-900',
        textClass: 'text-teal-800/80',
        description: 'Solicita a certidão de matrícula atualizada do imóvel junto ao Cartório de Registro de Imóveis. Exigida pela Caixa para análise do imóvel.',
        url: 'https://registradores.onr.org.br/'
      }
    ]
  },
  {
    title: 'Protestos e Restrições',
    icon: Scale,
    iconColor: 'text-pink-500',
    links: [
      {
        title: 'Consulta de Protestos — SERASA',
        badge: 'Essencial',
        badgeClass: 'bg-pink-200 text-pink-800',
        cardClass: 'bg-pink-50 border-pink-200',
        titleClass: 'text-pink-900',
        textClass: 'text-pink-800/80',
        description: 'Consulte protestos em cartório. O dono do CPF pode realizar a quitação dos valores em aberto e emolumentos online.',
        url: 'https://site.cenprotnacional.org.br/'
      },
      {
        title: 'SERASA Limpa Nome',
        description: 'Negocie dívidas negativadas no SERASA com descontos de até 90%. Essencial para regularização antes do financiamento.',
        url: 'https://www.serasa.com.br/limpa-nome-online/'
      },
      {
        title: 'Boa Vista SCPC — Consulta Gratuita',
        description: 'Consulte negativações no SCPC (Boa Vista). Sistema independente do SERASA, também consultado pela Caixa.',
        url: 'https://www.consumidorpositivo.com.br/'
      }
    ]
  },
  {
    title: 'Legislação e Programas Habitacionais',
    icon: BookOpen,
    iconColor: 'text-indigo-500',
    links: [
      {
        title: 'Portal Habitação — Caixa Econômica Federal',
        description: 'Informações completas sobre programas habitacionais da Caixa: MCMV, Crédito Associativo, Carta de Crédito FGTS e SBPE.',
        url: 'https://www.caixa.gov.br/habitacao/'
      },
      {
        title: 'Gestão Urbana SP — ZEIS e Programas Habitacionais',
        description: 'Consulte as Zonas Especiais de Interesse Social (ZEIS), ZEU e programas habitacionais do município de São Paulo.',
        url: 'https://gestaourbana.prefeitura.sp.gov.br/'
      },
      {
        title: 'Prefeitura SP — HIS e HMP',
        description: 'Informações sobre Habitação de Interesse Social (HIS) e Habitação de Mercado Popular (HMP) do município de São Paulo.',
        url: 'https://www.prefeitura.sp.gov.br/cidade/secretarias/habitacao/'
      },
      {
        title: 'FGTS Digital — Consulta e Extrato',
        description: 'Consulte o saldo do FGTS, extrato de movimentações e simulação de uso para financiamento habitacional.',
        url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital'
      }
    ]
  },
  {
    title: 'Ferramentas Jurídicas e Fiscais',
    icon: Building,
    iconColor: 'text-slate-500',
    links: [
      {
        title: 'Tesouro Nacional — CADIN',
        description: 'Consulte inscrições no CADIN (Cadastro Informativo de Créditos não Quitados do Setor Público Federal). Impede financiamentos com recursos federais.',
        url: 'https://www.gov.br/tesouronacional/pt-br/cadin'
      },
      {
        title: 'Consumidor.gov.br',
        description: 'Plataforma oficial para reclamações contra empresas. Use para exigir baixa de negativação após quitação de dívidas.',
        url: 'https://consumidor.gov.br/'
      },
      {
        title: 'PGFN — Parcelamento de Dívida Ativa',
        description: 'Parcelamento de dívidas com a Procuradoria Geral da Fazenda Nacional. Regulariza débitos federais que constam no CADIN.',
        url: 'https://www.regularize.pgfn.gov.br/'
      }
    ]
  }
];

const checklist = [
  'Situação do CPF na Receita Federal',
  'Score e negativações no SERASA',
  'Negativações no SCPC / Boa Vista',
  'Protestos em cartório',
  'CND Conjunta (Receita + PGFN)',
  'Extrato FGTS e saldo disponível',
  'Carteira de Trabalho Digital',
  'Matrícula atualizada do imóvel',
  'Registrato (BACEN) — dívidas ativas',
  'CNIS / PIS para beneficiários INSS'
];
</script>
