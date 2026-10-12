<script setup lang="ts">
import rough from 'roughjs'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import type { Project } from '../../data/projects'

const props = defineProps<{ products: Project[]; websites: Project[] }>()

const frame = ref<HTMLElement | null>(null)
const outline = ref<SVGSVGElement | null>(null)
const active = shallowRef<Project>(props.products[0])

const folder = (p: Project) => p.name.toLowerCase().replace(/\s+/g, '-') + '/'
const width = computed(() => Math.max(...[...props.products, ...props.websites].map((p) => folder(p).length)))

// hand-drawn window frame + title bar rule, redrawn whenever the box resizes
const draw = () => {
  const svg = outline.value
  const box = frame.value
  if (!svg || !box) return
  const { width: w, height: h } = box.getBoundingClientRect()
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.replaceChildren()
  const rc = rough.svg(svg)
  const stroke = { stroke: 'currentColor', strokeWidth: 1.5, roughness: 1.2, seed: 11 }
  svg.appendChild(rc.rectangle(3, 3, w - 6, h - 6, stroke))
  svg.appendChild(rc.line(3, 38, w - 3, 38, { ...stroke, seed: 12 }))
  ;['#ff6b6b', '#ffd43b', '#69db7c'].forEach((fill, i) =>
    svg.appendChild(rc.circle(22 + i * 20, 21, 12, { ...stroke, seed: 13 + i, fill, fillStyle: 'solid' })),
  )
}

let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(draw)
  if (frame.value) observer.observe(frame.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="frame" class="terminal">
    <svg ref="outline" class="outline" aria-hidden="true"></svg>
    <div class="title">~/projects — zsh</div>
    <div class="screen">
      <template v-for="group in [{ dir: '~/projects', items: products }, { dir: '~/clients', items: websites }]" :key="group.dir">
        <p class="prompt"><span class="caret">$</span> ls -l {{ group.dir }}</p>
        <ul class="listing">
          <li v-for="project in group.items" :key="project.name">
            <a
              :href="project.link"
              target="_blank"
              rel="noopener"
              class="row"
              :aria-current="active === project ? 'true' : undefined"
              @mouseenter="active = project"
              @focus="active = project"
            >
              <span class="perm">drwxr-xr-x</span>
              <span class="dir" :style="{ minWidth: `${width}ch` }">{{ folder(project) }}</span>
              <span class="kind">{{ project.kind }}</span>
            </a>
          </li>
        </ul>
      </template>
      <p class="prompt"><span class="caret">$</span> cat {{ folder(active) }}README</p>
      <p class="output" aria-live="polite">{{ active.description }} <span class="tags">[{{ active.tags.join(', ') }}]</span></p>
      <p class="prompt"><span class="caret">$</span> <span class="cursor" aria-hidden="true"></span></p>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  position: relative;
  margin: 1.25rem 0;
  color: var(--fg);
}

.outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.title {
  height: 38px;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  color: var(--fg-soft);
}

.screen {
  padding: 0.9rem 1.2rem 1.1rem;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.85rem;
  line-height: 1.7;
}

.prompt,
.output {
  margin: 0;
}

.prompt + .listing,
.listing + .prompt {
  margin-top: 0.15rem;
}

.listing + .prompt {
  margin-top: 0.6rem;
}

.caret {
  color: var(--accent);
}

.listing {
  list-style: none;
  padding: 0;
}

.row {
  display: flex;
  gap: 1.2ch;
  padding: 0 0.4rem;
  margin: 0 -0.4rem;
  border: none;
  border-radius: 3px;
  white-space: nowrap;
}

.row:where([aria-current='true']) {
  background: color-mix(in oklab, var(--accent) 14%, transparent);
}

.row:hover,
.row:focus-visible {
  color: inherit;
}

.row:focus-visible {
  outline: 2px dashed var(--accent);
  outline-offset: 1px;
}

.perm {
  color: var(--fg-softer);
}

.dir {
  color: var(--accent);
}

.kind {
  color: var(--fg-soft);
  overflow: hidden;
  text-overflow: ellipsis;
}

.output {
  color: var(--fg-soft);
  text-wrap: pretty;
}

.tags {
  color: var(--fg-softer);
}

.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.1em;
  vertical-align: -0.2em;
  background: var(--fg);
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 30rem) {
  .perm {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}
</style>
