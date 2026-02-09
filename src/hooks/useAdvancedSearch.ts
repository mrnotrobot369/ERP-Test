import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/features/auth/stores/authStore'

interface SearchFilters {
    category?: string
    priceRange?: [number, number]
}

export function useAdvancedSearch() {
    const user = useAuthStore((state) => state.user)
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (query: string, filters?: SearchFilters) => {
        if (!query.trim() && !filters?.category) {
            setResults([])
            return
        }

        setLoading(true)
        setError(null)

        try {
            let supabaseQuery = supabase
                .from('products')
                .select('*')

            // Add text search
            if (query.trim()) {
                supabaseQuery = supabaseQuery.or(
                    `name.ilike.%${query}%,description.ilike.%${query}%`
                )
            }

            // Add filters
            if (filters?.category) {
                supabaseQuery = supabaseQuery.eq('category', filters.category)
            }

            if (filters?.priceRange) {
                supabaseQuery = supabaseQuery
                    .gte('selling_price', filters.priceRange[0])
                    .lte('selling_price', filters.priceRange[1])
            }

            const { data, error: queryError } = await supabaseQuery.limit(20)

            if (queryError) throw queryError

            setResults(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed')
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [user])

    return { results, loading, error, search }
}
