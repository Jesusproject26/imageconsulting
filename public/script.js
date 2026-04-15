const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Sending...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.success) {
        statusEl.textContent = result.message;
        statusEl.style.color = '#00c46a';
        form.reset();
      } else {
        statusEl.textContent = result.message || 'Something went wrong.';
        statusEl.style.color = '#f97373';
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Network error. Please try again.';
      statusEl.style.color = '#f97373';
    }
  });
}
