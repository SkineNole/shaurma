(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const intro = document.querySelector('.fire-intro');
  const canvas = intro.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  // Draw Bézier curves at screen density, including on high-DPI phones.
  const width = 416;
  const height = 172;
  const density = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  context.scale(canvas.width / width, canvas.height / height);

  function smoothStep(start, end, time) {
    const progress = Math.max(0, Math.min(1, (time - start) / (end - start)));
    return progress * progress * (3 - 2 * progress);
  }

  function flame(width, height, sway, colors) {
    const gradient = context.createLinearGradient(0, -height, 0, 3);
    colors.forEach(([position, color]) => gradient.addColorStop(position, color));
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, 3);
    context.bezierCurveTo(-width, 3, -width * 1.17, -height * .31, -width * .62, -height * .52);
    context.bezierCurveTo(-width * .3, -height * .63, sway * .5, -height * .77, sway, -height);
    context.bezierCurveTo(sway + width * .45, -height * .82, width * .59, -height * .61, width * .33, -height * .49);
    context.bezierCurveTo(width * 1.18, -height * .44, width * 1.28, 2, 0, 3);
    context.fill();
  }

  const outerColors = [[0, '#ff632f'], [.55, '#ff8428'], [1, '#e24821']];
  const middleColors = [[0, '#ffb038'], [.63, '#ffcc56'], [1, '#ff8928']];
  const coreColors = [[0, '#ffe782'], [.62, '#fff3b0'], [1, '#ffce56']];
  const flames = [.74, .88, 1, .88, .74].map((scale, index) => {
    const x = width / 2 + (index - 2) * 68;
    const halo = context.createRadialGradient(x, 90, 4, x, 90, 65);
    halo.addColorStop(0, '#fe6a2535');
    halo.addColorStop(1, '#fe6a2500');
    return { x, scale, halo };
  });

  function draw(time) {
    context.clearRect(0, 0, width, height);

    flames.forEach(({ x, scale, halo }, index) => {
      const age = Math.max(0, time - index * 95);
      const fade = 1 - smoothStep(940, 1450, time - (4 - index) * 37);
      const intensity = smoothStep(0, 180, age) * fade;
      const phase = age + index * 186;
      const sway = Math.sin(phase * .013) * 7 + Math.sin(phase * .027) * 2.5;
      const flicker = 1 + Math.sin(phase * .014) * .075 + Math.sin(phase * .044) * .04;

      context.save();
      context.globalAlpha = intensity;
      context.fillStyle = halo;
      context.fillRect(x - 65, 25, 130, 130);
      context.translate(x, 120);
      context.scale(scale * (.72 + .28 * intensity), scale * (.35 + .65 * intensity));
      flame(27, 79 * flicker, sway, outerColors);
      flame(18, 58 * flicker, sway * .65 - 6, middleColors);
      flame(9, 31 * flicker, sway * .25 + 4, coreColors);
      context.restore();

      for (let spark = 0; spark < 2; spark++) {
        const travel = (phase + spark * 275) % 650 / 650;
        context.globalAlpha = intensity * Math.sin(travel * Math.PI) * .8;
        context.fillStyle = spark ? '#ff9c43' : '#ffe39b';
        context.beginPath();
        context.arc(x + Math.sin(index + spark + travel * 5) * 14,
          89 - travel * 54, 1.65 - travel * .8, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    });
  }

  let frame;
  let timeout;
  function dismiss() {
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    window.removeEventListener('keydown', dismiss);
    intro.remove();
  }

  intro.hidden = false;
  intro.addEventListener('animationend', dismiss, { once: true });
  window.addEventListener('keydown', dismiss, { once: true });
  timeout = window.setTimeout(dismiss, 2150);

  const start = performance.now();
  function animate(now) {
    draw(now - start);
    frame = requestAnimationFrame(animate);
  }
  frame = requestAnimationFrame(animate);
})();

