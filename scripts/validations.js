
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    
    if (!contactForm) {
        console.error('Formulario de contacto no encontrado');
        return;
    }
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    
    let isSubmitting = false;

    
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    
    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        
        notification.innerHTML = `
            <div class="notification-title">${icon} ${title}</div>
            <p class="notification-message">${message}</p>
        `;
        
        notificationContainer.appendChild(notification);
        
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

   
    function validateField(field, showNotificationFlag = false) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('placeholder') || field.getAttribute('name');
        
        field.classList.remove('error', 'success');
        
       
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            if (showNotificationFlag) {
                showNotification('Campo requerido', `"${fieldName}" es obligatorio`, 'error');
            }
            return false;
        }
        
      
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    field.classList.add('error');
                    if (showNotificationFlag) {
                        showNotification('Error de validación', `El formato de email en "${fieldName}" no es válido`, 'error');
                    }
                    return false;
                }
                break;
                
            case 'text':
                if (value && value.length < 2) {
                    field.classList.add('error');
                    if (showNotificationFlag) {
                        showNotification('Error de validación', `"${fieldName}" debe tener al menos 2 caracteres`, 'error');
                    }
                    return false;
                }
                break;
                
            case 'textarea':
                if (value && value.length < 10) {
                    field.classList.add('error');
                    if (showNotificationFlag) {
                        showNotification('Error de validación', `"${fieldName}" debe tener al menos 10 caracteres`, 'error');
                    }
                    return false;
                }
                break;
        }
        
        if (value) {
            field.classList.add('success');
        }
        
        return true;
    }

    function validateForm() {
        let isValid = true;
        let firstErrorField = null;
        let errorCount = 0;
        
        inputs.forEach(input => {
            if (!validateField(input, true)) { 
                isValid = false;
                errorCount++;
                if (!firstErrorField) {
                    firstErrorField = input;
                }
            }
        });

        if (!isValid && errorCount > 0) {
            showNotification('Formulario incompleto', `Hay ${errorCount} campo(s) que requieren atención`, 'error');
        }
        
    
        if (firstErrorField) {
            firstErrorField.focus();
        }
        
        return isValid;
    }

   
    inputs.forEach(input => {
        
        input.addEventListener('input', () => {
            input.classList.remove('error', 'success');
            if (input.value.trim()) {
                validateField(input, false); 
            }
        });
        
        input.addEventListener('blur', () => {
            validateField(input, true); 
        });
    });


    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
      
        if (isSubmitting) {
            showNotification('Espera', 'El formulario se está enviando...', 'info');
            return;
        }
        
        if (!validateForm()) {
            return; 
        }
        
        
        isSubmitting = true;
        
    
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
        submitButton.disabled = true;
        
        console.log('Enviando formulario...');
        
   
        emailjs.sendForm('service_l63vwrn', 'template_7llypvq', this)
            .then(() => {
                console.log('SUCCESS! - Formulario enviado correctamente');
                showNotification('¡Éxito!', 'Tu mensaje ha sido enviado correctamente. Te responderé pronto.', 'success');
                contactForm.reset();
                
               
                inputs.forEach(input => input.classList.remove('success'));
            })
            .catch((error) => {
                console.error('FAILED... - Error enviando el formulario:', error);
                showNotification('Error', 'Hubo un problema al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
            })
            .finally(() => {
                
                isSubmitting = false;
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                console.log('Estado del formulario restaurado');
            });
    });


    inputs.forEach(input => {
        if (input.value.trim()) {
            validateField(input, false);
        }
    });
    
    console.log('Sistema de validación cargado correctamente');
});