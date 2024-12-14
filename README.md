
# Blog API Backend

## Descripción
Este proyecto es un backend para un sistema de blogs que permite a los usuarios registrarse, iniciar sesión, gestionar publicaciones y realizar acciones como dar "likes" a los posts. La API está desarrollada con **Node.js**, **TypeScript**, **Express**, y utiliza **MySQL** con **Prisma ORM**, tambien esta documentada con **Swagger**.

---

## Requisitos

### Tecnologías necesarias
- **Node.js** v16+
- **MySQL** 
- **npm**  
- **Jest**
### Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/LeoCastaeda/blog-api
   cd blog-api
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/blog"
   JWT_SECRET="tu_secreto"
   PORT=3000
   ```

4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor:
   ```bash
   npm start
   ```

---

## Endpoints

### **Auth**
| Método | Endpoint             | Descripción                  | Autorización |
|--------|-----------------------|------------------------------|--------------|
| POST   | `/api/auth/register` | Registro de usuario          | No           |
| POST   | `/api/auth/login`    | Inicio de sesión             | No           |
| POST   | `/api/auth/logout`   | Cierre de sesión             | Sí (Bearer)  |

### **Usuarios**
| Método | Endpoint             | Descripción                   | Autorización |
|--------|-----------------------|-------------------------------|--------------|
| GET    | `/api/users`         | Lista todos los usuarios      | Sí (Bearer)  |
| GET    | `/api/users/:id`     | Obtiene un usuario por ID     | Sí (Bearer)  |
| PUT    | `/api/users/:id`     | Actualiza un usuario por ID   | Sí (Bearer)  |
| DELETE | `/api/users/:id`     | Elimina un usuario por ID     | Sí (Bearer)  |
| POST   | `/api/users/:id/ban` | Banea a un usuario por ID     | Sí (Bearer)  |
| POST   | `/api/users/:id/unban` | Desbanea a un usuario por ID | Sí (Bearer)  |

### **Posts**
| Método | Endpoint               | Descripción                  | Autorización |
|--------|-------------------------|------------------------------|--------------|
| POST   | `/api/posts`           | Crea un nuevo post           | Sí (Bearer)  |
| GET    | `/api/posts`           | Obtiene todos los posts      | Sí (Bearer)  |
| GET    | `/api/posts/:id`       | Obtiene un post por ID       | Sí (Bearer)  |
| PUT    | `/api/posts/:id`       | Actualiza un post por ID     | Sí (Bearer)  |
| DELETE | `/api/posts/:id`       | Elimina un post por ID       | Sí (Bearer)  |
| POST   | `/api/posts/:id/recover` | Recupera un post eliminado | Sí (Bearer)  |

### **Likes**
| Método | Endpoint               | Descripción                       | Autorización |
|--------|-------------------------|-----------------------------------|--------------|
| POST   | `/api/likes`           | Da like a un post                 | Sí (Bearer)  |
| DELETE | `/api/likes`           | Quita el like de un post          | Sí (Bearer)  |
| GET    | `/api/likes/count/:id` | Obtiene el número de likes de un post | Sí (Bearer)  |

---

## Modelo de datos

Describe brevemente los modelos principales y sus relaciones.

### Usuario
- `id`: Identificador único.
- `username`: Nombre de usuario.
- `email`: Correo electrónico.
- `password`: Contraseña encriptada.
- `role`: Rol del usuario (`admin`, `user`).
- Relaciones:
  - Tiene muchos `posts`.

### Post
- `id`: Identificador único.
- `title`: Título del post.
- `content`: Contenido del post.
- `authorId`: Relación con el usuario.

### Like
- `id`: Identificador único.
- `postId`: Relación con el post.
- `userId`: Relación con el usuario.

---
![Diagrama del proyecto](frontend/src/assets/blog-api-mysql.png)


## Pruebas

### Ejecutar pruebas
```bash
npm test
```
Incluye pruebas unitarias y de integración con Jest.

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
