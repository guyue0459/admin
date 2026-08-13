async function loadPortfolio() {
  const response = await fetch('data/portfolio.json');
  const data = await response.json();
  const { person, experiences = [], projects = [] } = data;
  document.title = `${person.name} — Portfolio`;
  text('role', person.role); text('name', person.name); text('heroIntro', person.hero_intro); text('aboutTitle', person.about_title);
  text('copyright', `© ${new Date().getFullYear()} ${person.name} — Portfolio`);
  const email = document.getElementById('email'); email.href = `mailto:${person.email}`;
  document.getElementById('aboutParagraphs').innerHTML = (person.about_paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  document.getElementById('skills').innerHTML = (person.skills || []).map(skill => `<div class="skill-tag">${escapeHtml(skill)}</div>`).join('');
  document.getElementById('socials').innerHTML = (person.socials || []).map(s => `<a href="${escapeAttr(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`).join('');
  document.getElementById('experiences').innerHTML = experiences.map(e => `<article class="exp__item"><div class="exp__meta"><div class="exp__period">${escapeHtml(e.period)}</div><div class="exp__tag">${escapeHtml(e.category)}</div></div><div class="exp__content"><h3 class="exp__company">${escapeHtml(e.organization)}</h3><p class="exp__role">${escapeHtml(e.role)}</p><p class="exp__desc">${escapeHtml(e.description)}</p></div></article>`).join('');
  const categories = [...new Set(projects.map(p => p.category))];
  document.getElementById('filter').innerHTML = `<button class="filter__btn active" data-filter="all">全部</button>${categories.map(c => `<button class="filter__btn" data-filter="${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}`;
  document.getElementById('projects').innerHTML = projects.map(p => `<article class="work__card" data-category="${escapeAttr(p.category)}"><div class="card__img"><img src="${escapeAttr(p.image || 'images/placeholder.svg')}" alt="${escapeAttr(p.title)}" /><div class="card__overlay"><a href="${escapeAttr(p.url || '#')}" class="card__link" ${p.url ? 'target="_blank" rel="noopener"' : ''}>查看作品 →</a></div></div><div class="card__info"><span class="card__tag">${escapeHtml(p.category)}</span><h3 class="card__title">${escapeHtml(p.title)}</h3><p class="card__desc">${escapeHtml(p.description)}</p></div></article>`).join('');
  document.querySelectorAll('.filter__btn').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter__btn').forEach(b => b.classList.toggle('active', b === button)); document.querySelectorAll('.work__card').forEach(card => card.classList.toggle('hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter)); }));
  motion();
}
function motion() {
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger); gsap.defaults({ ease: 'power3.out', duration: .7 });
  gsap.from('.nav__logo, .nav__links li', { y: -12, autoAlpha: 0, stagger: .06, clearProps: 'all' });
  ScrollTrigger.batch('.section, .work__card', { start: 'top 84%', once: true, onEnter: batch => gsap.from(batch, { y: 24, autoAlpha: 0, stagger: .08, clearProps: 'all' }) });
  document.querySelectorAll('.work__card').forEach(card => { const image = card.querySelector('img'); card.addEventListener('pointerenter', () => { gsap.to(card, { y: -7, duration: .35 }); gsap.to(image, { scale: 1.04, duration: .5 }); }); card.addEventListener('pointerleave', () => { gsap.to(card, { y: 0, duration: .4 }); gsap.to(image, { scale: 1, duration: .4 }); }); });
}
function text(id, value) { document.getElementById(id).textContent = value || ''; }
function escapeHtml(value = '') { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }
function escapeAttr(value = '') { return escapeHtml(value).replace(/`/g, '&#96;'); }
loadPortfolio();
