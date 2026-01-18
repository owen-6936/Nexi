import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMCPStore, type MCPServerStatus } from '@/store/mcpStore';
import {
    CheckCircle2,
    Circle,
    Edit,
    Loader2,
    Plus,
    Power,
    ServerCrash,
    Trash2,
    XCircle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<MCPServerStatus, { icon: typeof Circle; color: string; label: string }> =
    {
        connected: {
            icon: CheckCircle2,
            color: 'text-green-500',
            label: 'Connected',
        },
        disconnected: {
            icon: Circle,
            color: 'text-muted-foreground',
            label: 'Disconnected',
        },
        connecting: {
            icon: Loader2,
            color: 'text-yellow-500',
            label: 'Connecting...',
        },
        error: { icon: XCircle, color: 'text-destructive', label: 'Error' },
    };

export function MCPPage() {
    const {
        servers,
        selectedServerId,
        setSelectedServer,
        addServer,
        removeServer,
        connectServer,
        disconnectServer,
    } = useMCPStore();

    const [isAddServerOpen, setIsAddServerOpen] = useState(false);
    const [isEditServerOpen, setIsEditServerOpen] = useState(false);
    const [editingServerId, setEditingServerId] = useState<string | null>(null);
    const [newServerName, setNewServerName] = useState('');
    const [newServerDesc, setNewServerDesc] = useState('');
    const [newServerCommand, setNewServerCommand] = useState('');
    const [newServerArgs, setNewServerArgs] = useState('');

    const selectedServer = servers.find((s) => s.id === selectedServerId);

    const handleAddServer = () => {
        if (!newServerName.trim() || !newServerCommand.trim()) return;

        addServer({
            name: newServerName,
            description: newServerDesc,
            command: newServerCommand,
            args: newServerArgs.split(' ').filter((arg) => arg.trim()),
            isPremium: false,
        });

        setNewServerName('');
        setNewServerDesc('');
        setNewServerCommand('');
        setNewServerArgs('');
        setIsAddServerOpen(false);
    };

    const handleToggleConnection = async (serverId: string, status: MCPServerStatus) => {
        if (status === 'connected') {
            disconnectServer(serverId);
        } else if (status === 'disconnected' || status === 'error') {
            await connectServer(serverId);
        }
    };

    const handleEditServer = (serverId: string) => {
        const server = servers.find((s) => s.id === serverId);
        if (!server || server.isPremium) return; // Only allow editing custom servers

        setEditingServerId(serverId);
        setNewServerName(server.name);
        setNewServerDesc(server.description);
        setNewServerCommand(server.command);
        setNewServerArgs(server.args.join(' '));
        setIsEditServerOpen(true);
    };

    const handleUpdateServer = () => {
        if (!editingServerId || !newServerName.trim() || !newServerCommand.trim()) return;

        const { updateServer } = useMCPStore.getState();
        updateServer(editingServerId, {
            name: newServerName,
            description: newServerDesc,
            command: newServerCommand,
            args: newServerArgs.split(' ').filter((arg) => arg.trim()),
        });

        setNewServerName('');
        setNewServerDesc('');
        setNewServerCommand('');
        setNewServerArgs('');
        setEditingServerId(null);
        setIsEditServerOpen(false);
    };

    return (
        <div className="h-full flex gap-6 p-6">
            {/* Servers List */}
            <div className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        MCP Servers
                    </h2>
                    <Dialog open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add MCP Server</DialogTitle>
                                <DialogDescription>
                                    Configure a new Model Context Protocol server
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="server-name">Name</Label>
                                    <Input
                                        id="server-name"
                                        value={newServerName}
                                        onChange={(e) => setNewServerName(e.target.value)}
                                        placeholder="e.g., My Custom MCP"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="server-desc">Description</Label>
                                    <Input
                                        id="server-desc"
                                        value={newServerDesc}
                                        onChange={(e) => setNewServerDesc(e.target.value)}
                                        placeholder="Brief description"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="server-command">Command</Label>
                                    <Input
                                        id="server-command"
                                        value={newServerCommand}
                                        onChange={(e) => setNewServerCommand(e.target.value)}
                                        placeholder="e.g., node or npx"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="server-args">Arguments</Label>
                                    <Input
                                        id="server-args"
                                        value={newServerArgs}
                                        onChange={(e) => setNewServerArgs(e.target.value)}
                                        placeholder="e.g., dist/index.js --port 3000"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddServerOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddServer}>Add Server</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {servers.map((server) => {
                        const StatusIcon = statusConfig[server.status].icon;
                        const isConnecting = server.status === 'connecting';

                        return (
                            <Card
                                key={server.id}
                                className={cn(
                                    'cursor-pointer transition-all hover:bg-sidebar-accent border-2',
                                    selectedServerId === server.id
                                        ? 'border-primary bg-sidebar-accent/50'
                                        : 'border-white/10'
                                )}
                                onClick={() => setSelectedServer(server.id)}
                            >
                                <CardHeader className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-sm truncate">
                                                    {server.name}
                                                </CardTitle>
                                                {server.isPremium && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-5 text-xs"
                                                    >
                                                        ⭐ Premium
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <StatusIcon
                                                    className={cn(
                                                        'h-3.5 w-3.5',
                                                        statusConfig[server.status].color,
                                                        isConnecting && 'animate-spin'
                                                    )}
                                                />
                                                <span className="text-muted-foreground">
                                                    {statusConfig[server.status].label}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleConnection(server.id, server.status);
                                            }}
                                            disabled={isConnecting}
                                        >
                                            <Power
                                                className={cn(
                                                    'h-4 w-4',
                                                    server.status === 'connected' &&
                                                        'text-green-500'
                                                )}
                                            />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Server Details */}
            <div className="flex-1 flex flex-col gap-4">
                {selectedServer ? (
                    <>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold">{selectedServer.name}</h2>
                                    {selectedServer.isPremium && (
                                        <Badge variant="default">⭐ Premium</Badge>
                                    )}
                                    <Badge
                                        variant={
                                            selectedServer.status === 'connected'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="gap-1"
                                    >
                                        {(() => {
                                            const StatusIcon =
                                                statusConfig[selectedServer.status].icon;
                                            return (
                                                <StatusIcon
                                                    className={cn(
                                                        'h-3.5 w-3.5',
                                                        selectedServer.status === 'connecting' &&
                                                            'animate-spin'
                                                    )}
                                                />
                                            );
                                        })()}
                                        {statusConfig[selectedServer.status].label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {selectedServer.description}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={
                                        selectedServer.status === 'connected'
                                            ? 'destructive'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        handleToggleConnection(
                                            selectedServer.id,
                                            selectedServer.status
                                        )
                                    }
                                    disabled={selectedServer.status === 'connecting'}
                                >
                                    {selectedServer.status === 'connecting' ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : selectedServer.status === 'connected' ? (
                                        <>
                                            <Power className="h-4 w-4 mr-2" />
                                            Disconnect
                                        </>
                                    ) : (
                                        <>
                                            <Power className="h-4 w-4 mr-2" />
                                            Connect
                                        </>
                                    )}
                                </Button>
                                {!selectedServer.isPremium && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEditServer(selectedServer.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeServer(selectedServer.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {selectedServer.errorMessage && (
                            <Card className="border-2 border-destructive/50 bg-destructive/5">
                                <CardHeader className="p-4">
                                    <div className="flex items-start gap-2">
                                        <ServerCrash className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                        <div>
                                            <CardTitle className="text-sm text-destructive">
                                                Connection Error
                                            </CardTitle>
                                            <CardDescription className="text-destructive/80 mt-1">
                                                {selectedServer.errorMessage}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-2 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-sm">Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Command
                                        </Label>
                                        <code className="block mt-1 text-sm bg-secondary p-2 rounded">
                                            {selectedServer.command}
                                        </code>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Arguments
                                        </Label>
                                        <code className="block mt-1 text-sm bg-secondary p-2 rounded">
                                            {selectedServer.args.join(' ')}
                                        </code>
                                    </div>
                                    {selectedServer.lastConnected && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground">
                                                Last Connected
                                            </Label>
                                            <p className="text-sm mt-1">
                                                {selectedServer.lastConnected.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-sm">Capabilities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedServer.capabilities &&
                                    selectedServer.capabilities.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedServer.capabilities.map((cap) => (
                                                <Badge key={cap} variant="secondary">
                                                    {cap}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No capabilities defined
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-3">
                            <Zap className="h-12 w-12 text-muted-foreground mx-auto" />
                            <div>
                                <h3 className="font-semibold">Select a server</h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose an MCP server to view details and manage connection
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Server Dialog */}
            <Dialog open={isEditServerOpen} onOpenChange={setIsEditServerOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit MCP Server</DialogTitle>
                        <DialogDescription>
                            Update your custom Model Context Protocol server configuration
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-server-name">Name</Label>
                            <Input
                                id="edit-server-name"
                                value={newServerName}
                                onChange={(e) => setNewServerName(e.target.value)}
                                placeholder="e.g., My Custom MCP"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-server-desc">Description</Label>
                            <Input
                                id="edit-server-desc"
                                value={newServerDesc}
                                onChange={(e) => setNewServerDesc(e.target.value)}
                                placeholder="Brief description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-server-command">Command</Label>
                            <Input
                                id="edit-server-command"
                                value={newServerCommand}
                                onChange={(e) => setNewServerCommand(e.target.value)}
                                placeholder="e.g., node or npx"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-server-args">Arguments</Label>
                            <Input
                                id="edit-server-args"
                                value={newServerArgs}
                                onChange={(e) => setNewServerArgs(e.target.value)}
                                placeholder="e.g., dist/index.js --port 3000"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditServerOpen(false);
                                setEditingServerId(null);
                                setNewServerName('');
                                setNewServerDesc('');
                                setNewServerCommand('');
                                setNewServerArgs('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateServer}>Update Server</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
