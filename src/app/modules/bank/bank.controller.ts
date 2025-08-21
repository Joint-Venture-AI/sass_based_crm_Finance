import status from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { BankService } from "./bank.service";

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
    message: "accesstoken successfull",
    data: result,
  });
});
const selectAccount = catchAsync(async (req, res) => {
  const access_token = req.body.accessToken;

  const result = await BankService.selectAccount(access_token);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "SelectAccount successfull",
    data: result,
  });
});

const fetchTransactions = catchAsync(async (req, res) => {
  const token = req.body.token;
  const accIds = req.body.accountId;
  const result = await BankService.fetchTransactions(token, accIds);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: result,
  });
});

//gocardless

const getToken = catchAsync(async (req, res) => {
  // const token = req.body.token;

  const result = await BankService.getToken();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "oauth-callback successfully",
    data: result,
  });
});

const chooseBank = catchAsync(async (req, res) => {
  // const token = req.body.token;

  const result = await BankService.chooseBank();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Bank fetched successfully",
    data: result,
  });
});

const BuildLink = catchAsync(async (req, res) => {
  const result = await BankService.BuildLink(req.body.ins_Id, req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Link created successfully",
    data: result,
  });
});
const getAccountList = catchAsync(async (req, res) => {
  const result = await BankService.getAccountList(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Account list fetched successfully",
    data: result,
  });
});

const getAccountDetails = catchAsync(async (req, res) => {
  const result = await BankService.getAccountDetails(req.params.aId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Account details fetched successfully",
    data: result,
  });
});

const getTransection = catchAsync(async (req, res) => {
  const { date_from, date_to } = req.query;
  const result = await BankService.getTransection(
    req.params.aId,
    date_from as string,
    date_to as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Account transection fetched successfully",
    data: result,
  });
});
const getApiResponse = catchAsync(async (req, res) => {
  const result = await BankService.getApiResponse(req.body.data);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ai response is fetched successfully",
    data: result,
  });
});

export const BankController = {
  getLinkToken,
  exchangePublicToken,
  selectAccount,
  fetchTransactions,

  getToken,
  chooseBank,
  getAccountList,
  getAccountDetails,
  getTransection,
  BuildLink,

  getApiResponse,
};
