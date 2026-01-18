import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { usePluginStore } from '@/store/pluginStore';
import { useUserStore } from '@/store/userStore';
import { Download, Package, Search, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

const categories = [
    'All',
    'Development',
    'AI',
    'Voice',
    'Translation',
    'Productivity',
    'Analytics',
];

export function PluginsPage() {
    const {
        plugins,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        installPlugin,
        uninstallPlugin,
        togglePlugin,
        getFilteredPlugins,
    } = usePluginStore();
    const { user, updateCredits } = useUserStore();

    const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace');

    const filteredPlugins = getFilteredPlugins();
    const installedPlugins = plugins.filter((p) => p.isInstalled);

    const handleInstall = (pluginId: string) => {
        const plugin = plugins.find((p) => p.id === pluginId);
        if (!plugin) return;

        if (plugin.isPremium && plugin.price) {
            if (!user || user.credits.used + plugin.price > user.credits.total) {
                alert('Insufficient credits');
                return;
            }
            updateCredits(user.credits.used + plugin.price);
        }

        installPlugin(pluginId);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Package className="h-8 w-8 text-primary" />
                        Plugins
                    </h1>
                    <p className="text-muted-foreground mt-1">Extend Nexi with powerful plugins</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                <TabsList>
                    <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                    <TabsTrigger value="installed">
                        Installed ({installedPlugins.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="marketplace" className="space-y-4 mt-4">
                    {/* Search and Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search plugins..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={
                                    selectedCategory === cat || (cat === 'All' && !selectedCategory)
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {/* Plugins Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlugins.map((plugin) => (
                            <Card
                                key={plugin.id}
                                className={cn(
                                    'border-2 transition-all',
                                    plugin.isPremium
                                        ? 'border-primary/30 bg-primary/5'
                                        : 'border-white/10'
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="text-4xl">{plugin.icon || '📦'}</div>
                                        {plugin.isPremium && (
                                            <Badge variant="default" className="gap-1">
                                                ⭐ Premium
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">{plugin.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {plugin.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Download className="h-3 w-3" />
                                            {plugin.downloads.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            {plugin.rating}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <div>
                                            <p className="text-muted-foreground">
                                                v{plugin.version}
                                            </p>
                                            <p className="text-muted-foreground">
                                                by {plugin.author}
                                            </p>
                                        </div>
                                        {plugin.isPremium && plugin.price && (
                                            <Badge variant="secondary">
                                                {plugin.price} credits
                                            </Badge>
                                        )}
                                    </div>

                                    {plugin.isInstalled ? (
                                        <Button variant="outline" className="w-full" disabled>
                                            Installed
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleInstall(plugin.id)}
                                        >
                                            {plugin.isPremium && plugin.price ? (
                                                <>Install ({plugin.price} credits)</>
                                            ) : (
                                                <>Install</>
                                            )}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="installed" className="space-y-4 mt-4">
                    {installedPlugins.length > 0 ? (
                        <div className="space-y-3">
                            {installedPlugins.map((plugin) => (
                                <Card key={plugin.id} className="border-2 border-white/10">
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{plugin.icon || '📦'}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CardTitle className="text-base">
                                                        {plugin.name}
                                                    </CardTitle>
                                                    {plugin.isPremium && (
                                                        <Badge variant="secondary" className="h-5">
                                                            ⭐ Premium
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="h-5">
                                                        v{plugin.version}
                                                    </Badge>
                                                </div>
                                                <CardDescription>
                                                    {plugin.description}
                                                </CardDescription>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Updated {formatDate(plugin.lastUpdated)} • by{' '}
                                                    {plugin.author}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <Label
                                                        htmlFor={`toggle-${plugin.id}`}
                                                        className="text-sm cursor-pointer"
                                                    >
                                                        {plugin.isEnabled ? 'Enabled' : 'Disabled'}
                                                    </Label>
                                                    <Switch
                                                        id={`toggle-${plugin.id}`}
                                                        checked={plugin.isEnabled}
                                                        onCheckedChange={() =>
                                                            togglePlugin(plugin.id)
                                                        }
                                                    />
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => uninstallPlugin(plugin.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="h-96 flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                                <div>
                                    <h3 className="font-semibold">No plugins installed</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Browse the marketplace to install plugins
                                    </p>
                                </div>
                                <Button onClick={() => setActiveTab('marketplace')}>
                                    Browse Marketplace
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
