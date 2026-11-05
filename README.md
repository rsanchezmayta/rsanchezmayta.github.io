# 🌐 Portafolio Personal - Robinson Sánchez Mayta

> Portafolio one-page de estudiante de **Ingeniería en Ciencia de Datos e Inteligencia Artificial**. Construido con HTML, CSS y JavaScript vanilla — sin frameworks, sin dependencias, 100% control.

[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://rsanchezmayta.github.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## ✨ Características

- **One-page responsive** — Funciona en móvil, tablet y desktop
- **Mobile-first** — CSS escrito para móvil primero, mejora progresiva
- **Accesible** — HTML semántico, ARIA labels, focus visible, `prefers-reduced-motion`
- **Modo oscuro/claro** — Automático según el sistema + toggle manual persistente (`localStorage`)
- **Hero interactivo** — Efecto de escritura, gráfico SVG animado y contadores animados
- **Timeline de trayectoria** — Formación, certificaciones, proyectos y objetivos
- **Filtros de proyectos** — Por categoría (ML, datos, web) con transiciones suaves
- **Habilidades visuales** — Barras de progreso animadas y leyenda de niveles
- **Sección "Aprendiendo"** — Progreso de las tecnologías en curso
- **Animaciones suaves** — IntersectionObserver para scroll reveal escalonado
- **Menú hamburguesa** — Totalmente accesible (teclado + Escape + click fuera)
- **Botón "volver arriba"** y header con sombra al hacer scroll
- **Formulario de contacto** — Formspree con fallback a `mailto:` si no está configurado
- **SEO ready** — Meta tags, Open Graph, Twitter Cards, sitemap-ready
- **Design tokens** — Colores, espaciado, tipografía, sombras y animaciones en `variables.css`
- **GitHub Pages** — Deploy automático en push a `main`

---

## 📁 Estructura del proyecto

```
my-page-web/
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   ├── reset.css          # Normalización cross-browser
│   │   ├── variables.css      # Design tokens (colores, spacing, tipografía)
│   │   └── main.css           # Estilos de componentes (BEM)
│   ├── js/
│   │   └── main.js            # Interactividad vanilla (ES6 IIFE)
│   └── img/
│       ├── favicon.svg
│       ├── apple-touch-icon.svg
│       ├── og-image.svg
│       └── projects/          # Capturas de proyectos (SVG placeholders)
├── pages/                     # Para futuro multipágina
├── .gitignore
└── README.md
```

---

## 🚀 Desarrollo local

```bash
# Clonar
git clone https://github.com/rsanchezmayta/rsanchezmayta.github.io.git
cd rsanchezmayta.github.io

# Servir localmente (cualquier servidor estático)
# Opción 1: Python (viene en tu sistema)
python -m http.server 8000

# Opción 2: Node.js (si tienes http-server instalado)
npx http-server

# Opción 3: VS Code → Live Server extension
# Abre http://localhost:8000
```

> **Tip:** Con `python -m http.server` no hay live-reload. Para desarrollo real, usa la extensión **Live Server** en VS Code o `npx serve`.

---

## 🎨 Personalización rápida

### Cambiar colores (toda la web)
Edita `assets/css/variables.css` → sección `/* ---------- COLORES ---------- */`:

```css
:root {
  --color-primary: #2563eb;        /* Tu color de marca */
  --color-primary-hover: #1d4ed8;
  --color-secondary: #0ea5e9;
  /* ... */
}
```

### Cambiar tipografía
En `variables.css`:

```css
--font-family-sans: 'Tu Fuente', system-ui, sans-serif;
--font-family-mono: 'Tu Mono', monospace;
```

> Importa la fuente en `index.html` (Google Fonts, `@font-face`, etc.) y actualiza la variable.

### Agregar/quitar proyectos
Edita la sección **Proyectos** en `index.html`. Cada tarjeta sigue la estructura `.project-card`. Para escalar, mueve los datos a `assets/js/projects.js` y renderiza dinámicamente.

### Formulario de contacto
El form usa **Formspree** (gratis, sin backend). Crea tu endpoint en [formspree.io](https://formspree.io) y reemplaza:

```html
<form class="contact__form" action="https://formspree.io/f/TU_ID" method="POST">
```

---

## 📦 Deploy en GitHub Pages

### Opción A: Repo `usuario.github.io` (URL limpia: `https://rsanchezmayta.github.io`)

```bash
# 1. Crea el repo en GitHub llamado EXACTAMENTE: rsanchezmayta.github.io
# 2. En local:
cd ~/Projects/my-page-web
git init
git add .
git commit -m "feat: initial commit - portfolio structure"
git branch -M main
git remote add origin https://github.com/rsanchezmayta/rsanchezmayta.github.io.git
git push -u origin main
```

### Opción B: Repo con otro nombre (URL: `https://rsanchezmayta.github.io/nombre-repo/`)

```bash
# En GitHub Settings → Pages → Source: Deploy from branch → main / /(root)
# Si usas subdirectorio, añade en variables.css:
/* :root { --base-path: '/nombre-repo/'; } */
```

### Activar GitHub Pages
1. Ve a tu repo en GitHub → **Settings** → **Pages** (sidebar izquierdo)
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/(root)`
4. **Save** → espera 1-2 min → tu web está en `https://rsanchezmayta.github.io`

> Cada `git push origin main` actualiza la web automáticamente. 🎉

---

## 🧪 Checklist antes de deploy

- [ ] `index.html` valida en [validator.w3.org](https://validator.w3.org)
- [ ] Meta tags: `title`, `description`, `og:*`, `twitter:*` personalizados
- [ ] Imágenes reales en `assets/img/projects/` (reemplaza SVGs placeholders)
- [ ] `favicon.svg` y `apple-touch-icon.svg` con tu branding
- [ ] Formspree configurado (o quita el form si no lo usas)
- [ ] Links de GitHub/LinkedIn/Email correctos
- [ ] Test en móvil (Chrome DevTools → device toolbar)
- [ ] Test modo oscuro (DevTools → Rendering → Emulate prefers-color-scheme: dark)
- [ ] Accesibilidad: `axe DevTools` o `Lighthouse` > 90

---

## 📈 Roadmap / Próximos pasos

| Fase | Qué | Aprendizaje |
|------|-----|-------------|
| **1** | ✅ One-page estático + GitHub Pages | HTML semántico, CSS moderno, Git |
| **2** | ✅ Toggle modo oscuro manual | `localStorage`, `data-theme`, CSS custom props |
| **3** | 📊 Datos de proyectos en `projects.js` | Separación datos/UI, `template` elements |
| **4** | 📝 Blog técnico con Markdown | Migrar a **Astro** (componentes, MDX, build optimizado) |
| **5** | 🔍 Analytics privacy-friendly | Plausible / Umami / GoatCounter |
| **6** | 🌍 i18n (ES/EN) | `lang` attribute, routing, JSON locales |

---

## 🛠 Stack técnico

| Herramienta | Uso |
|-------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Custom properties, Grid, Flexbox, Media queries |
| **Vanilla JS (ES6+)** | Interactividad, IIFE pattern, IntersectionObserver |
| **Git + GitHub** | Control de versiones, CI/CD (Pages) |
| **Neovim + LazyVim** | Editor (¡lo estás aprendiendo!) |
| **Python http.server** | Servidor local rápido |

---

## 📄 Licencia

MIT License — Libre para usar, modificar y compartir. Atribución apreciada.

---

## 🤝 Contacto

- **Email**: [robinsonjsm281006@gmail.com](mailto:robinsonjsm281006@gmail.com)
- **GitHub**: [@rsanchezmayta](https://github.com/rsanchezmayta)
- **LinkedIn**: [robinson-sanchez-mayta](https://linkedin.com/in/robinson-sanchez-mayta)

---

> **Hecho con dedicación desde Lima, Perú 🇵🇪**  
> *Aprende construyendo. Construye aprendiendo.*