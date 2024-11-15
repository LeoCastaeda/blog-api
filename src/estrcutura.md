/src
  /entities
    User.ts
    Post.ts
  /usecases
    CreateUserUseCase.ts
    LoginUserUseCase.ts
    CreatePostUseCase.ts
    EditPostUseCase.ts
    DeletePostUseCase.ts
    LikePostUseCase.ts
    GetUserPostsUseCase.ts
    GetAllPostsUseCase.ts
    GetAllUsersUseCase.ts
    BanUserUseCase.ts
    UpdateUserProfileUseCase.ts
  /interfaces
    IUserRepository.ts
    IPostRepository.ts
    UserController.ts
    PostController.ts
    AuthController.ts
  /infrastructure
    /database
      prismaClient.ts
    UserRepository.ts
    PostRepository.ts
  /presentation
    /routes
      userRoutes.ts
      postRoutes.ts
      authRoutes.ts
  /app.ts
  /server.ts

  Detalles de la estructura:
/entities:

User.ts, Post.ts: Definición de las entidades de dominio.
/usecases:

Contiene los casos de uso de la aplicación, cada uno representado por un archivo TypeScript. Ejemplos: CreateUserUseCase.ts, LoginUserUseCase.ts, etc.
/interfaces:

IUserRepository.ts, IPostRepository.ts: Interfaces que definen los métodos que deben implementar los repositorios.
UserController.ts, PostController.ts, AuthController.ts: Controladores que manejan las solicitudes HTTP.
/infrastructure:

/database/prismaClient.ts: Configuración del cliente Prisma.
UserRepository.ts, PostRepository.ts: Implementaciones concretas de los repositorios.
/presentation:

/routes/userRoutes.ts, /routes/postRoutes.ts, /routes/authRoutes.ts: Definición de las rutas de la API.
/app.ts:

Configuración de la aplicación Express.
/server.ts:

Punto de entrada de la aplicación donde se inicializa el servidor.