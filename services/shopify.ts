import { Product, CartItem } from '../types';

const SHOPIFY_DOMAIN = 'qag0f0-gq.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'd80cefbc93c419d6711b2356be501808';

async function shopifyFetch(query: string, variables = {}) {
  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    
    const json = await response.json();
    if (json.errors) {
      console.error('Shopify API Error:', json.errors);
      throw new Error(json.errors[0].message);
    }
    return json.data;
  } catch (error) {
    console.error('Network error communicating with Shopify:', error);
    throw error;
  }
}

export const fetchShopifyProducts = async (): Promise<Product[]> => {
  // We fetch variants(first: 1) to get the specific ID needed for Checkout.
  // The Storefront API requires a Variant ID to create a checkout, not a Product ID.
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query);
    return data.products.edges.map((edge: any) => {
      const node = edge.node;
      const firstVariant = node.variants.edges[0]?.node;
      
      // We use the Variant ID as the main 'id' for the app so that addToCart
      // passes the correct ID to the checkout mutation later.
      const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
      const variantId = firstVariant ? firstVariant.id : node.id;

      return {
        id: variantId, 
        name: node.title,
        price: price,
        image: node.images.edges[0]?.node.url || 'https://picsum.photos/seed/fashion/800/1000',
        description: node.description || 'No description available.',
        category: node.productType || 'Uncategorized',
        isNew: false 
      };
    });
  } catch (e) {
    console.warn("Failed to fetch from Shopify. Ensure Domain is correct.", e);
    return [];
  }
};

export const createShopifyCheckout = async (cartItems: CartItem[]): Promise<string | null> => {
  const lineItems = cartItems.map(item => ({
    variantId: item.id, // This now holds the actual Shopify Variant ID
    quantity: item.quantity
  }));
  
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems
    }
  };

  try {
    const data = await shopifyFetch(mutation, variables);
    
    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      console.error("Checkout Errors:", data.checkoutCreate.checkoutUserErrors);
      return null;
    }

    return data.checkoutCreate.checkout.webUrl;
  } catch (e) {
    console.error("Checkout creation failed", e);
    return null;
  }
};