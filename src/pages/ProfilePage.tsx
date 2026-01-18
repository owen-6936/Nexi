import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store/userStore';
import { Link2, X } from 'lucide-react';

export function ProfilePage() {
    const { user, connectAccount } = useUserStore();

    if (!user) return null;

    const accountLinks = [
        {
            name: 'Twitter (X)',
            icon: '𝕏',
            key: 'twitter' as const,
            connected: user.connectedAccounts.twitter,
        },
        {
            name: 'Telegram',
            icon: '✈',
            key: 'telegram' as const,
            connected: user.connectedAccounts.telegram,
        },
        {
            name: 'Solana Wallet',
            icon: '◎',
            key: 'solanaWallet' as const,
            connected: user.connectedAccounts.solanaWallet,
        },
    ];

    const handleConnect = (platform: 'twitter' | 'telegram' | 'solanaWallet') => {
        // Simulated connection - in real app would open OAuth flow
        const mockIdentifier =
            platform === 'solanaWallet'
                ? '9xQe...7Yf3'
                : platform === 'twitter'
                  ? '@username'
                  : '@telegram_user';
        connectAccount(platform, mockIdentifier);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="border-2 border-white/10">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-2xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user.id}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge
                        variant={user.plan === 'premium' ? 'default' : 'secondary'}
                        className="h-6"
                    >
                        {user.plan === 'premium' ? '⭐ Premium' : 'Free Plan'}
                    </Badge>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credits Used */}
                <Card className="border-2 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-base">Credits Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{user.credits.used}</span>
                                <span className="text-2xl text-muted-foreground">
                                    /{user.credits.total}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 transition-all"
                                    style={{
                                        width: `${(user.credits.used / user.credits.total) * 100}%`,
                                    }}
                                />
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {user.plan === 'free'
                                    ? 'Upgrade to Premium for unlimited credits'
                                    : 'Unlimited credits available'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan */}
                <Card className="border-2 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-base">Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {user.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                                </h3>
                                {user.plan === 'free' && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Limited to {user.credits.total} credits per month
                                    </p>
                                )}
                            </div>

                            {user.plan === 'free' ? (
                                <Button className="w-full" size="lg">
                                    Upgrade to Premium
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full" size="lg">
                                    Manage Subscription
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Link Accounts */}
            <Card className="border-2 border-white/10">
                <CardHeader>
                    <CardTitle>Link your accounts</CardTitle>
                    <CardDescription>
                        Connect your social accounts and wallet for enhanced features
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {accountLinks.map((account, index) => (
                            <div key={account.key}>
                                {index > 0 && <Separator className="my-3" />}

                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                                            {account.icon}
                                        </div>
                                        <div>
                                            <p className="font-medium">{account.name}</p>
                                            {account.connected && (
                                                <p className="text-sm text-muted-foreground">
                                                    {account.connected}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {account.connected ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => connectAccount(account.key, '')}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Disconnect
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleConnect(account.key)}
                                            className="gap-1"
                                        >
                                            <Link2 className="h-4 w-4" />
                                            Link
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
