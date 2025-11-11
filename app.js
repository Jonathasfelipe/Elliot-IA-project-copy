// app.js - Elliot Dev Lab - Versão Completa e Corrigida

class ElliotDevLab {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDialogueSystem();
        this.setupCommentSystem();
        this.setupProgressBar();
        this.setupThemeSwitcher();
        this.setupScrollToTop();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Theme switcher
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
        
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
        const floatingBtn = document.getElementById('dialogueFloatingBtn');
        const popup = document.getElementById('dialoguePopup');
        const closeBtn = document.getElementById('closeDialogue');
        const overlay = document.getElementById('dialogueOverlay');
        const form = document.getElementById('dialogueForm');
        const input = document.getElementById('dialogueInput');
        const messages = document.getElementById('dialogueMessages');

        // Open dialogue
        floatingBtn.addEventListener('click', () => {
            popup.classList.add('open');
            overlay.classList.add('active');
            input.focus();
        });

        // Close dialogue
        const closeDialogue = () => {
            popup.classList.remove('open');
            overlay.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeDialogue);
        overlay.addEventListener('click', closeDialogue);

        // Handle form submission
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

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('open')) {
                closeDialogue();
            }
        });
    }

    setupCommentSystem() {
        const commentForm = document.getElementById('commentForm');
        const commentInput = document.getElementById('commentInput');
        const commentsList = document.getElementById('commentsList');

        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = commentInput.value.trim();
            if (content) {
                this.addComment(content);
                commentInput.value = '';
                showNotification('💬 Comentário adicionado com sucesso!', 'success');
            }
        });

        this.displayComments();
    }

    addComment(content) {
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
    }

    getComments() {
        return JSON.parse(localStorage.getItem('elliot-comments') || '[]');
    }

    displayComments() {
        const commentsList = document.getElementById('commentsList');
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
        const messages = document.getElementById('dialogueMessages');
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
    }

    addElliotResponse(userMessage) {
        const messages = document.getElementById('dialogueMessages');
        
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
        }, 2000);
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
        const progressBar = document.getElementById('progressBar');
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    }

    setupThemeSwitcher() {
        // Load saved theme
        const savedTheme = localStorage.getItem('elliot-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('elliot-theme', newTheme);
        
        showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'info');
    }

    setupScrollToTop() {
        const topBtn = document.getElementById('topBtn');
        
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
    }

    loadInitialData() {
        this.updateStats();
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('🚀 Elliot Dev Lab carregado! Explore os projetos e deixe seus comentários.', 'success');
        }, 1000);
    }

    updateStats() {
        const comments = this.getComments();
        document.getElementById('commentsCount').textContent = comments.length;
        document.getElementById('ideasCount').textContent = Math.floor(comments.length * 1.5);
        
        // Calculate Elliot progress based on interactions
        const progress = Math.min(5 + (comments.length * 2), 100);
        document.getElementById('elliotProgress').textContent = progress + '%';
    }

    // Public methods for quick actions
    suggestIdea() {
        showNotification('💡 Ideia registrada! Elliot analisará sua sugestão.', 'success');
    }

    feedback() {
        showNotification('📝 Feedback enviado! Obrigado pela contribuição.', 'info');
    }
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.elliotDev = new ElliotDevLab();
});

// Export data function (for future use)
window.exportElliotData = function() {
    const data = {
        comments: window.elliotDev.getComments(),
        theme: localStorage.getItem('elliot-theme'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `elliot-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('📁 Dados exportados com sucesso!', 'success');
};