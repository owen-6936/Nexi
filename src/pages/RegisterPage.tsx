import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store/userStore';
import { Github, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Simulate registration - in production, make API call
        setUser({
            id: 'user_' + Date.now(),
            email: email,
            name: name,
            plan: 'free',
            credits: {
                used: 0,
                total: 250,
            },
            connectedAccounts: {},
        });
        navigate('/');
    };

    const handleOAuthRegister = (provider: 'github' | 'google') => {
        // Simulate OAuth registration - in production, redirect to OAuth provider
        setUser({
            id: 'user_' + Date.now(),
            email: `user@${provider}.com`,
            name: `${provider} User`,
            plan: 'free',
            credits: {
                used: 0,
                total: 250,
            },
            connectedAccounts: {
                [provider]: provider === 'github' ? 'github.com/user' : 'user@gmail.com',
            },
        });
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-white/10">
                <CardHeader className="space-y-1 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                        Nexi
                    </div>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Get started with 250 free credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create account
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthRegister('github')}
                            className="gap-2"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthRegister('google')}
                            className="gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            Google
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => navigate('/login')}
                        >
                            Sign in
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
