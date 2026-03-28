# TuriMap — Documentación Técnica
**Aplicación Móvil de Guía Turística**
**Plataforma:** Android / iOS
**Tecnología:** React Native + Expo
**Fecha:** Marzo 2026

---

## 1. Descripción General

**TuriMap** es una aplicación móvil de guía turística desarrollada para la ciudad de **San Pedro Sula, Honduras**. Permite a los usuarios explorar lugares turísticos y eventos locales directamente en un mapa interactivo, con funcionalidades de geolocalización y trazado de rutas en tiempo real.

El concepto de la aplicación está inspirado en el funcionamiento de **Waze**, aplicando esa lógica al turismo: los usuarios pueden descubrir lugares, ver eventos activos en el mapa y obtener indicaciones de cómo llegar desde su ubicación actual.

---

## 2. Objetivos de la Aplicación

- Mostrar lugares turísticos de San Pedro Sula en un mapa interactivo.
- Permitir que usuarios registrados publiquen eventos locales que aparecen en el mapa.
- Trazar rutas desde la ubicación del usuario hasta el lugar o evento seleccionado.
- Diferenciar entre usuarios regulares y administradores con flujos de navegación distintos.
- Sentar las bases para una integración futura con panel web de administración.

---

## 3. Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework base de la app |
| Expo | ~54.0.0 | Plataforma de desarrollo y build |
| TypeScript | ~5.9.2 | Tipado estático |
| Redux Toolkit | ^2.11.2 | Gestión de estado global |
| React Redux | ^9.2.0 | Integración de Redux con React |
| React Navigation | ^7.x | Navegación entre pantallas |
| Supabase JS | ^2.99.3 | Backend: autenticación y base de datos |
| React Native Maps | ^1.20.1 | Mapa interactivo |
| React Native Maps Directions | ^1.9.0 | Trazado de rutas con Google Directions API |
| Expo Location | ~19.0.8 | Geolocalización del dispositivo |
| Expo Constants | ~18.0.13 | Acceso a variables de entorno en runtime |
| AsyncStorage | 2.2.0 | Persistencia local de sesión |
| @expo/vector-icons | incluido en Expo | Librería de íconos |

---

## 4. Arquitectura del Proyecto

```
TouristicGuide/
├── src/
│   ├── screens/           # Todas las pantallas de la app
│   │   ├── SplashScreen.tsx
│   │   ├── StartScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PlaceDetailScreen.tsx
│   │   ├── AddEventScreen.tsx
│   │   ├── AdminDashboardScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── navigation/        # Toda la lógica de navegación
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── UserStack.tsx
│   │   ├── AdminStack.tsx
│   │   ├── TabsNavigator.tsx
│   │   └── StackNavigator.tsx
│   ├── store/             # Estado global con Redux
│   │   ├── index.ts
│   │   ├── hook.ts
│   │   └── slices/
│   │       └── eventsSlice.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── supabaseClient.ts
│   ├── data/
│   │   ├── places.ts      # Lugares turísticos hardcodeados
│   │   └── events.ts      # Eventos iniciales hardcodeados
│   ├── types/
│   │   └── user.ts
│   └── theme/
│       └── theme.ts
├── app.config.js          # Configuración Expo (lee variables .env)
├── app.json               # Configuración base de Expo
├── .env                   # Variables de entorno (ignorado por git)
├── .env.example           # Plantilla de variables para el equipo
└── App.tsx                # Punto de entrada principal
```

---

## 5. Sistema de Navegación

La navegación está dividida en **3 stacks** controlados por `RootNavigator`, que decide cuál mostrar según el estado de autenticación:

```
RootNavigator
├── AuthStack       → Usuario no autenticado
│   ├── StartScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── PlaceDetailScreen
│   └── ExploreTabs (TabsNavigator en modo lectura)
│
├── UserStack       → Usuario autenticado con rol "user"
│   ├── TabsNavigator
│   │   ├── MapScreen
│   │   ├── EventsScreen
│   │   └── ProfileScreen
│   └── AddEventScreen
│
└── AdminStack      → Usuario autenticado con rol "admin"
    └── AdminDashboardScreen
```

### Flujo de decisión en RootNavigator:
1. Si `isLoading` → muestra spinner
2. Si no hay usuario → `AuthStack`
3. Si el usuario tiene `role === "admin"` → `AdminStack`
4. Si el usuario tiene `role === "user"` → `UserStack`

---

## 6. Autenticación

La autenticación está manejada por **Supabase Auth** y un **Context API** propio (`AuthContext`).

### Datos del usuario en sesión:
```typescript
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;        // "user" | "admin"
  isActive: boolean;
  createdAt: string;
  token?: string;
}
```

### Flujo de Login:
1. Usuario ingresa email y contraseña
2. Se llama a `supabase.auth.signInWithPassword()`
3. Si hay error, se muestra un `Alert` con mensaje en español según el tipo de error
4. Si el login es exitoso, el usuario se guarda en `AsyncStorage` para persistir la sesión
5. `RootNavigator` detecta el cambio de estado y redirige automáticamente

### Flujo de Registro:
1. Usuario ingresa nombre, email y contraseña
2. Se llama a `supabase.auth.signUp()` con el nombre en `user_metadata`
3. Supabase envía email de confirmación (configurable)
4. El usuario es redirigido a `LoginScreen`

### Persistencia de sesión:
- Al abrir la app, `AuthContext` lee la sesión guardada en `AsyncStorage`
- Si existe, restaura la sesión sin necesidad de volver a loguearse
- Al cerrar sesión, se limpia `AsyncStorage`

---

## 7. Gestión de Estado — Redux

Se usa **Redux Toolkit** para manejar el estado global de los eventos.

### Store:
```
store/
├── index.ts         → Configura el store con preloadedState
├── hook.ts          → useAppDispatch y useAppSelector tipados
└── slices/
    └── eventsSlice.ts
```

### Modelo de Evento:
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  place_id?: string;
  latitude: number;
  longitude: number;
  category_id?: string;
  start_date: string;
  end_date: string;
  photo_url?: string;
  is_free: boolean;
  status: "pending" | "active" | "rejected";
  created_by: string;
  created_at: string;
}
```

### Acciones disponibles:
| Acción | Descripción |
|---|---|
| `addEvent(event)` | Agrega un nuevo evento al store |
| `removeEvent(id)` | Elimina un evento por ID |
| `clearEvents()` | Limpia todos los eventos |

### Carga inicial:
Los 4 eventos hardcodeados en `src/data/events.ts` se cargan en el store mediante `preloadedState` al iniciar la app.

---

## 8. Mapa Interactivo — MapScreen

Es la pantalla principal y más compleja de la app. Integra múltiples tecnologías:

### Funcionalidades:
- **Visualización de lugares** turísticos con marcadores personalizados (emoji + color primario)
- **Visualización de eventos** activos con marcadores diferenciados (emoji 🎉 + color dorado)
- **Ubicación en tiempo real** del usuario mediante `expo-location`
- **Panel inferior interactivo** que aparece al tocar cualquier pin con animación spring
- **Trazado de rutas** desde la ubicación del usuario hasta el destino seleccionado
- **Tarjeta de información de ruta** mostrando distancia (km) y tiempo estimado (min)
- **Carrusel de lugares** en la parte inferior con cards deslizables horizontalmente
- **FAB (+)** visible solo para usuarios logueados para añadir eventos

### Control de acceso en el mapa:
- **Usuarios no logueados:** pueden ver el mapa y los pins, pero al intentar trazar una ruta aparece un `Alert` ofreciendo ir al Login
- **Usuarios logueados:** acceso completo incluyendo rutas y publicación de eventos

### Flujo de trazado de ruta:
1. Usuario toca un pin en el mapa
2. Aparece el panel inferior con el nombre y subtítulo del lugar
3. Usuario toca "📍 Cómo llegar"
4. Si no está logueado → Alert con opción de iniciar sesión
5. Si está logueado → `MapViewDirections` traza la ruta con Google Directions API
6. Se muestra tarjeta con distancia y tiempo estimado
7. Botón "✕ Cancelar ruta" en el header para limpiar la ruta

---

## 9. Publicación de Eventos — AddEventScreen

Pantalla accesible solo para usuarios logueados desde el FAB (+) del mapa.

### Campos del formulario:
- Título del evento
- Descripción
- Latitud y longitud (coordenadas del evento)
- Fecha de inicio y fecha de fin
- Es gratuito (checkbox/toggle)

### Flujo actual:
1. Usuario llena el formulario
2. Al guardar, se genera un ID único local
3. Se hace `dispatch(addEvent({...}))` al store de Redux
4. El evento aparece inmediatamente en el mapa con un pin 🎉

### Flujo futuro (con backend):
- `status = "pending"` al crear
- Admin aprueba desde panel web
- `status = "active"` → aparece en el mapa

---

## 10. Base de Datos — Supabase

### Tablas principales:

**`auth.users`** (gestionada por Supabase internamente)
- Almacena credenciales y metadatos de autenticación

**`users`**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | Clave primaria, vinculada a auth.users.id |
| name | text | Nombre completo |
| email | text | Correo electrónico |
| avatar_url | text | URL de foto de perfil |
| role | user_role | Enum: "user" o "admin" |
| is_active | bool | Estado de la cuenta |
| created_at | timestamptz | Fecha de creación |

**`places`**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | Clave primaria |
| name | text | Nombre del lugar |
| description | text | Descripción |
| category_id | uuid | Referencia a categoría |
| latitude / longitude | numeric | Coordenadas |
| address | text | Dirección |
| city | text | Ciudad |
| photos | _text | Array de URLs de fotos |
| schedule | text | Horario |
| entry_fee | text | Costo de entrada |
| phone | text | Teléfono |
| status | place_status | Estado del lugar |
| contributed_by | uuid | Usuario que lo registró |
| avg_rating | numeric | Calificación promedio |
| is_sponsored | bool | Si es patrocinado |
| created_at / updated_at | timestamptz | Fechas |

**`events`**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | Clave primaria |
| title | text | Título del evento |
| description | text | Descripción |
| place_id | uuid | Lugar asociado (opcional) |
| latitude / longitude | numeric | Coordenadas |
| category_id | uuid | Categoría |
| start_date / end_date | timestamptz | Fechas del evento |
| photo_url | text | Foto del evento |
| is_free | bool | Si es gratuito |
| status | event_status | pending / active / rejected |
| created_by | uuid | Usuario creador |
| created_at | timestamptz | Fecha de creación |

---

## 11. Datos Hardcodeados (MVP)

### Lugares turísticos — `src/data/places.ts`
10 lugares de San Pedro Sula:
1. Museo de Antropología e Historia
2. Parque Central
3. Mercado Guamilito
4. Catedral San Pedro Apóstol
5. Parque Naciones Unidas (zoológico)
6. Mall Multiplaza
7. Estadio Olímpico Metropolitano
8. Lago de Sula
9. Copantl Hotel & Convention Center
10. Terminal Metropolitana de Buses

### Eventos iniciales — `src/data/events.ts`
4 eventos de ejemplo con `status: "active"`:
1. Feria Gastronómica San Pedro Sula
2. Concierto Rock en el Estadio
3. Expo Artesanías Lenca
4. Torneo de Pesca Deportiva

---

## 12. Seguridad

- **API Keys** almacenadas en `.env` (ignorado por git)
- **`app.config.js`** lee las variables de entorno en tiempo de build via `dotenv`
- **`.env.example`** incluido en el repositorio como referencia para el equipo
- **Row Level Security (RLS)** habilitado en Supabase para proteger las tablas
- **Restricción de API Key de Google** por nombre de paquete Android/iOS y por APIs habilitadas

---

## 13. Variables de Entorno

```env
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**APIs de Google habilitadas para la key:**
- Maps SDK for Android
- Maps SDK for iOS
- Directions API
- Places API

---

## 14. Roadmap / Funcionalidades Futuras

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Integración completa con Supabase | Leer lugares y eventos desde la BD en vez de hardcodeados | Alta |
| Panel web de administración | Aprobar/rechazar eventos con `status = pending` | Alta |
| Flujo de aprobación de eventos | Usuario crea evento → admin aprueba → aparece en mapa | Alta |
| Favoritos | Guardar lugares favoritos por usuario | Media |
| Calificaciones | Sistema de rating para lugares | Media |
| Fotos en eventos | Subir imágenes al crear un evento | Media |
| Notificaciones push | Alertar sobre nuevos eventos cercanos | Baja |
| Filtros en el mapa | Filtrar por categoría, distancia, gratuito/pago | Media |
| Modo offline | Cache de lugares para ver sin conexión | Baja |

---

## 15. Instrucciones de Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>

# 2. Entrar al directorio
cd TouristicGuide

# 3. Instalar dependencias
npm install

# 4. Crear archivo de variables de entorno
cp .env.example .env
# Editar .env con tu API Key de Google Maps

# 5. Iniciar la app
npx expo start --android
```

---

*Documentación generada para la asignatura de Programación Móvil — 2026*
