import SubscriptionPackage from "./subscription.model";

const getAllActiveSubscriptions = async () => {
  const subscriptions = await SubscriptionPackage.find({
    isActive: true,
  }).lean();
  return subscriptions;
};

const getSubscriptionById = async (id: string) => {
  const subscription = await SubscriptionPackage.findById(id);
  return subscription;
};

export const SubscriptionService = {
  getAllActiveSubscriptions,
  getSubscriptionById,
};
