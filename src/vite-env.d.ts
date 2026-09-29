/// <reference types="vite/client" />

// Explicit fallback deklarációk a stílus-importokhoz (side-effect import),
// hogy a `tsc` (noUncheckedSideEffectImports) ne panaszkodjon akkor sem,
// ha a `vite/client` típusok valamiért nem töltődnének be.
declare module '*.css';
