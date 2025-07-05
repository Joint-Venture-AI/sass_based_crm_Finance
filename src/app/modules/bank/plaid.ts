import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { appConfig } from "../../config";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": appConfig.plaid.c_Id, // Replace with your Plaid client ID
      "PLAID-SECRET": appConfig.plaid.s_Key, // Replace with your Plaid secret
    },
  },
});

export const client = new PlaidApi(configuration);
