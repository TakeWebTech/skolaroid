import { Injectable } from "@nestjs/common";
import {
  BusinessOpsPlugin,
  PluginCapability,
  SkolaroidPlugin,
  WebsiteCmsPlugin,
} from "./plugin.types";

@Injectable()
export class PluginRegistryService {
  private readonly plugins = new Map<string, SkolaroidPlugin>();

  register(plugin: SkolaroidPlugin) {
    this.plugins.set(plugin.key, plugin);
  }

  list() {
    return Array.from(this.plugins.values()).map((plugin) => ({
      key: plugin.key,
      name: plugin.name,
      scope: plugin.scope,
      capabilities: plugin.capabilities,
    }));
  }

  find(key: string) {
    return this.plugins.get(key);
  }

  findByCapability(capability: PluginCapability) {
    return Array.from(this.plugins.values()).filter((plugin) =>
      plugin.capabilities.includes(capability),
    );
  }

  websiteCms(key: string): WebsiteCmsPlugin | undefined {
    const plugin = this.plugins.get(key);
    if (!plugin?.capabilities.includes("website.cms")) return undefined;
    return plugin as WebsiteCmsPlugin;
  }

  businessOps(key: string): BusinessOpsPlugin | undefined {
    const plugin = this.plugins.get(key);
    if (!plugin?.capabilities.includes("business.invoice.read")) return undefined;
    return plugin as BusinessOpsPlugin;
  }
}
