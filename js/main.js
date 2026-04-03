// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Contact form validation & submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const fields = [
    { id: 'name', validate: v => v.trim().length > 0 },
    { id: 'email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'phone', validate: v => v.replace(/\D/g, '').length >= 7 },
    { id: 'business', validate: v => v.trim().length > 0 },
    { id: 'message', validate: v => v.trim().length > 0 }
  ];

  // Clear error on input
  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('error');
      });
    }
  });

  // Format phone number as user types
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      if (digits.length >= 7) {
        e.target.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length >= 4) {
        e.target.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        e.target.value = `(${digits}`;
      }
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    let hasErrors = false;

    // Validate all fields
    fields.forEach(({ id, validate }) => {
      const input = document.getElementById(id);
      const group = input.closest('.form-group');
      if (!validate(input.value)) {
        group.classList.add('error');
        hasErrors = true;
      } else {
        group.classList.remove('error');
      }
    });

    if (hasErrors) {
      // Focus the first invalid field
      const firstError = contactForm.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Send via Web3Forms
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.className = 'form-status';
    status.style.display = 'none';

    const formData = new FormData(contactForm);
    // TODO: Replace with your Web3Forms access key
    // Sign up free at https://web3forms.com to get your key
    formData.append('access_key', '6db08d91-9564-4e64-a215-740ef6d258c2');
    formData.append('subject', 'New inquiry from ' + formData.get('name') + ' — Grumpy Sites');
    formData.append('from_name', 'Grumpy Sites Contact Form');
    formData.append('botcheck', ''); // Web3Forms honeypot — bots fill this, humans don't

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        status.className = 'form-status success';
        status.textContent = 'Message sent! I\'ll get back to you within 24 hours.';
        status.style.display = 'block';
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = 'Something went wrong. Please call (385) 522-0254 instead.';
      status.style.display = 'block';
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
}
