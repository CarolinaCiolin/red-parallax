const scenes = Array.from(document.querySelectorAll('.scene'));
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsBox = document.getElementById('progress-dots');

let currentIndex = 0;
let isAnimating = false;

scenes.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ir para seção ${index + 1}`);
  dot.addEventListener('click', () => goTo(index));
  dotsBox.appendChild(dot);
});

const dots = Array.from(document.querySelectorAll('.dot'));

function updateParallaxLayers() {
  scenes.forEach((scene, index) => {
    const distance = index - currentIndex;
    scene.style.setProperty('--parallax-x', distance * 100);
  });
}

function updateUI() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === scenes.length - 1;
  dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
  updateParallaxLayers();
}

function activateScene(nextIndex) {
  scenes.forEach((scene, index) => {
    scene.classList.toggle('active', index === nextIndex);
    if (index !== nextIndex) scene.classList.remove('leaving');
  });
}

function goTo(nextIndex) {
  nextIndex = Math.max(0, Math.min(nextIndex, scenes.length - 1));
  if (nextIndex === currentIndex || isAnimating) return;

  isAnimating = true;

  const oldIndex = currentIndex;
  const oldScene = scenes[oldIndex];
  const nextScene = scenes[nextIndex];

  oldScene.classList.remove('active');
  oldScene.classList.add('leaving');
  nextScene.classList.add('active');

  currentIndex = nextIndex;
  updateUI();

  window.setTimeout(() => {
    oldScene.classList.remove('leaving');
    activateScene(currentIndex);
    isAnimating = false;
    updateUI();
  }, 960);
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

window.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (isAnimating) return;
  goTo(currentIndex + (event.deltaY > 0 ? 1 : -1));
}, { passive: false });

window.addEventListener('keydown', (event) => {
  if (isAnimating) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') goTo(currentIndex + 1);
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') goTo(currentIndex - 1);
});

let touchStartY = 0;
window.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  if (isAnimating) return;
  const touchEndY = event.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 45) goTo(currentIndex + (diff > 0 ? 1 : -1));
}, { passive: true });

activateScene(currentIndex);
updateUI();

let bgOffset = 0;
function animateBackground() {
  bgOffset -= 0.8; 
  document.documentElement.style.setProperty('--bg-offset', `${bgOffset}px`);
  requestAnimationFrame(animateBackground);
}
animateBackground();
