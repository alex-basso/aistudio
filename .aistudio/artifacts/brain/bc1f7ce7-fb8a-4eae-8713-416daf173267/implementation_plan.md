# Trilhas Farroupilha - Organizador de Passeios de Moto & Trilheiros

Aplicativo dedicado à comunidade off-road e motociclistas para planejamento, gestão e confirmação de passeios aos sábados na região de Farroupilha (Serra Gaúcha), com cronograma de horários, gestão de participantes com contatos de segurança e mapeamento interativo de rotas.

## Revisão do Usuário & Decisões Confirmadas

> [!IMPORTANT]
> As decisões de produto e design foram alinhadas com base nas preferências selecionadas:

- **Estilo Visual Confirmado**: Tema escuro aventureiro off-road com acentos em laranja terra cota / rally (`#F97316` / `#EA580C`) e superfícies carvão grafite texturizadas, transmitindo a adrenalina do barro e das trilhas da serra.
- **Campos de Participantes Confirmados**: Nome completo, telefone / WhatsApp, contato de emergência (nome e telefone de suporte) e nível de experiência em trilhas (Iniciante, Intermediário, Pro / Hard Enduro), além do modelo opcional da moto.
- **Catálogo de Rotas de Farroupilha Confirmado**: Integração de roteiros clássicos do interior de Farroupilha (Salto Ventoso, Linha Julieta, Nova Milano e Rota dos Tropeiros) combinados com ferramenta para criar e salvar novas rotas personalizadas.

---

## 1. Visão Geral & Conceito Principal

### O que o aplicativo faz
O **Trilhas Farroupilha** centraliza a rotina dos grupos de motos e trilheiros que se reúnem aos sábados para explorar as estradas de chão, vales, rios e pedreiras do interior de Farroupilha/RS. O organizador pode:
1. Agendar passeios específicos para qualquer sábado (ou navegar pelo calendário dos próximos sábados).
2. Definir horário de concentração, horário de partida e horário estimado de retorno/chegada, além do ponto de encontro (postos, praças ou sedes).
3. Selecionar ou montar a rota proposta para o dia, detalhando distância em km, tipo de piso predominante (barro, cascalho, pedras, travessia de rio) e waypoints/paradas de abastecimento e almoço colonial.
4. Cadastrar e gerenciar a lista de participantes com status de presença, experiência na trilha e contato de emergência.
5. Gerar o resumo do briefing formatado para envio direto no WhatsApp do grupo de trilheiros e conferir checklist de segurança.

### Público-Alvo
- Grupos e motoclubes de motocross, trilha, big trail e enduro da Serra Gaúcha e região metropolitana que sobem para Farroupilha aos fins de semana.
- Líderes de comboio e organizadores de passeios de sábado que precisam de controle claro sobre quem vai, segurança dos participantes e itinerário fechado.

---

## 2. Experiência do Usuário & Design Visual

### Fluxos Principais
1. **Painel de Passeios dos Sábados**:
   - Destaque para o próximo sábado com contagem regressiva, status do passeio e resumo da rota escolhida.
   - Alternância entre passeios futuros, criação de novo passeio e histórico de trilhas passadas.
2. **Criação / Edição do Passeio**:
   - Seletor de sábado facilitado (com preenchimento rápido para o próximo sábado).
   - Definição de horários: Horário de Encontro, Horário de Saída (Largar na trilha) e Previsão de Chegada.
   - Ponto de saída e chegada em Farroupilha (ex: Posto Trevo Farroupilha, Caravaggio, Nova Milano).
3. **Seleção e Criação de Rota Proposta**:
   - Catálogo integrado com rotas clássicas do interior de Farroupilha:
     - *Trilha do Salto Ventoso*: cachoeiras, barro moderado, single tracks e paradas históricas.
     - *Linha Julieta & Desfiladeiros*: subidas íngremes, pedras e travessia de lajeados.
     - *Circuito Nova Milano & Vale Trentino*: cascalho batido, estradões para big trails e pontos gastronômicos.
     - *Rota dos Tropeiros & Caminhos de Ferro*: trilha mista com trechos de hard enduro.
   - Opção de criar rota livre com nome, paradas/waypoints intermediários, estimativa de km e nível de dificuldade.
   - Visualizador esquemático e interativo de waypoints com elevação estimada e paradas demarcadas.
4. **Gerenciador de Participantes & Segurança**:
   - Cadastro ágil de participantes com Nome, Telefone, Contato de Emergência e Nível de Habilidade.
   - Status de presença em tempo real: Confirmado, Aguardando, Desistente, Presente no local.
   - Indicador de capacidade do grupo para garantir segurança na trilha.
5. **Briefing do Comboio & Compartilhamento**:
   - Botão de 1 clique para gerar texto estruturado com emojis do briefing para o WhatsApp do grupo.
   - Checklist de equipamentos obrigatórios (capacete enduro, botas de trilha, ferramentas, água/camelbak, kit remendo).

### Identidade Visual & Tema
- **Paleta de Cores**:
  - Fundo principal: Grafite e carvão profundo (`#0F1115` e `#181B20`).
  - Superfícies dos cards: Superfícies texturizadas escuras (`#20242B`) com bordas sutis (`#2D323C`).
  - Destaques & Acentos: Laranja Off-Road KTM/Trail (`#F97316` e `#EA580C`) para ações primárias e badges de destaque.
  - Alertas de Dificuldade: Verde musgo (Leve), Âmbar terroso (Média), Vermelho lama (Pesada/Hard Enduro).
- **Tipografia**:
  - Títulos: Fonte robusta e atlética para expressar energia e movimento.
  - Textos e dados: Tipografia nítida com numerais tabulares para horários, quilometragens e telefones.
- **Ergonomia Mobile-First & Desktop**:
  - Botões com áreas de toque amplas ($\ge 44\text{px}$) pensados para uso fácil em celulares no ponto de encontro.
  - Layout responsivo que aproveita o espaço em telas grandes com visão simultânea da rota, cronograma e participantes.

---

## 3. Decisões de Produto & Arquitetura de Dados

- **Persistência de Dados**:
  - Armazenamento em `localStorage` com schema tipado em TypeScript, garantindo funcionamento 100% offline no meio da trilha sem perda de dados caso falte sinal 4G/5G no interior de Farroupilha.
  - Pré-carregamento com passeios de demonstração realistas e rotas consagradas de Farroupilha logo na inicialização.
- **Exportação & Compartilhamento sem atrito**:
  - Integração com `navigator.clipboard` e links `https://wa.me/` com mensagens prontas formatadas em Markdown/WhatsApp.
- **Filtros e Visualização de Rotas**:
  - Visualizador de itinerário com linha do tempo de waypoints, paradas estratégicas de combustível e almoço.

---

## 4. Arquitetura Técnica & Componentes

```
┌───────────────────────────────────────────────────────────────┐
│                     App Container                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Top Bar: Marca "Trilhas Farroupilha", Data, Novo Passeio│  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────┐ ┌───────────────────┐ ┌────────────────┐  │
│  │  Passeio Ativo  │ │ Rota do Dia &     │ │ Participantes  │  │
│  │  (Sábado)       │ │ Waypoints         │ │ & Emergências  │  │
│  │                 │ │                   │ │                │  │
│  │ - Horário Saída │ │ - Salto Ventoso   │ │ - Pilotos (Nomes)│
│  │ - Horário Cheg. │ │ - Nova Milano     │ │ - Contato SOS  │  │
│  │ - Ponto Encontro│ │ - Altimetria / Km │ │ - Nível Trail  │  │
│  │ - Briefing WPP  │ │ - Tipo de Terreno │ │ - Presença Box │  │
│  └─────────────────┘ └───────────────────┘ └────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Modais: [Criar/Editar Passeio] [Cadastrar Participante] │  │
│  │         [Criar Rota Livre]     [Checklist de Segurança] │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Entidades de Dados
- **Ride (Passeio)**: ID, data (sábado), título, ponto de saída, horário de encontro, horário de saída, horário previsto de retorno, rota selecionada, briefing, notas de apoio, status.
- **Route (Rota)**: ID, nome, região/bairro de Farroupilha, distância total (km), dificuldade (Iniciante / Média / Hard), tipo de piso (estrada de chão, barro, pedras, travessia de rio), waypoints ordenados com horários sugeridos.
- **Participant (Participante)**: ID, passeioId, nome, telefone, contatoEmergenciaNome, contatoEmergenciaTelefone, nivelExperiencia, modeloMoto, presencaConfirmada (sim/não/aguardando).
