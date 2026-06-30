<template>
  <button
    class="hero-die"
    :class="{ 'is-forging': forging }"
    aria-label="Generate character"
    @click="$emit('forge')"
  >
    <span class="arcane-ring"></span>
    <span class="arcane-ring inner"></span>
    <span class="compass-mark north"></span>
    <span class="compass-mark east"></span>
    <span class="compass-mark south"></span>
    <span class="compass-mark west"></span>
    <span class="die-aura"></span>
    <span class="die-core">
      <span class="die-ground-shadow"></span>
      <span class="die-spinner">
        <img class="die-art" src="/static/d20-hero-premium.png" alt="" />
      </span>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    forging: {
      type: Boolean,
      default: false
    }
  },
  emits: ['forge']
};
</script>

<style scoped>
.hero-die {
  --die-y-offset: 0px;
  position: relative;
  align-self: center;
  width: min(360px, 92vw);
  aspect-ratio: 1 / 1;
  margin: 34px 0 24px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  perspective: 720px;
  -webkit-tap-highlight-color: transparent;
}

.hero-die:focus {
  outline: none;
}

.hero-die:focus-visible .arcane-ring {
  border-color: rgba(214, 164, 70, 0.74);
  box-shadow: 0 0 0 3px rgba(180, 116, 28, 0.18);
}

.arcane-ring {
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(176, 140, 81, 0.38);
  border-radius: 50%;
}

.arcane-ring.inner {
  inset: 48px;
  border-style: dashed;
  opacity: 0.78;
}

.compass-mark {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 1px solid rgba(176, 140, 81, 0.55);
  transform: rotate(45deg);
}

.compass-mark.north { top: 5px; left: calc(50% - 9px); }
.compass-mark.east { right: 5px; top: calc(50% - 9px); }
.compass-mark.south { bottom: 5px; left: calc(50% - 9px); }
.compass-mark.west { left: 5px; top: calc(50% - 9px); }

.die-aura {
  position: absolute;
  inset: 28px;
  border: 1px solid rgba(164, 122, 59, 0.22);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(164, 122, 59, 0.07), 0 20px 34px rgba(86, 47, 13, 0.18);
}

.die-core {
  position: absolute;
  left: 50%;
  top: calc(50% + var(--die-y-offset));
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  transition: transform 260ms ease;
  will-change: transform;
}

.die-spinner {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform-origin: 50% 54%;
  will-change: transform, filter;
}

.die-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: 50% 54%;
}

.die-ground-shadow {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: -8px;
  height: 24px;
  z-index: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(58, 27, 8, 0.18), rgba(58, 27, 8, 0.08) 42%, transparent 72%);
  filter: blur(7px);
}

.hero-die:active .die-core,
.hero-die.is-forging .die-core {
  animation: die-throw-path 980ms cubic-bezier(0.18, 0.84, 0.24, 1);
}

.hero-die:active .die-spinner,
.hero-die.is-forging .die-spinner {
  animation: die-spin-settle 980ms cubic-bezier(0.16, 0.8, 0.22, 1);
}

.hero-die:active .die-aura,
.hero-die.is-forging .die-aura {
  animation: aura-forge-pulse 920ms ease-out;
}

.hero-die:active .die-ground-shadow,
.hero-die.is-forging .die-ground-shadow {
  animation: shadow-forge-pulse 920ms ease-out;
}

.hero-die:active .arcane-ring,
.hero-die.is-forging .arcane-ring {
  animation: ring-forge-turn 920ms ease-out;
}

@keyframes die-throw-path {
  0% {
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
  14% {
    transform: translate3d(-57%, -48%, 0) scale(0.96);
  }
  34% {
    transform: translate3d(-64%, -70%, 0) scale(0.88);
  }
  58% {
    transform: translate3d(-38%, -54%, 0) scale(1.02);
  }
  74% {
    transform: translate3d(-52%, -47%, 0) scale(1.04);
  }
  86% {
    transform: translate3d(-49%, -52%, 0) scale(0.99);
  }
  100% {
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
}

@keyframes die-spin-settle {
  0% {
    transform: rotate(0deg) scale(1);
    filter: brightness(1);
  }
  18% {
    transform: rotate(-54deg) scale(0.98);
    filter: brightness(0.9);
  }
  38% {
    transform: rotate(234deg) scale(1.04);
    filter: brightness(1.16);
  }
  62% {
    transform: rotate(392deg) scale(1.02);
    filter: brightness(1.08);
  }
  78% {
    transform: rotate(346deg) scale(0.985);
    filter: brightness(0.98);
  }
  100% {
    transform: rotate(360deg) scale(1);
    filter: brightness(1);
  }
}

@keyframes aura-forge-pulse {
  0% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 28px rgba(164, 122, 59, 0.07), 0 20px 34px rgba(86, 47, 13, 0.18);
  }
  38% {
    opacity: 0.92;
    transform: scale(1.045);
    box-shadow: 0 0 0 36px rgba(189, 137, 56, 0.12), 0 24px 42px rgba(86, 47, 13, 0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 28px rgba(164, 122, 59, 0.07), 0 20px 34px rgba(86, 47, 13, 0.18);
  }
}

@keyframes shadow-forge-pulse {
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  18% {
    transform: scaleX(1.18);
    opacity: 0.86;
  }
  36% {
    transform: scaleX(0.58);
    opacity: 0.38;
  }
  66% {
    transform: scaleX(1.24);
    opacity: 0.78;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes ring-forge-turn {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  46% {
    transform: rotate(16deg);
    opacity: 0.78;
  }
  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}

@media (max-width: 360px) {
  .hero-die {
    width: 292px;
  }
}
</style>
