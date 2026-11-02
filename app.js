'use strict';
const content = window.SANU_CONTENT;
document.title = content.pageTitle;
document.querySelectorAll('[data-copy]').forEach(element => {
  element.textContent = content[element.dataset.copy] ?? '';
});
const reveal = document.querySelector('#reveal-flowers');
const flowerMessage = document.querySelector('#flower-message');
reveal.addEventListener('click', () => {
  const expanded = reveal.getAttribute('aria-expanded') === 'true';
  reveal.setAttribute('aria-expanded', String(!expanded));
  flowerMessage.hidden = expanded;
  reveal.textContent = expanded ? 'Open the little note ♡' : 'Close the note';
});
const area = document.querySelector('#answer-playground');
const no = document.querySelector('#no-button');
const yes = document.querySelector('#yes-button');
const response = document.querySelector('#answer-response');
let moves = 0;
// Fixed, bounded destinations keep No inside the page and away from Yes.
// Click (including touch and keyboard activation) triggers the joke, not hover.
function moveNo() {
  const maxX = Math.max(0, area.clientWidth - no.offsetWidth - 12);
  const destinations = [
    { x: maxX, y: 100 }, { x: 12, y: 190 },
    { x: maxX, y: 190 }, { x: 12, y: 100 }
  ];
  const next = destinations[(moves - 1) % destinations.length];
  no.style.left = `${next.x}px`;
  no.style.top = `${next.y}px`;
}
no.addEventListener('click', () => {
  response.textContent = content.noResponse;
  moves += 1;
  moveNo();
});
yes.addEventListener('click', () => {
  response.textContent = content.yesResponse;
  area.classList.add('answered');
  yes.setAttribute('aria-pressed', 'true');
  const shower = document.querySelector('#heart-shower');
  shower.replaceChildren();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 14; i += 1) {
      const heart = document.createElement('span');
      heart.textContent = i % 3 === 0 ? '✿' : '♡';
      heart.style.setProperty('--x', `${(i / 13) * 90 + 5}%`);
      heart.style.setProperty('--delay', `${(i % 5) * .07}s`);
      shower.append(heart);
    }
    setTimeout(() => shower.replaceChildren(), 2400);
  }
});
window.addEventListener('resize', () => { if (moves) moveNo(); });
