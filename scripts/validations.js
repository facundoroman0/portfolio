class ContactFormValidator {
    constructor() {
        this.form = null;
        this.fields = {};
        this.lastSubmitTime = 0;
        this.SUBMIT_COOLDOWN = 30000; 
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupForm();
            this.setupEventListeners();
        });
    }

    setupForm() {
        this.form = document.getElementById('contactForm');
        if (!this.form) {
            console.warn('Formulario de contacto no encontrado');
            return;
        }

        this.fields = {
            name: this.form.querySelector('input[type="text"]'),
            email: this.form.querySelector('input[type="email"]'),
            subject: this.form.querySelector('input[placeholder="Asunto"]'),
            message: this.form.querySelector('textarea'),
            submitBtn: this.form.querySelector('button[type="submit"]')
        };
    }

    setupEventListeners() {
        if (!this.form) return;

        
        this.setupRealTimeValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/;
        
        if (!name.trim()) {
            return 'El nombre es obligatorio';
        }
        
        if (name.trim().length < 2) {
            return 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (name.trim().length > 50) {
            return 'El nombre no puede exceder 50 caracteres';
        }
        
        if (!nameRegex.test(name.trim())) {
            return 'El nombre solo puede contener letras y espacios';
        }
        
        return null;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!email.trim()) {
            return 'El email es obligatorio';
        }
        
        if (!emailRegex.test(email.trim())) {
            return 'Por favor, ingresa un email válido';
        }
        
        if (email.length > 100) {
            return 'El email no puede exceder 100 caracteres';
        }
        
        return null;
    }

    validateSubject(subject) {
        if (!subject.trim()) {
            return 'El asunto es obligatorio';
        }
        
        if (subject.trim().length < 5) {
            return 'El asunto debe tener al menos 5 caracteres';
        }
        
        if (subject.trim().length > 100) {
            return 'El asunto no puede exceder 100 caracteres';
        }
        
        return null;
    }

    validateMessage(message) {
        if (!message.trim()) {
            return 'El mensaje es obligatorio';
        }
        
        if (message.trim().length < 10) {
            return 'El mensaje debe tener al menos 10 caracteres';
        }
        
        if (message.trim().length > 1000) {
            return 'El mensaje no puede exceder 1000 caracteres';
        }

        if (this.isSpamMessage(message)) {
            return 'El mensaje parece ser spam. Por favor, escribe un mensaje personal.';
        }
        
        return null;
    }

    isSpamMessage(message) {
        const spamPatterns = [
            /viagra|casino|lottery|winner|congratulations/i,
            /click here|act now|limited time/i,
            /free money|easy money|make money fast/i,
            /(https?:\/\/|www\.)/gi
        ];
        
        const urlCount = (message.match(/(https?:\/\/|www\.)/gi) || []).length;
        if (urlCount > 2) return true;
        
        return spamPatterns.some(pattern => pattern.test(message));
    }

    createErrorMessage(input, message) {
        this.removeErrorMessage(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-1"></i>
            ${message}
        `;
        
        Object.assign(errorDiv.style, {
            color: 'var(--accent-secondary)',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-in'
        });
        
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        input.style.borderColor = 'var(--accent-secondary)';
        input.style.boxShadow = '0 0 0 0.1rem rgba(190, 124, 77, 0.25)';
    }

    removeErrorMessage(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = 'var(--border-color)';
        input.style.boxShadow = 'none';
    }

    setupRealTimeValidation() {
        const validators = {
            name: this.validateName.bind(this),
            email: this.validateEmail.bind(this),
            subject: this.validateSubject.bind(this),
            message: this.validateMessage.bind(this)
        };

        Object.keys(validators).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (!field) return;

            field.addEventListener('blur', () => {
                const error = validators[fieldName](field.value);
                if (error) {
                    this.createErrorMessage(field, error);
                } else {
                    this.removeErrorMessage(field);
                }
            });

            field.addEventListener('input', () => {
                if (field.parentNode.querySelector('.error-message')) {
                    const error = validators[fieldName](field.value);
                    if (!error) {
                        this.removeErrorMessage(field);
                    }
                }
            });
        });
    }

    validateForm() {
        const validators = [
            { field: this.fields.name, validator: this.validateName.bind(this), name: 'Nombre' },
            { field: this.fields.email, validator: this.validateEmail.bind(this), name: 'Email' },
            { field: this.fields.subject, validator: this.validateSubject.bind(this), name: 'Asunto' },
            { field: this.fields.message, validator: this.validateMessage.bind(this), name: 'Mensaje' }
        ];

        let isValid = true;
        const errors = [];

        validators.forEach(({ field, validator, name }) => {
            if (!field) return;
            
            const error = validator(field.value);
            if (error) {
                this.createErrorMessage(field, error);
                errors.push(name);
                isValid = false;
            } else {
                this.removeErrorMessage(field);
            }
        });

        return { isValid, errors };
    }

    setLoadingState(isLoading) {
        const btn = this.fields.submitBtn;
        if (!btn) return;

        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            btn.style.opacity = '0.7';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensaje';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }

    showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `form-notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
        const bgColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon} me-2"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10000',
            padding: '15px 20px',
            borderRadius: '12px',
            color: 'white',
            backgroundColor: bgColor,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transform: 'translateX(400px)',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            maxWidth: '350px',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginLeft: '10px',
            padding: '0',
            fontSize: '0.8rem',
            opacity: '0.8'
        });

        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, 5000);
    }

    checkSubmitCooldown() {
        const now = Date.now();
        if (now - this.lastSubmitTime < this.SUBMIT_COOLDOWN) {
            const remainingTime = Math.ceil((this.SUBMIT_COOLDOWN - (now - this.lastSubmitTime)) / 1000);
            return `Por favor, espera ${remainingTime} segundos antes de enviar otro mensaje.`;
        }
        return null;
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const cooldownMessage = this.checkSubmitCooldown();
        if (cooldownMessage) {
            this.showNotification(cooldownMessage, 'error');
            return;
        }
        
        const validation = this.validateForm();
        
        if (!validation.isValid) {
            this.showNotification(
                `Por favor, corrige los errores en: ${validation.errors.join(', ')}`, 
                'error'
            );
            
            const firstError = this.form.querySelector('.error-message');
            if (firstError) {
                firstError.parentElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            return;
        }

        const formData = {
            name: this.sanitizeInput(this.fields.name.value.trim()),
            email: this.sanitizeInput(this.fields.email.value.trim()),
            subject: this.sanitizeInput(this.fields.subject.value.trim()),
            message: this.sanitizeInput(this.fields.message.value.trim()),
            timestamp: new Date().toISOString()
        };
        this.setLoadingState(true);

        try {
            
            await this.submitForm(formData);
            this.showNotification('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
            this.form.reset();
            this.lastSubmitTime = Date.now();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    async submitForm(formData) {
    
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Mensaje enviado' });
                } else {
                    reject(new Error('Error simulado'));
                }
            }, 2000);
        });
    }

    reset() {
        Object.values(this.fields).forEach(field => {
            if (field && field.nodeType) {
                this.removeErrorMessage(field);
            }
        });
    }
}

const contactValidator = new ContactFormValidator();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormValidator;
}