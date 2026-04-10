const faqButtons = document.querySelectorAll('.faq-item');

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
  });
});
