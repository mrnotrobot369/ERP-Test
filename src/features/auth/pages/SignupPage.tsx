import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { toast } from 'sonner'

export function Signup() {
    const navigate = useNavigate()
    const signUp = useAuthStore((state) => state.signUp)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState<string | null>(null)

    const validateForm = () => {
        if (password.length < 6) {
            setFormError('Le mot de passe doit contenir au moins 6 caractères')
            return false
        }
        if (password !== confirmPassword) {
            setFormError('Les mots de passe ne correspondent pas')
            return false
        }
        setFormError(null)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        await signUp(email, password)

        const storeError = useAuthStore.getState().error
        if (storeError) {
            toast.error(storeError)
        } else {
            toast.success('Compte créé ! Vérifiez vos emails.')
            navigate('/login')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Créer un compte
                    </CardTitle>
                    <CardDescription>
                        Entrez vos informations pour créer votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            S'inscrire
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <Link to="/login" className="hover:text-primary underline underline-offset-4">
                        Déjà un compte ? Se connecter
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
