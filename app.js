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
    const btnStart = document.getElementById('btn-start');
    const btnGenerateDeck = document.getElementById('btn-generate-deck');
    const btnManualDeck = document.getElementById('btn-manual-deck');

    const screenHome = document.getElementById('screen-home');
    const screenConfig = document.getElementById('screen-config');
    const screenReview = document.getElementById('screen-review');
    const screenGame = document.getElementById('screen-game');
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
    const goToConfig = () => {
        screenHome.classList.add('hidden');
        screenConfig.classList.remove('hidden');
    };
    
    const goToReview = () => {
        screenConfig.classList.add('hidden');
        screenReview.classList.remove('hidden');
        renderReviewList();
    };

    const goToGame = () => {
        currentIndex = 0;
        gameResults = [];
        screenReview.classList.add('hidden');
        screenGame.classList.remove('hidden');
        renderGameCard();
    };

    const goToResult = () => {
        screenGame.classList.add('hidden');
        screenResult.classList.remove('hidden');
        renderResultScreen();
    };

    // Tarefa 1 & 3: Lógica de Resultados e Exportação
    const renderResultScreen = () => {
        const agreeCount = gameResults.filter(r => r.response === 'Concordamos').length;
        const disagreeCount = gameResults.filter(r => r.response === 'Discordamos').length;
        const total = gameResults.length;
        
        const agreePercent = (agreeCount / total) * 100;
        const disagreePercent = (disagreeCount / total) * 100;

        // Update UI
        document.getElementById('count-agree').textContent = agreeCount;
        document.getElementById('count-disagree').textContent = disagreeCount;
        document.getElementById('bar-agree').style.width = `${agreePercent}%`;
        document.getElementById('bar-disagree').style.width = `${disagreePercent}%`;

        const titleElement = document.getElementById('result-title');
        const cardTitleElement = document.getElementById('card-result-title');
        
        if (agreeCount > disagreeCount) {
            titleElement.textContent = "Sintonia Perfeita! ❤️";
            cardTitleElement.textContent = "Sintonia Perfeita";
        } else {
            titleElement.textContent = "Vocês são o Caos! 🔥";
            cardTitleElement.textContent = "Conexão no Caos";
        }
    };

    const downloadShareableCard = () => {
        const card = document.getElementById('shareable-card');
        html2canvas(card, { scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'cupidcards-nosso-momento.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    // Tarefa 1 & 4: Lógica do Jogo
    const reloadAds = () => {
        // Função reservada para futura integração com AdSense/IMA
        console.log("Ad Slots reloaded for card index:", currentIndex);
    };

    const renderGameCard = () => {
        const question = currentDeck[currentIndex];
        
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
            card.className = "flex items-center justify-between p-5 bg-white border border-hairline-soft rounded-airbnb-md shadow-sm hover:border-hairline transition-all group";
            
            card.innerHTML = `
                <p class="text-ink text-[16px] leading-relaxed pr-4 font-medium">${question.text}</p>
                <button onclick="removeQuestion(${index})" class="text-muted hover:text-rausch p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
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

    document.getElementById('btn-disagree').addEventListener('click', () => handleResponse('Discordamos'));
    document.getElementById('btn-agree').addEventListener('click', () => handleResponse('Concordamos'));
    
    document.getElementById('btn-download-card').addEventListener('click', downloadShareableCard);

    // Tarefa 3 (Lógica): Gerar Baralho Automático
    btnGenerateDeck.addEventListener('click', () => {
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

        console.log("Baralho Gerado:", currentDeck);
        console.log("Total de Perguntas:", currentDeck.length);

        goToReview();
    });

    btnManualDeck.addEventListener('click', () => {
        alert('A funcionalidade de montagem manual será implementada em breve!');
        // Poderia navegar para uma tela de seleção manual de perguntas
    });
});