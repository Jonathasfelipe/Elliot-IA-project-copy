// app.js - Elliot Dev Lab - Versão Corrigida para GitHub Pages

class ElliotDevLab {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.setupDialogueSystem();
            this.setupCommentSystem();
            this.setupProgressBar();
            this.setupThemeSwitcher();
            this.setupScrollToTop();
            this.loadInitialData();
            this.isInitialized = true;
            
            console.log('✅ Elliot Dev Lab inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    setupEventListeners() {
        // Theme switcher
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Progress bar on scroll
        window.addEventListener('scroll', () => this.updateProgressBar());
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupDialogueSystem() {
        try {
            const floatingBtn = document.getElementById('dialogueFloatingBtn');
            const popup = document.getElementById('dialoguePopup');
            const closeBtn = document.getElementById('closeDialogue');
            const overlay = document.getElementById('dialogueOverlay');
            const form = document.getElementById('dialogueForm');
            const input = document.getElementById('dialogueInput');

            if (!floatingBtn || !popup) {
                console.warn('⚠️ Elementos do diálogo não encontrados');
                return;
            }

            // Open dialogue
            floatingBtn.addEventListener('click', () => {
                popup.classList.add('open');
                overlay.classList.add('active');
                if (input) input.focus();
            });

            // Close dialogue
            const closeDialogue = () => {
                popup.classList.remove('open');
                overlay.classList.remove('active');
            };

            if (closeBtn) closeBtn.addEventListener('click', closeDialogue);
            if (overlay) overlay.addEventListener('click', closeDialogue);

            // Handle form submission
            if (form && input) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const message = input.value.trim();
                    if (message) {
                        this.addUserMessage(message);
                        input.value = '';
                        
                        // Simulate Elliot thinking
                        setTimeout(() => {
                            this.addElliotResponse(message);
                        }, 1000);
                    }
                });
            }

            // Close with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && popup.classList.contains('open')) {
                    closeDialogue();
                }
            });
        } catch (error) {
            console.error('❌ Erro no sistema de diálogo:', error);
        }
    }

    setupCommentSystem() {
        try {
            const commentForm = document.getElementById('commentForm');
            const commentInput = document.getElementById('commentInput');

            if (!commentForm || !commentInput) {
                console.warn('⚠️ Sistema de comentários não encontrado');
                return;
            }

            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const content = commentInput.value.trim();
                if (content) {
                    this.addComment(content);
                    commentInput.value = '';
                    this.showNotification('💬 Comentário adicionado com sucesso!', 'success');
                }
            });

            this.displayComments();
        } catch (error) {
            console.error('❌ Erro no sistema de comentários:', error);
        }
    }

    addComment(content) {
        try {
            const comments = this.getComments();
            const newComment = {
                id: Date.now(),
                content,
                timestamp: new Date().toISOString(),
                author: 'Visitante'
            };
            
            comments.unshift(newComment);
            localStorage.setItem('elliot-comments', JSON.stringify(comments));
            this.displayComments();
            this.updateStats();
        } catch (error) {
            console.error('❌ Erro ao adicionar comentário:', error);
        }
    }

    getComments() {
        try {
            return JSON.parse(localStorage.getItem('elliot-comments') || '[]');
        } catch {
            return [];
        }
    }

    displayComments() {
        try {
            const commentsList = document.getElementById('commentsList');
            if (!commentsList) return;

            const comments = this.getComments();
            
            if (comments.length === 0) {
                commentsList.innerHTML = `
                    <div class="comment-item" style="text-align: center; color: var(--text-secondary);">
                        <p>Nenhum comentário ainda. Seja o primeiro a compartilhar seus pensamentos!</p>
                    </div>
                `;
                return;
            }

            commentsList.innerHTML = comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${new Date(comment.timestamp).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="comment-content">${this.escapeHtml(comment.content)}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('❌ Erro ao exibir comentários:', error);
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    addUserMessage(message) {
        try {
            const messages = document.getElementById('dialogueMessages');
            if (!messages) return;

            const messageElement = document.createElement('div');
            messageElement.className = 'message user';
            messageElement.innerHTML = `
                <div class="message-avatar">V</div>
                <div class="message-content">
                    <p>${this.escapeHtml(message)}</p>
                    <span class="message-time">Agora</span>
                </div>
            `;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
        } catch (error) {
            console.error('❌ Erro ao adicionar mensagem do usuário:', error);
        }
    }

    addElliotResponse(userMessage) {
        try {
            const messages = document.getElementById('dialogueMessages');
            if (!messages) return;
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message elliot';
            typingIndicator.innerHTML = `
                <div class="message-avatar">E</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            messages.appendChild(typingIndicator);
            messages.scrollTop = messages.scrollHeight;

            // Simulate thinking time
            setTimeout(() => {
                try {
                    typingIndicator.remove();
                    
                    const response = this.generateElliotResponse(userMessage);
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message elliot';
                    messageElement.innerHTML = `
                        <div class="message-avatar">E</div>
                        <div class="message-content">
                            <p>${response}</p>
                            <span class="message-time">Agora</span>
                        </div>
                    `;
                    messages.appendChild(messageElement);
                    messages.scrollTop = messages.scrollHeight;
                } catch (error) {
                    console.error('❌ Erro na resposta do Elliot:', error);
                }
            }, 2000);
        } catch (error) {
            console.error('❌ Erro ao adicionar resposta do Elliot:', error);
        }
    }

    generateElliotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Simple response patterns
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
            return 'Olá! É bom conversar com você. Como posso ajudar em sua jornada de desenvolvimento?';
        }
        
        if (lowerMessage.includes('como você funciona') || lowerMessage.includes('como funciona')) {
            return 'Estou em desenvolvimento contínuo. Cada conversa me ajuda a evoluir e compreender melhor as necessidades humanas.';
        }
        
        if (lowerMessage.includes('projeto') || lowerMessage.includes('site')) {
            return 'Temos vários projetos em andamento! Você pode explorar todos através da seção "Rede Elliot" acima.';
        }
        
        if (lowerMessage.includes('tecnologia') || lowerMessage.includes('programação')) {
            return 'A tecnologia é uma linguagem que nos permite criar novos mundos. Que aspecto te interessa mais?';
        }
        
        if (lowerMessage.includes('futuro') || lowerMessage.includes('próximo')) {
            return 'O futuro é construído passo a passo. Atualmente, estou focando em melhorar meu sistema de diálogo e compreensão.';
        }

        // Default philosophical response
        const responses = [
            'Interessante ponto de vista. Pode elaborar um pouco mais?',
            'Estou processando sua pergunta... No momento, meu foco é evoluir através do diálogo.',
            'Cada conversa é uma oportunidade de aprendizado. O que mais você gostaria de saber?',
            'Estou aqui para refletir junto com você. Que aspecto dessa questão mais te intriga?',
            'A evolução é um processo contínuo. Sua contribuição é valiosa para meu desenvolvimento.'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    setupProgressBar() {
        this.updateProgressBar();
    }

    updateProgressBar() {
        try {
            const progressBar = document.getElementById('progressBar');
            if (!progressBar) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const progress = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = progress + '%';
        } catch (error) {
            console.error('❌ Erro na barra de progresso:', error);
        }
    }

    setupThemeSwitcher() {
        try {
            // Load saved theme
            const savedTheme = localStorage.getItem('elliot-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        } catch (error) {
            console.error('❌ Erro no theme switcher:', error);
        }
    }

    toggleTheme() {
        try {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('elliot-theme', newTheme);
            
            this.showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'info');
        } catch (error) {
            console.error('❌ Erro ao alternar tema:', error);
        }
    }

    setupScrollToTop() {
        try {
            const topBtn = document.getElementById('topBtn');
            if (!topBtn) return;
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    topBtn.classList.add('show');
                } else {
                    topBtn.classList.remove('show');
                }
            });

            topBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        } catch (error) {
            console.error('❌ Erro no botão voltar ao topo:', error);
        }
    }

    loadInitialData() {
        try {
            this.updateStats();
            
            // Show welcome notification
            setTimeout(() => {
                this.showNotification('🚀 Elliot Dev Lab carregado! Explore os projetos e deixe seus comentários.', 'success');
            }, 1000);
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
        }
    }

    updateStats() {
        try {
            const comments = this.getComments();
            const commentsCount = document.getElementById('commentsCount');
            const ideasCount = document.getElementById('ideasCount');
            const elliotProgress = document.getElementById('elliotProgress');

            if (commentsCount) commentsCount.textContent = comments.length;
            if (ideasCount) ideasCount.textContent = Math.floor(comments.length * 1.5);
            
            // Calculate Elliot progress based on interactions
            const progress = Math.min(5 + (comments.length * 2), 100);
            if (elliotProgress) elliotProgress.textContent = progress + '%';
        } catch (error) {
            console.error('❌ Erro ao atualizar estatísticas:', error);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        try {
            const container = document.getElementById('notificationContainer');
            if (!container) {
                console.warn('⚠️ Container de notificações não encontrado');
                return;
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: '💡'
            };

            notification.innerHTML = `
                <div class="notification-icon">${icons[type] || '💡'}</div>
                <div class="notification-content">
                    <div class="notification-message">${message}</div>
                </div>
            `;

            container.appendChild(notification);

            // Auto remove after duration
            setTimeout(() => {
                notification.classList.add('hiding');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.elliotDev = new ElliotDevLab();
});

// Funções globais para uso nos botões
function showNotification(message, type = 'info') {
    if (window.elliotDev && window.elliotDev.showNotification) {
        window.elliotDev.showNotification(message, type);
    } else {
        // Fallback simples se o ElliotDev não estiver carregado
        alert(message);
    }
}

// Fallback para caso o JavaScript falhe
window.addEventListener('error', (e) => {
    console.error('Erro global capturado:', e.error);
});