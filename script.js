// Frases Tanda 1 (Inicio)
const frasesParte1 = [
  "Hola Amor",
  "Un día como hoy hace 4 meses empezó todo...",
  "Y nunca me hubiera imaginado todo lo bonito que le has traído a mi vida",
  "Por eso quiero hacerte este detalle...",
  "Pero primero...",
  "Vamos a ponerle Banda sonora a este momento",
  "Y como no podía ser de otra forma..."
];

// Frases Tanda 2 (Antes de la carta)
const frasesParte2 = [
  "Me encantaría darte esto en persona pero...",
  "Aquí tienes una carta :)",
  "Vamos, ábrela"
];

// Frases Tanda 3 (Final tras agotar las tarjetas)
const frasesFinal = [
  "Pero esto...",
  "Sólo ha sido el principio de todo lo que nos queda por vivir <3"
];

let indexParte1 = 0;
let indexParte2 = 0;
let indexFinal = 0;

let faseTexto = 'parte1'; // 'parte1', 'parte2', 'final'

// Selección de elementos
const textContainer = document.getElementById('text-container');
const slideText = document.getElementById('slide-text');
const nextTextBtn = document.getElementById('next-text-btn');

const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play-btn');
const nextMusicBtn = document.getElementById('next-music-btn');
const bgMusic = document.getElementById('bg-music');
const heartsBackground = document.querySelector('.background-hearts');

const letterContainer = document.getElementById('letter-container');
const envelopeClosed = document.getElementById('envelope-closed');
const envelopeOpen = document.getElementById('envelope-open');

const previewModal = document.getElementById('preview-modal');
const modalContainer = document.getElementById('modal-container');
const paperSound = document.getElementById('paper-sound');

// Función para reproducir el sonido de papel
function playPaperSound() {
  if (paperSound) {
    paperSound.volume = 0.25;
    paperSound.currentTime = 0;
    paperSound.play().catch(() => {});
  }
}

// Cargar la primera frase
if (slideText) {
  slideText.textContent = frasesParte1[indexParte1];
}

// Botón SIGUIENTE / REINICIAR para las frases
if (nextTextBtn) {
  nextTextBtn.addEventListener('click', () => {
    textContainer.classList.remove('visible');

    setTimeout(() => {
      if (faseTexto === 'parte1') {
        indexParte1++;
        if (indexParte1 < frasesParte1.length) {
          slideText.textContent = frasesParte1[indexParte1];
          textContainer.classList.add('visible');
        } else {
          textContainer.classList.add('hidden');
          musicContainer.classList.remove('hidden');
          setTimeout(() => musicContainer.classList.add('visible'), 50);
        }
      } else if (faseTexto === 'parte2') {
        indexParte2++;
        if (indexParte2 < frasesParte2.length) {
          slideText.textContent = frasesParte2[indexParte2];
          textContainer.classList.add('visible');
        } else {
          textContainer.classList.add('hidden');
          letterContainer.classList.remove('hidden');
          setTimeout(() => letterContainer.classList.add('visible'), 50);
        }
      } else if (faseTexto === 'final') {
        indexFinal++;
        if (indexFinal < frasesFinal.length) {
          slideText.textContent = frasesFinal[indexFinal];
          if (indexFinal === frasesFinal.length - 1) {
            nextTextBtn.textContent = "VOLVER A ABRIR EL SOBRE";
          }
          textContainer.classList.add('visible');
        } else {
          // Reiniciar el sobre sin detener la música
          textContainer.classList.add('hidden');
          
          stackItems.forEach(item => item.classList.remove('discarded'));
          currentStackIndex = 0;
          esparcirTarjetas();

          envelopeOpen.classList.add('hidden');
          envelopeClosed.classList.remove('hidden');
          envelopeClosed.style.opacity = '1';

          faseTexto = 'parte1';
          indexFinal = 0;
          nextTextBtn.textContent = "SIGUIENTE";

          letterContainer.classList.remove('hidden');
          setTimeout(() => letterContainer.classList.add('visible'), 50);
        }
      }
    }, 600);
  });
}

// Botón PLAY (Música atenuada al 45% y en bucle)
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (bgMusic) {
      bgMusic.volume = 0.45;
      bgMusic.loop = true;
      bgMusic.play();
    }
    if (heartsBackground) heartsBackground.classList.add('active');
    playBtn.classList.add('hidden');
    if (nextMusicBtn) nextMusicBtn.classList.remove('hidden');
  });
}

// Botón SIGUIENTE de la música
if (nextMusicBtn) {
  nextMusicBtn.addEventListener('click', () => {
    musicContainer.classList.remove('visible');
    if (heartsBackground) heartsBackground.classList.add('dimmed');

    setTimeout(() => {
      musicContainer.classList.add('hidden');

      setTimeout(() => {
        faseTexto = 'parte2';
        slideText.textContent = frasesParte2[0];
        textContainer.classList.remove('hidden');
        setTimeout(() => textContainer.classList.add('visible'), 50);
      }, 3000);

    }, 600);
  });
}

// Clic en el sobre cerrado
if (envelopeClosed) {
  envelopeClosed.addEventListener('click', () => {
    envelopeClosed.style.opacity = '0';
    envelopeClosed.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      envelopeClosed.classList.add('hidden');
      envelopeOpen.classList.remove('hidden');
      envelopeOpen.style.opacity = '0';
      
      setTimeout(() => {
        envelopeOpen.style.transition = 'opacity 0.5s ease';
        envelopeOpen.style.opacity = '1';
      }, 50);
    }, 500);
  });
}

// =========================================================
// DISTRIBUCIÓN Y LÓGICA DE TARJETAS
// =========================================================
const stackItems = document.querySelectorAll('.stack-item');
let currentStackIndex = 0;

function esparcirTarjetas() {
  stackItems.forEach((item, index) => {
    item.style.zIndex = stackItems.length - index;

    const rotacion = (Math.random() * 20 - 10).toFixed(1);
    const lado = index % 2 === 0 ? 1 : -1;
    const desplazamientoX = Math.floor((Math.random() * 110 + 35) * lado);

    item.style.setProperty('--rot', `${rotacion}deg`);
    item.style.setProperty('--offset-x', `${desplazamientoX}px`);

    item.addEventListener('click', (e) => {
      e.stopPropagation();

      if (index === currentStackIndex) {
        playPaperSound();

        modalContainer.innerHTML = '';

        const isScratch = item.hasAttribute('data-scratch');

        if (isScratch) {
          prepararValeRasca(item);
        } else {
          modalContainer.innerHTML = item.innerHTML;
        }

        previewModal.classList.remove('hidden');
        requestAnimationFrame(() => {
          previewModal.classList.add('active');
        });
      }
    });
  });
}

esparcirTarjetas();

// =========================================================
// COMPONENTE "RASCA Y GANA" (SIN EMOJIS)
// =========================================================
function prepararValeRasca(itemOriginal) {
  const wrapper = document.createElement('div');
  wrapper.className = 'scratch-wrapper';

  const imgOriginal = itemOriginal.querySelector('img');
  const imgClon = imgOriginal.cloneNode(true);
  imgClon.className = 'polaroid-img';
  wrapper.appendChild(imgClon);

  const canvas = document.createElement('canvas');
  canvas.className = 'scratch-canvas';
  wrapper.appendChild(canvas);

  modalContainer.appendChild(wrapper);

  let haEstadoRascando = false;

  wrapper.addEventListener('click', (e) => {
    if (haEstadoRascando) {
      e.stopPropagation();
      haEstadoRascando = false;
    }
  });

  const setupCanvas = () => {
    const rect = imgClon.getBoundingClientRect();
    const w = imgClon.naturalWidth || rect.width || 340;
    const h = imgClon.naturalHeight || rect.height || 460;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#59111A');
    gradient.addColorStop(0.5, '#A32E3E');
    gradient.addColorStop(1, '#3B0A11');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#F4E8D1';
    ctx.lineWidth = Math.max(4, w * 0.015);
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.fillStyle = '#F4E8D1';
    ctx.font = `bold ${Math.round(w * 0.065)}px Montserrat, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASCA AQUÍ', w / 2, h / 2); // 👈 Texto limpio sin emojis

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getPos(e) {
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - cRect.left) * (canvas.width / cRect.width),
        y: (clientY - cRect.top) * (canvas.height / cRect.height)
      };
    }

    function startScratch(e) {
      e.stopPropagation();
      isDrawing = true;
      haEstadoRascando = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      scratchLine(pos.x, pos.y);
    }

    function scratchLine(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = Math.round(w * 0.16);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    }

    function moveScratch(e) {
      if (!isDrawing) return;
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      haEstadoRascando = true;
      const pos = getPos(e);
      scratchLine(pos.x, pos.y);
    }

    function stopScratch() {
      isDrawing = false;
    }

    canvas.onmousedown = startScratch;
    canvas.onmousemove = moveScratch;
    window.onmouseup = stopScratch;

    canvas.ontouchstart = startScratch;
    canvas.ontouchmove = moveScratch;
    window.ontouchend = stopScratch;
  };

  if (imgClon.complete) {
    setupCanvas();
  } else {
    imgClon.onload = setupCanvas;
  }
}

// Clic para cerrar el visor modal y descartar
if (previewModal) {
  previewModal.addEventListener('click', () => {
    previewModal.classList.remove('active');

    setTimeout(() => {
      previewModal.classList.add('hidden');

      if (currentStackIndex < stackItems.length) {
        stackItems[currentStackIndex].classList.add('discarded');
        currentStackIndex++;

        // Al descartar la última tarjeta (Carta Escrita), inicia la tanda final de frases
        if (currentStackIndex === stackItems.length) {
          setTimeout(() => {
            letterContainer.classList.remove('visible');
            setTimeout(() => {
              letterContainer.classList.add('hidden');
              
              faseTexto = 'final';
              indexFinal = 0;
              slideText.textContent = frasesFinal[0];
              nextTextBtn.textContent = "SIGUIENTE";

              textContainer.classList.remove('hidden');
              setTimeout(() => textContainer.classList.add('visible'), 50);
            }, 800);
          }, 400);
        }
      }
    }, 300);
  });
}