// Укажите номер в международном формате, например +79991234567.
const orderPhone = '';
const formattedPhone = '';

if (/^\+[1-9]\d{7,14}$/.test(orderPhone)) {
  const call = document.createElement('a');
  call.href = 'tel:' + orderPhone;
  call.textContent = formattedPhone || orderPhone;
  const label = document.createElement('span');
  label.textContent = 'Позвонить и заказать ↗';
  call.append(document.createElement('br'), label);
  document.querySelector('#order-contact').replaceChildren(call);
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
}

// Добавьте URL профилей, чтобы кнопки открывали страницы заведения.
const socialUrls = { telegram: '', max: '', vk: '', whatsapp: '' };
const socialDialog = document.querySelector('#social-dialog');

document.querySelectorAll('[data-social]').forEach(button => {
  const url = socialUrls[button.dataset.social];
  if (/^https:\/\//.test(url)) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', button.getAttribute('aria-label'));
    link.title = button.title;
    link.append(...button.childNodes);
    button.replaceWith(link);
    return;
  }

  button.addEventListener('click', () => {
    socialDialog.querySelector('h2').textContent = button.getAttribute('aria-label');
    socialDialog.showModal();
  });
});

