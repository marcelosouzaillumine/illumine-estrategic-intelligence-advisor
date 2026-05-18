# Story: Restrict Auth Access, Case-Insensitive Matching, Premium Typography, and Glassmorphic Redesign

## Description
Remove the user registration option ("Criar Conta") from the Login screen, enforce case-insensitive email matching for client users, automatically delete unauthorized Firebase Auth accounts created during Google Authentication, import/apply Google Fonts (**Tilt Warp** and **Work Sans**), remove the strategic pill, implement perfect letter-width matching for the subtext logo, and overhaul the login form into an ultra-premium glassmorphic dashboard interface.

## Tasks
- [x] Remove the "Criar Conta" tab and form elements from the Email login UI in `src/App.tsx`.
- [x] Implement case-insensitive Firestore queries in `src/App.tsx` comparing the email in both its original and normalized lowercase format.
- [x] Auto-delete newly created unauthorized accounts inside the `onAuthStateChanged` auth listener using `deleteUser()` from `firebase/auth`.
- [x] Ensure that client user email fields are entered and stored in strict lowercase inside `src/components/ClientUserManager.tsx`.
- [x] Import **Tilt Warp** and **Work Sans** Google Fonts inside `index.html`.
- [x] Remove the "Inteligência financeira para decisões de alto impacto" strategic pill from the left column in `src/App.tsx`.
- [x] Apply **Tilt Warp** to the lowercase `"illumine"` text logo.
- [x] Replace "Assessoria Estratégica" with `"Business Intelligence"` formatted in **Work Sans** and distribute its letters dynamically to match the exact responsive width of `"illumine"`.
- [x] Redesign the right login panel into a stunning glassmorphic structure featuring radial background ambient highlights, custom SVG Google logo, and a styled Secure Environment card.

## Files
- [index.html](file:///Users/marcelosouza/Documents/illumine-advisor/index.html)
- [src/App.tsx](file:///Users/marcelosouza/Documents/illumine-advisor/src/App.tsx)
- [src/components/ClientUserManager.tsx](file:///Users/marcelosouza/Documents/illumine-advisor/src/components/ClientUserManager.tsx)

## Checklist
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
