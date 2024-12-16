# Frontend Application

## 📋 Descripción

Este proyecto es la interfaz de usuario de una aplicación basada en React que permite a los usuarios gestionar publicaciones, editar perfiles y realizar otras acciones relacionadas con la administración de contenidos.

## 🚀 Características

- **Gestión de usuarios**: Inicio de sesión, registro, edición de perfiles.
- **Publicaciones**: Crear, editar, eliminar y listar publicaciones.
- **Protección de rutas**: Acceso limitado según autenticación y roles.
- **Integración con API**: Consume endpoints protegidos con JWT.

---

## 📦 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

### Prerrequisitos

- **Node.js**: Asegúrate de tener instalado [Node.js](https://nodejs.org/).
- **npm**: Gestor de paquetes.

### Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/LeoCastaeda/blog-api
   cd frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
  
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto y añade la siguiente configuración:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:5173/api
   ```

4. Inicia el frontend en modo desarollo:

   ```
   npm start
   ```

  
### Build de la Aplicación

Para compilar el frontend para producción:

1. Navega al directorio del frontend:

   ```
    cd frontend
   ```
2. Ejecuta el comando de build:

   ```
    npm run build
   ```  

---

## 🔧 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start` 

Inicia la aplicación en modo de desarrollo.  
Abre [http://localhost:3000](http://localhost:3000) para verlo en tu navegador.

### `npm run dev` 

Inicia la aplicación en modo de desarrollo.  
Abre [http://localhost:5173](http://localhost:5173) para verlo en tu navegador.


## 🛠️ Tecnologías Utilizadas

- **React-vite ts**: Entorno de desarrollo rápido para aplicaciones React con TypeScript.
- **React**: Biblioteca principal para la interfaz de usuario.
- **TypeScript**: Mejora de tipado y mantenimiento del código.
- **React Router**: Navegación entre páginas.
- **Fetch**: Para la comunicación con la API.


---

## 📂 Estructura del Proyecto

```
📦 src
 ┣ 📂api
 ┃ ┗ client.ts  # Configuración del cliente API
 ┣ 📂components
 ┃ ┣ 📂Shared   # Componentes comunes como Footer,Navbar
 ┃ ┗ EditProfile.tsx  # Componente para editar el perfil
 ┃ ┗  AdminRoute.tsx  # Componente para manejo de AdminUser
 ┃ ┗  ManagePost.tsx  #Componente para manejo de las publicaciones
 ┣ 📂context
 ┃ ┗ AuthProvider.tsx  # Contexto para la autenticación
 ┣ 📂pages
 ┃ ┣ Home.tsx    # Página principal
 ┃ ┣ Login.tsx   # Página de inicio de sesión
 ┃ ┣ AdminUser.tsx
 ┃ ┣ AuthorUser.tsx
 ┃ ┣ Error404.tsx
 ┃ ┣ UserProfile.tsx
 ┃ ┗ Register.tsx  # Página de registro
 ┣ appRoutes.tsx
 ┗ main.tsx      # Punto de entrada principal
```

---

## 🔐 Seguridad

- **Autenticación JWT**: Cada solicitud protegida requiere un token en el encabezado `Authorization`.
- **Roles de Usuario**: Las rutas están protegidas según los roles.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## 👥 Contribuciones

¡Contribuciones, issues y solicitudes de funciones son bienvenidas!  
Siéntete libre de abrir un issue o enviar un pull request.

---

## 📧 Contacto

Si tienes alguna pregunta o necesitas ayuda, puedes contactarme en [leocastaeda11@gmail.com](mailto:leocastaeda11@gmail.com).

