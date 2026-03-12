# bulag-faust-node

Rebuilding bulag-faust Spring Boot blog API in Node.js + Express from scratch.

> **Goal:** Learn Node.js by translating what you already know from Spring Boot.

---

## 🎯 MVP Philosophy

**Build in this order:**
1. **MVP First** - Minimum working product (Auth + Posts)
2. **Structure** - Clean architecture from the start (Types → Repositories → Services → Controllers)
3. **Polish Later** - Pagination, validation, rate limiting AFTER MVP works

```
MVP (Phases 1-5) → Features (Phases 6-8) → Polish (Phases 9-10)
     ↓                    ↓                     ↓
  Must have           Should have            Nice to have
```

---

## Stack

| Node.js | Spring Boot Equivalent |
|---------|----------------------|
| Express.js | Spring MVC |
| pg (raw SQL) | JPA / Hibernate |
| jsonwebtoken | JwtUtils |
| bcrypt | BCryptPasswordEncoder |
| zod | Bean Validation (@Valid) |
| dotenv | application.properties |
| nodemon | Spring DevTools |

---

## How to Run

```bash
# Start the database
docker-compose up -d

# Run migrations (creates tables)
npm run migrate

# Start dev server (auto-restarts on save)
npm run dev
```

---

## 📁 Project Structure (Clean Architecture)

```
src/
├── types/              ← TypeScript interfaces (DTOs, entities)
├── repositories/       ← Database queries ONLY
├── services/           ← Business logic ONLY
├── controllers/        ← HTTP handlers
├── routes/             ← Endpoint definitions
├── middlewares/        ← Auth, error handling
├── errors/             ← Custom error classes
├── utils/              ← Helpers (pagination, etc)
└── db/
    ├── index.ts        ← Connection pool
    └── migrate.ts      ← Schema creation
```

**Data Flow:**
```
Request → Controller → Service → Repository → DB
          (HTTP)       (Logic)    (SQL)      (Postgres)
```

---

## ✅ Phase 1 — Project Setup (COMPLETE)

**Goal:** Get the skeleton running

- [x] Initialize npm project
- [x] Install dependencies (express, dotenv, bcrypt, jsonwebtoken, pg)
- [x] Install dev dependencies (nodemon, typescript)
- [x] Create folder structure
- [x] Create `app.ts` entry point
- [x] Setup `.env` file
- [x] Setup `docker-compose.yml` (postgres on port 5433)
- [x] Setup database connection pool
- [x] Setup package.json scripts

**✅ Done when:** `npm run dev` starts server, database connects

---

## ✅ Phase 2 — Database Schema (COMPLETE)

**Goal:** All tables created

- [x] Users table
- [x] Roles table
- [x] User_roles join table
- [x] Posts table
- [x] Categories table
- [x] Post_categories join table
- [x] Tags table
- [x] Post_tags join table
- [x] Seed default roles (ROLE_USER, ROLE_ADMIN)
- [x] Seed default admin user

**✅ Done when:** `npm run migrate` creates all tables

---

## 🔲 Phase 3 — Foundation (Types + Repositories)

**Goal:** Type safety + clean data access layer

**Why first?** Everything else depends on these. Do this BEFORE auth!

### 3.1 — TypeScript Types
- [ ] Create `src/types/entities.ts`
- [ ] Define these interfaces **(in order)**:
  - [ ] `User` - base entity (id, username, email, password, timestamps)
  - [ ] `UserPublic` - response DTO (no password!)
  - [ ] `Role` - role entity (id, name)
  - [ ] `UserWithRoles` - user + roles (for JWT)
  - [ ] `AuthCredentials` - login input (email, password)
  - [ ] `RegisterCredentials` - register input (username, email, password)
  - [ ] `JWTPayload` - JWT payload (userId, email, roles, iat?, exp?)

> **Note:** Add Post, Category, Tag types later when you build those features!

### 3.2 — Repository Layer (MVP Only)
- [ ] Create `src/repositories/` directory
- [ ] Create `src/repositories/user.repository.ts` with **ONLY**:
  - [ ] `findByEmail(email: string): Promise<User | null>`
  - [ ] `findByUsername(username: string): Promise<User | null>`
  - [ ] `create(data: RegisterCredentials): Promise<User>`
  - [ ] `findById(id: string): Promise<User | null>`
- [ ] Create `src/repositories/role.repository.ts` with **ONLY**:
  - [ ] `findByName(name: string): Promise<Role | null>`
  - [ ] `findUserRoles(userId: string): Promise<Role[]>`

**✅ Done when:** Types defined, repositories can query users + roles

> **Spring Boot equivalent:** `@Entity` classes + `@Repository` interfaces

---

## 🔲 Phase 4 — Authentication (MVP CRITICAL!)

**Goal:** Users can register and login

**Why first?** Nothing else works without knowing "who is making the request"

**Dependencies:** Phase 3 (Types + Repositories) complete!

### 4.1 — Services
- [ ] Create `src/services/auth.service.ts`
  - [ ] `register(username, email, password)` → hash password, create user, return JWT
  - [ ] `login(email, password)` → validate credentials, return JWT
- [ ] Create `src/services/user.service.ts`
  - [ ] `getCurrentUser(userId)` → get user + roles, return UserPublic

### 4.2 — Controllers + Routes
- [ ] Create `src/controllers/auth.controller.ts`
  - [ ] `POST /api/v1/auth/register`
  - [ ] `POST /api/v1/auth/login`
- [ ] Create `src/routes/auth.routes.ts`
- [ ] Wire routes into `app.ts`

### 4.3 — Auth Middleware
- [ ] Create `src/middlewares/auth.middleware.ts`
  - [ ] Extract Bearer token from `Authorization` header
  - [ ] Verify JWT signature
  - [ ] Attach decoded user to `req.user`

### 4.4 — Test!
- [ ] Register a new user → get JWT
- [ ] Login with existing user → get JWT
- [ ] Access protected route without token → 401
- [ ] Access protected route with valid token → 200

**✅ Done when:** Register, login, and JWT verification all work!

> **Spring Boot equivalent:** `AuthController`, `AuthService`, `JwtUtils`, `SecurityConfig`

---

## 🔲 Phase 5 — Error Handling (MVP Foundation)

**Goal:** Consistent error responses

**Why now?** Before building more features, establish how errors are handled

**Dependencies:** Phase 4 (Auth) complete!

- [ ] Create `src/errors/` directory
  - [ ] `AppError.ts` - base class with statusCode
  - [ ] `NotFoundException.ts` - 404
  - [ ] `UnauthorizedException.ts` - 401
  - [ ] `ForbiddenException.ts` - 403
  - [ ] `ConflictException.ts` - 409
  - [ ] `BadRequestException.ts` - 400
- [ ] Create `src/middlewares/errorHandler.middleware.ts`
  - [ ] Handle known errors (AppError subclasses)
  - [ ] Handle 404 (unknown routes)
  - [ ] Handle 500 (unknown errors - log stack trace)
- [ ] Wire error handler as **last middleware** in `app.ts`
- [ ] Update auth endpoints to use custom errors

**✅ Done when:** All errors return consistent format:
```json
{
  "error": "Not Found",
  "message": "User not found",
  "statusCode": 404
}
```

> **Spring Boot equivalent:** `@RestControllerAdvice` + `@ExceptionHandler`

---

## 🎉 MVP COMPLETE! 

**You now have:**
- ✅ User registration + login
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Consistent error handling

**Next:** Build features (Posts, Categories, Tags)

---

## 🔲 Phase 6 — User Profile (Simplest Feature)

**Goal:** Users can view their own profile

**Why now?** Simple read-only endpoint to test the full stack

**Dependencies:** Phase 5 (Error Handling) complete!

- [ ] Extend `src/repositories/user.repository.ts` (already exists!)
- [ ] Create `src/services/user.service.ts` (extend existing)
  - [ ] `getPublicUserById(id)` - returns UserPublic
- [ ] Create `src/controllers/user.controller.ts`
  - [ ] `GET /api/v1/users/me` - current user
  - [ ] `GET /api/v1/users/:id` - public profile
- [ ] Create `src/routes/user.routes.ts`
- [ ] Wire into `app.ts`
- [ ] Test: Login → `/users/me` → see your data

**✅ Done when:** Users can fetch their own profile

---

## 🔲 Phase 7 — Category Module (Admin-only CRUD)

**Goal:** Admins can manage categories

**Dependencies:** Phase 6 (User) complete!

### 7.1 — Repository (NEW)
- [ ] Create `src/repositories/category.repository.ts`
  - [ ] `findAll()` - all categories
  - [ ] `findById(id)` - single category
  - [ ] `create(name, description)` - create
  - [ ] `update(id, name, description)` - update
  - [ ] `delete(id)` - delete

### 7.2 — Service + Controller
- [ ] Create `src/services/category.service.ts`
- [ ] Create `src/controllers/category.controller.ts`
  - [ ] `GET /api/v1/categories` (public)
  - [ ] `GET /api/v1/categories/:id` (public)
  - [ ] `POST /api/v1/categories` (ADMIN only)
  - [ ] `PUT /api/v1/categories/:id` (ADMIN only)
  - [ ] `DELETE /api/v1/categories/:id` (ADMIN only)

### 7.3 — Role Middleware
- [ ] Create `src/middlewares/requireRole.middleware.ts`
  - [ ] Check if `req.user.roles` contains required role
- [ ] Create `src/routes/category.routes.ts`
- [ ] Wire into `app.ts`

**✅ Done when:** Categories CRUD works, admin-only writes

> **Spring Boot equivalent:** `CategoryController`, `@PreAuthorize("hasRole('ADMIN')")`

---

## 🔲 Phase 8 — Tag Module (Simpler CRUD)

**Goal:** Authenticated users can manage tags

**Dependencies:** Phase 7 (Category) pattern established!

- [ ] Create `src/repositories/tag.repository.ts`
  - [ ] `findAll()`, `findById()`, `create()`, `delete()`
- [ ] Create `src/services/tag.service.ts`
- [ ] Create `src/controllers/tag.controller.ts`
  - [ ] `GET /api/v1/tags` (public)
  - [ ] `POST /api/v1/tags` (authenticated)
  - [ ] `DELETE /api/v1/tags/:id` (authenticated, owner only)
- [ ] Create `src/routes/tag.routes.ts`
- [ ] Wire into `app.ts`

**✅ Done when:** Tags CRUD works for authenticated users

---

## 🔲 Phase 9 — Post Module (CORE FEATURE!)

**Goal:** Full blog post CRUD with relationships

**Why now?** The MAIN feature - everything else supports this

**Dependencies:** Phase 7-8 (Category + Tag) patterns established!

### 9.1 — Repository
- [ ] Create `src/repositories/post.repository.ts`
  - [ ] `findAll({ categoryId, tagId, authorId, page, size, published })`
  - [ ] `findById(id)` - includes author, categories, tags
  - [ ] `create(data, authorId)` - create post
  - [ ] `update(id, data, authorId)` - update (owner only)
  - [ ] `delete(id, authorId)` - delete (owner only)

### 9.2 — Service + Controller
- [ ] Create `src/services/post.service.ts`
- [ ] Create `src/controllers/post.controller.ts`
  - [ ] `GET /api/v1/posts` (public, filterable)
  - [ ] `GET /api/v1/posts/:id` (public)
  - [ ] `POST /api/v1/posts` (authenticated)
  - [ ] `PATCH /api/v1/posts/:id` (owner only)
  - [ ] `DELETE /api/v1/posts/:id` (owner only)
- [ ] Create `src/routes/post.routes.ts`
- [ ] Wire into `app.ts`

### 9.3 — Test Full Workflow
- [ ] Login → Create post with categories + tags → View post → Update → Delete

**✅ Done when:** Full blog post workflow works!

> **Spring Boot equivalent:** `PostController`, `PostService`, `@OneToMany`

---

## 🔲 Phase 10 — Pagination (Optimization)

**Goal:** Efficient data loading for lists

**Why now?** MVP works! Now optimize.

**Dependencies:** Phase 9 (Posts) complete!

- [ ] Create `src/utils/PageResponse.ts`
  - [ ] Standard structure: `{ content, page, size, totalElements, totalPages, last, first }`
- [ ] Apply pagination to:
  - [ ] `GET /api/v1/posts`
  - [ ] `GET /api/v1/categories`
  - [ ] `GET /api/v1/tags`
- [ ] Add query params: `?page=0&size=10&sort=createdAt,desc`

**✅ Done when:** All list endpoints support pagination

> **Spring Boot equivalent:** `Pageable`, `Page<T>`, `PageResponse<T>`

---

## 🔲 Phase 11 — Polish & Security

**Goal:** Production-ready API

**Why last?** Only optimize after MVP works!

**Dependencies:** Phase 10 (Pagination) complete!

- [ ] Input validation with `zod`
  - [ ] Registration (email format, password length)
  - [ ] Post creation (title required, content min length)
- [ ] Rate limiting (prevent brute force on auth)
- [ ] CORS configuration
- [ ] Helmet.js security headers
- [ ] Request logging middleware
- [ ] API documentation (README with endpoints)

**✅ Done when:** API is secure and documented

---

## 🧠 Key Mental Models

| Spring Boot | Express/TypeScript |
|-------------|-------------------|
| `@Entity` | `interface User {}` in `types/entities.ts` |
| `@RestController` | `router.get/post/put/delete` + controller |
| `@Service` | `src/services/*.ts` (business logic) |
| `@Repository` | `src/repositories/*.ts` (DB queries) |
| `@Autowired` | `import` at top of file |
| `ResponseEntity<T>` | `res.status(code).json(data)` |
| `@PathVariable` | `req.params.id` |
| `@RequestParam` | `req.query.page` |
| `@RequestBody` | `req.body` |
| `@PreAuthorize` | Custom middleware (`requireAuth`, `requireRole`) |
| `@RestControllerAdvice` | Last `app.use()` (error handler) |
| `SecurityContextHolder` | `req.user` from auth middleware |
| `Page<T>` | `PageResponse<T>` utility class |

---

## 🦆 Rubber Duck Debugging

> When stuck: Don't Google randomly.
> Ask: **"How did Spring Boot do this?"** then search **"how to do X in Express"**.
> You're **translating**, not starting over.

---

## 📋 Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 - Setup | ✅ Complete | Project skeleton ready |
| Phase 2 - Database | ✅ Complete | All tables created |
| **Phase 3 - Foundation** | 🔲 **NEXT!** | Types + Repositories |
| Phase 4 - Auth | 🔲 Pending | Register + Login + JWT |
| Phase 5 - Errors | 🔲 Pending | Error handling |
| Phase 6-9 - Features | 🔲 Pending | User, Category, Tag, Post |
| Phase 10-11 - Polish | 🔲 Pending | Pagination, Security |

---

**🚀 Start with Phase 3 - Foundation!**

1. Create `src/types/entities.ts` (User, Role, Auth types)
2. Create `src/repositories/user.repository.ts` + `role.repository.ts`
3. Then move to Phase 4 (Authentication)

**Remember:** One phase at a time. Test each phase. Don't skip ahead! ✨
