import { isDesktop } from './helpers.js';

const editor = document.querySelector('.editor');
const sidebar = document.querySelector('.sidebar');
const scrollbar = document.querySelector('.scrollbar');

function getPercentage(target) {
  const { scrollTop, scrollHeight, offsetHeight } = target;
  const maximum = scrollHeight - offsetHeight;
  const precentage = Math.round((scrollTop / maximum) * 100);
  return precentage || 0;
}

function normalize(deltaY) {
  const speed = 53;
  const direction = deltaY > 0 ? 1 : -1;
  return direction * speed;
}

function sync(deltaY) {
  const speed = normalize(deltaY);
  editor.scrollTop += speed;
  sidebar.scrollTop += speed;
}

export function update() {
  if (isDesktop(window.innerWidth)) {
    if (editor.scrollHeight > sidebar.scrollHeight) {
      scrollbar.style.width = `${getPercentage(editor)}%`;
    } else {
      scrollbar.style.width = `${getPercentage(sidebar)}%`;
    }
  }
}

function handleWheel(event) {
  sync(event.deltaY);
  update();
}

document.addEventListener('wheel', handleWheel, {
  capture: false,
  passive: true,
});
