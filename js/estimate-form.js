// Estimate Form Handler with EmailJS

// Initialize EmailJS
// Replace with your actual EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_70klpzb'; // Замініть на ваш Service ID
const EMAILJS_TEMPLATE_ID = 'template_bekt5pp'; // Замініть на ваш Template ID
const EMAILJS_PUBLIC_KEY = '3lwyNPt2YYAmIRWNE'; // Замініть на ваш Public Key

document.addEventListener('DOMContentLoaded', function () {
  const estimateForm = document.getElementById('estimateForm');
  const modal = document.getElementById('estimateModal');

  // Initialize EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  if (estimateForm) {
    estimateForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(estimateForm);
      const data = {
        name: formData.get('clientName'),
        phone: formData.get('clientPhone'),
        designStyle: formData.get('designStyle') || 'Не указан',
        callTime: formData.get('callTime') || 'Не указано',
        timestamp: new Date().toLocaleString('ru-RU')
      };

      // Validate required fields
      if (!data.name.trim() || !data.phone.trim()) {
        showAlert('Пожалуйста, заполните обязательные поля!', 'error');
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(data.phone)) {
        showAlert('Пожалуйста, введите корректный номер телефона!', 'error');
        return;
      }

      // Show loading state
      const submitBtn = estimateForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Отправка...';
      submitBtn.disabled = true;

      // Send email using EmailJS
      sendEstimateEmail(data)
        .then(() => {
          // Success
          showAlert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
          estimateForm.reset();
          // Close modal after 2 seconds
          setTimeout(() => {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
              bootstrapModal.hide();
            }
          }, 2000);
        })
        .catch((error) => {
          // Error
          console.error('Error sending estimate request:', error);
          showAlert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.', 'error');
        })
        .finally(() => {
          // Reset button state
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  }
});

// Function to send estimate email via EmailJS
function sendEstimateEmail(data) {
  return new Promise((resolve, reject) => {
    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'your_service_id' ||
      EMAILJS_TEMPLATE_ID === 'your_template_id' ||
      EMAILJS_PUBLIC_KEY === 'your_public_key') {
      console.warn('EmailJS not configured. Using fallback demonstration mode.');
      return sendEstimateEmailFallback(data).then(resolve).catch(reject);
    }

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS not loaded. Please check your EmailJS script inclusion.');
      return sendEstimateEmailFallback(data).then(resolve).catch(reject);
    }

    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: data.name,
      from_phone: data.phone,
      design_style: data.designStyle,
      call_time: data.callTime,
      timestamp: data.timestamp
    };

    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log('Email sent successfully:', response);
        resolve(response);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        reject(error);
      });
  });
}

// Fallback function for demonstration (if EmailJS is not configured)
function sendEstimateEmailFallback(data) {
  return new Promise((resolve, reject) => {
    // Simulate email sending for demonstration
    console.log('Email would be sent with the following data:', data);

    // Create email content for logging
    const emailContent = `
Новая заявка на смету

Имя клиента: ${data.name}
Телефон: ${data.phone}
Стиль дизайна: ${data.designStyle}
Удобное время звонка и пожелания: ${data.callTime}
Время подачи заявки: ${data.timestamp}
        `;

    console.log('Email content would be:', emailContent);

    // Simulate API call delay
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        resolve();
      } else {
        reject(new Error('Simulated network error'));
      }
    }, 1500);
  });
}

// Alert function
function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());

  // Create alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert custom-alert position-fixed`;
  alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

  // Set alert type styling
  if (type === 'success') {
    alertDiv.className += ' alert-success';
    alertDiv.innerHTML = `
            <i class="fa fa-check-circle me-2"></i>
            ${message}
        `;
  } else if (type === 'error') {
    alertDiv.className += ' alert-danger';
    alertDiv.innerHTML = `
            <i class="fa fa-exclamation-circle me-2"></i>
            ${message}
        `;
  } else {
    alertDiv.className += ' alert-info';
    alertDiv.innerHTML = `
            <i class="fa fa-info-circle me-2"></i>
            ${message}
        `;
  }

  // Add close button
  alertDiv.innerHTML += `
        <button type="button" class="btn-close ms-2" onclick="this.parentElement.remove()"></button>
    `;

  // Add to document
  document.body.appendChild(alertDiv);

  // Auto remove after 5 seconds (except for success messages which are removed after 3 seconds)
  const timeout = type === 'success' ? 3000 : 5000;
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, timeout);
}

// Form validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  // More comprehensive phone validation
  const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
  return cleanPhone.length >= 10 && /^[\+]?[0-9]+$/.test(cleanPhone);
}

// Real-time phone formatting
document.addEventListener('DOMContentLoaded', function () {
  const phoneInput = document.getElementById('clientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.startsWith('380')) {
          // Ukrainian format
          value = value.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
        } else if (value.length === 10) {
          // Standard format
          value = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
        }
      }
      e.target.value = value;
    });
  }
}); 