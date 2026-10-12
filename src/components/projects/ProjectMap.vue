<script setup lang="ts">
import rough from 'roughjs'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { Project } from '../../data/projects'

const props = defineProps<{ products: Project[]; websites: Project[] }>()

interface Node {
  project: Project
  x: number
  y: number
  rx: number
  group: 'tool' | 'site'
}

const RY = 22
const ME = { rx: 34, ry: 26 }
const fills = { tool: '#ffe066', site: '#b7e4c7' }

// two hand-placed layouts: a wide mind-map and a stacked one for phones
const layouts = {
  wide: {
    w: 640,
    h: 420,
    me: { x: 320, y: 200 },
    tools: [[175, 50], [115, 125], [95, 200], [115, 275], [175, 350]],
    sites: [[470, 110], [525, 200], [470, 290]],
    labels: [{ x: 140, y: 404, text: 'my tools' }, { x: 495, y: 360, text: 'Sabah businesses' }],
  },
  narrow: {
    w: 360,
    h: 560,
    me: { x: 180, y: 40 },
    tools: [[95, 160], [95, 245], [95, 330], [95, 415], [95, 500]],
    sites: [[268, 180], [268, 290], [268, 400]],
    labels: [{ x: 95, y: 112, text: 'my tools' }, { x: 268, y: 132, text: 'Sabah businesses' }],
  },
}

const wrap = ref<HTMLElement | null>(null)
const edges = ref<SVGGElement | null>(null)
const bubbles = ref<SVGGElement | null>(null)
const mode = ref<keyof typeof layouts>('wide')
const active = shallowRef<Project | null>(null)

const layout = computed(() => layouts[mode.value])

const nodes = computed<Node[]>(() => {
  const radius = (p: Project) => p.name.length * 5.2 + 20
  return [
    ...props.products.map((project, i) => ({ project, x: layout.value.tools[i][0], y: layout.value.tools[i][1], rx: radius(project), group: 'tool' as const })),
    ...props.websites.map((project, i) => ({ project, x: layout.value.sites[i][0], y: layout.value.sites[i][1], rx: radius(project), group: 'site' as const })),
  ]
})

// where the line from a's centre towards b leaves a's ellipse
const edgePoint = (ax: number, ay: number, rx: number, ry: number, bx: number, by: number) => {
  const dx = bx - ax
  const dy = by - ay
  const t = 1 / Math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2)
  return [ax + dx * t, ay + dy * t] as const
}

const drawEdges = () => {
  const g = edges.value
  if (!g) return
  g.replaceChildren()
  const rc = rough.svg(g.ownerSVGElement!)
  const { me } = layout.value
  g.appendChild(rc.ellipse(me.x, me.y, ME.rx * 2, ME.ry * 2, { stroke: 'currentColor', strokeWidth: 2, roughness: 1.4, seed: 1 }))
  nodes.value.forEach((n, i) => {
    const [x1, y1] = edgePoint(me.x, me.y, ME.rx + 4, ME.ry + 4, n.x, n.y)
    const [x2, y2] = edgePoint(n.x, n.y, n.rx + 4, RY + 4, me.x, me.y)
    g.appendChild(rc.line(x1, y1, x2, y2, { stroke: 'currentColor', strokeWidth: 1, roughness: 1.6, bowing: 2, seed: 20 + i }))
  })
}

const drawBubbles = () => {
  const g = bubbles.value
  if (!g) return
  g.replaceChildren()
  const rc = rough.svg(g.ownerSVGElement!)
  nodes.value.forEach((n, i) => {
    const on = active.value === n.project
    g.appendChild(
      rc.ellipse(n.x, n.y, n.rx * 2, RY * 2, {
        stroke: on ? '#4467c4' : 'currentColor',
        strokeWidth: on ? 2.2 : 1.3,
        roughness: 1.3,
        fill: fills[n.group],
        fillStyle: on ? 'solid' : 'hachure',
        hachureGap: 6,
        fillWeight: 1,
        seed: 40 + i,
      }),
    )
  })
}

const pickMode = () => {
  const w = wrap.value?.clientWidth ?? 640
  mode.value = w < 520 ? 'narrow' : 'wide'
}

watch(mode, () => {
  drawEdges()
  drawBubbles()
})
watch(active, drawBubbles)

let observer: ResizeObserver | undefined
onMounted(() => {
  pickMode()
  drawEdges()
  drawBubbles()
  observer = new ResizeObserver(pickMode)
  if (wrap.value) observer.observe(wrap.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="wrap" class="map">
    <svg :viewBox="`0 0 ${layout.w} ${layout.h}`" role="group" aria-label="Map of my projects">
      <g ref="edges" class="edges"></g>
      <text :x="layout.me.x" :y="layout.me.y" class="me">me</text>
      <text v-for="l in layout.labels" :key="l.text" :x="l.x" :y="l.y" class="cluster">{{ l.text }}</text>
      <g ref="bubbles"></g>
      <a
        v-for="n in nodes"
        :key="n.project.name"
        :href="n.project.link"
        target="_blank"
        rel="noopener"
        class="node"
        @mouseenter="active = n.project"
        @mouseleave="active = null"
        @focus="active = n.project"
        @blur="active = null"
      >
        <ellipse :cx="n.x" :cy="n.y" :rx="n.rx" :ry="RY" class="hit" />
        <text :x="n.x" :y="n.y" class="label">{{ n.project.name }}</text>
      </a>
    </svg>
    <p class="caption" aria-live="polite">
      <template v-if="active">
        <b>{{ active.name }}</b> — {{ active.description }}
        <span class="tags">{{ active.tags.join(' · ') }}</span>
      </template>
      <template v-else>Hover a bubble to read about it, click to open it.</template>
    </p>
  </div>
</template>

<style scoped>
.map {
  margin: 1.25rem 0;
  color: var(--fg);
}

svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

text {
  font-family: var(--font-hand);
  fill: currentColor;
  text-anchor: middle;
  dominant-baseline: central;
}

.me {
  font-size: 20px;
}

.cluster {
  font-size: 15px;
  fill: var(--fg-soft);
}

.label {
  font-size: 17px;
  pointer-events: none;
  paint-order: stroke;
  stroke: var(--bg);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.node {
  border: none;
  cursor: pointer;
}

.hit {
  fill: transparent;
}

.node:focus-visible {
  outline: none;
}

.node:focus-visible .hit {
  stroke: var(--accent);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}

.caption {
  min-height: 3.4em;
  margin-top: 0.5rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--fg-soft);
  text-align: center;
  text-wrap: pretty;
}

.caption b {
  font-weight: 400;
  color: var(--fg);
}

.tags {
  margin-left: 0.4rem;
  font-size: 0.8rem;
  color: var(--fg-softer);
}
</style>
