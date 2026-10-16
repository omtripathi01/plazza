# Plazza — Notes

## Tech stack

| Layer | Choice |
|---|---|
| Platform | Android only, `minSdkVersion` 33 (Android 13+), `targetSdkVersion` 35 |
| Framework | React Native 0.79.7 (bare CLI), React 19, New Architecture (Fabric) on, Hermes, JavaScript |
| Navigation | `@react-navigation/native` 7 + `@react-navigation/bottom-tabs` 7, `react-native-screens`, `react-native-safe-area-context` |
| State | `zustand` 5 — one small store per feature (cart, search, permissions, auth, theme) |
| Persistence | `@react-native-async-storage/async-storage` 2 — versioned `{ version, data }` envelope, never throws on bad data |
| Permissions | `react-native-permissions` 5 |
| Location | `@react-native-community/geolocation` 3.4 + OpenStreetMap Nominatim for the place name |
| Animations | `react-native-reanimated` 3 (row enter/exit, button press, coupon bounce) + built-in `Animated` (splash, order confetti) |
| UI | Own design system: theme tokens + shared components (`Button`, `Card`, `Input`, `Chip`, `AppText`, …). No UI or icon library |
| Tests | Jest 29 — 51 tests over pure logic and stores |
| Tooling | ESLint, Prettier, Gradle `-PbundleInDebug` for Metro-free debug APKs |

## Functionalities

- **Splash + login:** branded splash, mock login (any name + 10 digit phone, password `1111`), or continue as guest. Session persists.
- **Permissions:** asks Location and Notifications on first launch; handles granted / denied / blocked with rationale and an Open Settings deep link; re-checks when returning from Settings; debug status banner.
- **Delivery location:** place name resolved from GPS, shown on Home and Profile.
- **Search:** by medicine name or salt, debounced, with empty / loading / no-results / results states; recent searches (max 5) persisted; browse-all list and health tips when idle.
- **Medicine details:** tap any medicine for a description sheet with Rx note and Add / quantity stepper.
- **Cart:** add, increment, decrement, remove; quantity capped at `maxQty`; Rx badges; cart persists across restarts; free-delivery nudge; tab badge with item count.
- **Bill:** Item Total, Discount, Delivery Fee (₹40 under ₹499, else free), Grand Total.
- **Coupons:** FLAT50, SAVE10 (10%, max ₹100), FREEDEL, FIRST100 (once per device); one coupon at a time; auto-removed with a toast when the cart stops qualifying; discount never exceeds item total. New coupons are one entry in `catalog.json`.
- **Place order:** guests are asked to log in first; mock order with confetti confirmation; clears the cart, records the order, marks FIRST100 as used.
- **Profile:** user details, dark / light theme switch (persisted), delivery location, permission status, past orders, log out.
- **Responsive UI:** scales to phone and tablet widths, supports rotation, safe-area aware, 48 dp touch targets with accessibility labels.
