# 🏆 CLASH ROYALE AI COACH V3.1.2

## 🎨 Polish & Perfection - Animaciones y UX Mejorado

Sistema completo con autenticación, tracking automático, analytics avanzado con gráficos interactivos, animaciones suaves, y experiencia de usuario pulida.

---

## ✨ CARACTERÍSTICAS V3.0

### 🔐 Sistema de Usuarios
- ✅ Registro y login con JWT
- ✅ Autenticación segura
- ✅ Perfiles personalizados
- ✅ Vinculación con Player Tag

### 📊 Analytics Avanzado
- ✅ Gráficas de progreso de trofeos
- ✅ Win rate histórico
- ✅ Distribución de batallas por modo
- ✅ Comparador de jugadores
- ✅ Estadísticas detalladas

### 🤖 IA Coach
- ✅ Análisis personalizados
- ✅ Recomendaciones de mazos
- ✅ Chat persistente con IA
- ✅ Consejos contextuales

### 🎴 Gestión de Cartas
- ✅ Colección ordenada por nivel
- ✅ Filtros por rareza
- ✅ Tracking histórico
- ✅ Progreso de upgrades

### ⚔️ Historial de Batallas
- ✅ Tracking automático
- ✅ Visualización detallada
- ✅ Top cartas usadas
- ✅ Análisis de matchups

### 🏰 Features de Clan
- ✅ Dashboard de clan
- ✅ Comparación de miembros
- ✅ Tracking de donaciones
- ✅ Leaderboards

### 💾 Base de Datos
- ✅ PostgreSQL para persistencia
- ✅ Snapshots históricos
- ✅ Estadísticas diarias
- ✅ Cache con Redis

---

## 📋 REQUISITOS

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (opcional, para Celery)
- Docker (opcional, pero recomendado)

---

## ⚡ INSTALACIÓN RÁPIDA (5 minutos)

### 1. Clonar el Proyecto

```bash
git clone <tu-repo>
cd clash-coach-v3
```

### 2. Base de Datos con Docker (Recomendado)

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
```

**O instalación local:**

```bash
# macOS
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

createdb clashcoach
```

### 3. Backend

```bash
cd backend

# Copiar y configurar variables de entorno
cp .env.template .env
# EDITA .env con tus API keys

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
psql clashcoach < database/schema.sql
# O con Docker:
docker exec -i clashcoach-postgres psql -U clashcoach -d clashcoach < database/schema.sql

# Iniciar servidor
python -m app.main
```

Backend disponible en: **http://localhost:8000**

### 4. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

Frontend disponible en: **http://localhost:3000**

---

## 🔑 CONFIGURACIÓN DE .ENV

### Backend (.env)

```env
# Clash Royale API (obtener en https://developer.clashroyale.com)
CLASH_ROYALE_API_KEY=tu-api-key

# Anthropic Claude API (obtener en https://console.anthropic.com)
ANTHROPIC_API_KEY=tu-api-key

# Base de Datos
DATABASE_URL=postgresql://clashcoach:clashcoach@localhost:5432/clashcoach

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT Security (generar con: openssl rand -hex 32)
SECRET_KEY=tu-secret-key-super-segura-de-32-caracteres-minimo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🎯 PRIMER USO

1. Abre **http://localhost:3000**
2. Haz clic en **"Regístrate"**
3. Crea tu cuenta (opcional: añade tu Player Tag)
4. ¡Ya puedes usar todas las funcionalidades!

---

## 📚 DOCUMENTACIÓN API

Una vez iniciado el backend, visita:

**http://localhost:8000/docs**

Documentación interactiva con Swagger UI donde puedes probar todos los endpoints.

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
clash-coach-v3/
├── backend/
│   ├── app/
│   │   ├── routers/          # Endpoints API
│   │   ├── services/         # Lógica de negocio
│   │   ├── models.py         # Modelos de BD
│   │   ├── auth.py           # Autenticación JWT
│   │   └── main.py           # App principal
│   ├── database/
│   │   └── schema.sql        # Schema PostgreSQL
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── Auth/         # Login/Register
│   │   │   ├── Analytics/    # Gráficas
│   │   │   ├── Chat/         # Chat con IA
│   │   │   └── ...
│   │   ├── contexts/         # React Context
│   │   └── services/         # API clients
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml        # PostgreSQL + Redis
```

---

## 🔧 COMANDOS ÚTILES

### Backend

```bash
# Activar entorno virtual
source venv/bin/activate

# Actualizar dependencias
pip install -r requirements.txt

# Crear migración de BD (con Alembic)
alembic revision --autogenerate -m "descripcion"
alembic upgrade head

# Ejecutar tests
pytest

# Ver logs
python -m app.main
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Actualizar dependencias
npm update
```

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar base de datos (¡CUIDADO! Borra datos)
docker-compose down -v
docker-compose up -d
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Connection refused" en PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps
# O en local:
brew services list

# Reiniciar
docker-compose restart postgres
```

### Error: "Module not found" en Python
```bash
# Asegúrate de que el venv esté activado
source venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "CORS" en el navegador
Verifica que en `.env` del backend tengas:
```env
CORS_ORIGINS=http://localhost:3000
```

### Error 403 en Clash Royale API
- Verifica que tu IP esté autorizada en developer.clashroyale.com
- Actualiza tu API key si cambió tu IP

---

## 🚀 DEPLOYMENT

### Backend (Railway.app / Render.com)

1. Conecta tu repo de GitHub
2. Configura las variables de entorno
3. Selecciona el Dockerfile o build command
4. Deploy automático

### Frontend (Vercel / Netlify)

1. Conecta tu repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy automático

### Base de Datos

Usa managed database de tu proveedor:
- Railway Database
- Render PostgreSQL
- Supabase
- AWS RDS

---

## 📈 ROADMAP FUTURO

### v3.1
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline

### v3.2
- [ ] Gráficas interactivas avanzadas
- [ ] Exportar reportes PDF
- [ ] Sistema de achievements

### v3.3
- [ ] Simulador de batallas
- [ ] Meta tracker en tiempo real
- [ ] Counter picks automáticos

---

## 🤝 CONTRIBUIR

¿Quieres contribuir? ¡Genial!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 LICENCIA

MIT License - Libre para usar y modificar

---

## 💬 SOPORTE

¿Tienes problemas? ¿Sugerencias?

- Abre un Issue en GitHub
- Contacta al equipo

---

**¡Disfruta mejorando tu gameplay en Clash Royale! 🏆**

---

*Powered by Claude AI × Clash Royale Official API*

---

## 📈 ROADMAP

See detailed roadmap in [ROADMAP.md](ROADMAP.md)

**Coming in v3.1:**
- 📊 Interactive charts with Recharts
- 🎨 Enhanced UI with animations
- 📱 Perfect mobile responsive
- ⚡ Performance optimizations

**Coming in v3.2:**
- 💬 Persistent AI chat
- 🏰 Complete clan dashboard
- 📊 Advanced analytics & comparisons

[View full roadmap →](ROADMAP.md)
