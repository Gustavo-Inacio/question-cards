# Documentação Técnica - cartasdecasal

O **cartasdecasal.com.br** é um Web App SPA (Single Page Application) desenvolvido para casais, focado em fortalecer a conexão através de perguntas curadas. O sistema utiliza uma estética inspirada no design do Airbnb (limpo, tipografia forte e cantos arredondados) com suporte nativo a Modo Escuro.

---

## 1. Filosofia de Design

- **Estética:** Baseada no `DESIGN.md`, utilizando a cor **Rausch (#ff385c)** como tom de destaque para CTAs e elementos interativos.
- **Tipografia:** Fonte **Inter** para legibilidade e clareza.
- **Espaçamento:** Sistema de grid generoso, priorizando o respiro visual e a hierarquia de informações.
- **Componentes:** Bordas suaves (`rounded-airbnb-lg`), sombras sutis (`shadow-sm`) e transições de cores suaves entre os temas claro e escuro.

---

## 2. Estrutura de Arquivos

- `index.html`: Contém a estrutura de todas as seções (telas) do app.
- `style.css`: Estilizações customizadas para sliders, animações de fade-in e ajustes de Modo Escuro.
- `app.js`: Core da aplicação (Navegação, Lógica de Sorteio, Gerenciamento de Estado e Integrações).
- `perguntas.json`: Banco de dados externo contendo as perguntas divididas por categorias.

---

## 3. Interfaces (Screens)

### 3.1. Landing Page (`screen-home`)
- **Objetivo:** Convencer o casal a iniciar a jornada.
- **Elementos:** Hero section com título chamativo, cards explicativos das funcionalidades e o CTA principal "Montar nosso Baralho".
- **Navegação:** Direciona o usuário para a Tela de Configuração.

### 3.2. Configuração do Baralho (`screen-config`)
- **Funcionalidade:** Ajuste de intensidade através de 4 Sliders (0-100%): *Divertidas, Futuro, Íntimas e Polêmicas*.
- **Ações de Ramificação:**
    - **Jogar com Surpresa:** Gera o baralho e pula direto para o jogo.
    - **Revisar Cartas:** Gera o baralho e abre a lista de edição.
    - **Criar Manualmente:** Abre a tela de revisão totalmente vazia para inserção manual.
- **Navegação:** Botão fixo no topo para retornar à Home.

### 3.3. Revisão do Baralho (`screen-review`)
- **Funcionalidade:** Lista dinâmica de cartas onde o usuário pode:
    - Visualizar as perguntas selecionadas.
    - **Remover:** Excluir perguntas indesejadas via ícone de lixeira (sempre visível).
    - **Regerar:** Sortear um novo conjunto de perguntas baseado nos sliders anteriores.
    - **Adicionar:** Campo de texto para criar perguntas personalizadas do casal.
- **Navegação:** Botão fixo no topo para retornar à Configuração.

### 3.4. Loop do Jogo (`screen-game`)
- **Funcionalidade:** Apresentação tátil das perguntas em formato de carta física.
- **Interações:**
    - **Concordamos / Discordamos:** Registra a resposta e avança para a próxima carta.
    - **Voltar (Anterior):** Permite retornar à pergunta anterior e alterar a resposta (ajusta o histórico em tempo real).
    - **Configurar:** Atalho rápido para retornar à tela de sliders.
- **Publicidade:** Espaços reservados (`ad-placeholder`) no topo e rodapé que reiniciam a cada nova carta.

### 3.5. Histórico Detalhado (`screen-history`)
- **Objetivo:** Transparência e reflexão.
- **Layout:** Feed vertical minimalista com badges coloridos:
    - **Verde Pastel:** Indica concordância (🤝).
    - **Vermelho Pastel:** Indica divergência (🤷‍♂️).
- **Ads:** Placeholders de anúncios inseridos a cada 4 itens para monetização nativa.

### 3.6. Resumo e Retrospectiva (`screen-result`)
- **Funcionalidade:** Exibição do "Score de Sintonia" e estatísticas por categoria.
- **Personalização (Estilo Spotify Wrapped):**
    - Input de nomes dos parceiros.
    - Seletor de cores de fundo para o card de compartilhamento (Rose, Purple, Sunset, Dark).
- **Celebração:** Disparo automático de confete (`canvas-confetti`) se a sintonia for superior a 80%.
- **Ações:**
    - **Verificar perguntas:** Retorna ao histórico para rever respostas específicas.
    - **Compartilhar:** Utiliza a Web Share API para enviar a imagem gerada pelo `html2canvas` diretamente para redes sociais ou baixar o arquivo em desktops.

---

## 4. Lógica de Negócio (Engine)

### 4.1. Algoritmo de Geração do Baralho
O sistema não faz um sorteio puramente aleatório. Ele utiliza os pesos dos sliders:
1. Calcula a proporção baseada na soma total dos valores dos 4 sliders.
2. Distribui as 15 cartas proporcionalmente, garantindo que categorias com sliders em 0% não apareçam e categorias em 100% dominem o deck.
3. Utiliza o método *Fisher-Yates* para embaralhar as perguntas selecionadas antes do jogo começar.

### 4.2. Persistência e Estado
- **Tema:** O estado do Modo Escuro é persistido no `localStorage`.
- **Dados:** As perguntas são carregadas via `fetch` assíncrono na inicialização. O app trava a interface caso o carregamento do JSON falhe, exibindo um alerta de erro de rede.

---

## 5. Requisitos Técnicos e Dependências

- **Tailwind CSS:** Framework de estilização via CDN.
- **html2canvas:** Para transformar o DOM em imagem PNG compartilhável.
- **canvas-confetti:** Para efeitos visuais de gamificação.
- **Web Share API:** Para integração nativa de compartilhamento em dispositivos móveis.

---

## 6. Fluxo de Navegação (Resumo)

1. `Home` -> `Config`
2. `Config` -> `Review` ou `Game`
3. `Review` -> `Game`
4. `Game` -> `Result`
5. `Result` <-> `History`
6. `Any` -> `Home/Restart` (via botões de voltar ou logomarca)

---

**Documentação gerada para a versão 1.0.0 do cartasdecasal.com.br.**