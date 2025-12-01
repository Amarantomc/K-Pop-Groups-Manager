# 🧪 Usuarios de Prueba - Sistema de Roles

## 📝 Credenciales disponibles:

### 👨‍💼 Admin
- **Email:** admin@test.com
- **Password:** admin123
- **Dashboard:** /admin/dashboard

### 🎬 Director
- **Email:** director@test.com
- **Password:** director123
- **Dashboard:** /director/dashboard

### 📊 Manager  
- **Email:** manager@test.com
- **Password:** manager123
- **Dashboard:** /manager/dashboard

### 🎤 Artist
- **Email:** artist@test.com
- **Password:** artist123
- **Dashboard:** /artist/dashboard

### 🎓 Apprentice
- **Email:** apprentice@test.com
- **Password:** apprentice123
- **Dashboard:** /apprentice/dashboard


---

## ✅ Funcionalidades implementadas:

- ✅ Login con 5 roles diferentes
- ✅ Remember Me (30 días de persistencia)
- ✅ Rutas protegidas por rol
- ✅ Menús dinámicos según rol
- ✅ Redirección automática según rol
- ✅ Icono corregido (Letter_K_violet.png)

## 🧪 Cómo probar:

1. Limpia localStorage: F12 → Application → Local Storage → Clear All
2. Refresca la página
3. Usa cualquiera de las credenciales de arriba
4. Marca "Recordarme por 30 días" si quieres persistencia
5. Verifica que te redirija al dashboard correcto
6. Verifica que el sidebar muestre el menú correcto para ese rol

## 📌 Nota:

Este AuthContext está en modo LOCAL (sin backend). Todas las peticiones se simulan con usuarios hardcodeados en `src/contextsLocal/AuthContext.tsx`.