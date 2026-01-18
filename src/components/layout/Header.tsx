import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { Bell, Menu, Search } from 'lucide-react';

export function Header() {
    const { toggleSidebar, sidebarCollapsed } = useUIStore();
    const { user } = useUserStore();

    return (
        <header
            className={cn(
                'fixed top-6 right-6 z-30 h-14',
                'bg-card backdrop-blur-2xl border-2 border-white/10',
                'rounded-3xl shadow-lg dark:shadow-2xl shadow-black/20 dark:shadow-black/50',
                'flex items-center justify-between px-4 lg:px-6',
                'transition-all duration-300',
                sidebarCollapsed ? 'left-24' : 'left-72',
                'max-lg:left-6'
            )}
        >
            {/* Left section */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={toggleSidebar}
                    className="lg:hidden"
                >
                    <Menu className="size-6" />
                </Button>

                {/* Search bar - hidden on mobile */}
                <div className="hidden md:flex relative w-64 lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 bg-background/50"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Credits indicator */}
                {user && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border">
                        <span className="text-xs text-muted-foreground">Credits:</span>
                        <span className="text-sm font-semibold">
                            {user.credits.used}/{user.credits.total}
                        </span>
                    </div>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon-lg" className="relative">
                    <Bell className="size-6" />
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        3
                    </Badge>
                </Button>

                {/* Account dropdown */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                            {user?.name.charAt(0) || 'U'}
                        </span>
                    </div>
                </Button>
            </div>
        </header>
    );
}
