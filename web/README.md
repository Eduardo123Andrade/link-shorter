# Link Shorter — Web

The frontend for the Link Shorter project. Built with **Next.js** and **React**, it is exported as a fully static **Single Page Application (SPA)** and deployed to **AWS S3**.

## Tech Stack

- **Framework:** Next.js 16 (static export)
- **UI:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand 5
- **Forms:** react-hook-form 7 + Zod
- **Icons:** Phosphor Icons 2
- **Notifications:** react-toastify 11

## Project Structure

```
web/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Home page — link creation and listing
│   │   ├── shortlink/index.tsx    # Shortlink redirect page (SPA routing)
│   │   ├── 404.tsx                # Custom 404 page
│   │   ├── _app.tsx               # App wrapper (global styles, toasts)
│   │   └── _document.tsx          # HTML document shell
│   ├── components/
│   │   ├── CreateLinkForm/        # Form to create a new short link
│   │   ├── LinkList/              # Table listing all links with actions
│   │   ├── ShortLink/             # Displays a created short link
│   │   └── ShortLinkRedirect/     # Handles the redirect logic on client
│   ├── hooks/
│   │   ├── useCreateLink.ts       # Mutation: create a new link
│   │   ├── useFetchLinks.ts       # Query: fetch all links
│   │   ├── useDeleteLink.ts       # Mutation: delete a link
│   │   ├── useRealtimeUpdates.ts  # WebSocket: live access count
│   │   └── useValidateLink.ts     # Validates a URL before submitting
│   ├── schemas/                   # Zod validation schemas
│   ├── interfaces/                # TypeScript interfaces
│   └── lib/
│       ├── api.ts                 # API client (fetch wrapper)
│       └── toast.tsx              # Toast notification helpers
├── out/                           # Static export output (deployed to S3)
└── package.json
```

## How It Works

### Pages

**Home (`/`)**

The main page where users can:
- Paste any URL and create a shortened link
- View a list of all their shortened links with access counts
- Copy a short link to the clipboard
- Delete a link
- Export the link list as CSV

**Shortlink (`/shortlink`)**

A client-side redirect page. When a user visits a short link URL, the browser loads this page. On mount, it reads `window.location.pathname` to extract the slug and immediately calls the API to resolve the redirect, then navigates the browser to the original URL.

This pattern is required because the app is deployed to S3 as a static site. S3 is configured with `shortlink/index.html` as its **error document**, so any path that does not match a static file falls through to this page, enabling client-side routing without a server.

### Real-Time Updates

The `useRealtimeUpdates` hook opens a **WebSocket** connection to the server. Whenever a short link is accessed anywhere, the server emits an event that updates the `accessCount` for that link in real time across all connected clients — no polling required.

### Form Validation

Link creation uses `react-hook-form` with a **Zod schema** for validation. The URL is validated on the client before the API call is made. Errors are shown inline below the input field.

## Environment Variables

Create a `.env.local` file in the `web/` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_WS_URL=ws://localhost:3333
```

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the REST API | `http://localhost:3333` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for real-time updates | `ws://localhost:3333` |

## Getting Started

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

The app will be available at `http://localhost:3000`.

Make sure the backend server is running. See [server/README.md](../server/README.md).

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start Next.js development server |
| `yarn build` | Build the Next.js application |
| `yarn build:export` | Build and export static files to `out/` |
| `yarn spa` | Export and preview the static SPA locally |
| `yarn lint` | Run ESLint |

## Static Export and SPA Routing

Next.js is configured with `output: 'export'` in `next.config.ts`, which generates a fully static site in the `out/` directory. There is no Node.js server at runtime — only static HTML, CSS, and JavaScript files served from S3.

Because S3 does not support server-side routing, dynamic routes are handled as follows:

1. A user visits `https://<bucket-url>/my-slug`
2. S3 cannot find a file at that path and serves `shortlink/index.html` (the configured error document)
3. The `ShortLinkRedirect` component reads the slug from `window.location.pathname`
4. It calls the API to resolve the redirect and navigates the browser to the original URL

## Deployment

The static export is deployed to **AWS S3**:

1. `yarn build:export` generates the `out/` directory
2. GitHub Actions syncs the `out/` directory to the S3 bucket using `aws s3 sync`
3. S3 static website hosting serves the files publicly

**S3 Configuration:**
- Index document: `index.html`
- Error document: `shortlink/index.html` (enables SPA fallback routing)
