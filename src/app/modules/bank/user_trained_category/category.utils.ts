import { MerchantCategory } from "./category.interface_model";

function normalizeMerchant(name?: string) {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .trim();
}

export async function getExpenseCategory(
  userId: string,
  counterparty?: string
): Promise<string> {
  const normalized = normalizeMerchant(counterparty);

  const mapping = await MerchantCategory.findOne({
    userId,
    normalizedName: normalized,
  });
  if (mapping) return mapping.category;

  return "Uncategorized"; // fallback
}
