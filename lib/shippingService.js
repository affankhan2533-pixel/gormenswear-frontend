// GOR MENSWEAR — Shipping Rules & Logistics Management Service

const INITIAL_SHIPPING_RULES = [
  {
    id: "ship-101",
    state: "Maharashtra",
    method: "Standard Delivery",
    charge: 0,
    freeAbove: 0,
    codFee: 50,
    priority: 1,
    status: "Active",
    estimatedDays: "2-3 Business Days",
  },
  {
    id: "ship-102",
    state: "Delhi NCR",
    method: "Standard Delivery",
    charge: 120,
    freeAbove: 2999,
    codFee: 50,
    priority: 2,
    status: "Active",
    estimatedDays: "3-4 Business Days",
  },
  {
    id: "ship-103",
    state: "Gujarat",
    method: "Standard Delivery",
    charge: 80,
    freeAbove: 2999,
    codFee: 50,
    priority: 3,
    status: "Active",
    estimatedDays: "3-4 Business Days",
  },
  {
    id: "ship-104",
    state: "Rest of India",
    method: "Standard Delivery",
    charge: 150,
    freeAbove: 2999,
    codFee: 50,
    priority: 4,
    status: "Active",
    estimatedDays: "4-6 Business Days",
  },
  {
    id: "ship-105",
    state: "All India (Express)",
    method: "Express Air Courier",
    charge: 250,
    freeAbove: 4999,
    codFee: 100,
    priority: 5,
    status: "Active",
    estimatedDays: "1-2 Business Days",
  },
  {
    id: "ship-106",
    state: "Mayfair Flagship Store",
    method: "Store Pickup",
    charge: 0,
    freeAbove: 0,
    codFee: 0,
    priority: 6,
    status: "Active",
    estimatedDays: "Same Day Pickup",
  },
];

class ShippingService {
  constructor() {
    this.rules = [...INITIAL_SHIPPING_RULES];
    this.globalConfig = {
      defaultFreeThreshold: 2999,
      globalCodFee: 50,
      codEnabled: true,
      storePickupEnabled: true,
    };
  }

  async getShippingRules() {
    return [...this.rules].sort((a, b) => a.priority - b.priority);
  }

  async getGlobalConfig() {
    return { ...this.globalConfig };
  }

  async updateGlobalConfig(updates) {
    this.globalConfig = { ...this.globalConfig, ...updates };
    return this.globalConfig;
  }

  async addShippingRule(ruleData) {
    // Check duplicate state/zone rules for the same method
    const duplicate = this.rules.find(
      (r) =>
        r.state.toLowerCase() === ruleData.state.toLowerCase() &&
        r.method === ruleData.method
    );

    if (duplicate) {
      throw new Error(`A shipping rule already exists for state '${ruleData.state}' with method '${ruleData.method}'.`);
    }

    const newRule = {
      id: `ship-${Date.now()}`,
      state: ruleData.state,
      method: ruleData.method || "Standard Delivery",
      charge: parseFloat(ruleData.charge) || 0,
      freeAbove: parseFloat(ruleData.freeAbove) || 0,
      codFee: parseFloat(ruleData.codFee) || 50,
      priority: parseInt(ruleData.priority, 10) || this.rules.length + 1,
      status: ruleData.status || "Active",
      estimatedDays: ruleData.estimatedDays || "2-4 Business Days",
    };

    this.rules.push(newRule);
    return newRule;
  }

  async updateShippingRule(id, updates) {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.rules[idx] = {
        ...this.rules[idx],
        ...updates,
        charge: parseFloat(updates.charge ?? this.rules[idx].charge),
        freeAbove: parseFloat(updates.freeAbove ?? this.rules[idx].freeAbove),
        codFee: parseFloat(updates.codFee ?? this.rules[idx].codFee),
        priority: parseInt(updates.priority ?? this.rules[idx].priority, 10),
      };
      return this.rules[idx];
    }
    return null;
  }

  async deleteShippingRule(id) {
    this.rules = this.rules.filter((r) => r.id !== id);
    return true;
  }

  async toggleRuleStatus(id) {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.rules[idx].status = this.rules[idx].status === "Active" ? "Inactive" : "Active";
      return this.rules[idx];
    }
    return null;
  }
}

export const shippingService = new ShippingService();
