/**
 * Types pour l'authentification
 * Sera peuplé lors de la migration depuis src/types/auth.ts ou src/stores/authStore.ts
 */

export interface AuthState {
    user: any // Remplacer par User Supabase
    session: any // Remplacer par Session Supabase
    loading: boolean
}
