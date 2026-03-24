# DogTravel Web

## Description
DogTravel is a modern web application designed to connect dog owners with professional dog walkers. The platform enables users to securely register, request walks, coordinate via chat, and track active walks in real-time, providing tailored interfaces for both client and walker workflows.

## Tech Stack
- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui UI components
- **Forms & Validation:** React Hook Form, Zod
- **Authentication:** NextAuth.js (v5 Beta)
- **Maps & Tracking:** Mapbox GL, react-map-gl
- **Icons & UI Utilities:** Lucide React, class-variance-authority, clsx, tailwind-merge

## Project Structure
- `public/`: Static assets and bespoke UI decorations (e.g., custom SVG patterns).
- `src/`
  - `app/`: Primary Next.js App Router definitions.
    - `(auth)/`: Contains the login and multi-step registration flows.
    - `dashboard/`: Contextual dashboards split by roles (`_client` and `_walker`).
    - `walkers/`: Walker discovery, listings, and profile layout definitions.
    - `walks/`: Active walk tracking, request forms, and walk management.
  - `components/`
    - `ui/`: Generic, reusable shadcn/ui components (Buttons, Inputs, Dialogs, etc.).
    - `common/`: Shared structural components like `sidebar.tsx` and `empty-state.tsx`.
  - `lib/`: Business logic, utility functions, and centralized configurations.
    - `validations/`: Zod schemas enforcing strict data validation.
    - `auth.ts`: NextAuth credentials and session handling logic.
    - `cpf.ts`: Pure algorithmic CPF validation, cleaning, and input masking.

## Features
- **Role-Based Architecture:** Distinct registration processes, dashboards, and navigation paths for Dog Owners and Walkers.
- **Strict Data Validation:** Robust form control using Zod, featuring mathematical CPF verification algorithms and formatted E164 phone inputs.
- **Live Walk Tracking:** Interactive, real-time mapping functionality migrated to Mapbox GL for precise location tracking.
- **Walk Requests:** Multi-step request interface featuring dynamic price estimation and payment configurations.
- **Real-Time Communication:** Live chat interface connecting owners directly to their walkers during active sessions.
- **Profile Management:** Dedicated pages for comprehensive profile setups, pet registrations, and payment method handling.

## Installation
1. Clone the repository.
2. Install the required Node dependencies:
   ```bash
   npm install
   ```

## Usage
Start the development server (powered by Turbopack):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

## Environment Variables
Create a `.env.local` file in the root directory. Required variables inferred by the integrations include:
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Required for rendering the interactive tracking maps.
- `AUTH_SECRET`: Used to securely encrypt NextAuth session tokens (generate using `npx auth secret`).

## Scripts / Commands
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles the application into an optimized production bundle.
- `npm run start`: Boots the Next.js production server.
- `npm run lint`: Executes ESLint to verify code quality and formatting.

## Important Notes
- **Development Authentication:** The `src/lib/auth.ts` NextAuth provider is currently configured for a development environment state. It forcefully authenticates users and assigns roles dynamically depending on whether the email string contains `"client"` or `"walker"`.
- **Form Masking Paradigm:** Instead of relying on heavy third-party masking dependencies, form masks (like the CPF field) are implemented as mathematically pure string-replacers securely bound to `react-hook-form` controllers to prevent React state desynchronization.
