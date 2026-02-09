import React, { useState, useCallback } from 'react'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, X } from 'lucide-react'

export const AdvancedSearch: React.FC = () => {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

    const { results, loading, search } = useAdvancedSearch()

    const handleSearch = useCallback(() => {
        search(query, { category, priceRange })
    }, [query, category, priceRange, search])

    const handleReset = () => {
        setQuery('')
        setCategory('')
        setPriceRange([0, 1000])
    }

    return (
        <div className="space-y-6 p-8">
            {/* Search Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Advanced Search
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Main Search */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search products, clients..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full mt-1 p-2 border rounded"
                            >
                                <option value="">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="services">Services</option>
                                <option value="products">Products</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Price Range</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                    className="w-full p-2 border rounded"
                                    placeholder="Min"
                                />
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full p-2 border rounded"
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <div className="flex items-end gap-2">
                            <Button variant="outline" onClick={handleReset} className="w-full">
                                <X className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    Results {results.length > 0 && `(${results.length})`}
                </h3>

                {results.length === 0 && !loading && (
                    <Card className="bg-gray-50">
                        <CardContent className="p-8 text-center text-gray-500">
                            {query ? 'No results found' : 'Start searching to see results'}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result) => (
                        <Card key={result.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-lg mb-2">{result.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-blue-600">
                                        ${result.selling_price?.toFixed(2) || result.price?.toFixed(2) || 'N/A'}
                                    </span>
                                    <Button size="sm">View</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdvancedSearch
