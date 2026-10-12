<script setup lang="ts">
import { RCard } from 'roughness'

interface Project {
  name: string
  description: string
  tags: string[]
  link?: string
}

defineProps<{ projects: Project[]; label?: string }>()

// "https://github.com/manfad/yfui" → "github.com/manfad/yfui"
const host = (link: string) => {
  const url = new URL(link)
  return (url.host + url.pathname).replace(/\/$/, '')
}
</script>

<template>
  <div class="project-group">
    <p v-if="label" class="row-label">{{ label }}</p>
    <div class="cards">
      <component
        :is="project.link ? 'a' : 'div'"
        v-for="project in projects"
        :key="project.name"
        :href="project.link"
        class="card-link"
        :target="project.link ? '_blank' : undefined"
        :rel="project.link ? 'noopener' : undefined"
      >
        <RCard class="card">
          <div class="card-body">
            <h3 class="name">{{ project.name }}</h3>
            <p class="description">{{ project.description }}</p>
            <div class="meta">
              <span class="tags">{{ project.tags.join(' · ') }}</span>
              <span v-if="project.link" class="host">{{ host(project.link) }} ↗</span>
            </div>
          </div>
        </RCard>
      </component>
    </div>
  </div>
</template>

<style scoped>
.project-group {
  margin: 0.9rem 0 1.5rem;
}

.row-label {
  color: var(--fg-soft);
  margin: 0 0 0.4rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}

.card-link {
  display: block;
  border: none;
  border-radius: 4px;
  transition: transform 0.2s ease, color 0.2s ease;
}

/* recolour the hand-drawn stroke, not just the text */
.card-link:hover,
.card-link:focus-visible {
  --r-common-color: var(--accent);
  transform: translateY(-2px);
}

.card-link:focus-visible {
  outline: 2px dashed var(--accent);
  outline-offset: 4px;
}

.card {
  height: 100%;
  --r-card-padding-block: 0.9rem;
  --r-card-padding-inline: 1.1rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  height: 100%;
}

.name {
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.3;
  color: var(--fg);
}

.description {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--fg);
  text-wrap: pretty;
}

/* pinned to the bottom so every card's footer lines up */
.meta {
  margin-top: auto;
  padding-top: 0.35rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem 0.75rem;
  font-size: 0.8rem;
  color: var(--fg-soft);
}

.host {
  overflow-wrap: anywhere;
}

.card-link:hover .host,
.card-link:focus-visible .host {
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .card-link {
    transition: color 0.2s ease;
  }

  .card-link:hover,
  .card-link:focus-visible {
    transform: none;
  }
}
</style>
