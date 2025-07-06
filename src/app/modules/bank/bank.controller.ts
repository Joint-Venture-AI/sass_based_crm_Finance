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
  const result = await BankService.BuildLink(req.body.ins_Id);

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
  chooseBank,
  BuildLink,
};
