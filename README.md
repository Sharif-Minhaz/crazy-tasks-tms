<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Crazy Tasks TMS

A task management REST API built with NestJS, MongoDB (Mongoose), Cloudinary (file storage), and zod validation.

## Overview

- **stack**: NestJS, Mongoose, JWT, Cloudinary, Nodemailer
- **auth**: Bearer access token + httpOnly refresh token cookie
- **roles**: `user`, `admin` (admin-restricted endpoints marked)
- **rate limit**: 10 requests per 60s (global)
- **cors**: origin `http://localhost:3000`, credentials enabled
- **base url**: `http://localhost:{PORT|3000}`

## Project setup

```bash
npm install
```

## Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Environment variables

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV` (affects cookie security)
- `PORT` (optional)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`

## Authentication model

- **access token**: Bearer JWT in `Authorization` header
- **refresh token**: httpOnly cookie `refresh_token` (path `/auth/refresh-token`, 7 days)
- **guards**:
  - `JwtAuthGuard` → requires valid access token
  - `AdminGuard` → requires access token with role `admin`
  - `GuestGuard` → blocks authenticated users (login/signup)

## Endpoints

### Health

- `GET /` → returns `"Server is running"`

### Auth

- `POST /auth/login` (Guest)
  - body: `{ email: string, password: string }`
  - sets cookie `refresh_token`; response `{ access_token }`
- `POST /auth/signup` (Guest)
  - body: `{ name, email, password, role }` (role: `user` | `admin`)
- `POST /auth/logout` (Auth)
  - clears cookie; response `{ success, message }`
- `POST /auth/refresh-token`
  - requires cookie `refresh_token`; response `{ access_token }`
- `GET /auth/profile` (Auth)
  - returns `{ userId, email, role }`

### Users

- `GET /users` → list users
- `GET /users/:id` → get user by id
- `PATCH /users/:id` (Auth)
  - body: partial `{ name, email, password, role }`
- `DELETE /users/:id` → delete user by id

### Projects

- `POST /projects` (Auth + Admin)
  - multipart/form-data: `name`, `description`, `icon? (file)`, `banner? (file)`
  - creates project, sets `createdBy`, adds creator to `members`
- `GET /projects` (Auth)
- `GET /projects/search?term=...` (Auth)
- `GET /projects/:id` (Auth)
- `PATCH /projects/:id` (Auth + Admin)
  - multipart/form-data: partial update with optional new `icon`/`banner`
  - deletes old assets if present, uploads new files
- `DELETE /projects/:id` (Auth + Admin)
  - deletes Cloudinary assets (if any) and all project tasks
- `PATCH /projects/join?projectId=&userId=` (Auth)
- `PATCH /projects/leave?projectId=&userId=` (Auth)

### Tasks

- `POST /tasks` (Auth + Admin)
  - body: `{ title, description, status, assignee: string[], project: string }`
  - `owner` inferred from JWT
- `GET /tasks` (Auth)
- `GET /tasks/user` (Auth) → tasks where current user is an assignee
- `GET /tasks/project/:id` (Auth)
- `GET /tasks/search?term=...` (Auth)
- `GET /tasks/:id` (Auth)
- `PATCH /tasks/:id` (Auth + Admin) → partial update of task fields
- `DELETE /tasks/:id` (Auth + Admin)
- `PATCH /tasks/assign?taskId=&userId=` (Auth + Admin)
- `PATCH /tasks/remove-assignee?taskId=&userId=` (Auth + Admin)

### Mail

- `POST /mail/task-reminder` (Auth + Admin)
  - body: `{ userId: string, taskId: string }`
  - sends templated email from `src/mail/templates/task-reminder.hbs`

## Data models

### User (`src/schemas/users.schema.ts`)

- `name: string`
- `email: string` (unique, immutable, lowercase)
- `password: string` (min 8, not selected by default)
- `role: 'user' | 'admin'` (default `user`)
- `refreshTokenHash?: string | null` (not selected by default)
- timestamps: `createdAt`, `updatedAt`

### Project (`src/schemas/projects.schema.ts`)

- `name: string` (unique, text-index)
- `description: string` (text-index)
- `icon: string`, `iconKey: string`
- `banner: string`, `bannerKey: string`
- `createdBy: User` (ref)
- `members: User[]` (ref)
- timestamps: `createdAt`, `updatedAt`
  > text index on `name`, `description`

### Task (`src/schemas/tasks.schema.ts`)

- `project: Project` (ref, required)
- `title: string` (required, index)
- `description: string` (index)
- `status: 'open' | 'progress' | 'completed'` (default `open`)
- `owner: User` (ref, required)
- `assignee: User[]` (ref)
- `startDate`, `dueDate`: Date (defaults now)
- `priority: 'low' | 'medium' | 'high'` (default `low`)
- timestamps: `createdAt`, `updatedAt`
  > text index on `title`, `description`

## Validation

- zod schemas enforced via `ZodValidationPipe`
  - auth: `loginSchema`
  - users: `createUserSchema`, `updateUserSchema`
  - projects: `createProjectSchema`, `updateProjectSchema`
  - tasks: `createTaskSchema`, `updateTaskSchema`
  - mail: `sendMailBodySchema`

## Security & middleware

- Helmet enabled globally
- Logger middleware logs: `<METHOD> <URL> - <statusCode>`
- Rate limiter: TTL `60000ms`, limit `10`
- JWT strategy reads Bearer token and maps `{ sub → userId, email, role }`

## File uploads (Projects)

### Create with images

```bash
POST /projects
Content-Type: multipart/form-data

# fields
name: "Project Name"
description: "Project Description"
icon: [file] (optional)
banner: [file] (optional)
```

### Update with images

```bash
PATCH /projects/:id
Content-Type: multipart/form-data

# fields (any subset)
name: "Updated Project Name"
description: "Updated Description"
icon: [file] (optional)
banner: [file] (optional)
```

Notes:

1. Old Cloudinary assets are deleted when new ones are uploaded (best effort)
2. New uploads store both URL and public id

Image requirements:

- formats: JPG, PNG, GIF, WebP
- recommended sizes: icon ≤ 256x256, banner ≤ 1920x1080
- max size: 10MB per image

## Typical flow

1. `POST /auth/signup`
2. `POST /auth/login` → store `access_token`; cookie set for refresh
3. Use `Authorization: Bearer <access_token>` on protected routes
4. `POST /auth/refresh-token` when access token expires
5. Admin: create project `POST /projects`, create tasks `POST /tasks`
6. Admin: assign users `PATCH /tasks/assign`
7. Users: view their tasks `GET /tasks/user`
