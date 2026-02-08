import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Alert,
    AlertDescription,
} from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { CheckCircle2 } from 'lucide-react'

export function Signup() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const signUp = useAuthStore((s) => s.signUp)
    const loading = useAuthStore((s) => s.loading)

    // Redirect if already logged in
    if (user) return <Navigate to="/" replace />

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const validateForm = (): boolean => {
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            return false
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        const { error: err } = await signUp(email, password)
        if (err) {
            setError(err.message)
            return
        }

        setSuccess(true)
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-center">Inscription réussie !</CardTitle>
                        <CardDescription className="text-center">
                            Vérifiez votre boîte mail pour confirmer votre compte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                            variant="outline"
                        >
                            Retour à la connexion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Créer un compte</CardTitle>
                    <CardDescription>
                        Inscrivez-vous pour accéder à l'ERP
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="vous@exemple.ch"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 caractères"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Inscription…' : "S'inscrire"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
