import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { appConfig } from "../../config";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": appConfig.bank_api.plaid.c_Id, // Replace with your Plaid client ID
      "PLAID-SECRET": appConfig.bank_api.plaid.s_Key, // Replace with your Plaid secret
    },
  },
});

export const client = new PlaidApi(configuration);
