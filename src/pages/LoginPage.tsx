import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store/userStore';
import { Github, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login - in production, make API call
        setUser({
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            plan: 'free',
            credits: {
                used: 0,
                total: 250,
            },
            connectedAccounts: {},
        });
        navigate('/');
    };

    const handleOAuthLogin = (provider: 'github' | 'google') => {
        // Simulate OAuth login - in production, redirect to OAuth provider
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
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
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
                        <Button type="submit" className="w-full">
                            Sign in
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
                            onClick={() => handleOAuthLogin('github')}
                            className="gap-2"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthLogin('google')}
                            className="gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            Google
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => navigate('/register')}
                        >
                            Sign up
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
