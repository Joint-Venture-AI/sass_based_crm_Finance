/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import { client } from "./plaid";
import { Products, CountryCode } from "plaid"; // Import the Products enum from Plaid SDK
import { appConfig } from "../../config";

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

const selectAccount = async (access_token: string) => {
  try {
    const response = await client.accountsGet({ access_token: access_token });

    // Store access_token securely or return it as needed

    return response.data.accounts;
  } catch (error: any) {
    throw new Error(error);
  }
};

const fetchTransactions = async (accessToken: string, accountId: [string]) => {
  const startDate = "2025-01-01"; // Start date for the transaction history
  const endDate = "2025-12-31"; // End date for the transaction history
  console.log(accountId);
  try {
    // Fetch the transactions
    const response = await client.transactionsGet({
      access_token: accessToken,

      start_date: startDate,
      end_date: endDate,
      options: {
        count: 250, // Number of transactions to retrieve
        offset: 0, // Offset for pagination
        account_ids: accountId,
      },
    });

    console.log("Fetched Transactions:", response.data.transactions);

    // Do something with the transactions, e.g., store them in your database
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

//gocardless

const getToken = async () => {
  const res = await axios.post(
    "https://bankaccountdata.gocardless.com/api/v2/token/new/",

    {
      secret_id: appConfig.bank_api.go_card_less.c_Id, // Replace with actual secret_id
      secret_key: appConfig.bank_api.go_card_less.s_Key, // Replace with actual secret_key
    }
  );

  return res.data;
};

const chooseBank = async () => {
  const { access } = await getToken();
  const res2 = await axios.get(
    "https://bankaccountdata.gocardless.com/api/v2/institutions/",
    {
      params: {
        country: "GB", // Country filter, GB for Great Britain
      },
      headers: {
        Authorization: `Bearer ${access}`, // Bearer token for authentication
      },
    }
  );
  return res2.data;
};

const BuildLink = async (ins_Id: string) => {
  const { access } = await getToken();

  try {
    const { data } = await axios.post(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/`,
      {
        redirect: "https://httpbin.org/get", //!change to app
        institution_id: ins_Id,
        reference: `d-${Date.now()}`,
      },
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return { id: data.id, link: data.link };
  } catch (error: any) {
    throw new Error(error);
  }
};

const getAccountList = async (rId: string) => {
  const { access } = await getToken();

  try {
    const { data } = await axios.get(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${rId}`,
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getTransection = async (
  aId: string,
  startDate: string,
  endDate: string
) => {
  const { access } = await getToken();

  try {
    const { data } = await axios.get(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${aId}/transactions?date_from=${startDate}&date_to=${endDate}`,
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const BankService = {
  getLinkToken,
  exchangePublicToken,
  selectAccount,
  fetchTransactions,
  getToken,
  chooseBank,
  BuildLink,
  getAccountList,
  getTransection,
};
