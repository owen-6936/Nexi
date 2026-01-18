import { create } from 'zustand';

export type MCPServerStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface MCPServer {
    id: string;
    name: string;
    description: string;
    command: string;
    args: string[];
    env?: Record<string, string>;
    status: MCPServerStatus;
    isPremium: boolean;
    lastConnected?: Date;
    errorMessage?: string;
    capabilities?: string[];
}

interface MCPStore {
    servers: MCPServer[];
    selectedServerId: string | null;

    // Server operations
    addServer: (server: Omit<MCPServer, 'id' | 'status'>) => string;
    removeServer: (serverId: string) => void;
    updateServer: (serverId: string, updates: Partial<MCPServer>) => void;
    setSelectedServer: (serverId: string | null) => void;

    // Connection operations
    connectServer: (serverId: string) => Promise<void>;
    disconnectServer: (serverId: string) => void;
    getServer: (serverId: string) => MCPServer | undefined;
}

export const useMCPStore = create<MCPStore>((set, get) => ({
    servers: [
        {
            id: 'filesystem',
            name: 'Filesystem MCP',
            description: 'Access and manipulate local filesystem',
            command: 'node',
            args: ['dist/filesystem/index.js'],
            status: 'connected',
            isPremium: false,
            lastConnected: new Date(),
            capabilities: ['read_file', 'write_file', 'list_directory'],
        },
        {
            id: 'github',
            name: 'GitHub MCP',
            description: 'Interact with GitHub repositories and issues',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github'],
            env: { GITHUB_TOKEN: 'ghp_****' },
            status: 'disconnected',
            isPremium: true,
            capabilities: ['create_issue', 'list_repos', 'create_pr'],
        },
        {
            id: 'postgres',
            name: 'PostgreSQL MCP',
            description: 'Query and manage PostgreSQL databases',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres'],
            status: 'disconnected',
            isPremium: true,
            capabilities: ['query', 'schema', 'insert', 'update'],
        },
    ],
    selectedServerId: null,

    addServer: (serverData) => {
        const id = serverData.name.toLowerCase().replace(/\s+/g, '-');
        const newServer: MCPServer = {
            ...serverData,
            id,
            status: 'disconnected',
        };

        set((state) => ({
            servers: [...state.servers, newServer],
        }));

        return id;
    },

    removeServer: (serverId) => {
        set((state) => ({
            servers: state.servers.filter((s) => s.id !== serverId),
            selectedServerId: state.selectedServerId === serverId ? null : state.selectedServerId,
        }));
    },

    updateServer: (serverId, updates) => {
        set((state) => ({
            servers: state.servers.map((s) => (s.id === serverId ? { ...s, ...updates } : s)),
        }));
    },

    setSelectedServer: (serverId) => {
        set({ selectedServerId: serverId });
    },

    connectServer: async (serverId) => {
        const server = get().servers.find((s) => s.id === serverId);
        if (!server) return;

        // Set connecting status
        get().updateServer(serverId, { status: 'connecting' });

        // Simulate connection process
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Randomly succeed or fail for demo
        const success = Math.random() > 0.3;

        if (success) {
            get().updateServer(serverId, {
                status: 'connected',
                lastConnected: new Date(),
                errorMessage: undefined,
            });
        } else {
            get().updateServer(serverId, {
                status: 'error',
                errorMessage: 'Failed to connect: Connection timeout',
            });
        }
    },

    disconnectServer: (serverId) => {
        get().updateServer(serverId, {
            status: 'disconnected',
            errorMessage: undefined,
        });
    },

    getServer: (serverId) => {
        return get().servers.find((s) => s.id === serverId);
    },
}));
