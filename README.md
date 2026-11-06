# Robinson J. Sánchez Mayta — Portfolio Website

Personal portfolio website for **Robinson Josué Sánchez Mayta**, Data Science & AI Engineering student at SENATI.

🌐 **Live:** https://rsanchezmayta.github.io

---

## 🚀 Features

### 🖥️ Interactive Hero Terminal
- **Realistic terminal simulation** at the top of the page
- **Types commands** character-by-character (typewriter effect)
- **Shows spinner** while "executing"
- **Displays technology icons** with smooth fade-in animations
- **12 technologies** cycle automatically: Python, SQL, MLflow, Pandas, NumPy, Docker, Terminal, Data Warehouse, PHP, Git, Linux, Neovim
- **Loop runs infinitely** with natural timing

### 🎨 Design System
- **Minimalism & Swiss Style** principles
- **Professional teal/emerald palette** (trust + tech)
- **Fluid typography** with `clamp()` — no media queries for text sizing
- **Consistent spacing** (4px base rhythm)
- **Semantic HTML5** with proper ARIA labels

### ♿ Accessibility (WCAG 2.2 AA)
- ✅ 4.5:1+ contrast ratios
- ✅ Visible focus states (`outline-offset: 2px`)
- ✅ 44px+ touch targets
- ✅ `prefers-reduced-motion` fully respected
- ✅ Semantic heading hierarchy (h1→h2→h3...)
- ✅ Skip link for keyboard navigation
- ✅ SVG icons (no emojis as icons)

### ⚡ Performance
- **Zero dependencies** — vanilla HTML/CSS/JS
- **Only PNG images** (no WebP conversion needed)
- **Vanilla JS** with `IntersectionObserver` for animations
- **CSS custom properties** for everything
- **Lazy loading** on all images
- **Zero CLS** — explicit width/height on images

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3 (Custom Properties), Vanilla JS (ES6+) |
| **Fonts** | Outfit (display), DM Sans (UI), JetBrains Mono (code) |
| **Icons** | Inline SVG + PNG (tech logos) |
| **Animations** | CSS `@keyframes`, `cubic-bezier` easing |
| **Deploy** | GitHub Pages |

---

## 📁 Project Structure

```
my-page-web/
├── index.html          # Main HTML (semantic, accessible)
├── styles.css          # All styles (custom properties, responsive)
├── script.js           # Terminal sequence + interactions
├── manifest.json       # PWA manifest
├── images/
│   ├── favicon-180.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── og-image.png
│   ├── icon-python.png
│   ├── icon-sql.png
│   ├── icon-ml.png
│   ├── icon-pandas.png
│   ├── icon-numpy.png
│   ├── icon-docker.png
│   ├── icon-terminal.png
│   ├── icon-datawarehouse.png
│   ├── icon-php.png
│   ├── icon-git.png
│   ├── icon-linux.png
│   └── icon-nvim.png
└── README.md
```

---

## 🎬 Hero Terminal Sequence

The terminal runs this sequence automatically:

```bash
robinson@data-lab:~$ python      → 🐍 Python
robinson@data-lab:~$ sqlite3     → 🗄️ SQL
robinson@data-lab:~$ mlflow      → 🤖 Machine Learning
robinson@data-lab:~$ pandas      → 🐼 Pandas
robinson@data-lab:~$ numpy       → 🔢 NumPy
robinson@data-lab:~$ docker      → 🐳 Docker
robinson@data-lab:~$ zsh         → 💻 Terminal
robinson@data-lab:~$ minio       → 📦 Data Warehouse
robinson@data-lab:~$ php         → 🐘 PHP
robinson@data-lab:~$ git         → 📝 Git
robinson@data-lab:~$ arch        → 🐧 Linux
robinson@data-lab:~$ nvim        → ⚡ Neovim
→ loops infinitely
```

**Timing:** ~1.1s per command (type + spinner + icon fade-in + pause)

---

## 📱 Sections

| Section | Description |
|---------|-------------|
| **Hero** | Terminal sequence + intro + metrics + CTAs |
| **Sobre mí** | Bio + pillars (Stack, Enfoque, Colaboración) + next steps |
| **Experiencia** | Timeline (2022-2024) with highlights |
| **Proyectos** | 6 project cards with filters (ML, Data Eng, MLOps, Backend, LLM) |
| **Habilidades** | 3 categories with animated progress bars |
| **Contacto** | Info cards + accessible form (validation, aria-live) |

---

## 🚀 Local Development

```bash
# Clone
git clone https://github.com/rsanchezmayta/rsanchezmayta.github.io.git
cd rsanchezmayta.github.io

# Serve locally (any static server)
python3 -m http.server 8000
# or
npx serve .

# Open http://localhost:8000
```

No build step, no dependencies — just open `index.html` in a browser.

---

## 📦 Deployment

Automatic via **GitHub Pages** on push to `main`:

```bash
git add -A
git commit -m "feat: your changes"
git push origin main
```

Live at: **https://rsanchezmayta.github.io**

---

## 📄 License

MIT License — feel free to use as reference for your own portfolio.

---

## 👤 Author

**Robinson Josué Sánchez Mayta**  
🎓 Data Science & AI Engineering Student (SENATI, 5º ciclo)  
📍 Ate, Lima, Perú  
✉️ robinsonjsm281006@gmail.com  
🔗 [GitHub](https://github.com/rsanchezmayta) · [LinkedIn](https://linkedin.com/in/rsanchezmayta)

---

> Built with curiosity, green, and a terminal that types itself. 💚