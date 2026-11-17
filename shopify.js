// Official Shopify Storefront API (public client). Requires a Shopify store, Storefront API access, and matched product handles.
const settings=()=>window.LUQFA_SHOPIFY||{};
export const canCheckout=()=>Boolean(settings().domain&&settings().publicStorefrontToken);
async function graphql(query,variables={}) {
  const c=settings();
  if (!canCheckout()) throw new Error('Shopify Storefront API is not configured.');
  const domain=c.domain.replace(/^https?:\/\//,'').replace(/\/$/,'');
  if (!/^[a-z0-9.-]+$/i.test(domain)) throw new Error('Invalid Shopify shop domain.');
  const response=await fetch(`https://${domain}/api/${c.apiVersion||'2026-10'}/graphql.json`,{
    method:'POST',headers:{'content-type':'application/json','x-shopify-storefront-access-token':c.publicStorefrontToken},body:JSON.stringify({query,variables})
  });
  if(!response.ok) throw new Error(`Shopify returned HTTP ${response.status}.`);
  const result=await response.json();if(result.errors?.length) throw new Error(result.errors[0].message);
  return result.data;
}
export async function createCheckout(items){
  const productQuery=`query VariantForHandle($handle:String!){product(handle:$handle){variants(first:1){nodes{id availableForSale}}}}`;
  const matches=await Promise.all(items.map(async(item)=>{
    const data=await graphql(productQuery,{handle:item.handle});
    const variant=data?.product?.variants?.nodes?.[0];
    if(!variant?.id||!variant.availableForSale)throw new Error(`Product not available for Shopify checkout: ${item.name}`);
    return {merchandiseId:variant.id,quantity:item.quantity};
  }));
  const mutation=`mutation MakeCart($lines:[CartLineInput!]){cartCreate(input:{lines:$lines}){cart{checkoutUrl}userErrors{field message}}}`;
  const data=await graphql(mutation,{lines:matches});
  const errors=data?.cartCreate?.userErrors||[];if(errors.length)throw new Error(errors[0].message);
  const url=data?.cartCreate?.cart?.checkoutUrl;
  if(!url||!/^https:\/\//.test(url))throw new Error('Shopify did not return a secure checkout URL.');
  return url;
}