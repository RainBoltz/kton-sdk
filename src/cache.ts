type DataPiece = {
  ts: number;
  ttl: number;
  data: string;
};

// Save the original stringify method
const originalStringify = JSON.stringify;

// Override JSON.stringify to handle BigInt
JSON.stringify = function (value, replacer, space) {
  // Create a custom replacer function that handles BigInt
  const bigintReplacer = (key: any, value: any) => {
    // If the value is a BigInt, convert it to a string
    if (typeof value === "bigint") {
      return value.toString() + "n"; // Append 'n' to indicate it's a BigInt
    }

    // If a custom replacer was provided, apply it after our BigInt handling
    if (typeof replacer === "function") {
      return replacer(key, value);
    } else if (Array.isArray(replacer)) {
      // If replacer is an array, check if the key is in it
      if (key === "" || replacer.includes(key)) {
        return value;
      }
      return undefined;
    }

    // For all other values, return as is
    return value;
  };

  // Call the original stringify with our enhanced replacer
  return originalStringify(value, bigintReplacer, space);
};

// Save the original parse method
const originalParse = JSON.parse;

// Override JSON.parse to handle BigInt strings
JSON.parse = function (text, reviver) {
  // Create a BigInt reviver function
  const bigintReviver = (key: any, value: any) => {
    // Check if the value is a string and matches a BigInt pattern
    if (typeof value === "string" && /^-?\d+n$/.test(value)) {
      // Remove the 'n' suffix and convert to BigInt
      return BigInt(value.slice(0, -1));
    }

    // Apply the original reviver if provided
    if (typeof reviver === "function") {
      return reviver(key, value);
    }

    return value;
  };

  // Call the original parse with our enhanced reviver
  return originalParse(text, bigintReviver);
};

export class NetworkCache {
  defaultTtl: number;
  prefix: string;

  constructor(defaultTtl: number, prefix: string = "network-cache-") {
    this.defaultTtl = defaultTtl;
    this.prefix = prefix;
  }

  get time() {
    return Date.now();
  }

  async get<T extends any>(
    key: string,
    getNewValue: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const fullKey = this.getFullKey(key);
    if (this.needsUpdate(fullKey)) {
      return this.save<T>(fullKey, getNewValue(), ttl);
    }

    return this.retrieve<T>(fullKey);
  }

  needsUpdate(key: string, force?: boolean): boolean {
    if (force) {
      return force;
    }

    const piece = this.getDataPiece(key);

    if (!piece) {
      return true;
    }

    return this.time - piece.ts >= piece.ttl;
  }

  async retrieve<T extends any>(key: string): Promise<T> {
    const piece = this.getDataPiece(key);
    if (!piece) {
      throw new Error("Data not found");
    }
    return JSON.parse(piece.data);
  }

  async save<T extends any>(
    key: string,
    data: Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      const resolvedData = await data;
      const serializedData = JSON.stringify(resolvedData);
      const dataPiece: DataPiece = {
        ts: this.time,
        ttl: ttl ?? this.defaultTtl,
        data: serializedData,
      };
      localStorage.setItem(key, JSON.stringify(dataPiece));
      return resolvedData;
    } catch (error) {
      console.error("Failed to save data:", error);
      throw error;
    }
  }

  pop<T extends any>(key: string): T | undefined {
    const fullKey = this.getFullKey(key);
    const piece = this.getDataPiece(fullKey);
    localStorage.removeItem(fullKey);
    return piece ? JSON.parse(piece.data) : undefined;
  }

  get size() {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith(this.prefix)
    ).length;
  }

  cleanup() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const piece = this.getDataPiece(key);
        if (piece && this.needsUpdate(key)) {
          this.pop(key);
        }
      }
    });
  }

  clear(methodsToClear?: string[]) {
    if (!methodsToClear) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return;
    }

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const keyParts = key.split("-").slice(0, 3).join("-");
        if (methodsToClear.some((method) => keyParts === method)) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getDataPiece(key: string): DataPiece | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
