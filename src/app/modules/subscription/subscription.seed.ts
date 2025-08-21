import SubscriptionPackage from "./subscription.model";

export const seedSubscriptions = async () => {
  const packages = [
    {
      name: "Flat Rate Package",
      type: "FLAT_RATE",
      priceMonthly: 39,
      priceYearly: 390,
      vatIncluded: true,
      vatPercentage: 22,
      features: ["Basic features for flat rate customers"],
      stripeMonthlyPriceId: "price_xxxFlatRateMonth",
      stripeYearlyPriceId: "price_xxxFlatRateYear",
    },
    {
      name: "Business Package",
      type: "BUSINESS",
      priceMonthly: 99,
      priceYearly: 990,
      vatIncluded: false,
      vatPercentage: 22,
      features: ["Business features", "Support"],
      stripeMonthlyPriceId: "price_xxxBusinessMonth",
      stripeYearlyPriceId: "price_xxxBusinessYear",
    },
    {
      name: "Premium Business Package",
      type: "PREMIUM_BUSINESS",
      priceMonthly: 129,
      priceYearly: 1290,
      vatIncluded: false,
      vatPercentage: 22,
      features: [
        "Business platform features",
        "Additional premium service outside the software",
      ],
      stripeMonthlyPriceId: "price_xxxPremiumMonth",
      stripeYearlyPriceId: "price_xxxPremiumYear",
    },
  ];

  for (const pkg of packages) {
    await SubscriptionPackage.findOneAndUpdate({ type: pkg.type }, pkg, {
      upsert: true,
      new: true,
    });
  }

  console.log("✅ Subscription packages with Stripe Price IDs seeded");
};
