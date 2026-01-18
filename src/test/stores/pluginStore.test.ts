import { usePluginStore } from '@/store/pluginStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PluginStore', () => {
    beforeEach(() => {
        const initialState = usePluginStore.getState();
        usePluginStore.setState({
            ...initialState,
            searchQuery: '',
            selectedCategory: null,
        });

        // Reset installed status
        initialState.plugins.forEach((plugin) => {
            plugin.isInstalled = false;
            plugin.isEnabled = false;
        });
    });

    describe('plugin filtering', () => {
        it('should filter plugins by search query', () => {
            const { setSearchQuery, getFilteredPlugins } = usePluginStore.getState();

            setSearchQuery('Code');
            const filtered = getFilteredPlugins();

            expect(
                filtered.every(
                    (p) =>
                        p.name.toLowerCase().includes('code') ||
                        p.description.toLowerCase().includes('code')
                )
            ).toBe(true);
        });

        it('should filter plugins by category', () => {
            const { setSelectedCategory, getFilteredPlugins } = usePluginStore.getState();

            setSelectedCategory('Development');
            const filtered = getFilteredPlugins();

            expect(filtered.every((p) => p.category === 'Development')).toBe(true);
        });

        it('should combine search and category filters', () => {
            const { setSearchQuery, setSelectedCategory, getFilteredPlugins } =
                usePluginStore.getState();

            setSearchQuery('formatter');
            setSelectedCategory('Development');
            const filtered = getFilteredPlugins();

            expect(
                filtered.every(
                    (p) =>
                        p.category === 'Development' &&
                        (p.name.toLowerCase().includes('formatter') ||
                            p.description.toLowerCase().includes('formatter'))
                )
            ).toBe(true);
        });

        it('should clear filters', () => {
            const { setSearchQuery, setSelectedCategory, getFilteredPlugins, plugins } =
                usePluginStore.getState();

            setSearchQuery('test');
            setSelectedCategory('AI');
            setSearchQuery('');
            setSelectedCategory(null);

            const filtered = getFilteredPlugins();
            expect(filtered).toHaveLength(plugins.length);
        });
    });

    describe('plugin installation', () => {
        it('should install a plugin', () => {
            const { plugins, installPlugin } = usePluginStore.getState();
            const pluginId = plugins[0].id;

            installPlugin(pluginId);

            const plugin = usePluginStore.getState().plugins.find((p) => p.id === pluginId);
            expect(plugin?.isInstalled).toBe(true);
        });

        it('should uninstall a plugin', () => {
            const { plugins, installPlugin, uninstallPlugin } = usePluginStore.getState();
            const pluginId = plugins[0].id;

            installPlugin(pluginId);
            uninstallPlugin(pluginId);

            const plugin = usePluginStore.getState().plugins.find((p) => p.id === pluginId);
            expect(plugin?.isInstalled).toBe(false);
            expect(plugin?.isEnabled).toBe(false);
        });

        it('should toggle plugin state', () => {
            const { plugins, installPlugin, togglePlugin } = usePluginStore.getState();
            const pluginId = plugins[0].id;

            // Install enables the plugin by default
            installPlugin(pluginId);
            let plugin = usePluginStore.getState().plugins.find((p) => p.id === pluginId);
            expect(plugin?.isInstalled).toBe(true);
            expect(plugin?.isEnabled).toBe(true);

            // Toggle should disable it
            togglePlugin(pluginId);
            plugin = usePluginStore.getState().plugins.find((p) => p.id === pluginId);
            expect(plugin?.isEnabled).toBe(false);

            // Toggle again should enable it
            togglePlugin(pluginId);
            plugin = usePluginStore.getState().plugins.find((p) => p.id === pluginId);
            expect(plugin?.isEnabled).toBe(true);
        });

        it('should have premium plugins', () => {
            const { plugins } = usePluginStore.getState();
            const premiumPlugins = plugins.filter((p) => p.isPremium);

            expect(premiumPlugins.length).toBeGreaterThan(0);
            expect(premiumPlugins.every((p) => p.price && p.price > 0)).toBe(true);
        });
    });
});
