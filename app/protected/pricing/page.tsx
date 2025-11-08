import { createUpdateClient } from "@/utils/update/server";
import PricingContent from "@/components/pricing-content";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const client = await createUpdateClient();

  if (!client) {
    return <div>Update is not configured. Please set your environment variables.</div>;
  }

  const { data, error } = await client.billing.getProducts();
  const { data: subscriptionData } = await client.billing.getSubscriptions();

  if (error) {
    return <div>There was an error loading products. Please try again.</div>;
  }

  const currentProductId =
    subscriptionData.subscriptions == null ||
    subscriptionData.subscriptions.length === 0
      ? null
      : subscriptionData.subscriptions[0].product.id;

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium">Pricing Plans</h1>
        <p className="text-muted-foreground mt-2">
          Choose the perfect plan for your needs
        </p>
      </div>

      <PricingContent
        products={data.products}
        currentProductId={currentProductId}
      />
    </>
  );
}
