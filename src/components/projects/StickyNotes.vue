<script setup lang="ts">
import type { Project } from '../../data/projects'

defineProps<{ products: Project[]; websites: Project[] }>()

// fixed, hand-picked tilts so the board looks pinned by hand but never reshuffles
const tilts = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.1, -2.2, 2]
const tilt = (i: number) => `${tilts[i % tilts.length]}deg`
</script>

<template>
  <div class="board">
    <a
      v-for="(project, i) in [...products, ...websites]"
      :key="project.name"
      :href="project.link"
      target="_blank"
      rel="noopener"
      class="note"
      :data-kind="i < products.length ? 'tool' : 'site'"
      :style="{ '--tilt': tilt(i) }"
    >
      <span class="tape" aria-hidden="true"></span>
      <span class="name">{{ project.name }}</span>
      <span class="description">{{ project.description }}</span>
      <span class="tags">{{ project.tags.join(' · ') }} ↗</span>
    </a>
  </div>
  <p class="legend">
    <span class="swatch" data-kind="tool"></span> tools I build
    <span class="swatch" data-kind="site"></span> websites for local businesses
  </p>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
  gap: 1.75rem 1.25rem;
  padding: 1.25rem 0.25rem 0.5rem;
}

.note {
  --paper: #fff3b0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: 11rem;
  padding: 1.4rem 1rem 0.9rem;
  border: none;
  color: #2a2a2a;
  background: var(--paper);
  /* slightly curled bottom edge */
  border-radius: 2px 2px 6px 18px / 2px 2px 6px 6px;
  box-shadow:
    0 1px 1px rgb(0 0 0 / 0.08),
    0 6px 10px -4px rgb(0 0 0 / 0.18);
  rotate: var(--tilt);
  transition:
    rotate 0.25s ease,
    translate 0.25s ease,
    box-shadow 0.25s ease;
}

.note[data-kind='site'] {
  --paper: #cdeccf;
}

.note:hover,
.note:focus-visible {
  color: #2a2a2a;
  rotate: 0deg;
  translate: 0 -4px;
  box-shadow:
    0 1px 1px rgb(0 0 0 / 0.08),
    0 14px 20px -8px rgb(0 0 0 / 0.28);
}

.note:focus-visible {
  outline: 2px dashed var(--accent);
  outline-offset: 4px;
}

.tape {
  position: absolute;
  top: -0.7rem;
  left: 50%;
  width: 4.5rem;
  height: 1.4rem;
  translate: -50% 0;
  rotate: calc(var(--tilt) * -1.6);
  background: rgb(255 255 255 / 0.55);
  border-left: 1px dashed rgb(0 0 0 / 0.12);
  border-right: 1px dashed rgb(0 0 0 / 0.12);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}

.name {
  font-size: 1.15rem;
  line-height: 1.25;
}

.description {
  font-size: 0.88rem;
  line-height: 1.5;
  text-wrap: pretty;
}

.tags {
  margin-top: auto;
  font-size: 0.78rem;
  color: rgb(0 0 0 / 0.55);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--fg-soft);
}

.swatch {
  display: inline-block;
  width: 0.9rem;
  height: 0.9rem;
  margin-left: 0.6rem;
  border-radius: 2px;
  background: #fff3b0;
}

.swatch:first-child {
  margin-left: 0;
}

.swatch[data-kind='site'] {
  background: #cdeccf;
}

@media (prefers-reduced-motion: reduce) {
  .note {
    transition: box-shadow 0.25s ease;
  }

  .note:hover,
  .note:focus-visible {
    rotate: var(--tilt);
    translate: none;
  }
}
</style>
