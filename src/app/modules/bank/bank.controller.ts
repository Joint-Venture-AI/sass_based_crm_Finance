import status from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { BankService } from "./bank.service";
import { appConfig } from "../../config";

const getLinkToken = catchAsync(async (req, res) => {
  const result = await BankService.getLinkToken();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Link token created successfully",
    data: result,
  });
});

const exchangePublicToken = catchAsync(async (req, res) => {
  const public_token = req.body.public_token;
  const result = await BankService.exchangePublicToken(public_token);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: result,
  });
});

const fetchTransactions = catchAsync(async (req, res) => {
  const token = req.body.token;
  const result = await BankService.fetchTransactions(token);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: result,
  });
});
const getToken = catchAsync(async (req, res) => {
  // const token = req.body.token;

  const data = {
    secret_id: appConfig.bank_api.go_card_less.c_Id, // Replace with actual secret_id
    secret_key: appConfig.bank_api.go_card_less.s_Key, // Replace with actual secret_key
  };

  const result = await BankService.getToken(data);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: result,
  });
});
const callBack = catchAsync(async (req, res) => {
  // const token = req.body.token;
  // const result = await BankService.fetchTransactions(token);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: "",
  });
});

export const BankController = {
  getLinkToken,
  exchangePublicToken,
  fetchTransactions,
  callBack,
  getToken,
};
