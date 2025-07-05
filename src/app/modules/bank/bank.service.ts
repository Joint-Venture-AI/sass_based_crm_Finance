import { client } from "./plaid";
import { Products, CountryCode } from "plaid"; // Import the Products enum from Plaid SDK
const getLinkToken = async () => {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "user-id", // Unique user identifier
      },
      client_name: "Your App",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export const BankService = {
  getLinkToken,
};
