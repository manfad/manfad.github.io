export interface Project {
  name: string
  description: string
  tags: string[]
  link: string
}

export const products: Project[] = [
  {
    name: 'TabsFlow',
    description: 'Turns indented notes into interactive node diagrams. A cross-platform desktop app.',
    tags: ['Vue', 'Tauri'],
    link: 'https://tabsflow.vercel.app',
  },
  {
    name: 'flashpoint',
    description: 'Checkpoints every AI-agent turn so you can inspect or time-travel without touching git.',
    tags: ['Rust', 'CLI'],
    link: 'https://github.com/manfad/flashpoint',
  },
  {
    name: 'YF UI',
    description: 'My own React component collection, installable through the shadcn CLI.',
    tags: ['React', 'shadcn'],
    link: 'https://yf-ui.vercel.app',
  },
  {
    name: 'yfui',
    description: 'A reusable Vue 3 admin UI kit with shadcn-style components.',
    tags: ['Vue', 'UnoCSS'],
    link: 'https://github.com/manfad/yfui',
  },
  {
    name: 'This site',
    description: 'A hand-drawn one-pager built with Vue islands, roughness and rough-notation.',
    tags: ['Astro', 'Vue'],
    link: 'https://github.com/manfad/manfad.github.io',
  },
]

export const websites: Project[] = [
  {
    name: 'kpom.my',
    description: 'Keningau Palm Oil Mill: palm oil milling in Keningau, Sabah, from grower to mill.',
    tags: ['Astro'],
    link: 'https://kpom.my',
  },
  {
    name: 'hibsf.my',
    description: 'A Black Soldier Fly farm in Keningau, Sabah: breeding, products and farm tours.',
    tags: ['Astro'],
    link: 'https://hibsf.my',
  },
  {
    name: 'yimei.my',
    description: 'Yimei Environment Protection Technology: industrial wastewater treatment systems.',
    tags: ['Astro'],
    link: 'https://yimei.my',
  },
]
