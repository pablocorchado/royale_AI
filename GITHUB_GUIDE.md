# 🚀 CÓMO SUBIR CLASH COACH V3 A GITHUB

## 📝 PASOS PARA CREAR TU REPOSITORIO

### 1. Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repo: `clash-royale-ai-coach`
3. Descripción: `AI-powered coaching app for Clash Royale with analytics, tracking, and more`
4. **Privado** o **Público** (tú decides)
5. **NO** inicialices con README, .gitignore ni license
6. Click en **"Create repository"**

### 2. En Tu Terminal (Dentro de clash-coach-v3)

```bash
# Inicializar Git
git init

# Añadir todos los archivos
git add .

# Primer commit
git commit -m "🚀 Initial commit - Clash Coach V3.0 complete"

# Conectar con tu repo de GitHub
git branch -M main
git remote add origin https://github.com/TU-USUARIO/clash-royale-ai-coach.git

# Subir todo
git push -u origin main
```

### 3. Variables de Entorno en GitHub (IMPORTANTE)

**NO subas tus API keys al repo público**

Si tu repo es público, añade esto al README:

```markdown
## ⚠️ Configuración Requerida

Antes de ejecutar, crea un archivo `.env` en `backend/` con:

\`\`\`env
CLASH_ROYALE_API_KEY=tu-api-key
ANTHROPIC_API_KEY=tu-api-key
DATABASE_URL=postgresql://...
SECRET_KEY=genera-uno-con-openssl-rand-hex-32
\`\`\`
```

### 4. GitHub Actions (CI/CD) - Opcional

Crea `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest
```

### 5. Proteger Ramas (Recomendado)

En GitHub:
1. Settings → Branches
2. Add rule para `main`
3. ✅ Require pull request reviews
4. ✅ Require status checks to pass

---

## 📦 ESTRUCTURA FINAL EN GITHUB

```
TU-USUARIO/clash-royale-ai-coach
│
├── README.md                    ← Descripción del proyecto
├── .gitignore                   ← Archivos a ignorar
├── docker-compose.yml           ← Setup de BD
├── LICENSE                      ← Licencia (MIT recomendada)
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── requirements.txt
│   └── .env.template            ← Template de variables
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## 🎯 COMANDOS GIT ÚTILES

### Trabajando en el Proyecto

```bash
# Ver estado
git status

# Crear nueva rama para feature
git checkout -b feature/nueva-funcionalidad

# Hacer commit
git add .
git commit -m "descripción del cambio"

# Subir cambios
git push origin feature/nueva-funcionalidad

# Actualizar desde main
git checkout main
git pull origin main

# Mergear tu feature
git checkout main
git merge feature/nueva-funcionalidad
git push origin main
```

### Colaboración

```bash
# Clonar el repo
git clone https://github.com/TU-USUARIO/clash-royale-ai-coach.git
cd clash-royale-ai-coach

# Ver ramas remotas
git branch -r

# Cambiar a rama de otra persona
git checkout -b feature-branch origin/feature-branch
```

---

## 🔐 SEGURIDAD

### ❌ NUNCA subas al repo:
- `.env` con tus API keys
- Contraseñas
- Tokens de acceso
- Información sensible

### ✅ SIEMPRE:
- Usa `.env.template` sin valores reales
- Documenta qué variables se necesitan
- Usa GitHub Secrets para CI/CD
- Revisa el `.gitignore`

---

## 📝 LICENCIA RECOMENDADA

Crea un archivo `LICENSE` con licencia MIT:

```
MIT License

Copyright (c) 2024 [Tu Nombre]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎉 ¡LISTO!

Tu proyecto ya está en GitHub. Ahora puedes:
- ✅ Compartirlo con otros
- ✅ Colaborar con amigos
- ✅ Hacer backup automático
- ✅ Usar GitHub Actions
- ✅ Crear Issues y PRs
- ✅ Desplegar en producción

---

**¿Preguntas?** Abre un Issue en tu repo 😊
