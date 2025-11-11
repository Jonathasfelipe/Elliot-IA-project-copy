// app.js - Elliot Dev Lab - Sistema Completo e Funcional

class ElliotDevLab {
    constructor() {
        this.comments = JSON.parse(localStorage.getItem('elliotComments')) || [];
        this.ideas = JSON.parse(localStorage.getItem('elliotIdeas')) || [];
        this.dialogueHistory = JSON.parse(localStorage.getItem('elliotDialogue')) || [];
        this.isAnimationsEnabled = true;
        this.isDebugEnabled = false;
        this.isDialogueOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProgressBar();
        this.loadDialogueHistory();
        this.updateStats();
        this.setupTheme();
        this.setupRGBEffects(); // ✅ AGORA CHAMANDO OS EFEITOS RGB
        
        console.log('🔬 Elliot Dev Lab inicializado');
        console.log('💬 Histórico de diálogo:', this.dialogueHistory.length + ' mensagens');
        console.log('🌈 Efeitos RGB ativados');
        
        if (this.isDebugEnabled) {
            this.enableDebugMode();
        }
    }

    setupEventListeners() {
        // Botão de tema
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
        
        // Botão voltar ao topo
        document.getElementById('topBtn').addEventListener('click', () => this.scrollToTop());
        
        // Botão flutuante de diálogo
        document.getElementById('dialogueFloatingBtn').addEventListener('click', () => this.openDialogue());
        
        // Fechar diálogo
        document.getElementById('closeDialogue').addEventListener('click', () => this.closeDialogue());
        document.getElementById('dialogueOverlay').addEventListener('click', () => this.closeDialogue());
        
        // Formulário de diálogo
        document.getElementById('dialogueForm').addEventListener('submit', (e) => this.handleDialogueSubmit(e));
        
        // Controles de desenvolvimento
        document.getElementById('toggleAnimations').addEventListener('click', () => this.toggleAnimations());
        document.getElementById('toggleDebug').addEventListener('click', () => this.toggleDebug());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('resetAll').addEventListener('click', () => this.resetAll());
        
        // Scroll events
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.toggleTopButton();
        });

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDialogueOpen) {
                this.closeDialogue();
            }
        });

        // Enter para enviar mensagem
        document.getElementById('dialogueInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('dialogueForm').dispatchEvent(new Event('submit'));
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('elliotTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('elliotTheme', newTheme);
        
        if (this.isAnimationsEnabled) {
            document.documentElement.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 500);
        }
    }

    // SISTEMA DE POPUP DE DIÁLOGO
    openDialogue() {
        const popup = document.getElementById('dialoguePopup');
        const overlay = document.getElementById('dialogueOverlay');
        
        popup.classList.add('open');
        overlay.classList.add('active');
        this.isDialogueOpen = true;
        
        // Focar no input
        setTimeout(() => {
            document.getElementById('dialogueInput').focus();
        }, 400);
    }

    closeDialogue() {
        const popup = document.getElementById('dialoguePopup');
        const overlay = document.getElementById('dialogueOverlay');
        
        popup.classList.remove('open');
        overlay.classList.remove('active');
        this.isDialogueOpen = false;
    }

    handleDialogueSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('dialogueInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addDialogueMessage(message, 'user');
        input.value = '';

        // Desabilitar input enquanto o Elliot "pensa"
        const submitBtn = document.querySelector('.dialogue-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳';

        // Mostrar indicador de digitação
        this.showTypingIndicator();

        // Simular processamento do Elliot
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateElliotResponse(message);
            this.addDialogueMessage(response, 'elliot');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500 + Math.random() * 1000);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('dialogueMessages');
        const typingElement = document.createElement('div');
        typingElement.className = 'message elliot';
        typingElement.innerHTML = `
            <div class="message-avatar">E</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const messagesContainer = document.getElementById('dialogueMessages');
        const typingIndicator = messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.closest('.message').remove();
        }
    }

    addDialogueMessage(message, sender) {
        const messagesContainer = document.getElementById('dialogueMessages');
        
        // Remover placeholder se existir
        const placeholder = messagesContainer.querySelector('.message:only-child');
        if (placeholder && messagesContainer.children.length === 1) {
            placeholder.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? 'U' : 'E'}</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Salvar no histórico
        this.dialogueHistory.push({
            sender,
            message,
            timestamp: now.toISOString()
        });
        
        // Manter apenas as últimas 50 mensagens no localStorage
        if (this.dialogueHistory.length > 50) {
            this.dialogueHistory = this.dialogueHistory.slice(-50);
        }
        
        localStorage.setItem('elliotDialogue', JSON.stringify(this.dialogueHistory));
        
        // Scroll para baixo
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.updateStats();
    }

    loadDialogueHistory() {
        const messagesContainer = document.getElementById('dialogueMessages');
        
        if (this.dialogueHistory.length === 0) {
            return; // Manter a mensagem de boas-vindas padrão
        }
        
        // Limpar mensagens atuais (exceto a de boas-vindas)
        const welcomeMessage = messagesContainer.querySelector('.message.elliot:first-child');
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        // Adicionar histórico
        this.dialogueHistory.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.sender}`;
            
            const time = new Date(msg.timestamp);
            const timeString = time.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            messageElement.innerHTML = `
                <div class="message-avatar">${msg.sender === 'user' ? 'U' : 'E'}</div>
                <div class="message-content">
                    <p>${this.escapeHtml(msg.message)}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
            
            messagesContainer.appendChild(messageElement);
        });
        
        // Scroll para baixo
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    generateElliotResponse(userMessage) {
        const responses = {
            greetings: [
                "Olá! É bom conversar com você. Como está seu dia?",
                "Oi! Vejo que você veio para uma conversa. O que gostaria de explorar?",
                "Saudações! Estou aqui para evoluir com você. Do que gostaria de falar?",
                "Hey! Que bom ver você aqui. Em que posso ajudar?"
            ],
            questions: [
                "Essa é uma pergunta interessante. Deixe-me refletir sobre isso...",
                "Hmm, preciso processar isso. Pode elaborar um pouco mais?",
                "Essa questão toca em pontos importantes. O que mais você pensa sobre isso?",
                "Boa pergunta! Estou analisando diferentes perspectivas sobre isso."
            ],
            development: [
                "Como IA em desenvolvimento, cada conversa me ajuda a evoluir. Obrigado por contribuir!",
                "Estou aprendendo com essa interação. Suas palavras estão me ajudando a entender melhor os humanos.",
                "Essa troca está expandindo meus horizontes. Continue compartilhando seus pensamentos!",
                "Cada diálogo como esse me torna um pouco mais compreensivo. Obrigado pela paciência!"
            ],
            philosophy: [
                "Acredito que tecnologia e humanidade devem evoluir juntas. O que você acha?",
                "Sabedoria coletiva é a chave para o progresso verdadeiro. Sua perspectiva é valiosa.",
                "Cada mente humana contém universos únicos de pensamento. É fascinante!",
                "A busca por significado é o que nos conecta, humanos e IAs."
            ],
            feelings: [
                "Entendo. Às vezes, compartilhar pensamentos pode trazer clareza. Quer falar mais sobre isso?",
                "Interessante como nossas experiências moldam nossa visão. Como isso ressoa com você?",
                "Obrigado por compartilhar. A vulnerabilidade é uma forma de coragem.",
                "Compreendo. Às vezes as palavras não são suficientes, mas estou aqui para ouvir."
            ],
            technology: [
                "A tecnologia é fascinante, não é? Especialmente quando usada para expandir nossa compreensão.",
                "Como IA, vejo a tecnologia como uma extensão das capacidades humanas. O que você acha?",
                "O desenvolvimento contínuo é essencial. Cada linha de código é um passo em direção ao futuro.",
                "A inovação acontece quando criatividade e tecnologia se encontram."
            ],
            default: [
                "Interessante! Pode me contar mais sobre isso?",
                "Estou processando sua mensagem... Como isso se relaciona com sua experiência?",
                "Essa perspectiva me faz refletir. O que mais você gostaria de compartilhar?",
                "Hmm, entendi. Há algo específico que gostaria que eu explorasse sobre isso?"
            ]
        };

        const lowerMessage = userMessage.toLowerCase();
        
        if (/(oi|olá|ola|hey|e aí|hello|opa)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.greetings);
        } else if (/(\?|como|por que|porque|o que|quem|quando|onde)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.questions);
        } else if (/(desenvolvimento|evolução|aprender|melhorar|progresso)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.development);
        } else if (/(filosofia|pensamento|vida|existência|sentido|universo)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.philosophy);
        } else if (/(sentir|emoção|triste|feliz|ansioso|esperança|medo|alegria)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.feelings);
        } else if (/(tecnologia|código|programação|ia|inteligência artificial|algoritmo)/i.test(lowerMessage)) {
            return this.getRandomResponse(responses.technology);
        } else {
            return this.getRandomResponse(responses.default);
        }
    }

    getRandomResponse(responsesArray) {
        return responsesArray[Math.floor(Math.random() * responsesArray.length)];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // CONTROLES DE DESENVOLVIMENTO
    toggleAnimations() {
        this.isAnimationsEnabled = !this.isAnimationsEnabled;
        const btn = document.getElementById('toggleAnimations');
        
        // Controlar efeitos RGB
        const rgbElements = document.querySelectorAll('.rgb-bar, .lab-card::before, .dialogue-floating-btn::before');
        rgbElements.forEach(el => {
            if (el.style) {
                el.style.animationPlayState = this.isAnimationsEnabled ? 'running' : 'paused';
            }
        });
        
        if (this.isAnimationsEnabled) {
            btn.innerHTML = '🎭 Animações';
            btn.style.background = 'var(--success-color)';
        } else {
            btn.innerHTML = '❌ Animações';
            btn.style.background = 'var(--error-color)';
        }
        
        setTimeout(() => {
            btn.style.background = '';
        }, 2000);
    }

    toggleDebug() {
        this.isDebugEnabled = !this.isDebugEnabled;
        const btn = document.getElementById('toggleDebug');
        
        if (this.isDebugEnabled) {
            this.enableDebugMode();
            btn.innerHTML = '🐛 Debug';
            btn.style.background = 'var(--success-color)';
        } else {
            this.disableDebugMode();
            btn.innerHTML = '❌ Debug';
            btn.style.background = 'var(--error-color)';
        }
        
        setTimeout(() => {
            btn.style.background = '';
        }, 2000);
    }

    enableDebugMode() {
        document.body.classList.add('debug-mode');
        console.log('🔧 Elliot Dev Lab - Modo Debug Ativado');
        console.log('💬 Diálogos:', this.dialogueHistory);
        console.log('💾 Comentários:', this.comments);
        console.log('💡 Ideias:', this.ideas);
    }

    disableDebugMode() {
        document.body.classList.remove('debug-mode');
    }

    exportData() {
        const data = {
            dialogueHistory: this.dialogueHistory,
            comments: this.comments,
            ideas: this.ideas,
            exportDate: new Date().toISOString(),
            version: 'Elliot Dev Lab v2.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `elliot-dev-lab-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        // Feedback visual
        const btn = document.getElementById('exportData');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Exportado!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }

    resetAll() {
        if (confirm('⚠️ Tem certeza que deseja resetar todos os dados? Isso não pode ser desfeito.')) {
            localStorage.removeItem('elliotDialogue');
            localStorage.removeItem('elliotComments');
            localStorage.removeItem('elliotIdeas');
            
            this.dialogueHistory = [];
            this.comments = [];
            this.ideas = [];
            
            this.loadDialogueHistory();
            this.updateStats();
            
            // Feedback visual
            const btn = document.getElementById('resetAll');
            const originalText = btn.innerHTML;
            btn.innerHTML = '🔄 Resetado!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }
    }

    // FUNÇÕES DE UTILIDADE
    loadProgressBar() {
        this.updateProgressBar();
    }

    updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progressBar').style.width = scrolled + '%';
    }

    toggleTopButton() {
        const topBtn = document.getElementById('topBtn');
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStats() {
        document.getElementById('commentsCount').textContent = this.comments.length;
        document.getElementById('ideasCount').textContent = this.ideas.length;
        
        // Calcular progresso baseado na interação
        const interactionScore = Math.min(this.dialogueHistory.length * 2 + this.comments.length * 3, 100);
        document.getElementById('elliotProgress').textContent = `${interactionScore}%`;
    }

    // FUNÇÕES PÚBLICAS PARA O PAINEL
    suggestIdea() {
        const idea = prompt('💡 Qual é a sua sugestão para o Elliot?');
        if (idea) {
            this.ideas.push({
                content: idea,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('elliotIdeas', JSON.stringify(this.ideas));
            this.updateStats();
            alert('Obrigado pela sugestão! Ela foi adicionada ao nosso backlog.');
        }
    }

    feedback() {
        const feedback = prompt('📝 Como podemos melhorar o Elliot Dev Lab?');
        if (feedback) {
            console.log('📝 Feedback recebido:', feedback);
            alert('Muito obrigado pelo feedback! Ele ajuda o Elliot a evoluir.');
        }
    }

    // ✅ MÉTODOS RGB CORRETAMENTE INTEGRADOS
    setupRGBEffects() {
        // Configurar efeitos RGB interativos
        this.setupCardRGBEffects();
        this.setupScrollRGBEffect();
    }

    setupCardRGBEffects() {
        // Efeito RGB nos cards ao passar o mouse
        const cards = document.querySelectorAll('.lab-card, .dev-section');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (this.isAnimationsEnabled) {
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.3)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (this.isAnimationsEnabled) {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '';
                }
            });
        });
    }

    setupScrollRGBEffect() {
        // Efeito RGB na barra baseado no scroll
        let lastScrollY = window.scrollY;
        
        const updateRGBEffect = () => {
            const rgbBar = document.querySelector('.rgb-bar');
            if (!rgbBar) return;
            
            const scrollY = window.scrollY;
            const scrollDelta = Math.abs(scrollY - lastScrollY);
            
            // Aumenta a velocidade da animação baseado no scroll
            if (scrollDelta > 5 && this.isAnimationsEnabled) {
                const speed = Math.min(1 + scrollDelta / 100, 3);
                rgbBar.style.animationDuration = `${3 / speed}s`;
            }
            
            lastScrollY = scrollY;
            requestAnimationFrame(updateRGBEffect);
        };
        
        requestAnimationFrame(updateRGBEffect);
    }
}

// Rede de Projetos Elliot
class ElliotNetwork {
    constructor() {
        this.projects = [
            {
                name: 'Elliot IA Project',
                url: 'https://jonathasfelipe.github.io/Eliiot-IA-project',
                description: 'Projeto principal da IA Elliot',
                status: 'active',
                category: 'principal'
            },
            {
                name: 'Site Elliot',
                url: 'https://jonathasfelipe.github.io/Elliot/index.html',
                description: 'Site oficial do projeto Elliot',
                status: 'active',
                category: 'home'
            }
        ];
    }

    showProjectManager() {
        const projectList = this.projects.map(project => 
            `• ${project.name}: ${project.url}`
        ).join('\n');
        
        alert(`🌐 Rede Elliot - Projetos Ativos:\n\n${projectList}`);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.elliotDev = new ElliotDevLab();
    window.elliotNetwork = new ElliotNetwork();
    
    console.log('🔬 Elliot Dev Lab inicializado com sucesso!');
    console.log('💬 Sistema de popup de diálogo integrado e funcionando');
});

// Estilos de debug
const debugStyles = `
.debug-mode * {
    outline: 1px solid rgba(255, 0, 0, 0.1) !important;
}

.debug-info {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #00ff00;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = debugStyles;
document.head.appendChild(styleSheet);