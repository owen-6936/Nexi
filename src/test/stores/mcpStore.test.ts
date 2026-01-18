import { useMCPStore } from '@/store/mcpStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('MCPStore', () => {
    beforeEach(() => {
        // Reset to initial state with default servers
        const initialState = useMCPStore.getState();
        useMCPStore.setState({
            ...initialState,
            selectedServerId: null,
        });
    });

    describe('server management', () => {
        it('should have default servers', () => {
            const { servers } = useMCPStore.getState();
            expect(servers.length).toBeGreaterThan(0);
            expect(servers.some((s) => s.name === 'Filesystem MCP')).toBe(true);
        });

        it('should add a custom server', () => {
            const { addServer, servers } = useMCPStore.getState();
            const initialCount = servers.length;

            const serverId = addServer({
                name: 'Custom Server',
                description: 'Test server',
                command: 'node',
                args: ['index.js'],
                isPremium: false,
            });

            const newServers = useMCPStore.getState().servers;
            expect(newServers).toHaveLength(initialCount + 1);
            expect(newServers.find((s) => s.id === serverId)?.name).toBe('Custom Server');
        });

        it('should remove a server', () => {
            const { addServer, removeServer } = useMCPStore.getState();

            const serverId = addServer({
                name: 'Temp Server',
                description: 'Temporary',
                command: 'node',
                args: [],
                isPremium: false,
            });

            removeServer(serverId);
            const servers = useMCPStore.getState().servers;
            expect(servers.find((s) => s.id === serverId)).toBeUndefined();
        });

        it('should update server configuration', () => {
            const { addServer, updateServer } = useMCPStore.getState();

            const serverId = addServer({
                name: 'Test Server',
                description: 'Original description',
                command: 'node',
                args: [],
                isPremium: false,
            });

            updateServer(serverId, {
                description: 'Updated description',
                command: 'npx',
            });

            const server = useMCPStore.getState().servers.find((s) => s.id === serverId);
            expect(server?.description).toBe('Updated description');
            expect(server?.command).toBe('npx');
        });

        it('should set selected server', () => {
            const { setSelectedServer, servers } = useMCPStore.getState();
            const serverId = servers[0].id;

            setSelectedServer(serverId);
            expect(useMCPStore.getState().selectedServerId).toBe(serverId);
        });
    });

    describe('server connection', () => {
        it('should connect to a server', async () => {
            const { servers, connectServer } = useMCPStore.getState();
            const serverId = servers[0].id;

            await connectServer(serverId);

            const server = useMCPStore.getState().servers.find((s) => s.id === serverId);
            expect(server?.status).toBe('connected');
            expect(server?.lastConnected).toBeInstanceOf(Date);
        });

        it('should disconnect from a server', () => {
            const { servers, disconnectServer } = useMCPStore.getState();
            const serverId = servers[0].id;

            disconnectServer(serverId);

            const server = useMCPStore.getState().servers.find((s) => s.id === serverId);
            expect(server?.status).toBe('disconnected');
        });

        it('should get server by id', () => {
            const { servers, getServer } = useMCPStore.getState();
            const serverId = servers[0].id;

            const server = getServer(serverId);
            expect(server).toBeDefined();
            expect(server?.id).toBe(serverId);
        });
    });
});
