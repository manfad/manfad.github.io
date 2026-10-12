<script setup lang="ts">
import { annotate } from 'rough-notation'
import type { Project } from '../../data/projects'

defineProps<{ products: Project[]; websites: Project[] }>()

const circles = new WeakMap<HTMLElement, ReturnType<typeof annotate>>()

// draw a rough circle around the name on hover/focus, wipe it on leave
const show = (event: Event) => {
  const name = (event.currentTarget as HTMLElement).querySelector<HTMLElement>('.name')
  if (!name) return
  let circle = circles.get(name)
  if (!circle) {
    circle = annotate(name, { type: 'circle', color: '#4467c4', padding: 6, strokeWidth: 1.5, animationDuration: 400 })
    circles.set(name, circle)
  }
  circle.show()
}

const hide = (event: Event) => {
  const name = (event.currentTarget as HTMLElement).querySelector<HTMLElement>('.name')
  if (name) circles.get(name)?.hide()
}

const number = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="index">
    <template v-for="(group, g) in [{ title: 'Tools', items: products, offset: 0 }, { title: 'Websites', items: websites, offset: products.length }]" :key="g">
      <h3 class="group-title">{{ group.title }}</h3>
      <ol class="entries">
        <li v-for="(project, i) in group.items" :key="project.name">
          <a
            :href="project.link"
            target="_blank"
            rel="noopener"
            class="entry"
            @mouseenter="show"
            @mouseleave="hide"
            @focus="show"
            @blur="hide"
          >
            <span class="number">{{ number(group.offset + i + 1) }}</span>
            <span class="name">{{ project.name }}</span>
            <span class="leader" aria-hidden="true"></span>
            <span class="kind">{{ project.kind }} ↗</span>
            <span class="note">{{ project.description }}</span>
          </a>
        </li>
      </ol>
    </template>
  </div>
</template>

<style scoped>
.index {
  margin: 1rem 0;
}

.group-title {
  margin: 1.25rem 0 0.25rem;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-soft);
}

.entries {
  list-style: none;
  padding: 0;
}

.entry {
  display: grid;
  grid-template-columns: 2.2rem auto 1fr auto;
  align-items: baseline;
  column-gap: 0.6rem;
  padding: 0.3rem 0;
  border: none;
}

.number {
  font-size: 0.85rem;
  color: var(--fg-softer);
  font-variant-numeric: tabular-nums;
}

.name {
  font-size: 1.3rem;
  line-height: 1.4;
}

.leader {
  align-self: end;
  margin-bottom: 0.55rem;
  border-bottom: 2px dotted var(--fg-softer);
}

.kind {
  font-size: 0.9rem;
  color: var(--fg-soft);
}

/* the margin note: hidden until hover on pointer devices, always shown on touch */
.note {
  grid-column: 2 / -1;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--fg-soft);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.25s ease,
    opacity 0.2s ease;
}

.entry:hover .note,
.entry:focus-visible .note {
  max-height: 3rem;
  opacity: 1;
}

.entry:hover,
.entry:focus-visible {
  color: inherit;
}

.entry:hover .kind,
.entry:focus-visible .kind {
  color: var(--accent);
}

.entry:focus-visible {
  outline: 2px dashed var(--accent);
  outline-offset: 4px;
}

@media (hover: none) {
  .note {
    max-height: none;
    opacity: 1;
  }
}

@media (max-width: 30rem) {
  .entry {
    grid-template-columns: 1.8rem auto 1fr;
  }

  .kind {
    grid-column: 2 / -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .note {
    transition: none;
  }
}
</style>
