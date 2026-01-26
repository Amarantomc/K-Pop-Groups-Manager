# MANUAL DE USUARIO
## Sistema de Gestión de Agencias de K-Pop

**Versión:** 2.0  
**Fecha:** 15 de enero de 2026  
**Público Objetivo:** Administradores, Gerentes, Artistas, Aprendices  

---

## TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Conceptos Básicos](#conceptos-básicos)
3. [Autenticación](#autenticación)
4. [Módulo: Gestión de Agencias](#módulo-gestión-de-agencias)
5. [Módulo: Gestión de Aprendices](#módulo-gestión-de-aprendices)
6. [Módulo: Gestión de Artistas](#módulo-gestión-de-artistas)
7. [Módulo: Gestión de Grupos](#módulo-gestión-de-grupos)
8. [Módulo: Gestión de Álbumes](#módulo-gestión-de-álbumes)
9. [Módulo: Gestión de Canciones](#módulo-gestión-de-canciones)
10. [Módulo: Gestión de Actividades](#módulo-gestión-de-actividades)
11. [Módulo: Gestión de Contratos](#módulo-gestión-de-contratos)
12. [Módulo: Gestión de Premios](#módulo-gestión-de-premios)
13. [Módulo: Gestión de Ingresos](#módulo-gestión-de-ingresos)
14. [Módulo: Listas de Popularidad](#módulo-listas-de-popularidad)
15. [Módulo: Conceptos](#módulo-conceptos)
16. [Módulo: Aplicaciones](#módulo-aplicaciones)
17. [Módulo: Usuarios](#módulo-usuarios)
18. [Búsquedas y Filtros](#búsquedas-y-filtros)
19. [Reportes](#reportes)
20. [Preguntas Frecuentes](#preguntas-frecuentes)
21. [Solución de Problemas](#solución-de-problemas)
22. [Glosario](#glosario)
23. [Tabla de Permisos](#tabla-de-permisos)

---

## INTRODUCCIÓN

Bienvenido al **Sistema de Gestión de Agencias de K-Pop**. Esta guía te ayudará a utilizar todas las funcionalidades del sistema para administrar tu agencia de música K-Pop.

### ¿Qué puedes hacer con este sistema?

- 📊 **Gestionar información** de agencias, grupos y artistas
- 👥 **Administrar aprendices** y su progreso de evaluación
- 🎤 **Organizar grupos musicales** y sus miembros
- 💿 **Catalogar álbumes** y canciones
- 📅 **Registrar actividades** (conciertos, ensayos, grabaciones)
- 📋 **Administrar contratos** entre entidades
- 🏆 **Registrar premios** ganados
- 💰 **Controlar ingresos** y distribuciones
- 📈 **Generar reportes** y estadísticas

### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet
- Cuenta de usuario activa
- Credenciales de acceso proporcionadas

---

## CONCEPTOS BÁSICOS

### Entidades Principales

#### Agencia
Una organización que gestiona grupos y artistas de K-Pop. Cada usuario pertenece a una agencia específica.

**Información almacenada:**
- Nombre de la agencia
- Dirección
- Fecha de fundación
- Estado (activa/inactiva)

#### Grupo
Un conjunto de artistas que trabajan juntos bajo el mismo proyecto musical. Cada grupo pertenece a una agencia.

**Información almacenada:**
- Nombre del grupo
- Fecha de debut
- Estado (activo/inactivo)
- Número de miembros
- Conceptos visuales asociados

#### Aprendiz
Una persona en entrenamiento para convertirse en artista profesional dentro de una agencia.

**Información almacenada:**
- Nombre completo
- Fecha de nacimiento
- Agencia a la que pertenece
- Estado de entrenamiento
- Evaluaciones periódicas

#### Artista
Una persona que forma parte activa de un grupo. Cada artista es un aprendiz graduado.

**Información almacenada:**
- Aprendiz origen
- Grupo al que pertenece
- Nombre artístico
- Fecha de debut en el grupo
- Estado en el grupo

#### Álbum
Una colección de canciones lanzadas por un grupo.

**Información almacenada:**
- Título
- Fecha de lanzamiento
- Número de canciones
- Grupo responsable
- Estado

#### Canción
Una composición musical individual dentro de un álbum.

**Información almacenada:**
- Título
- Duración
- Artistas participantes
- Álbum
- Reproducciones

#### Actividad
Cualquier evento o actividad en la que participa un grupo o artista.

**Información almacenada:**
- Tipo (concierto, ensayo, grabación, etc.)
- Fecha
- Lugar
- Participantes
- Estado

#### Contrato
Acuerdo formal entre la agencia y artistas/grupos.

**Información almacenada:**
- Tipo de contrato
- Partes involucradas
- Fechas de vigencia
- Condiciones
- Estado

---

## AUTENTICACIÓN

### Login al Sistema

#### Paso 1: Acceder a la Página de Login
1. Abre tu navegador web
2. Dirígete a la URL del sistema: `https://kpop-manager.example.com`
3. Verás la pantalla de login

#### Paso 2: Ingresar Credenciales
```
┌─────────────────────────────────┐
│   K-POP GROUPS MANAGER          │
│                                 │
│  Email: ________________        │
│  Contraseña: __________         │
│                                 │
│  [     INGRESAR      ]          │
│  [¿Olvidó su contraseña?]       │
│                                 │
└─────────────────────────────────┘
```

**Campos obligatorios:**
- **Email:** Tu correo registrado
- **Contraseña:** Tu contraseña segura

1. Ingresa tu email en el campo "Email"
2. Ingresa tu contraseña en el campo "Contraseña"
3. Haz clic en "Ingresar"

#### Paso 3: Validación
- ✅ Si las credenciales son correctas → Acceso al sistema
- ❌ Si son incorrectas → Verás un mensaje de error

### Errores Comunes de Login

| Error | Causa | Solución |
|-------|-------|----------|
| "Email o contraseña incorrectos" | Credenciales inválidas | Verifica mayúsculas/minúsculas, espacios |
| "Usuario no existe" | Email no registrado | Contacta al administrador |
| "Cuenta desactivada" | Tu usuario fue deshabilitado | Contacta al administrador |
| "Demasiados intentos fallidos" | Múltiples intentos incorrectos | Espera 15 minutos e intenta nuevamente |

### Gestión de Contraseña

#### Cambiar Contraseña
1. Haz clic en tu **perfil** (esquina superior derecha)
2. Selecciona **"Cambiar Contraseña"**
3. Ingresa:
   - Contraseña actual
   - Nueva contraseña (mín. 8 caracteres, debe incluir: mayúsculas, minúsculas, números, símbolos)
   - Confirmar nueva contraseña
4. Haz clic en **"Guardar"**

#### Recuperar Contraseña
1. En la página de login, haz clic en **"¿Olvidó su contraseña?"**
2. Ingresa tu email
3. Recibirás un link de recuperación
4. Sigue las instrucciones en el email
5. Crea una nueva contraseña

### Cerrar Sesión

1. Haz clic en tu **perfil** (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**
3. Se cerrará tu sesión automáticamente

---

## MÓDULO: GESTIÓN DE AGENCIAS

### ¿Qué es?
El módulo de Gestión de Agencias permite administrar la información de tu organización de K-Pop.

### ¿Para qué sirve?
- Mantener datos actualizados de la agencia
- Registrar nueva información corporativa
- Gestionar múltiples agencias (si aplica)
- Visualizar información global de la agencia

### Roles permitidos
- **ADMIN:** Acceso total
- **DIRECTOR:** Lectura y actualización
- **MANAGER:** Lectura

---

### Procedimiento 1: Ver Lista de Agencias

**Objetivo:** Visualizar todas las agencias registradas en el sistema

**Pasos:**
1. En el menú principal, haz clic en **"Agencias"**
2. Se abrirá una pantalla con tabla de agencias
3. Verás las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| ID | Identificador único |
| Nombre | Nombre de la agencia |
| Dirección | Ubicación física |
| Fecha Fundación | Cuándo se creó |
| Estado | Activa/Inactiva |
| Acciones | Botones de editar/ver |

**Información adicional:**
- Haz clic en una fila para ver detalles completos
- Usa filtros para buscar por estado
- Usa paginación para navegar entre páginas

---

### Procedimiento 2: Crear Nueva Agencia

**Objetivo:** Registrar una nueva agencia en el sistema

**Prerequisitos:** Ser usuario con rol ADMIN

**Pasos:**
1. En el módulo Agencias, haz clic en **"+ Nueva Agencia"**
2. Se abrirá un formulario con los siguientes campos:

| Campo | Obligatorio | Tipo | Restricción |
|-------|-------------|------|-------------|
| Nombre | Sí | Texto | Máx. 255 caracteres |
| Dirección | No | Texto | Máx. 500 caracteres |
| Fecha de Fundación | No | Fecha | Debe ser fecha pasada |

**Validaciones:**
- El nombre no puede estar vacío
- El nombre debe ser único (no repetir)
- La fecha de fundación no puede ser futura

**Ejemplo de datos:**
```
Nombre: YG Entertainment
Dirección: Calle Principal 123, Seúl, Corea del Sur
Fecha Fundación: 1996-08-06
```

3. Completa cada campo requerido
4. Haz clic en **"Guardar"**
5. Verás un mensaje de confirmación: "Agencia creada exitosamente"

**Posibles errores:**
```
❌ Error: El nombre ya existe
   Solución: Usa un nombre diferente

❌ Error: La fecha es futura
   Solución: Ingresa una fecha anterior a hoy

❌ Error: No tienes permisos
   Solución: Contacta a un administrador
```

---

### Procedimiento 3: Editar Agencia Existente

**Objetivo:** Actualizar información de una agencia

**Pasos:**
1. Ve a la lista de Agencias
2. Busca la agencia a editar
3. Haz clic en el botón **"Editar"** (icono de lápiz)
4. Se abrirá el formulario con datos actuales
5. Modifica los campos que necesites cambiar
6. Haz clic en **"Guardar Cambios"**
7. Verás confirmación: "Agencia actualizada exitosamente"

**Campos editables:**
- Nombre
- Dirección
- Fecha de Fundación
- Estado (Activa/Inactiva)

---

### Procedimiento 4: Ver Detalles de Agencia

**Objetivo:** Visualizar información completa de una agencia

**Pasos:**
1. En la lista de Agencias, haz clic en el **nombre de la agencia**
2. Se abrirá la pantalla de detalles mostrando:

**Información General:**
- Nombre
- Dirección
- Fecha de fundación
- Estado actual
- Fecha de creación en el sistema
- Fecha de última actualización

**Información Relacionada:**
- Total de grupos adscritos
- Total de aprendices
- Total de contratos activos
- Total de ingresos registrados

**Acciones disponibles:**
- Editar agencia
- Ver grupos de la agencia
- Ver aprendices de la agencia
- Ver contratos de la agencia
- Generar reporte

---

## MÓDULO: GESTIÓN DE APRENDICES

### ¿Qué es?
Gestión de aprendices es el módulo donde registras y administras a las personas en entrenamiento para convertirse en artistas.

### ¿Para qué sirve?
- Registrar nuevos aprendices
- Seguimiento del progreso
- Registrar evaluaciones
- Rastrear estado de entrenamiento
- Promover a artista cuando sean competentes

### Roles permitidos
- **ADMIN:** Acceso total
- **MANAGER:** Crear, leer, actualizar
- **DIRECTOR:** Crear, leer, actualizar
- **APPRENTICE:** Solo ver su perfil

---

### Procedimiento 1: Registrar Nuevo Aprendiz

**Objetivo:** Ingresa un nuevo aprendiz al programa de entrenamiento

**Pasos:**
1. En el menú, ve a **"Aprendices"**
2. Haz clic en **"+ Nuevo Aprendiz"**
3. Completa el formulario:

| Campo | Obligatorio | Tipo | Restricción |
|-------|-------------|------|-------------|
| Nombre | Sí | Texto | 2-255 caracteres |
| Fecha Nacimiento | Sí | Fecha | 15-50 años de edad |
| Agencia | Sí | Selección | Una agencia del sistema |

**Validaciones:**
- Nombre mínimo 2 caracteres
- Edad mínima: 15 años
- Edad máxima: 50 años
- Agencia debe existir en el sistema

**Ejemplo:**
```
Nombre: Kim Min-jae
Fecha de Nacimiento: 2005-03-15  (Edad: 20 años) ✅
Agencia: YG Entertainment
```

4. Haz clic en **"Registrar"**
5. Verás confirmación: "Aprendiz registrado exitosamente"
6. El estado inicial será: **ACTIVO**

**Errores posibles:**
```
❌ "Edad fuera de rango"
   La edad debe estar entre 15 y 50 años

❌ "Nombre muy corto"
   El nombre debe tener mínimo 2 caracteres

❌ "Agencia no encontrada"
   Selecciona una agencia válida del listado
```

---

### Procedimiento 2: Evaluar Aprendiz

**Objetivo:** Registrar evaluación periódica del progreso del aprendiz

**Prerequisitos:** 
- Rol MANAGER o DIRECTOR
- Aprendiz en estado ACTIVO

**Pasos:**
1. Ve a **"Aprendices"**
2. Busca el aprendiz a evaluar
3. Haz clic en **"Evaluar"** (botón azul)
4. Se abre formulario de evaluación:

| Campo | Tipo | Rango | Descripción |
|-------|------|-------|-------------|
| Puntaje | Número | 0-100 | Calificación general |
| Comentarios | Texto | Máx. 1000 | Observaciones |
| Áreas Fuertes | Texto | Máx. 500 | Fortalezas identificadas |
| Áreas a Mejorar | Texto | Máx. 500 | Aspectos por trabajar |

5. Completa los campos:
```
Puntaje: 85
Comentarios: Excelente progreso en técnica vocal y carisma en escena
Áreas Fuertes: Habilidades vocales, presencia en escena
Áreas a Mejorar: Técnica de baile, resistencia física
```

6. Haz clic en **"Registrar Evaluación"**

**Sistema Automático de Progreso:**

El sistema analiza automáticamente el promedio de últimas 5 evaluaciones:

```
Promedio >= 80 puntos
    ↓
✅ ESTADO CAMBIA A: GRADUADO
   - Se crea automáticamente Usuario como ARTIST
   - Recibe credenciales de acceso
   - Se notifica al aprendiz

Promedio 40-79 puntos
    ↓
➡️ ESTADO PERMANECE: ACTIVO
   - Continúa en entrenamiento
   - Se programan nuevas sesiones

Promedio < 40 puntos
    ↓
⚠️ ESTADO CAMBIA A: SUSPENDIDO
   - Se pausa entrenamiento
   - Se notifica a supervisores
   - Requiere revisión especial para continuar
```

---

### Procedimiento 3: Ver Historial de Evaluaciones

**Objetivo:** Revisar todas las evaluaciones previas de un aprendiz

**Pasos:**
1. En lista de Aprendices, haz clic en el **nombre del aprendiz**
2. Se abre perfil con información completa
3. Baja hasta sección **"Historial de Evaluaciones"**
4. Verás tabla con:

| Columna | Información |
|---------|-------------|
| Fecha | Cuándo se registró |
| Puntaje | Calificación obtenida |
| Evaluador | Quién realizó la evaluación |
| Promedio Mobile | Promedio últimas 5 evaluaciones |
| Estado | Estado del aprendiz después |

**Visualización gráfica:**
```
Gráfico de Progreso - Kim Min-jae

100 │
 90 │        ╱╲
 80 │      ╱  ╲╱╲
 70 │    ╱      ╲
 60 │  ╱
    └──┴─────────→ Evaluación #1 #2 #3 #4 #5
```

---

## MÓDULO: GESTIÓN DE ARTISTAS

### ¿Qué es?
Gestión de Artistas permite administrar a los aprendices graduados que ahora son miembros activos de grupos.

### ¿Para qué sirve?
- Vincular artistas con grupos
- Registrar información artística
- Gestionar estado en el grupo
- Rastrear carrera del artista

### Roles permitidos
- **ADMIN:** Acceso total
- **MANAGER:** Crear, leer, actualizar
- **ARTIST:** Ver su propio perfil

---

### Procedimiento 1: Crear Nuevo Artista

**Objetivo:** Registrar a un aprendiz graduado como artista activo en un grupo

**Pasos:**
1. Ve a **"Artistas"**
2. Haz clic en **"+ Nuevo Artista"**
3. Completa formulario:

| Campo | Obligatorio | Restricción |
|-------|-------------|-------------|
| Aprendiz | Sí | Debe ser aprendiz con estado GRADUADO |
| Grupo | Sí | Debe ser grupo activo |
| Nombre Artístico | Sí | 1-255 caracteres |
| Fecha Debut | Sí | Fecha anterior a hoy |

**Validación especial:**
```
⚠️ Solo se pueden vincular APRENDICES GRADUADOS
   (estado >= 80 puntos promedio)
```

**Ejemplo:**
```
Aprendiz: Kim Min-jae (ID: 15)
Grupo: BLACKPINK
Nombre Artístico: Sakura
Fecha Debut: 2024-01-10
```

4. Haz clic en **"Crear Artista"**
5. Confirmación: "Artista creado exitosamente"

---

### Procedimiento 2: Editar Información Artística

**Objetivo:** Actualizar datos del artista

**Pasos:**
1. Ve a lista de Artistas
2. Busca el artista
3. Haz clic en **"Editar"**
4. Modifica:
   - Nombre artístico
   - Fecha de debut
   - Estado en grupo (ACTIVE/INACTIVE)
   - Información biográfica

5. Haz clic en **"Guardar"**

---

## MÓDULO: GESTIÓN DE GRUPOS

### ¿Qué es?
Gestión de Grupos permite crear y administrar los grupos musicales de K-Pop.

### ¿Para qué sirve?
- Crear nuevos grupos
- Administrar miembros
- Asociar conceptos visuales
- Rastrear estado y actividades
- Gestionar debut y lanzamientos

### Roles permitidos
- **ADMIN:** Acceso total
- **MANAGER:** Crear, leer, actualizar
- **DIRECTOR:** Crear, leer, actualizar

---

### Procedimiento 1: Crear Nuevo Grupo

**Objetivo:** Registrar un nuevo grupo en el sistema

**Pasos:**
1. Ve a **"Grupos"**
2. Haz clic en **"+ Nuevo Grupo"**
3. Completa formulario:

| Campo | Obligatorio | Restricción |
|-------|-------------|-------------|
| Nombre | Sí | 1-255, único en sistema |
| Fecha Debut | Sí | Anterior a hoy |
| Agencia | Sí | Una agencia del sistema |
| Número Miembros | No | 1-20 |
| Concepto Visual | No | Seleccionar del listado |
| Estado | Sí | ACTIVE/INACTIVE |

**Ejemplo:**
```
Nombre: NewJeans
Fecha Debut: 2022-08-01
Agencia: HYBE
Número Miembros: 5
Concepto Visual: Y2K Modern
Estado: ACTIVE
```

4. Haz clic en **"Crear Grupo"**
5. Confirmación: "Grupo creado exitosamente"

**Advertencias:**
```
⚠️ El nombre del grupo debe ser único
   No puede haber dos grupos con el mismo nombre

⚠️ La fecha de debut no puede ser futura
   Debe ser una fecha anterior a hoy
```

---

### Procedimiento 2: Agregar Miembros a Grupo

**Objetivo:** Vincular artistas a un grupo

**Pasos:**
1. Ve a la lista de Grupos
2. Haz clic en **nombre del grupo**
3. Se abre perfil del grupo
4. Baja hasta sección **"Miembros"**
5. Haz clic en **"+ Agregar Miembro"**
6. Selecciona artista de la lista:

```
┌─────────────────────────────────┐
│ Seleccionar Artista             │
│                                 │
│ Buscar por nombre: _______      │
│                                 │
│ [√] Kim Min-jae (Sakura)       │
│ [ ] Park Chaeyoung (Rose)      │
│ [ ] Jennie Kim                  │
│ [ ] Lisa Manobal                │
│                                 │
│  [Agregar]  [Cancelar]         │
└─────────────────────────────────┘
```

7. Haz clic en checkbox del artista
8. Haz clic en **"Agregar"**
9. Confirmación: "Artista añadido al grupo"

---

### Procedimiento 3: Ver Detalles del Grupo

**Objetivo:** Visualizar información completa del grupo

**Pasos:**
1. En lista de Grupos, haz clic en **nombre del grupo**
2. Se muestra pantalla con información:

**Datos Básicos:**
- Nombre
- Fecha de debut
- Agencia responsable
- Número de miembros
- Estado actual

**Miembros Actuales:**
```
┌──────────────────────────────────┐
│ Nombre Artístico │ Artista │ Rol│
├──────────────────────────────────┤
│ Sakura           │ Kim Min-jae   │
│ Rose             │ Park Chaeyoung│
│ Jennie           │ Jennie Kim    │
│ Lisa             │ Lisa Manobal  │
└──────────────────────────────────┘
```

**Álbumes Lanzados:**
- Título
- Fecha de lanzamiento
- Número de canciones

**Actividades Relacionadas:**
- Conciertos programados
- Ensayos
- Grabaciones

**Acciones:**
- Editar grupo
- Agregar miembros
- Crear álbum
- Crear actividad

---

## MÓDULO: GESTIÓN DE ÁLBUMES

### ¿Qué es?
Gestión de Álbumes permite registrar lanzamientos discográficos de grupos.

### ¿Para qué sirve?
- Registrar álbumes
- Asociar canciones
- Rastrear lanzamientos
- Gestionar información de proyecto

### Roles permitidos
- **ADMIN:** Acceso total
- **MANAGER:** Crear, leer, actualizar
- **ARTIST:** Ver álbumes

---

### Procedimiento 1: Crear Nuevo Álbum

**Objetivo:** Registrar un nuevo álbum de un grupo

**Pasos:**
1. Ve a **"Álbumes"**
2. Haz clic en **"+ Nuevo Álbum"**
3. Completa formulario:

| Campo | Obligatorio | Restricción |
|-------|-------------|-------------|
| Título | Sí | 1-255 caracteres |
| Grupo | Sí | Un grupo del sistema |
| Fecha Lanzamiento | Sí | Anterior a hoy |

**Ejemplo:**
```
Título: Hype Boy (Single Album)
Grupo: NewJeans
Fecha Lanzamiento: 2022-08-01
```

4. Haz clic en **"Crear Álbum"**
5. Confirmación: "Álbum creado exitosamente"

---

### Procedimiento 2: Agregar Canciones al Álbum

**Objetivo:** Vincular composiciones al álbum

**Pasos:**
1. En lista de Álbumes, haz clic en **nombre del álbum**
2. Se abre detalles del álbum
3. Baja a sección **"Canciones"**
4. Haz clic en **"+ Agregar Canción"**
5. Completa información:

| Campo | Obligatorio |
|-------|-------------|
| Título | Sí |
| Duración | No |
| Posición en Álbum | No |

6. Haz clic en **"Guardar Canción"**

---

## MÓDULO: GESTIÓN DE CANCIONES

### ¿Qué es?
Registro de composiciones musicales individuales.

### ¿Para qué sirve?
- Catalogar canciones
- Registrar información musical
- Rastrear reproducciones
- Asociar con álbumes

### Procedimiento 1: Crear Nueva Canción

**Pasos:**
1. Ve a **"Canciones"**
2. Haz clic en **"+ Nueva Canción"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Título | Sí |
| Álbum | Sí |
| Duración (minutos) | No |
| Artistas Destacados | No |

**Ejemplo:**
```
Título: Hype Boy
Álbum: Hype Boy (Single Album)
Duración: 3:05
Artistas: NewJeans (todas las miembros)
```

4. Haz clic en **"Guardar"**

---

## MÓDULO: GESTIÓN DE ACTIVIDADES

### ¿Qué es?
Registro de eventos, conciertos, ensayos y actividades de grupos/artistas.

### ¿Para qué sirve?
- Programar eventos
- Registrar participantes
- Rastrear actividades
- Gestionar logística

### Procedimiento 1: Crear Nueva Actividad

**Pasos:**
1. Ve a **"Actividades"**
2. Haz clic en **"+ Nueva Actividad"**
3. Completa formulario:

| Campo | Obligatorio | Tipo |
|-------|-------------|------|
| Tipo | Sí | CONCERT, REHEARSAL, RECORDING, EVENT |
| Responsable | Sí | Texto |
| Fecha | Sí | Fecha/Hora |
| Lugar | Sí | Texto |
| Participantes | No | Grupos/Artistas |

**Ejemplo:**
```
Tipo: CONCERT
Responsable: Juan Pérez (Manager)
Fecha: 2026-02-15 18:00
Lugar: Estadio Jamsil, Seúl
Participantes: NewJeans, BLACKPINK
```

4. Haz clic en **"Crear Actividad"**

---

## MÓDULO: GESTIÓN DE CONTRATOS

### ¿Qué es?
Administración de acuerdos formales entre agencia y artistas/grupos.

### ¿Para qué sirve?
- Registrar contratos
- Rastrear vigencia
- Gestionar términos
- Archivar contratos

### Procedimiento 1: Crear Nuevo Contrato

**Pasos:**
1. Ve a **"Contratos"**
2. Haz clic en **"+ Nuevo Contrato"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Tipo | Sí (ARTIST, GROUP, APPRENTICE) |
| Parte 1 | Sí |
| Parte 2 | Sí |
| Fecha Inicio | Sí |
| Fecha Fin | No |
| Condiciones | No |
| Estado | Sí |

**Ejemplo:**
```
Tipo: GROUP
Parte 1: HYBE (Agencia)
Parte 2: NewJeans (Grupo)
Inicio: 2022-08-01
Fin: 2030-08-01
Condiciones: Contrato de gestión por 8 años
Estado: ACTIVE
```

4. Haz clic en **"Guardar"**

---

## MÓDULO: GESTIÓN DE PREMIOS

### ¿Qué es?
Registro de premios y reconocimientos ganados.

### ¿Para qué sirve?
- Documentar logros
- Rastrear reconocimientos
- Generar estadísticas

### Procedimiento: Registrar Premio

**Pasos:**
1. Ve a **"Premios"**
2. Haz clic en **"+ Nuevo Premio"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Nombre del Premio | Sí |
| Categoría | Sí |
| Grupo/Artista | Sí |
| Fecha | Sí |
| Ceremonia/Evento | No |

**Ejemplo:**
```
Nombre: Daesang (Album del Año)
Categoría: Premios de Música
Grupo: NewJeans
Fecha: 2023-12-15
Evento: MAMA Awards
```

4. Haz clic en **"Guardar"**

---

## MÓDULO: GESTIÓN DE INGRESOS

### ¿Qué es?
Control de ingresos generados por grupos y artistas.

### ¿Para qué sirve?
- Registrar ingresos
- Distribuir ganancias
- Rastrear fuentes
- Generar reportes financieros

### Procedimiento: Registrar Ingreso

**Pasos:**
1. Ve a **"Ingresos"**
2. Haz clic en **"+ Nuevo Ingreso"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Fuente | Sí (Streaming, Conciertos, Merchandising) |
| Monto | Sí |
| Grupo/Artista | Sí |
| Fecha | Sí |
| Descripción | No |

**Ejemplo:**
```
Fuente: Streaming
Monto: $50,000
Grupo: NewJeans
Fecha: 2026-01-31
Descripción: Ingresos de Spotify enero 2026
```

4. Haz clic en **"Guardar"**

---

## MÓDULO: LISTAS DE POPULARIDAD

### ¿Qué es?
Registro de posiciones en charts y listas de popularidad.

### ¿Para qué sirve?
- Rastrear posiciones en charts
- Monitorear desempeño
- Comparar con competencia

### Procedimiento: Agregar Posición en Chart

**Pasos:**
1. Ve a **"Listas de Popularidad"**
2. Haz clic en **"+ Nueva Posición"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Canción | Sí |
| Chart | Sí |
| Posición | Sí |
| Semana | Sí |

**Ejemplo:**
```
Canción: Hype Boy
Chart: Melon Top 100
Posición: 1
Semana: 2022-08-15
```

4. Haz clic en **"Guardar"**

---

## MÓDULO: CONCEPTOS

### ¿Qué es?
Temas visuales y artísticos para grupos.

### Procedimiento: Crear Concepto

**Pasos:**
1. Ve a **"Conceptos"**
2. Haz clic en **"+ Nuevo Concepto"**
3. Ingresa:
   - Nombre
   - Descripción
   - Tipo (Visual, Musical, etc.)

4. Haz clic en **"Guardar"**

---

## MÓDULO: APLICACIONES

### ¿Qué es?
Solicitudes de nuevos usuarios para unirse al sistema.

### Procedimiento: Revisar Aplicación

**Pasos:**
1. Ve a **"Aplicaciones"**
2. Verás lista de solicitudes pendientes
3. Haz clic en solicitud
4. Revisa información del solicitante
5. Haz clic en **"Aprobar"** o **"Rechazar"**
6. Si apruebas: Usuario recibe credenciales

---

## MÓDULO: USUARIOS

### ¿Qué es?
Gestión de cuentas de usuario en el sistema.

### Roles disponibles
- **ADMIN:** Acceso administrativo completo
- **DIRECTOR:** Acceso directivo
- **MANAGER:** Gestor de operaciones
- **STAFF:** Personal administrativo
- **ARTIST:** Artista (acceso limitado)
- **APPRENTICE:** Aprendiz (acceso muy limitado)

### Procedimiento 1: Crear Nuevo Usuario

**Pasos:**
1. Ve a **"Usuarios"**
2. Haz clic en **"+ Nuevo Usuario"**
3. Completa:

| Campo | Obligatorio |
|-------|-------------|
| Email | Sí (debe ser único) |
| Nombre | Sí |
| Contraseña | Sí (mín. 8 caracteres) |
| Rol | Sí |
| Agencia | Según rol |

4. Haz clic en **"Crear"**
5. Usuario recibe email con contraseña temporal

### Procedimiento 2: Editar Usuario

**Pasos:**
1. En lista de Usuarios, busca el usuario
2. Haz clic en **"Editar"**
3. Modifica:
   - Nombre
   - Email
   - Rol
   - Agencia
   - Estado (Activo/Inactivo)

4. Haz clic en **"Guardar"**

---

## BÚSQUEDAS Y FILTROS

### Búsqueda General

En cualquier módulo con tabla de datos:

1. Ubica el campo **"Buscar"** (parte superior izquierda)
2. Escribe lo que buscas:
   - Nombre de grupo
   - Email de usuario
   - Nombre de agencia
   - Etc.

3. Presiona Enter o espera 500ms
4. Resultados se filtran automáticamente

**Ejemplo:**
```
Buscando: "NewJeans"
Resultados: 
  - Grupo NewJeans
  - Usuario newjeans@hybe.com
  - Contrato Group-NewJeans
```

### Filtros Avanzados

En módulos principales:

1. Haz clic en **"Filtros"** (icono de embudo)
2. Se abre panel con opciones:

**Ejemplo - Filtrar Aprendices:**
```
┌──────────────────────────────┐
│ FILTROS                      │
├──────────────────────────────┤
│ □ Estado                     │
│   ☑ Activo                  │
│   □ Inactivo                │
│   □ Graduado                │
│                             │
│ □ Agencia                   │
│   ☑ YG Entertainment        │
│   ☑ HYBE                    │
│   □ JYP Entertainment       │
│                             │
│ □ Rango Edad               │
│   De: 15 A: 25             │
│                             │
│   [Aplicar] [Limpiar]      │
└──────────────────────────────┘
```

3. Selecciona criterios
4. Haz clic en **"Aplicar"**

---

## REPORTES

### Generar Reporte

**Pasos:**
1. Ve a módulo deseado
2. Haz clic en **"Generar Reporte"** (icono de documento)
3. Selecciona formato:
   - PDF
   - Excel
   - CSV

4. Selecciona período:
   - Este mes
   - Últimos 3 meses
   - Últimos 6 meses
   - Todo el año
   - Personalizado

5. Haz clic en **"Descargar"**

**Reportes Disponibles:**
- Listado de grupos y status
- Evaluaciones de aprendices
- Ingresos por categoría
- Contratos activos
- Actividades realizadas

---

## PREGUNTAS FRECUENTES

**P: ¿Olvidé mi contraseña, qué hago?**
R: Haz clic en "¿Olvidó su contraseña?" en login y sigue las instrucciones de email.

**P: ¿Puedo editar un dato de un grupo ya creado?**
R: Sí, haz clic en "Editar" en la fila del grupo y actualiza los campos.

**P: ¿Qué pasa si un aprendiz llega a 80 puntos?**
R: El sistema automáticamente lo promueve a ARTISTA y crea su usuario.

**P: ¿Cuántas veces puedo evaluar un aprendiz?**
R: Las veces que necesites, el sistema mantiene histórico y calcula promedio.

**P: ¿Puedo eliminar un grupo?**
R: Sí (rol ADMIN), pero se eliminarán relaciones asociadas. Se solicita confirmación.

**P: ¿Cómo veo ingresos por grupo?**
R: Ve a "Ingresos", usa filtro por Grupo deseado.

**P: ¿Puedo cambiar el rol de un usuario?**
R: Sí, como ADMIN, edita el usuario y selecciona nuevo rol.

**P: ¿Cuál es el tiempo de sesión?**
R: 24 horas, después se cierra automáticamente.

**P: ¿Puedo tener dos usuarios con el mismo email?**
R: No, email es único en el sistema.

**P: ¿Dónde descargo reportes?**
R: En cada módulo hay botón "Generar Reporte" que descarga en PDF/Excel.

---

## SOLUCIÓN DE PROBLEMAS

### Problema: No puedo ingresar al sistema

**Causa posible:** Credenciales incorrectas o cuenta desactivada

**Solución:**
1. Verifica que email sea correcto (sin espacios)
2. Verifica que contraseña sea correcta (sensible a mayúsculas)
3. Si no recuerdas, usa "Recuperar Contraseña"
4. Si aún no funciona, contacta a administrador

### Problema: Recibo error "No tienes permisos"

**Causa posible:** Tu rol no tiene acceso a esta función

**Solución:**
1. Verifica tu rol actual (perfil → información)
2. Si necesitas más permisos, contacta a administrador
3. Revisa tabla de permisos más abajo

### Problema: No veo los datos que debería

**Causa posible:** Filtros activos o datos pertenecen a otra agencia

**Solución:**
1. Haz clic en "Filtros"
2. Haz clic en "Limpiar todos los filtros"
3. Haz clic en "Aplicar"
4. Datos deberían aparecer

### Problema: Recibo error al crear registro

**Causa posible:** Validación fallida o datos duplicados

**Solución:**
1. Lee el mensaje de error con atención
2. Verifica que todos los campos obligatorios estén completos
3. Verifica que no haya datos duplicados (ej: email, nombre)
4. Intenta nuevamente

### Problema: El sistema va lento

**Causa posible:** Conexión a internet lenta o servidor ocupado

**Solución:**
1. Verifica tu conexión de internet
2. Recarga la página (F5)
3. Si persiste, intenta más tarde
4. Contacta a administrador si el problema continúa

### Problema: Se cierra mi sesión de repente

**Causa posible:** Inactividad por 24 horas o cierre de navegador

**Solución:**
1. Vuelve a hacer login
2. Tus datos guardados permanecen
3. Para mantener sesión activa, usa el sistema regularmente

---

## GLOSARIO

**Agencia:** Organización que gestiona grupos y artistas de K-Pop

**Álbum:** Colección de canciones lanzadas por un grupo

**Aprendiz:** Persona en entrenamiento para convertirse en artista

**Artista:** Aprendiz graduado que forma parte activa de un grupo

**Canción:** Composición musical individual

**Concepto:** Tema visual o artístico de un grupo

**Contrato:** Acuerdo formal entre entidades

**Débito:** Cantidad de dinero owed

**Début:** Primera presentación oficial de grupo o artista

**Director:** Rol administrativo de nivel ejecutivo

**Distribución:** Reparto de ganancias entre partes

**Duración:** Longitud en minutos de una canción

**Estadio:** Lugar de conciertos grandes

**Estado:** Condición actual de un registro (Activo/Inactivo)

**Evaluación:** Calificación periódica del progreso

**Fecha de Fundación:** Cuándo se creó una agencia

**Gestor:** Persona que administra artistas

**Graduado:** Aprendiz que completó entrenamiento exitosamente

**Grupo:** Conjunto de artistas que trabajan juntos

**Ingreso:** Dinero generado por actividades

**Logro:** Premio o reconocimiento obtenido

**Manager:** Rol de gestor de operaciones

**Merchandising:** Productos vendidos (posters, ropa, etc.)

**Miembro:** Artista que pertenece a un grupo

**Nominación:** Selección para un premio

**Popularidad:** Ranking de éxito (charts, listas)

**Premio:** Reconocimiento ganado en competencia

**Reproducciones:** Cantidad de veces que se escucha una canción

**Rol:** Posición/función de un usuario en el sistema

**Sesión:** Período de tiempo conectado al sistema

**Streaming:** Reproducción de música desde plataformas (Spotify, etc.)

**Suspendido:** Aprendiz pausado temporalmente

---

## TABLA DE PERMISOS

| Funcionalidad | ADMIN | DIRECTOR | MANAGER | STAFF | ARTIST | APPRENTICE |
|---------------|-------|----------|---------|-------|--------|-----------|
| Ver Agencias | R | R | R | R | - | - |
| Crear Agencia | C | - | - | - | - | - |
| Editar Agencia | U | U | - | - | - | - |
| Eliminar Agencia | D | - | - | - | - | - |
| Ver Aprendices | R | R | R | R | - | R* |
| Crear Aprendiz | C | C | C | - | - | - |
| Editar Aprendiz | U | U | U | - | - | - |
| Evaluar Aprendiz | C | C | C | - | - | - |
| Ver Artistas | R | R | R | R | R | - |
| Crear Artista | C | C | C | - | - | - |
| Ver Grupos | R | R | R | R | R | R |
| Crear Grupo | C | C | C | - | - | - |
| Editar Grupo | U | U | U | - | - | - |
| Ver Álbumes | R | R | R | R | R | R |
| Crear Álbum | C | C | C | - | - | - |
| Ver Canciones | R | R | R | R | R | R |
| Crear Canción | C | C | C | - | - | - |
| Ver Actividades | R | R | R | R | R | R |
| Crear Actividad | C | C | C | C | - | - |
| Ver Contratos | R | R | R | R | - | - |
| Crear Contrato | C | C | C | - | - | - |
| Ver Premios | R | R | R | R | R | - |
| Registrar Premio | C | C | C | - | - | - |
| Ver Ingresos | R | R | R | - | - | - |
| Registrar Ingreso | C | C | C | - | - | - |
| Ver Usuarios | R | R | - | - | - | - |
| Crear Usuario | C | - | - | - | - | - |
| Editar Usuario | U | U | - | - | - | - |
| Eliminar Usuario | D | - | - | - | - | - |
| Generar Reportes | R | R | R | R | - | - |
| Ver Listas Popularidad | R | R | R | R | R | - |
| Crear Posición Chart | C | C | C | C | - | - |

**Leyenda:**
- R = Lectura
- C = Crear
- U = Actualizar
- D = Eliminar
- \* = Solo su propio perfil
- "-" = Sin acceso

---

**Fin del Manual de Usuario V2**

Documento generado: 15 de enero de 2026

*Para más información o reportar problemas, contacta al equipo de soporte*

