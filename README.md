# OzScore Match List

<img src="assets/images/text-icon.png" alt="OzScore App Logo" width="180" height="80" />

OzScore Match List is a React Native application built with Expo Router that demonstrates a production-grade sports match listing experience with infinite scrolling, live countdown timers, timezone-aware time display, and apply-based tournament filtering.

## Tech Stack

- React Native (`0.81.5`)
- Expo SDK (`~54.0.33`)
- Expo Router (`~6.0.23`)
- TypeScript (`~5.9.2`)
- TanStack React Query (`^5.90.21`)
- Zustand (`^5.0.11`)
- FlashList (`2.0.2`)
- `@gorhom/bottom-sheet` (`^5.2.8`)
- `date-fns` (`^4.1.0`)
- Axios (`^1.13.5`)

## Features Implemented

- Infinite scrolling with offset-based pagination
- Dynamic timezone handling (device timezone)
- Multi-select tournament filters
- Apply-based filter system (filters apply only on confirmation)
- Optimized countdown timer using a single global clock
- Loading, empty, and error states
- FlashList performance optimization
- Memoized list/item components to reduce unnecessary re-renders
- GestureHandlerRootView integration for smooth gesture-based UI (bottom sheet)

## How to Run the Project

Clone the repository:

```bash
git clone https://github.com/zeon-X/OzScore
cd OzScore
```

```bash
npm install
npx expo start
```

Alternative script command:

```bash
npm run start
```

### APK

`OzScore.apk` is included here: **[Download APK](https://expo.dev/accounts/gozeonx/projects/ozscore-digiground/builds/a3afc2e3-0b88-479e-a381-bf93d0422968)**

[Open Expo Build Link](https://expo.dev/accounts/gozeonx/projects/ozscore-digiground/builds/a3afc2e3-0b88-479e-a381-bf93d0422968)

Scan QR to open the APK link:

<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fexpo.dev%2Faccounts%2Fgozeonx%2Fprojects%2Fozscore-digiground%2Fbuilds%2Fa3afc2e3-0b88-479e-a381-bf93d0422968" alt="APK QR Code" width="180" height="180" />

## Architecture Overview

- **API layer separation (`src/api`)**: Network setup and domain API modules are separated (`axios.ts`, `matchApi.ts`, `sportsApi.ts`) for clean boundaries and easier maintenance.
- **Server state with React Query**: Remote data fetching, caching, stale handling, and pagination orchestration are handled with TanStack Query.
- **UI state with Zustand**: Filter selections and apply-state behavior are managed in a lightweight global store (`src/store/filterStore.ts`).
- **Infinite pagination via `useInfiniteQuery`**: Match lists are loaded progressively via offset-based pagination for scalable list rendering.
- **Filter-driven refetch through query keys**: Applied filter values are included in query dependencies so updates trigger consistent automatic refetches.
- **Countdown optimization via global clock**: A shared clock hook (`src/hooks/useGlobalClock.ts`) avoids spinning individual timers in each card.

## Assumptions Made

- API pagination follows offset-based loading semantics.
- Tournament filters are applied only when the user taps **Apply**.
- Timezone is derived from the device via `Intl` API behavior.

## Trade-offs

- Implemented full date selection by tapping month/year in the UI to improve usability, at the cost of extra UI complexity (screenshot to be added).
- Did not implement tournament search query wiring in the active filter sheet for simplicity and assignment scope.
- API-based filter variant is kept but not currently used: `src/components/FilterBottomSheetWithApiCall.tsx`.
- Used local device timezone instead of user-selectable timezone settings.
- Used FlashList v2 dynamic measurement rather than manual item size estimation to keep implementation straightforward.

## Improvements

- Add debounced tournament/search filtering.
- Improve backend image reliability (`image: null` and occasional image endpoint `404` responses should be handled/fixed server-side).
- Add stronger image fallback strategy at API or CDN level.

## Screenshots

<p align="center">
	<img width="24%" alt="Match List screen with active tournament filtering, live match cards, and real-time countdown timers demonstrating infinite-scroll list behavior" src="https://github.com/user-attachments/assets/039ef67f-3efa-4961-b8b6-b838d19dc94b" />
	<img width="24%" alt="Match List default date view showing timezone-aware schedule rendering and baseline unfiltered list state" src="https://github.com/user-attachments/assets/b966bf7f-56ec-4010-a8a2-13c5d4743978" />
	<img width="24%" alt="Custom date filtering result screen where selected date constraints are applied to match data after user confirmation" src="https://github.com/user-attachments/assets/95c1aa17-138d-4997-bdf6-1d386c581884" />
	<img width="24%" alt="Filter bottom sheet interface with multi-select tournament options and apply-based state update workflow" src="https://github.com/user-attachments/assets/25f4cf5d-56e9-497d-8526-7078f7dc933b" />
</p>

- **Match List + Filter Applied**: Active filtered state with countdown-enabled match cards.
- **Default Date Selection**: Initial date state with device-timezone-aware schedule display.
- **Custom Date Applied**: Refreshed match results after explicit date filter apply action.
- **Filter Bottom Sheet**: Tournament multi-select + apply interaction flow.

## Project Structure

```text
.
├── README.md
├── app
│   ├── _layout.tsx
│   └── index.tsx
├── app.json
├── assets
│   └── images
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── favicon.png
│       ├── icon.png
│       └── splash-icon.png
├── eas.json
├── eslint.config.js
├── expo-env.d.ts
├── package-lock.json
├── package.json
├── scripts
│   └── reset-project.js
├── src
│   ├── api
│   │   ├── axios.ts
│   │   ├── matchApi.ts
│   │   └── sportsApi.ts
│   ├── components
│   │   ├── CountdownTimer.tsx
│   │   ├── DateSelectDropdown.tsx
│   │   ├── EmptyView.tsx
│   │   ├── FilterBottomSheet.tsx
│   │   ├── FilterBottomSheetWithApiCall.tsx
│   │   ├── LoadingView.tsx
│   │   └── MatchCard.tsx
│   ├── constants
│   │   ├── config.ts
│   │   └── theme.ts
│   ├── depriciated
│   ├── hooks
│   │   ├── useGlobalClock.ts
│   │   ├── useMatches.ts
│   │   └── useTournaments.ts
│   ├── screens
│   │   └── MatchListScreen.tsx
│   ├── services
│   ├── store
│   │   └── filterStore.ts
│   ├── types
│   │   ├── match.ts
│   │   ├── query.ts
│   │   └── sport.ts
│   └── utils
│       └── time.ts
└── tsconfig.json
```
