# Todofy - Fullstack Code Challenge

Todofy is a fullstack To-Do list built as a code challenge for a Fullstack Developer position. It demonstrates best practices React, Next.js, TypeScript, API design, testing, and internationalization.

---

## How to Run the Project

### 1. **Install dependencies**

This project uses [pnpm](https://pnpm.io/) and a monorepo structure. From the root directory:

```bash
pnpm install
```

### 2. **Run the App**

#### Development Mode

```bash
pnpm run dev
```

#### Docker Container

```bash
pnpm run docker:dev
```

- The app will be available at `http://localhost:3000` by default.
- The API and UI are integrated in the same monorepo for a seamless DX.

## How to Test

### 1. **Unit & Component Tests (Vitest)**

Run all unit and component tests:

```bash
pnpm run test
```

Or, for a specific module only:

```bash
pnpm run test --filter @repo/api
```

- Uses [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).
- Tests are colocated in `__tests__` folders next to components and logic.

### 2. **End-to-End Tests (Playwright)**

Run all E2E tests:

```bash
pnpm run e2e
```

- Uses [Playwright](https://playwright.dev/) for browser automation.
- E2E tests are in `apps/web/tests/e2e/specs` and use a Page Object Model (POM) for maintainability.
- APIs are not mocked on purpose to allow a E2E of both backend and frontend

---

## Technical Decisions & Insights

### **Monorepo Structure**

- Uses a monorepo with `apps/` (web, api) and `packages/` (domain, ui, etc.) for clear separation and reusability.
- Shared types and logic live in `@repo/domain` and `@repo/ui`.

### **Frontend (Next.js + React)**

- Built with Next.js App Router.
- Uses React Query for data fetching and caching.
- UI built with Tailwind CSS and custom Shadcn component library.
- Internationalization (i18n) is supported with dictionaries for English, Spanish, and Italian.

### **Backend (API)**

- Simple file-based persistence using a `FilesystemTaskDataSource` for demo purposes.
- API is modular and easily swappable for a real database.
- Error handling uses a `Result` type for explicit success/failure mimicking Functional Programming patterns.

### **Testing**

- **Unit/Component:** Vitest + Testing Library for fast, isolated tests.
- **E2E:** Playwright for a robust POM structure tests.

### **Other Notable Choices**

- **TypeScript everywhere** for safety and DX.
- **Toast notifications** for user feedback (using `sonner`).
- **Drag-and-drop** for task reordering (using `@dnd-kit`).
- **Debounced updates** to avoid excessive API calls.
- **Undo actions** for destructive operations.
- **Extensible i18n**: Easily add more languages by copying a dictionary file.

---

## Project Structure (Key Parts)

```
todo/
  apps/
    web/           # Next.js frontend
    api/           # API (file-based for demo)
  packages/
    domain/        # Shared types/models
    ui/            # Shared UI components
  config/          # Shared config (eslint, tailwind, tsconfig)
```

---

## Possible Improvements

- Use a proper backend framework (like NestJS, Express, or Fastify) instead of developing everything from scratch, adding it as a separated module
- Add more functionalities in Completed / Archived pages
- Add stores to encapsulate view logic with options like Zustand or any other state management framework
- Improve global theming
- Extract shared configs there were used only in the `apps/web` like Playwright config and Docker

---

## Final Notes

- This project is designed to be clear, maintainable, and production-ready in structure.
- Multiples decisions were made giving priority to simplicity and to showcase technical knowledge
- All code is type-safe, tested, and follows modern best practices.
- APIs on SSR were skipped to prioritize showing case the loading, caching logic on the client side
- If you have any questions or want to see more features, just ask!
