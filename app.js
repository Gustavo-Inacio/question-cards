// CupidCards - SPA Logic

// Tarefa 2 (Dados): Mock de JSON estático com perguntas
const questions = {
    "Divertidas": [
        { id: 1, text: "Qual foi a coisa mais engraçada que você já fez por amor?" },
        { id: 2, text: "Se pudéssemos ter um superpoder juntos, qual seria e como o usaríamos?" },
        { id: 3, text: "Qual é a sua lembrança mais embaraçosa da nossa relação?" },
        { id: 4, text: "Se fôssemos personagens de desenho animado, quais seríamos?" },
        { id: 5, text: "Qual é a sua 'guilty pleasure' que você não me contou ainda?" },
        { id: 6, text: "Qual é a coisa mais aleatória que te faz rir?" },
        { id: 7, text: "Se pudéssemos trocar de corpo por um dia, o que você faria?" },
        { id: 8, text: "Qual é a sua melhor imitação de alguém?" }
    ],
    "Futuro": [
        { id: 9, text: "Onde você se vê daqui a 5 anos, e como eu me encaixo nisso?" },
        { id: 10, text: "Qual é um sonho ou objetivo que você tem para nós como casal?" },
        { id: 11, text: "Se pudéssemos viajar para qualquer lugar no futuro, para onde iríamos?" },
        { id: 12, text: "Qual é a maior aventura que você gostaria de viver comigo?" },
        { id: 13, text: "Que tipo de legado você gostaria que deixássemos juntos?" },
        { id: 14, text: "Qual é uma nova habilidade que você gostaria que aprendêssemos juntos?" },
        { id: 15, text: "Como você imagina nossa rotina ideal em um futuro distante?" }
    ],
    "Íntimas": [
        { id: 16, text: "Qual é a coisa que você mais admira em mim e que talvez eu não saiba?" },
        { id: 17, text: "Qual foi o momento em que você sentiu que realmente me conhecia?" },
        { id: 18, text: "O que te faz sentir mais amado(a) e seguro(a) em nosso relacionamento?" },
        { id: 19, text: "Qual é a sua linguagem do amor principal e como posso expressá-la melhor?" },
        { id: 20, text: "Qual é um medo ou insegurança que você tem e que eu posso ajudar a aliviar?" },
        { id: 21, text: "Qual é a sua fantasia mais secreta que você gostaria de compartilhar?" },
        { id: 22, text: "O que você mais valoriza em nossa conexão emocional?" },
        { id: 23, text: "Qual é a coisa mais vulnerável que você já me contou?" }
    ],
    "Polêmicas": [
        { id: 24, text: "Qual é uma opinião impopular que você tem sobre relacionamentos?" },
        { id: 25, text: "Se tivéssemos uma grande discussão, qual seria o motivo mais provável?" },
        { id: 26, text: "Qual é a coisa mais difícil que você já teve que me perdoar?" },
        { id: 27, text: "Existe algo que você gostaria de mudar em nosso relacionamento, mas tem receio de falar?" },
        { id: 28, text: "Qual é o maior desafio que enfrentamos ou podemos enfrentar como casal?" },
        { id: 29, text: "Se você pudesse mudar uma coisa no seu passado antes de me conhecer, o que seria?" },
        { id: 30, text: "Qual é o limite que você nunca cruzaria em um relacionamento?" }
    ]
};

let currentDeck = []; // Baralho atual de perguntas
let currentIndex = 0; // Índice da pergunta atual no jogo
let gameResults = []; // Registro das respostas (Concordamos/Discordamos)
const TOTAL_QUESTIONS_IN_DECK = 15;

document.addEventListener('DOMContentLoaded', () => {
    // Lógica de Modo Escuro
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Inicializa o tema baseado no localStorage ou preferência do sistema
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    });

    // Listener para mudanças no sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.theme) {
            e.matches ? htmlElement.classList.add('dark') : htmlElement.classList.remove('dark');
        }
    });

    const btnStart = document.getElementById('btn-start');
    const btnPlaySurprise = document.getElementById('btn-play-surprise');
    const btnReviewAuto = document.getElementById('btn-review-auto');
    const btnManualEmpty = document.getElementById('btn-manual-empty');

    const screenHome = document.getElementById('screen-home');
    const screenConfig = document.getElementById('screen-config');
    const screenReview = document.getElementById('screen-review');
    const screenGame = document.getElementById('screen-game');
    const screenHistory = document.getElementById('screen-history');
    const screenResult = document.getElementById('screen-result');
    const deckList = document.getElementById('deck-list');
    const gameCardContainer = document.getElementById('game-card-container');
    const gameCardText = document.getElementById('game-card-text');
    const gameCardCategory = document.getElementById('game-card-category');

    const sliders = {
        divertidas: document.getElementById('slider-divertidas'),
        futuro: document.getElementById('slider-futuro'),
        intimas: document.getElementById('slider-intimas'),
        polemicas: document.getElementById('slider-polemicas'),
    };

    const sliderValueDisplays = {
        divertidas: document.getElementById('value-divertidas'),
        futuro: document.getElementById('value-futuro'),
        intimas: document.getElementById('value-intimas'),
        polemicas: document.getElementById('value-polemicas'),
    };

    // Atualiza o display de valor do slider
    const updateSliderValueDisplay = (category) => {
        sliderValueDisplays[category].textContent = `${sliders[category].value}%`;
    };

    // Inicializa os displays dos sliders e adiciona listeners
    for (const category in sliders) {
        updateSliderValueDisplay(category);
        sliders[category].addEventListener('input', () => updateSliderValueDisplay(category));
    }

    // Navigation function
    const goToHome = () => {
        screenConfig.classList.add('hidden');
        screenHome.classList.remove('hidden');
    };

    const goToConfig = () => {
        screenHome.classList.add('hidden');
        screenReview.classList.add('hidden');
        screenGame.classList.add('hidden');
        screenConfig.classList.remove('hidden');
    };
    
    const goToReview = () => {
        screenConfig.classList.add('hidden');
        screenGame.classList.add('hidden');
        screenReview.classList.remove('hidden');
        renderReviewList();
    };

    const goToGame = () => {
        currentIndex = 0;
        gameResults = [];
        screenConfig.classList.add('hidden');
        screenReview.classList.add('hidden');
        screenGame.classList.remove('hidden');
        renderGameCard();
    };

    const goToHistory = () => {
        screenGame.classList.add('hidden');
        screenResult.classList.add('hidden');
        screenHistory.classList.remove('hidden');
        renderHistoryScreen();
    };

    const goToResult = () => {
        screenGame.classList.add('hidden');
        screenHistory.classList.add('hidden');
        screenResult.classList.remove('hidden');
        renderResultScreen();
    };
    
    // Tarefa 2 & 3: Renderização do Feed de Histórico
    const renderHistoryScreen = () => {
        const feed = document.getElementById('history-feed');
        feed.innerHTML = '';

        gameResults.forEach((result, index) => {
            const isAgree = result.response === 'Concordamos';
            const card = document.createElement('div');
            
            // Estilo do Card baseado na escolha
            const statusClass = isAgree 
                ? "border-l-4 border-[#d1fae5] bg-white" 
                : "border-l-4 border-[#fee2e2] bg-white";
            
            const badgeClass = isAgree 
                ? "bg-[#d1fae5] text-[#065f46]" 
                : "bg-[#fee2e2] text-[#991b1b]";

            const icon = isAgree ? "🤝 Concordaram" : "🤷‍♂️ Divergente";

            card.className = `p-4 rounded-airbnb-md border border-hairline-soft dark:border-white/10 ${statusClass} transition-all dark:bg-surface-dark`;
            card.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div class="flex flex-col">
                        <span class="text-[9px] font-bold uppercase tracking-widest text-muted dark:text-muted-dark mb-1">${result.question.category || 'Personalizada'}</span>
                        <p class="text-ink dark:text-white font-medium text-[15px] leading-tight">${result.question.text}</p>
                    </div>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold whitespace-nowrap self-start md:self-center ${badgeClass}">
                        ${icon}
                    </span>
                </div>
            `;
            feed.appendChild(card);

            // Tarefa 3: Inserção de Ad Placeholder a cada 4 itens
            if ((index + 1) % 4 === 0 && index !== gameResults.length - 1) {
                const ad = document.createElement('div');
                ad.className = "ad-placeholder-feed w-full h-32 bg-surface-soft dark:bg-ink border border-dashed border-hairline-soft dark:border-muted rounded-airbnb-md flex items-center justify-center text-muted dark:text-muted-dark text-xs italic";
                ad.textContent = "Sugestão para o Casal (Anúncio)";
                feed.appendChild(ad);
            }
        });
        window.scrollTo(0, 0);
    };

    // Tarefa 1: Personalização em Tempo Real
    const inputName1 = document.getElementById('input-name1');
    const inputName2 = document.getElementById('input-name2');
    const displayNames = document.getElementById('display-names');
    const shareableCard = document.getElementById('shareable-card');

    const updateNames = () => {
        const n1 = inputName1.value.trim() || "Você";
        const n2 = inputName2.value.trim() || "Seu Par";
        displayNames.textContent = `${n1} & ${n2}`;
    };

    inputName1.addEventListener('input', updateNames);
    inputName2.addEventListener('input', updateNames);

    document.querySelectorAll('.btn-color-pick').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove gradients anteriores
            shareableCard.className = shareableCard.className.replace(/from-\S+ to-\S+/g, '');
            shareableCard.classList.add(...btn.dataset.gradient.split(' '));
            
            // Estilo visual do botão selecionado
            document.querySelectorAll('.btn-color-pick').forEach(b => b.classList.remove('ring-ink'));
            btn.classList.add('ring-ink');
        });
    });

    // Tarefa 2: Refinamento do Score
    const renderResultScreen = () => {
        const agreeCount = gameResults.filter(r => r.response === 'Concordamos').length;
        const disagreeCount = gameResults.filter(r => r.response === 'Discordamos').length;
        const total = gameResults.length;
        
        const overallScore = Math.round((agreeCount / total) * 100);

        // Update UI
        document.getElementById('count-agree').textContent = agreeCount;
        document.getElementById('count-disagree').textContent = disagreeCount;
        document.getElementById('display-overall-score').textContent = `${overallScore}%`;

        // Score por Categoria
        const catStats = {};
        gameResults.forEach(res => {
            const cat = res.question.category || "Personalizada";
            if (!catStats[cat]) catStats[cat] = { agree: 0, total: 0 };
            catStats[cat].total++;
            if (res.response === 'Concordamos') catStats[cat].agree++;
        });

        const listContainer = document.getElementById('display-category-list');
        listContainer.innerHTML = '';
        
        Object.entries(catStats).forEach(([name, stat]) => {
            const percent = Math.round((stat.agree / stat.total) * 100);
            const item = document.createElement('div');
            item.className = "text-left";
            item.innerHTML = `
                <div class="flex justify-between text-[10px] uppercase font-bold mb-1 opacity-80">
                    <span>${name}</span>
                    <span>${stat.agree}/${stat.total}</span>
                </div>
                <div class="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div class="bg-white h-full" style="width: ${percent}%"></div>
                </div>
            `;
            listContainer.appendChild(item);
        });

        const titleElement = document.getElementById('result-title');
        
        if (agreeCount > disagreeCount) {
            titleElement.textContent = "Sintonia Perfeita! ❤️";
        } else {
            titleElement.textContent = "Vocês são o Caos! 🔥";
        }

        // Dispara confete se a sintonia for maior que 80%
        if (overallScore > 80) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff385c', '#ffffff', '#92174d'], // Cores baseadas no design (Rausch, White, Plus)
                disableForReducedMotion: true
            });
        }
    };

    // Tarefa 4: Web Share API e Fallback
    const shareResult = async () => {
        const btn = document.getElementById('btn-share-result');
        const originalText = btn.innerHTML;
        btn.innerHTML = "Processando...";

        try {
            const canvas = await html2canvas(shareableCard, { scale: 2, useCORS: true });
            const dataUrl = canvas.toDataURL('image/png');
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'cupidcards-result.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Nosso Raio-X de Casal!',
                    text: 'Veja nossa sintonia no CupidCards!',
                    url: window.location.href,
                    files: [file]
                });
            } else {
                // Fallback para Desktop
                const link = document.createElement('a');
                link.download = 'cupidcards-result.png';
                link.href = dataUrl;
                link.click();
                navigator.clipboard.writeText(window.location.href);
                alert('Imagem baixada e link copiado para a área de transferência! ✨');
            }
        } catch (err) {
            console.error(err);
        } finally {
            btn.innerHTML = originalText;
        }
    };

    // Tarefa 1 & 4: Lógica do Jogo
    const reloadAds = () => {
        // Função reservada para futura integração com AdSense/IMA
        console.log("Ad Slots reloaded for card index:", currentIndex);
    };

    const renderGameCard = () => {
        const question = currentDeck[currentIndex];
        const btnPrev = document.getElementById('btn-game-prev');
        
        // Habilita/Desabilita botão de pergunta anterior
        btnPrev.disabled = currentIndex === 0;
        
        // Aplica fade out antes de trocar o texto
        gameCardContainer.classList.add('opacity-0');
        
        setTimeout(() => {
            gameCardText.textContent = question.text;
            gameCardCategory.textContent = question.category || "Personalizada";
            gameCardContainer.classList.remove('opacity-0');
        }, 300);
    };

    const handleResponse = (response) => {
        gameResults.push({ question: currentDeck[currentIndex], response });
        reloadAds();
        
        currentIndex++;
        
        if (currentIndex < currentDeck.length) {
            renderGameCard();
        } else {
            goToResult();
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            currentIndex--;
            gameResults.pop();
            renderGameCard();
        }
    };

    // Tarefa 3: Lógica de Manipulação do Baralho
    window.removeQuestion = (index) => {
        currentDeck.splice(index, 1);
        renderReviewList();
    };

    const addCustomQuestion = () => {
        const input = document.getElementById('input-custom-question');
        const text = input.value.trim();
        
        if (text) {
            currentDeck.push({ id: Date.now(), text: text, custom: true, category: "Personalizada" });
            input.value = '';
            renderReviewList();
            // Scroll suave para o novo item
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    const renderReviewList = () => {
        deckList.innerHTML = '';
        document.getElementById('deck-count').textContent = currentDeck.length;

        currentDeck.forEach((question, index) => {
            const card = document.createElement('div');
            card.className = "flex items-center justify-between p-5 bg-white dark:bg-surface-dark border border-hairline-soft dark:border-white/10 rounded-airbnb-md shadow-sm hover:border-hairline dark:hover:border-white transition-all group";
            
            card.innerHTML = `
                <p class="text-ink dark:text-white text-[16px] leading-relaxed pr-4 font-medium">${question.text}</p>
                <button onclick="removeQuestion(${index})" class="text-muted dark:text-muted-dark hover:text-rausch p-2 rounded-full hover:bg-red-50 dark:hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            deckList.appendChild(card);
        });
    };

    btnStart.addEventListener('click', goToConfig);
    
    document.getElementById('btn-add-custom').addEventListener('click', addCustomQuestion);
    document.getElementById('input-custom-question').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomQuestion();
    });

    document.getElementById('btn-go-to-game').addEventListener('click', () => {
        if (currentDeck.length > 0) goToGame();
        else alert("Adicione pelo menos uma carta para jogar!");
    });

    document.getElementById('btn-go-to-result').addEventListener('click', goToResult);

    document.getElementById('btn-back-to-history').addEventListener('click', goToHistory);
    
    // Navigation Event Listeners
    document.getElementById('btn-config-back').addEventListener('click', goToHome);
    document.getElementById('btn-review-back').addEventListener('click', goToConfig);
    document.getElementById('btn-game-back-config').addEventListener('click', goToConfig);
    document.getElementById('btn-game-prev').addEventListener('click', prevQuestion);
    document.getElementById('btn-history-back').addEventListener('click', goToResult);

    // Tarefa 3: Controle de Rotas e Lógica de Ramificação
    btnPlaySurprise.addEventListener('click', () => {
        gerarBaralho();
        goToGame();
    });

    btnReviewAuto.addEventListener('click', () => {
        gerarBaralho();
        goToReview();
    });

    btnManualEmpty.addEventListener('click', () => {
        currentDeck = [];
        goToReview();
    });

    // Tarefa 2: Função Gerar Baralho baseada nos Sliders
    const gerarBaralho = () => {
        const sliderValues = {
            "Divertidas": parseInt(sliders.divertidas.value),
            "Futuro": parseInt(sliders.futuro.value),
            "Íntimas": parseInt(sliders.intimas.value),
            "Polêmicas": parseInt(sliders.polemicas.value),
        };

        const totalSliderValue = Object.values(sliderValues).reduce((sum, val) => sum + val, 0);
        const categories = Object.keys(questions);

        let questionsPerCategory = {};
        let fractionalParts = {};
        let currentTotal = 0;

        // Helper para embaralhar um array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Calcula a base de perguntas por categoria e as partes fracionárias
        for (const category of categories) {
            if (totalSliderValue === 0) {
                questionsPerCategory[category] = 0;
                fractionalParts[category] = 0;
            } else {
                const exactCount = (sliderValues[category] / totalSliderValue) * TOTAL_QUESTIONS_IN_DECK;
                questionsPerCategory[category] = Math.floor(exactCount);
                fractionalParts[category] = exactCount - questionsPerCategory[category];
            }
            currentTotal += questionsPerCategory[category];
        }

        // Distribui as perguntas restantes com base nas partes fracionárias
        let remainingQuestions = TOTAL_QUESTIONS_IN_DECK - currentTotal;
        const sortedCategories = categories.sort((a, b) => fractionalParts[b] - fractionalParts[a]);

        for (const category of sortedCategories) {
            if (remainingQuestions <= 0) break;
            if (questionsPerCategory[category] < questions[category].length) { // Garante que não exceda o número de perguntas disponíveis
                questionsPerCategory[category]++;
                remainingQuestions--;
            }
        }

        currentDeck = [];
        for (const category of categories) {
            const num = questionsPerCategory[category];
            if (num > 0) {
                const shuffledCategoryQuestions = shuffleArray([...questions[category]]); // Embaralha uma cópia
                const withCategory = shuffledCategoryQuestions.slice(0, num).map(q => ({ ...q, category }));
                currentDeck.push(...withCategory);
            }
        }

        // Ajuste final para garantir o número exato de perguntas, caso haja alguma discrepância
        while (currentDeck.length < TOTAL_QUESTIONS_IN_DECK && Object.values(questions).flat().length > currentDeck.length) {
            const allQuestions = [];
            for (const cat in questions) {
                questions[cat].forEach(q => allQuestions.push({ ...q, category: cat }));
            }
            
            const allAvailableQuestions = shuffleArray(allQuestions);
            const questionToAdd = allAvailableQuestions.find(q => !currentDeck.some(deckQ => deckQ.id === q.id));
            if (questionToAdd) {
                currentDeck.push(questionToAdd);
            } else {
                break;
            }
        }
        while (currentDeck.length > TOTAL_QUESTIONS_IN_DECK) {
            currentDeck.pop();
        }
        
        // Embaralha o resultado final para misturar as categorias
        shuffleArray(currentDeck);
    };

    document.getElementById('btn-disagree').addEventListener('click', () => handleResponse('Discordamos'));
    document.getElementById('btn-agree').addEventListener('click', () => handleResponse('Concordamos'));
    
    document.getElementById('btn-share-result').addEventListener('click', shareResult);
});