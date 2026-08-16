import { APIRequestContext, Page } from '@playwright/test';

/**
 * Seeds a cart via the API and injects the resulting cart_id/cart_quantity
 * into sessionStorage BEFORE the Angular app initializes (via addInitScript),
 * since the frontend reads its cart state from sessionStorage on startup
 * rather than from cookies or localStorage.
 *
 * NOTE (Guessing — to verify): exact request/response shape of POST /carts
 * and POST /carts/{id} is assumed based on the public API resource groups
 * (Cart), not yet confirmed against a real request/response.
 */
export async function seedCart(
  page: Page,
  request: APIRequestContext,
  productId: string,
  quantity: number = 1
) {
  const createCartResponse = await request.post('http://localhost:8091/carts');
  const { id: cartId } = await createCartResponse.json();

  await request.post(`http://localhost:8091/carts/${cartId}`, {
    data: { product_id: productId, quantity },
  });

  await page.addInitScript(
    ({ cartId, quantity }) => {
      sessionStorage.setItem('cart_id', cartId);
      sessionStorage.setItem('cart_quantity', String(quantity));
    },
    { cartId, quantity }
  );
}