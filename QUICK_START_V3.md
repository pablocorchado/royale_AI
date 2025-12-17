# 🚀 CLASH COACH V3.0 - INICIO RÁPIDO

## ⚡ Setup Rápido (5 minutos)

### 1. Base de Datos PostgreSQL

**Opción A: Docker** (Recomendado)
```bash
docker run --name clashcoach-postgres -e POSTGRES_PASSWORD=clashcoach -e POSTGRES_USER=clashcoach -e POSTGRES_DB=clashcoach -p 5432:5432 -d postgres:15
```

**Opción B: Local (macOS)**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb clashcoach
```

### 2. Backend

```bash
cd backend

# Copiar variables de entorno
cp .env.template .env
# EDITA .env con tus API keys

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
psql clashcoach < database/schema.sql

# Iniciar servidor
python -m app.main
```

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

## 🎯 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📝 Primer Uso

1. Registra una cuenta en /register
2. Ingresa tu Player Tag
3. ¡Explora todas las funcionalidades!

## ⚙️ Configuración de .env

Asegúrate de tener:
- ✅ CLASH_ROYALE_API_KEY (de developer.clashroyale.com)
- ✅ ANTHROPIC_API_KEY (de console.anthropic.com)
- ✅ DATABASE_URL (postgresql://...)
- ✅ SECRET_KEY (genera uno: `openssl rand -hex 32`)

