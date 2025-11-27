import { Product, CartItem } from '../types';

const SHOPIFY_DOMAIN = 'qag0f0-gq.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'd80cefbc93c419d6711b2356be501808';

async function shopifyFetch(query: string, variables = {}) {
  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    
    const json = await response.json();
    if (json.errors) {
      console.error('Shopify API Error:', JSON.stringify(json.errors, null, 2));
      throw new Error(json.errors[0].message);
    }
    return json.data;
  } catch (error) {
    console.error('Network error communicating with Shopify:', error);
    throw error;
  }
}

export const fetchShopifyProducts = async (): Promise<Product[]> => {
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
            collections(first: 1) {
              edges {
                node {
                  title
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            options {
              name
              values
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                  }
                  image {
                    url
                  }
                  selectedOptions {
                    name
                    value
                  }
                  availableForSale
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
      
      const variants = node.variants.edges.map((vEdge: any) => ({
        id: vEdge.node.id,
        title: vEdge.node.title,
        price: parseFloat(vEdge.node.price.amount),
        image: vEdge.node.image?.url,
        selectedOptions: vEdge.node.selectedOptions,
        availableForSale: vEdge.node.availableForSale
      }));

      // Base price is usually the lowest price variant or the first one
      const basePrice = variants.length > 0 ? variants[0].price : 0;

      // Use productType, fallback to first collection, fallback to Uncategorized
      const category = node.productType || node.collections?.edges[0]?.node?.title || 'Uncategorized';

      return {
        id: node.id, 
        name: node.title,
        price: basePrice,
        image: node.images.edges[0]?.node.url || 'https://picsum.photos/seed/fashion/800/1000',
        description: node.description || 'No description available.',
        category: category,
        isNew: false,
        options: node.options,
        variants: variants
      };
    });
  } catch (e) {
    console.warn("Failed to fetch from Shopify. Ensure Domain is correct.", e);
    return [];
  }
};

export const createShopifyCheckout = async (cartItems: CartItem[]): Promise<string | null> => {
  // Use cartCreate instead of legacy checkoutCreate
  // Map variantId to merchandiseId for CartLineInput
  const lineItems = cartItems.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity
  }));
  
  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: lineItems
    }
  };

  try {
    const data = await shopifyFetch(mutation, variables);
    
    if (data.cartCreate.userErrors.length > 0) {
      console.error("Checkout Errors:", data.cartCreate.userErrors);
      return null;
    }

    return data.cartCreate.cart.checkoutUrl;
  } catch (e) {
    console.error("Checkout creation failed", e);
    return null;
  }
};