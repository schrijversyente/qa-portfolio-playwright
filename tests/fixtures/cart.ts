import { APIRequestContext, Page } from '@playwright/test';

/**
 * Seeds a cart via the API and injects the resulting cart_id/cart_quantity
 * into sessionStorage BEFORE the Angular app initializes (via addInitScript),
 * since the frontend reads its cart state from sessionStorage on startup
 * rather than from cookies or localStorage.
 *
 * Request/response shapes for POST /carts, POST /carts/{id} and GET /products
 * are verified against the live API (2026-08-16), not assumed.
 */
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8091';

type Product = { id: string; in_stock: boolean };

async function getAnyInStockProductId(request: APIRequestContext): Promise<string> {
  const response = await request.get(`${API_BASE_URL}/products`);
  const { data }: { data: Product[] } = await response.json();
  const product = data.find((p) => p.in_stock);
  if (!product) {
    throw new Error('No in-stock product found to seed the cart with');
  }
  return product.id;
}

export async function seedCart(
  page: Page,
  request: APIRequestContext,
  productId?: string,
  quantity: number = 1
) {
  const resolvedProductId = productId ?? (await getAnyInStockProductId(request));

  const createCartResponse = await request.post(`${API_BASE_URL}/carts`);
  const { id: cartId } = await createCartResponse.json();

  await request.post(`${API_BASE_URL}/carts/${cartId}`, {
    data: { product_id: resolvedProductId, quantity },
  });

  await page.addInitScript(
    ({ cartId, quantity }) => {
      sessionStorage.setItem('cart_id', cartId);
      sessionStorage.setItem('cart_quantity', String(quantity));
    },
    { cartId, quantity }
  );
}
