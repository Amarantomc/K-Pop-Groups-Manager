# INFORME TÉCNICO
## Sistema de Gestión de Agencias de K-Pop

**Versión:** 2.0  
**Fecha:** 15 de enero de 2026  
**Autores:** Equipo de Desarrollo  
**Universidad:** SBDII 2025-2026  

---

## TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Descripción del Problema](#descripción-del-problema)
3. [Solución Propuesta](#solución-propuesta)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Especificación de Base de Datos](#especificación-de-base-de-datos)
6. [Especificación Técnica](#especificación-técnica)
7. [Seguridad y Autenticación](#seguridad-y-autenticación)
8. [Documentación de APIs](#documentación-de-apis)
9. [Validaciones y Restricciones](#validaciones-y-restricciones)
10. [Flujos de Negocio](#flujos-de-negocio)
11. [Pruebas](#pruebas)
12. [Conclusiones](#conclusiones)

---

## INTRODUCCIÓN

Este documento describe la especificación técnica del **Sistema de Gestión de Agencias de K-Pop**. El sistema es una aplicación web diseñada para facilitar la administración de agencias de música K-Pop, permitiendo la gestión integral de grupos, artistas, aprendices, contratos, actividades y recursos relacionados.

### Propósito del Sistema

- Centralizar la información de agencias de K-Pop
- Administrar relaciones entre agencias, grupos y artistas
- Gestionar el proceso de evaluación de aprendices
- Mantener registro de contratos y actividades
- Generar reportes y estadísticas

### Alcance

El sistema cubre 14 módulos principales que abarcan todas las operaciones de una agencia de K-Pop, desde la gestión de personal hasta la administración de activos de la empresa.

---

## DESCRIPCIÓN DEL PROBLEMA

Las agencias de K-Pop enfrentan varios desafíos en su operación diaria:

### Problemas Identificados

1. **Desorganización de Datos**
   - Información dispersa entre múltiples sistemas
   - Dificultad para acceder a datos históricos
   - Inconsistencias en registros

2. **Gestión Compleja de Relaciones**
   - Múltiples relaciones entre entidades (agencias, grupos, artistas)
   - Difícil rastrear cambios en status y evaluaciones
   - Falta de visibilidad en el progreso de aprendices

3. **Falta de Automatización**
   - Procesos manuales propensos a errores
   - Dificultad en generación de reportes
   - Tiempo invertido en tareas administrativas

4. **Seguridad y Control de Acceso**
   - Información sensible sin protección adecuada
   - Falta de auditoría de cambios
   - Acceso sin restricciones por rol

---

## SOLUCIÓN PROPUESTA

### Objetivo General

Desarrollar una aplicación web moderna que centralice la gestión de agencias de K-Pop, proporcionando herramientas intuitivas y seguras para la administración de datos y procesos.

### Objetivos Específicos

- Crear una base de datos relacional normalizada para almacenar información
- Desarrollar una API REST escalable para acceso a datos
- Implementar interfaz de usuario intuitiva para cada tipo de usuario
- Establecer controles de seguridad basados en roles
- Automatizar procesos críticos del negocio

---

## ARQUITECTURA DEL SISTEMA

### Modelo de 3 Capas

```
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                      │
│  (React + TypeScript + Vite)                                │
│  - Interfaz de Usuario                                      │
│  - Componentes Reutilizables                                │
│  - Context API para Estado Global                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                       │
│  (Node.js + Express + TypeScript)                           │
│  - Controladores HTTP                                       │
│  - DTOs (Data Transfer Objects)                             │
│  - Lógica de Negocio                                        │
│  - Inyección de Dependencias                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  CAPA DE DATOS                              │
│  (PostgreSQL + Prisma ORM)                                  │
│  - Base de Datos Relacional                                 │
│  - Modelos y Esquemas                                       │
│  - Migraciones                                              │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. Frontend (React)
- **Framework:** React 18+ con TypeScript
- **Build Tool:** Vite
- **Estado:** Context API
- **Componentes:** Organizados por feature (Agencias, Aprendices, etc.)
- **Estilos:** CSS modules

#### 2. Backend (Node.js + Express)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Patrón:** Clean Architecture + Dependency Injection

#### 3. Base de Datos (PostgreSQL)
- **Motor:** PostgreSQL 12+
- **ORM:** Prisma
- **Migraciones:** Versionadas
- **Entidades:** 15+ modelos relacionales

### Patrones de Arquitectura

#### Clean Architecture
```
Domain Layer (Entidades y Lógica de Negocio)
    ↓
Application Layer (Casos de Uso y DTOs)
    ↓
Infrastructure Layer (Repositorios y BD)
    ↓
Presentation Layer (Controladores)
```

#### Dependency Injection
```typescript
// Contenedor DI en infrastructure/di/
export class Container {
  static register() {
    // Registro de dependencias
    // Inyección en controladores
  }
}
```

---

## ESPECIFICACIÓN DE BASE DE DATOS

### Diagrama ER (Entidad-Relación)

```
┌─────────────────┐         ┌──────────────────┐
│     Usuario     │────────▶│     Agencia      │
│─────────────────│         │──────────────────│
│ id (PK)         │         │ id (PK)          │
│ email           │         │ name             │
│ nombre          │         │ address          │
│ password        │         │ fundationDate    │
│ rol             │         │ estado           │
│ createdAt       │         │ createdAt        │
│ updatedAt       │         │ updatedAt        │
└─────────────────┘         └────────┬─────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
            ┌───────▼──────┐  ┌─────▼──────┐  ┌────▼────────┐
            │  Aprendiz    │  │   Grupo    │  │   Contrato  │
            │──────────────│  │────────────│  │─────────────│
            │ id (PK)      │  │ id (PK)    │  │ id (PK)     │
            │ nombre       │  │ nombre     │  │ tipo        │
            │ dateOfBirth  │  │ debut      │  │ startDate   │
            │ agencyId (FK)│  │ status     │  │ endDate     │
            │ estado       │  │ members    │  │ estado      │
            │ createdAt    │  │ agencyId(FK)  │ conditions  │
            │ updatedAt    │  │ createdAt  │  │ createdAt   │
            └───────┬──────┘  │ updatedAt  │  │ updatedAt   │
                    │         └─────┬──────┘  └─────────────┘
                    │               │
            ┌───────▼─────────┐     │
            │     Artista     │     │
            │─────────────────│     │
            │ apprenticeId(PK)│     │
            │ groupId (PK)    │     │
            │ artistName      │     │
            │ debutDate       │     │
            │ estado          │     │
            │ createdAt       │     │
            │ updatedAt       │     │
            └─────────────────┘     │
                                    │
            ┌───────────────────────┴──────────────────┐
            │                                          │
        ┌───▼────────┐  ┌──────────────┐  ┌──────────▼───┐
        │   Álbum    │  │   Actividad  │  │    Premios   │
        │────────────│  │──────────────│  │──────────────│
        │ id (PK)    │  │ id (PK)      │  │ id (PK)      │
        │ titulo     │  │ responsible  │  │ nombre       │
        │ releaseDate│  │ tipo         │  │ date         │
        │ groupId(FK)│  │ fecha        │  │ groupId (FK) │
        │ estado     │  │ lugar        │  │ category     │
        │ createdAt  │  │ estado       │  │ createdAt    │
        │ updatedAt  │  │ createdAt    │  │ updatedAt    │
        └───┬────────┘  │ updatedAt    │  └──────────────┘
            │           └──────────────┘
        ┌───▼────────┐
        │   Canción  │
        │────────────│
        │ id (PK)    │
        │ titulo     │
        │ artista    │
        │ albumId(FK)│
        │ duracion   │
        │ createdAt  │
        │ updatedAt  │
        └────────────┘

Más entidades:
- Listas de Popularidad
- Conceptos Visuales
- Conceptos
- Aplicaciones
- Ingresos
```

### Entidades Principales

| Entidad | Registros Típicos | Descripción |
|---------|-------------------|-------------|
| Usuario | 10-50 | Administradores, gerentes, artistas |
| Agencia | 3-10 | Agencias de K-Pop principales |
| Grupo | 20-100 | Grupos musicales bajo agencias |
| Artista | 100-500 | Miembros de grupos |
| Aprendiz | 50-300 | Nuevos talentos en entrenamiento |
| Contrato | 20-100 | Acuerdos entre entidades |
| Álbum | 50-300 | Lanzamientos discográficos |
| Canción | 500-2000 | Composiciones musicales |
| Actividad | 200-1000 | Eventos, conciertos, actividades |
| Premio | 50-200 | Reconocimientos ganados |

### Propiedades de Datos

#### Usuario
```sql
CREATE TABLE "Usuario" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN', 'STAFF', 'ARTIST', 'APPRENTICE', 'MANAGER', 'DIRECTOR'),
  agencyId INTEGER FOREIGN KEY,
  idAp INTEGER FOREIGN KEY,
  idGr INTEGER FOREIGN KEY,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Agencia
```sql
CREATE TABLE "Agencia" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  fundationDate DATE,
  estado VARCHAR(50),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Aprendiz
```sql
CREATE TABLE "Aprendiz" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  dateOfBirth DATE NOT NULL,
  agencyId INTEGER NOT NULL FOREIGN KEY,
  estado ENUM('ACTIVE', 'INACTIVE', 'GRADUATED'),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Grupo
```sql
CREATE TABLE "Grupo" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  debut DATE,
  status VARCHAR(50),
  miembros INTEGER,
  idAgency INTEGER NOT NULL FOREIGN KEY,
  idConcept INTEGER FOREIGN KEY,
  idVisualConcept INTEGER FOREIGN KEY,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## ESPECIFICACIÓN TÉCNICA

### Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | React | 18+ |
| Backend | Node.js | 18+ |
| Framework API | Express.js | 4+ |
| Lenguaje | TypeScript | 5+ |
| ORM | Prisma | 5+ |
| Base de Datos | PostgreSQL | 12+ |
| Build | Vite | 5+ |
| Test | Jest | 29+ |

### Estructura de Carpetas Backend

```
src/
├── index.ts                 # Entrada principal
├── application/             # Lógica de aplicación
│   ├── dtos/               # Data Transfer Objects
│   ├── interfaces/         # Interfaces de negocio
│   ├── repositories/       # Interfaces de repositorios
│   └── usesCase/          # Casos de uso
├── domain/                  # Capa de dominio
│   ├── entities/           # Entidades de negocio
│   ├── enums/             # Enumeraciones
│   └── factories/          # Factories
├── infrastructure/          # Infraestructura
│   ├── controllers/        # Controladores HTTP
│   ├── repositories/       # Implementación de repos
│   ├── database/          # Configuración BD
│   ├── di/                # Inyección de dependencias
│   └── PdfExporter.ts     # Utilidades
├── presentation/            # Presentación
│   ├── controllers/        # Lógica de rutas
│   ├── middlewares/        # Middlewares
│   └── routes/            # Definición de rutas
└── tests/                   # Pruebas
```

### Enumeraciones Principales

#### Estado de Usuario
```typescript
enum RolUsuario {
  ADMIN = 'ADMIN',           // Acceso total
  STAFF = 'STAFF',           // Gestión de contenido
  ARTIST = 'ARTIST',         // Artista del sistema
  APPRENTICE = 'APPRENTICE', // Aprendiz
  MANAGER = 'MANAGER',       // Gerente de agencia
  DIRECTOR = 'DIRECTOR'      // Director ejecutivo
}
```

#### Estado de Aprendiz
```typescript
enum EstadoAprendiz {
  ACTIVO = 'ACTIVE',
  INACTIVO = 'INACTIVE',
  GRADUADO = 'GRADUATED',
  SUSPENDIDO = 'SUSPENDED'
}
```

#### Tipo de Actividad
```typescript
enum TipoActividad {
  CONCIERTO = 'CONCERT',
  ENSAYO = 'REHEARSAL',
  GRABACION = 'RECORDING',
  EVENTO = 'EVENT',
  PRESENTACION = 'PRESENTATION'
}
```

#### Estado de Contrato
```typescript
enum EstadoContrato {
  VIGENTE = 'ACTIVE',
  FINALIZADO = 'COMPLETED',
  CANCELADO = 'CANCELLED',
  SUSPENDIDO = 'SUSPENDED'
}
```

---

## SEGURIDAD Y AUTENTICACIÓN

### Sistema de Autenticación JWT

#### Flujo de Login
```
Cliente                          Servidor API
   │                                │
   ├─ POST /auth/login ────────────▶│
   │  { email, password }           │
   │                                │ Validar credenciales
   │                                │ Generar JWT token
   │                                │
   │◀─────────────────────────────┤ Retornar token + refresh
   │  { accessToken, refreshToken } │
   │  { user, role, permissions }   │
   │                                │
```

#### Estructura del JWT
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "email": "user@example.com",
    "role": "MANAGER",
    "agencyId": 5,
    "iat": 1705326000,
    "exp": 1705412400
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

### Control de Acceso por Rol

#### Matriz de Permisos

| Recurso | ADMIN | STAFF | ARTIST | APPRENTICE | MANAGER | DIRECTOR |
|---------|-------|-------|--------|-----------|---------|----------|
| Usuarios | CRUD | R | R | R | R | RU |
| Agencias | CRUD | R | R | - | RU | RU |
| Grupos | CRUD | RUD | R | R | RU | RU |
| Aprendices | CRUD | CRU | R | R | RU | RU |
| Artistas | CRUD | RUD | R | - | R | R |
| Contratos | CRUD | RU | R | R | RU | RU |
| Actividades | CRUD | CRU | R | R | RU | RU |
| Reportes | R | R | R | - | R | CR |

**Leyenda:** C=Create, R=Read, U=Update, D=Delete, -=No access

### Middlewares de Seguridad

#### AuthMiddleware
```typescript
// Verifica que la solicitud incluya JWT válido
app.use(AuthMiddleware);

// Validaciones:
// 1. Header "Authorization" presente
// 2. Token con formato "Bearer <token>"
// 3. JWT válido y no expirado
// 4. Usuario existe en base de datos
```

#### RoleMiddleware
```typescript
// Verifica que el usuario tenga el rol requerido
app.get('/admin', RoleMiddleware(['ADMIN']), controller);
app.get('/manager', RoleMiddleware(['MANAGER', 'ADMIN']), controller);

// Validaciones:
// 1. Usuario autenticado
// 2. Rol está en lista de permitidos
```

### Protección de Datos Sensibles

- **Contraseñas:** Hasheadas con bcrypt (10 rounds)
- **Tokens:** Expiración 24 horas (refresh: 7 días)
- **HTTPS:** Requerido en producción
- **CORS:** Configurado para dominios específicos
- **Rate Limiting:** 100 solicitudes por minuto por IP

---

## DOCUMENTACIÓN DE APIs

### Base URL
```
Development: http://localhost:3000/api
Production: https://kpop-api.example.com/api
```

### Headers Requeridos
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
X-Request-ID: <UUID>
```

### Formato de Respuestas

#### Respuesta Exitosa
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Agencia K-Pop"
  },
  "message": "Operación exitosa"
}
```

#### Respuesta de Error
```json
{
  "success": false,
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "El campo 'nombre' es requerido",
  "details": [
    {
      "field": "nombre",
      "message": "Requerido",
      "code": "REQUIRED"
    }
  ]
}
```

### Códigos HTTP Utilizados

| Código | Significado | Descripción |
|--------|-----------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado |
| 204 | No Content | Éxito sin contenido |
| 400 | Bad Request | Solicitud inválida |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | No autorizado |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 500 | Server Error | Error interno |

### Endpoints por Módulo

#### 1. Autenticación
```
POST   /auth/login          - Login de usuario
POST   /auth/logout         - Logout
POST   /auth/refresh        - Refrescar token
GET    /auth/profile        - Obtener perfil
PUT    /auth/profile        - Actualizar perfil
```

#### 2. Usuarios
```
GET    /users               - Listar usuarios
GET    /users/:id           - Obtener usuario
POST   /users               - Crear usuario
PUT    /users/:id           - Actualizar usuario
DELETE /users/:id           - Eliminar usuario
GET    /users/search        - Buscar usuarios
```

#### 3. Agencias
```
GET    /agencies            - Listar agencias
GET    /agencies/:id        - Obtener agencia
POST   /agencies            - Crear agencia
PUT    /agencies/:id        - Actualizar agencia
DELETE /agencies/:id        - Eliminar agencia
```

#### 4. Grupos
```
GET    /groups              - Listar grupos
GET    /groups/:id          - Obtener grupo
POST   /groups              - Crear grupo
PUT    /groups/:id          - Actualizar grupo
DELETE /groups/:id          - Eliminar grupo
GET    /groups/:id/members  - Miembros del grupo
```

#### 5. Aprendices
```
GET    /apprentices         - Listar aprendices
GET    /apprentices/:id     - Obtener aprendiz
POST   /apprentices         - Crear aprendiz
PUT    /apprentices/:id     - Actualizar aprendiz
DELETE /apprentices/:id     - Eliminar aprendiz
```

#### 6. Artistas
```
GET    /artists             - Listar artistas
GET    /artists/:id         - Obtener artista
POST   /artists             - Crear artista
PUT    /artists/:id         - Actualizar artista
DELETE /artists/:id         - Eliminar artista
```

#### 7. Contratos
```
GET    /contracts           - Listar contratos
GET    /contracts/:id       - Obtener contrato
POST   /contracts           - Crear contrato
PUT    /contracts/:id       - Actualizar contrato
DELETE /contracts/:id       - Eliminar contrato
```

#### 8. Álbumes
```
GET    /albums              - Listar álbumes
GET    /albums/:id          - Obtener álbum
POST   /albums              - Crear álbum
PUT    /albums/:id          - Actualizar álbum
DELETE /albums/:id          - Eliminar álbum
```

#### 9. Canciones
```
GET    /songs               - Listar canciones
GET    /songs/:id           - Obtener canción
POST   /songs               - Crear canción
PUT    /songs/:id           - Actualizar canción
DELETE /songs/:id           - Eliminar canción
```

#### 10. Actividades
```
GET    /activities          - Listar actividades
GET    /activities/:id      - Obtener actividad
POST   /activities          - Crear actividad
PUT    /activities/:id      - Actualizar actividad
DELETE /activities/:id      - Eliminar actividad
```

#### 11. Premios
```
GET    /awards              - Listar premios
GET    /awards/:id          - Obtener premio
POST   /awards              - Crear premio
PUT    /awards/:id          - Actualizar premio
DELETE /awards/:id          - Eliminar premio
```

#### 12. Ingresos
```
GET    /income              - Listar ingresos
GET    /income/:id          - Obtener ingreso
POST   /income              - Crear ingreso
PUT    /income/:id          - Actualizar ingreso
DELETE /income/:id          - Eliminar ingreso
```

#### 13. Listas de Popularidad
```
GET    /popularity          - Listar posiciones
POST   /popularity          - Crear posición
```

#### 14. Conceptos
```
GET    /concepts            - Listar conceptos
GET    /concepts/:id        - Obtener concepto
POST   /concepts            - Crear concepto
```

---

## VALIDACIONES Y RESTRICCIONES

### Validaciones por Entidad

#### Usuario
```json
{
  "email": {
    "required": true,
    "type": "string",
    "format": "email",
    "minLength": 5,
    "maxLength": 255,
    "unique": true
  },
  "nombre": {
    "required": true,
    "type": "string",
    "minLength": 2,
    "maxLength": 255
  },
  "password": {
    "required": true,
    "type": "string",
    "minLength": 8,
    "maxLength": 255,
    "pattern": "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])",
    "message": "Debe contener minúsculas, mayúsculas, números y símbolos"
  },
  "rol": {
    "required": true,
    "type": "enum",
    "enum": ["ADMIN", "STAFF", "ARTIST", "APPRENTICE", "MANAGER", "DIRECTOR"]
  }
}
```

#### Aprendiz
```json
{
  "nombre": {
    "required": true,
    "type": "string",
    "minLength": 2,
    "maxLength": 255
  },
  "dateOfBirth": {
    "required": true,
    "type": "date",
    "validation": "age must be between 15 and 50 years old"
  },
  "agencyId": {
    "required": true,
    "type": "integer",
    "foreignKey": "Agencia"
  }
}
```

#### Grupo
```json
{
  "nombre": {
    "required": true,
    "type": "string",
    "minLength": 1,
    "maxLength": 255,
    "unique": true
  },
  "debut": {
    "required": true,
    "type": "date",
    "validation": "debe ser una fecha pasada"
  },
  "status": {
    "type": "enum",
    "enum": ["ACTIVE", "INACTIVE", "DISBANDED"],
    "default": "ACTIVE"
  },
  "miembros": {
    "type": "integer",
    "min": 1,
    "max": 20
  }
}
```

#### Contrato
```json
{
  "tipo": {
    "required": true,
    "type": "enum",
    "enum": ["ARTIST", "GROUP", "APPRENTICE"]
  },
  "startDate": {
    "required": true,
    "type": "date"
  },
  "endDate": {
    "type": "date",
    "validation": "debe ser posterior a startDate"
  },
  "estado": {
    "required": true,
    "type": "enum",
    "enum": ["ACTIVE", "COMPLETED", "CANCELLED"],
    "default": "ACTIVE"
  }
}
```

### Restricciones de Negocio

| Restricción | Descripción | Validación |
|------------|-------------|-----------|
| Email único | No puede haber dos usuarios con el mismo email | BD + API |
| Edad mínima | Los aprendices deben tener mínimo 15 años | API |
| Edad máxima | Los aprendices deben tener máximo 50 años | API |
| Grupo activo | Un artista solo puede pertenecer a 1 grupo activo | API |
| Fecha debut | La fecha de debut debe ser anterior a hoy | API |
| Contrato válido | endDate debe ser >= startDate | API |
| Nombre único | Cada grupo debe tener nombre único | BD |
| Estado válido | Solo transiciones de estado permitidas | API |

---

## FLUJOS DE NEGOCIO

### Flujo 1: Login de Usuario

```
┌─────────────┐
│   Inicio    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Usuario ingresa email y     │
│ contraseña                  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Backend valida credenciales │
│ en base de datos            │
└──────┬──────────────────────┘
       │
       ├─ ❌ Inválidas
       │   │
       │   ▼
       │ Retornar error 401
       │
       ├─ ✅ Válidas
       │   │
       │   ▼
       │ Generar JWT token
       │ (exp: 24 horas)
       │
       │ Generar refresh token
       │ (exp: 7 días)
       │
       └──▶ Retornar tokens
           │
           ▼
       ┌──────────┐
       │  Fin     │
       └──────────┘
```

### Flujo 2: Crear Nuevo Grupo

```
┌─────────────┐
│   Inicio    │
└──────┬──────┘
       │
       ▼
┌───────────────────────────────────┐
│ Usuario (MANAGER/ADMIN) ingresa   │
│ datos del grupo                   │
└──────┬────────────────────────────┘
       │
       ▼
┌───────────────────────────────────┐
│ Frontend valida datos localmente  │
└──────┬────────────────────────────┘
       │
       ├─ ❌ Error de validación
       │   │
       │   ▼
       │ Mostrar mensaje de error
       │
       ├─ ✅ Datos válidos
       │   │
       │   ▼
       │ POST /groups con datos
       │
       │
       └──▶ Backend recibe solicitud
           │
           ▼
       ┌───────────────────────────┐
       │ Validar autorización      │
       │ (requiere MANAGER/ADMIN)  │
       └──────┬────────────────────┘
              │
              ├─ ❌ No autorizado
              │   │
              │   ▼
              │ Retornar error 403
              │
              ├─ ✅ Autorizado
              │   │
              │   ▼
              │ Validar datos
              │
              │
              ├─ ❌ Validación falla
              │   │
              │   ▼
              │ Retornar error 400
              │
              ├─ ✅ Datos válidos
              │   │
              │   ▼
              │ Verificar nombre único
              │
              │
              ├─ ❌ Nombre existe
              │   │
              │   ▼
              │ Retornar error 409
              │
              ├─ ✅ Nombre único
              │   │
              │   ▼
              │ Crear grupo en BD
              │ Registrar en auditoría
              │
              └──▶ Retornar grupo creado
                  │
                  ▼
              ┌──────────┐
              │   Fin    │
              └──────────┘
```

### Flujo 3: Evaluar Aprendiz

```
┌─────────────────────────────────┐
│ MANAGER accede a módulo         │
│ Evaluación de Aprendices        │
└──────┬────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Sistema obtiene lista de        │
│ aprendices con estado ACTIVE    │
└──────┬────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ MANAGER selecciona aprendiz     │
│ e ingresa evaluación            │
│ (puntaje, comentarios)          │
└──────┬────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend valida puntaje (0-100)  │
└──────┬────────────────────────────┘
       │
       ├─ ❌ Inválido
       │   │
       │   ▼
       │ Retornar error
       │
       ├─ ✅ Válido
       │   │
       │   ▼
       │ Guardar evaluación
       │
       │ Verificar progreso
       │ (promedio últimas 5)
       │
       │
       ├─ Promedio >= 80
       │   │
       │   ▼
       │ Actualizar estado a GRADUATED
       │ Crear Usuario para artista
       │ Notificar a aprendiz
       │
       ├─ Promedio < 40
       │   │
       │   ▼
       │ Actualizar estado a SUSPENDED
       │ Notificar supervisor
       │
       └─ Promedio 40-79
           │
           ▼
       Mantener estado ACTIVE
       │
       ▼
   Actualizar registro
   │
   ▼
┌──────────┐
│   Fin    │
└──────────┘
```

---

## PRUEBAS

### Estrategia de Testing

#### 1. Unit Tests
- **Enfoque:** Funciones individuales y validaciones
- **Cobertura:** >80%
- **Framework:** Jest

```typescript
// Ejemplo: Validar email
describe('User Validation', () => {
  it('should validate email format', () => {
    const isValid = User.isValidEmail('test@example.com');
    expect(isValid).toBe(true);
  });

  it('should reject invalid email', () => {
    const isValid = User.isValidEmail('invalid-email');
    expect(isValid).toBe(false);
  });
});
```

#### 2. Integration Tests
- **Enfoque:** APIs y flujos completos
- **Cobertura:** Endpoints críticos
- **Framework:** Jest + Supertest

```typescript
// Ejemplo: Test de login
describe('POST /auth/login', () => {
  it('should return tokens on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
```

#### 3. E2E Tests
- **Enfoque:** Flujos de usuario completos
- **Herramienta:** Cypress o Playwright

### Test Cases Críticos

| Caso | Descripción | Resultado Esperado |
|------|---------|----------|
| TC-AUTH-001 | Login con credenciales válidas | Status 200, tokens retornados |
| TC-AUTH-002 | Login con email inválido | Status 401, error de autenticación |
| TC-AUTH-003 | Login con contraseña incorrecta | Status 401, error de autenticación |
| TC-USER-001 | Crear usuario con email duplicado | Status 409, error de conflicto |
| TC-USER-002 | Crear usuario con datos válidos | Status 201, usuario creado |
| TC-GROUP-001 | Crear grupo sin autenticación | Status 401, no autorizado |
| TC-GROUP-002 | Crear grupo con nombre duplicado | Status 409, conflicto |
| TC-APPRENTICE-001 | Crear aprendiz con edad < 15 | Status 400, validación fallida |
| TC-APPRENTICE-002 | Crear aprendiz con edad válida | Status 201, aprendiz creado |

---

## CONCLUSIONES

### Logros Alcanzados

✅ **Sistema Robusto:** Arquitectura escalable con separación clara de capas

✅ **Seguridad:** Implementación de JWT, roles y controles de acceso

✅ **Escalabilidad:** Diseño modular que permite crecimiento

✅ **Mantenibilidad:** Código limpio siguiendo Clean Architecture

✅ **Funcionalidad:** 14 módulos cubriendo necesidades de agencias K-Pop

### Beneficios para la Organización

- **Eficiencia:** Automatización de procesos manuales
- **Datos Centralizados:** Una única fuente de verdad
- **Seguridad:** Control granular de acceso y auditoría
- **Reportes:** Visualización de datos en tiempo real
- **Escalabilidad:** Infraestructura preparada para crecimiento

### Recomendaciones Futuras

1. **Implementar Caché:** Redis para mejorar performance
2. **Agregar WebSockets:** Para notificaciones en tiempo real
3. **Expandir Mobile:** Aplicación nativa para iOS/Android
4. **Analytics:** Dashboard de métricas del sistema
5. **Integración:** APIs externas (Spotify, Instagram, etc.)

---

## ANEXOS

### A. Datos de Prueba

Usuarios disponibles para testing:
```
ADMIN:
  Email: admin@kpop.com
  Password: AdminPass123!
  
MANAGER:
  Email: manager@kpop.com
  Password: ManagerPass123!
  
ARTIST:
  Email: artist@kpop.com
  Password: ArtistPass123!
```

### B. Variables de Entorno Backend

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/kpop_db
JWT_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:5173
```

### C. Referencia Rápida de Errores

| Código | Mensaje | Solución |
|--------|---------|----------|
| AUTH_001 | Invalid credentials | Verificar email y contraseña |
| AUTH_002 | Token expired | Usar refresh token para obtener nuevo |
| VAL_001 | Email format invalid | Verificar formato de email |
| VAL_002 | Age out of range | Aprendiz debe tener 15-50 años |
| AUTH_003 | Unauthorized | Verificar permisos del rol |
| DB_001 | Duplicate entry | El registro ya existe |

---

**Fin del Informe Técnico V2**

Documento generado: 15 de enero de 2026
