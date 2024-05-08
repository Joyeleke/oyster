import { ENV } from '@/shared/env';

type ShopifyGiftCardInput = {
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
};

async function createCustomer(
  firstName: string,
  lastName: string,
  email: string
) {
  const url =
    'https://development-issue-168.myshopify.com/admin/api/2023-10/customers.json';

  const body = {
    customer: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      send_email_invite: true,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'X-Shopify-Access-Token': ENV.SHOPIFY_ADMIN_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data['errors']) {
    console.log(data['errors']);

    return null;
  } else {
    return data['customer']['id'];
  }
}

async function createGiftCard(amount: number, recipientId: number) {
  const url =
    'https://development-issue-168.myshopify.com/admin/api/2023-10/gift_cards.json';

  const body = {
    gift_card: {
      initial_value: amount,
      recipient_id: recipientId,
    },
  };

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'X-Shopify-Access-Token': ENV.SHOPIFY_ADMIN_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });
}

export async function sendShopifyGiftCard({
  amount,
  firstName,
  lastName,
  email,
}: ShopifyGiftCardInput) {
  const recipientId = await createCustomer(firstName, lastName, email);

  if (!recipientId) {
    return 'failed';
  }

  await createGiftCard(amount, recipientId);
}
