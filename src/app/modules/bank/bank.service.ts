/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
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
      country_codes: [CountryCode.It],
      language: "en",
    });
    return response.data.link_token;
  } catch (error: any) {
    throw new Error(error);
  }
};

const exchangePublicToken = async (public_token: string) => {
  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;
    // Store access_token securely or return it as needed
    console.log(access_token);
    return { access_token };
  } catch (error: any) {
    throw new Error(error);
  }
};

const fetchTransactions = async (accessToken: string) => {
  const startDate = "2025-01-01"; // Start date for the transaction history
  const endDate = "2025-12-31"; // End date for the transaction history

  try {
    // Fetch the transactions
    const response = await client.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 250, // Number of transactions to retrieve
        offset: 0, // Offset for pagination
      },
    });

    console.log("Fetched Transactions:", response.data.transactions);

    // Do something with the transactions, e.g., store them in your database
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

const getToken = async (data: any) => {
  console.log(data);

  const res = await axios.post(
    "https://bankaccountdata.gocardless.com/api/v2/token/new/",
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const res2 = await axios.get(
    "https://bankaccountdata.gocardless.com/api/v2/institutions/",
    {
      params: {
        country: "gb", // Country filter, GB for Great Britain
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${res.data.access}`, // Bearer token for authentication
      },
    }
  );

  return { bank: res2.data, token: res.data };
};

const BuildLink = async (data2: { token: string; ins_Id: string }) => {
  const data = {
    redirect: "http://localhost:3000/",
    institution_id: data2.token,
    reference: "124151",
    user_language: "EN",
  };

  const config = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${data2.token}`,
    },
  };
  console.log(data2);
  try {
    const response = await axios.post(
      "https://bankaccountdata.gocardless.com/api/v2/requisitions/",
      data,
      config
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const BankService = {
  getLinkToken,
  exchangePublicToken,
  fetchTransactions,
  getToken,
  BuildLink,
};
