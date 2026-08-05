import { ExecutiveProductConstitution } from '../../governance/ExecutiveProductConstitution';
import { ExecutiveProductSchema } from '../../schema/ExecutiveProductSchema';

export class ExecutiveProductRegistry {
  private static products = new Map<string, ExecutiveProductSchema>();

  /**
   * Registers a new product into the Illumine Platform, enforcing the Executive Constitution.
   */
  static register(product: ExecutiveProductSchema): void {
    // Fails fast if the product breaks the constitution
    ExecutiveProductConstitution.validateProductContract(product);
    
    this.products.set(product.id, product);
  }

  /**
   * Retrieves an authorized product definition.
   */
  static getProduct(id: string): ExecutiveProductSchema {
    const product = this.products.get(id);
    if (!product) {
      throw new Error(`[Executive Product Registry]: Product ${id} is not registered.`);
    }
    return product;
  }
}
