/**
 * GOR Menswear — AI Service Architecture
 * Modular, provider-agnostic AI abstraction layer.
 * Allows plugging in OpenAI, Gemini, Claude, or custom backend services without UI modifications.
 */

// Default Local Provider for Phase 17A UI Shell
class LocalMockProvider {
  constructor() {
    this.name = "LocalMockProvider";
  }

  async sendMessage(message, context = {}) {
    // Simulated UI response demonstration for Phase 17A
    return {
      id: `msg-${Date.now()}`,
      sender: "concierge",
      text: `Thank you for choosing GOR Atelier. I've noted your preference for "${message}". Our stylists curate garments tailored to modern confidence and timeless elegance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }

  getStylingPromptSuggestions() {
    return [
      { id: "office", label: "Office & Business", query: "Help me select an outfit for the office." },
      { id: "casual", label: "Casual Everyday", query: "Show me relaxed everyday streetwear." },
      { id: "wedding", label: "Wedding & Formal", query: "What should I wear for a formal evening event?" },
      { id: "vacation", label: "Resort & Travel", query: "Recommend lightweight summer shirting." },
      { id: "evening", label: "Evening Atelier", query: "Suggest statement evening menswear." },
      { id: "party", label: "Weekend Party", query: "Find modern co-ord sets for weekend night out." },
    ];
  }
}

class AiService {
  constructor() {
    this.providers = new Map();
    this.activeProviderName = "local";

    // Register default fallback provider
    this.registerProvider("local", new LocalMockProvider());
  }

  registerProvider(name, providerInstance) {
    if (!providerInstance || typeof providerInstance.sendMessage !== "function") {
      throw new Error(`[AiService] Invalid provider instance for '${name}'. Must implement sendMessage()`);
    }
    this.providers.set(name, providerInstance);
  }

  setProvider(name) {
    if (!this.providers.has(name)) {
      console.warn(`[AiService] Provider '${name}' not found. Falling back to default.`);
      return;
    }
    this.activeProviderName = name;
  }

  getActiveProvider() {
    return this.providers.get(this.activeProviderName) || this.providers.get("local");
  }

  async sendMessage(message, context = {}) {
    const provider = this.getActiveProvider();
    return provider.sendMessage(message, context);
  }

  getPromptSuggestions() {
    const provider = this.getActiveProvider();
    return provider.getStylingPromptSuggestions ? provider.getStylingPromptSuggestions() : [];
  }
}

// Global Singleton Export
export const aiService = new AiService();
