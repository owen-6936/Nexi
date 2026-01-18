import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import { Bell, Check, Palette, Save, Settings as SettingsIcon, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SettingsPage() {
    const { theme, setTheme } = useUIStore();
    const { clearHistory } = useChatStore();
    const [saved, setSaved] = useState(false);
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [apiKeys, setApiKeys] = useState({
        openai: '',
        anthropic: '',
        customEndpoint: '',
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        messages: true,
        updates: false,
    });
    const [privacy, setPrivacy] = useState({
        analytics: true,
        shareUsage: false,
        publicProfile: false,
    });
    const [preferences, setPreferences] = useState({
        autoSave: true,
        soundEffects: false,
        compactMode: false,
        showCredits: true,
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            const savedPrefs = localStorage.getItem('nexi-preferences');
            const savedNotifs = localStorage.getItem('nexi-notifications');
            const savedPrivacy = localStorage.getItem('nexi-privacy');
            const savedFontSize = localStorage.getItem('nexi-font-size');
            const savedApiKeys = localStorage.getItem('nexi-api-keys');

            if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
            if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
            if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
            if (savedFontSize) setFontSize(savedFontSize as 'small' | 'medium' | 'large');
            if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));
        };

        loadSettings();
    }, []);

    // Apply font size to document
    useEffect(() => {
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[fontSize];
    }, [fontSize]);

    // Apply compact mode
    useEffect(() => {
        if (preferences.compactMode) {
            document.documentElement.classList.add('compact-mode');
        } else {
            document.documentElement.classList.remove('compact-mode');
        }
    }, [preferences.compactMode]);

    const handleSave = () => {
        localStorage.setItem('nexi-preferences', JSON.stringify(preferences));
        localStorage.setItem('nexi-notifications', JSON.stringify(notifications));
        localStorage.setItem('nexi-privacy', JSON.stringify(privacy));
        localStorage.setItem('nexi-font-size', fontSize);
        localStorage.setItem('nexi-api-keys', JSON.stringify(apiKeys));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setPreferences({
            autoSave: true,
            soundEffects: false,
            compactMode: false,
            showCredits: true,
        });
        setNotifications({
            email: true,
            push: false,
            messages: true,
            updates: false,
        });
        setPrivacy({
            analytics: true,
            shareUsage: false,
            publicProfile: false,
        });
        setFontSize('medium');
        setApiKeys({
            openai: '',
            anthropic: '',
            customEndpoint: '',
        });
        setTheme('dark');
    };

    const handleClearHistory = () => {
        if (
            confirm(
                'Are you sure you want to clear all conversation history? This cannot be undone.'
            )
        ) {
            clearHistory();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleDownloadData = () => {
        const data = {
            preferences,
            notifications,
            privacy,
            fontSize,
            theme,
            apiKeys: { ...apiKeys, openai: '***', anthropic: '***' }, // Redact keys
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexi-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <SettingsIcon className="h-8 w-8 text-primary" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <Tabs defaultValue="general" className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Preferences
                            </CardTitle>
                            <CardDescription>
                                Configure your general application preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto-save">Auto-save conversations</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically save your conversations as you type
                                    </p>
                                </div>
                                <Switch
                                    id="auto-save"
                                    checked={preferences.autoSave}
                                    onCheckedChange={(checked) =>
                                        setPreferences({ ...preferences, autoSave: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="sound">Sound effects</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Play sounds for notifications and actions
                                    </p>
                                </div>
                                <Switch
                                    id="sound"
                                    checked={preferences.soundEffects}
                                    onCheckedChange={(checked) =>
                                        setPreferences({ ...preferences, soundEffects: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="compact">Compact mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Use a more compact layout to fit more content
                                    </p>
                                </div>
                                <Switch
                                    id="compact"
                                    checked={preferences.compactMode}
                                    onCheckedChange={(checked) =>
                                        setPreferences({ ...preferences, compactMode: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="credits">Show credits in header</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Display your credit balance in the navigation bar
                                    </p>
                                </div>
                                <Switch
                                    id="credits"
                                    checked={preferences.showCredits}
                                    onCheckedChange={(checked) =>
                                        setPreferences({ ...preferences, showCredits: checked })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle>API Configuration</CardTitle>
                            <CardDescription>
                                Configure your API keys for external services
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="openai-key">OpenAI API Key</Label>
                                <Input
                                    id="openai-key"
                                    type="password"
                                    placeholder="sk-..."
                                    value={apiKeys.openai}
                                    onChange={(e) =>
                                        setApiKeys({ ...apiKeys, openai: e.target.value })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used for GPT models and embeddings
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                                <Input
                                    id="anthropic-key"
                                    type="password"
                                    placeholder="sk-ant-..."
                                    value={apiKeys.anthropic}
                                    onChange={(e) =>
                                        setApiKeys({ ...apiKeys, anthropic: e.target.value })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used for Claude models
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="custom-endpoint">Custom Endpoint</Label>
                                <Input
                                    id="custom-endpoint"
                                    type="url"
                                    placeholder="https://api.example.com"
                                    value={apiKeys.customEndpoint}
                                    onChange={(e) =>
                                        setApiKeys({ ...apiKeys, customEndpoint: e.target.value })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Override default API endpoint (optional)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 mt-4">
                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Choose what notifications you want to receive
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notif">Email notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates and alerts via email
                                    </p>
                                </div>
                                <Switch
                                    id="email-notif"
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, email: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notif">Push notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get instant notifications in your browser
                                    </p>
                                </div>
                                <Switch
                                    id="push-notif"
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, push: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="message-notif">New message alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Be notified when you receive new messages
                                    </p>
                                </div>
                                <Switch
                                    id="message-notif"
                                    checked={notifications.messages}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, messages: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="update-notif">Product updates</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Stay informed about new features and improvements
                                    </p>
                                </div>
                                <Switch
                                    id="update-notif"
                                    checked={notifications.updates}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, updates: checked })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4 mt-4">
                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy & Security
                            </CardTitle>
                            <CardDescription>
                                Control how your data is used and shared
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="analytics">Usage analytics</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Help improve Nexi by sharing anonymous usage data
                                    </p>
                                </div>
                                <Switch
                                    id="analytics"
                                    checked={privacy.analytics}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, analytics: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="share-usage">Share usage with partners</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow sharing anonymized data with third parties
                                    </p>
                                </div>
                                <Switch
                                    id="share-usage"
                                    checked={privacy.shareUsage}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, shareUsage: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="public-profile">Public profile</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make your profile visible to other users
                                    </p>
                                </div>
                                <Switch
                                    id="public-profile"
                                    checked={privacy.publicProfile}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, publicProfile: checked })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>Download, clear, or delete your data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleDownloadData}
                            >
                                Download your data
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Export all your settings and preferences as JSON
                            </p>
                            <Separator />
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleClearHistory}
                            >
                                Clear conversation history
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Remove all conversations permanently
                            </p>
                            <Separator />
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={() =>
                                    alert(
                                        'Account deletion requires email confirmation. This feature will be available in the next update.'
                                    )
                                }
                            >
                                Delete account
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your account and all associated data
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 mt-4">
                    <Card className="border-2 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Theme & Appearance
                            </CardTitle>
                            <CardDescription>Customize how Nexi looks and feels</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        variant={theme === 'light' ? 'default' : 'outline'}
                                        onClick={() => setTheme('light')}
                                        className="w-full"
                                    >
                                        Light
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? 'default' : 'outline'}
                                        onClick={() => setTheme('dark')}
                                        className="w-full"
                                    >
                                        Dark
                                    </Button>
                                    <Button
                                        variant={theme === 'system' ? 'default' : 'outline'}
                                        onClick={() => setTheme('system')}
                                        className="w-full"
                                    >
                                        System
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Choose your preferred color scheme
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Font size</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        variant={fontSize === 'small' ? 'default' : 'outline'}
                                        className="w-full"
                                        onClick={() => setFontSize('small')}
                                    >
                                        Small
                                    </Button>
                                    <Button
                                        variant={fontSize === 'medium' ? 'default' : 'outline'}
                                        className="w-full"
                                        onClick={() => setFontSize('medium')}
                                    >
                                        Medium
                                    </Button>
                                    <Button
                                        variant={fontSize === 'large' ? 'default' : 'outline'}
                                        className="w-full"
                                        onClick={() => setFontSize('large')}
                                    >
                                        Large
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Adjust the base font size across the app
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
                <Button variant="outline" onClick={handleReset}>
                    Reset to defaults
                </Button>
                <Button className="gap-2" onClick={handleSave}>
                    {saved ? (
                        <>
                            <Check className="h-4 w-4" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
