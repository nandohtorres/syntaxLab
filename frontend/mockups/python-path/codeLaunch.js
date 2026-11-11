// "Tap your code to launch it": every visible character becomes its own piece at its exact screen spot,
// then flies off with a random direction and spin. Uses the Web Animations API; no dependency.
export const LAUNCH_MS = 800
export const REDUCED_MOTION_FADE_MS = 200
const VIBRATION_MS = 35

const random = (low, high) => low + Math.random() * (high - low)

// A short buzz on phones that support it; ignored everywhere else.
export function launchVibration() {
  if (!globalThis.matchMedia?.('(pointer: coarse)').matches) return
  try { navigator.vibrate?.(VIBRATION_MS) } catch { /* vibration is optional */ }
}

// Resolves after the animation; the overlay layer is always removed, even if animate() is unavailable.
export function launchCharacters({ fontFamily, fontSize, boxes }) {
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2000;overflow:hidden'
  for (const box of boxes) {
    const piece = document.createElement('span')
    piece.textContent = box.char
    piece.style.cssText = `position:absolute;left:${box.left}px;top:${box.top}px;height:${box.height}px;line-height:${box.height}px;white-space:pre;will-change:transform,opacity`
    piece.style.fontFamily = fontFamily
    piece.style.fontSize = fontSize
    piece.style.color = box.color
    layer.appendChild(piece)
    const angle = random(0, Math.PI * 2)
    const distance = random(140, 460)
    // A slight upward bias reads as "launch" rather than "fall apart".
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - random(60, 160)
    piece.animate?.([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px) rotate(${random(-540, 540)}deg) scale(${random(0.6, 1.4)})`, opacity: 0 },
    ], { duration: LAUNCH_MS * random(0.7, 1), easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' })
  }
  document.body.appendChild(layer)
  return new Promise(resolve => setTimeout(() => { layer.remove(); resolve() }, LAUNCH_MS))
}
