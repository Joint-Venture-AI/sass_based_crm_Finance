/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export interface NormalizedTransaction {
//   date: string; // YYYY-MM-DD
//   amount: number; // always as number
//   currency: string;
//   type: "income" | "expense";
//   description: string;
//   category?: string; // optional (from bank if available)
//   source: "gocardless" | "plaid" | "tink";
//   raw: any; // original data
// }

// type GoCardlessTx = any;
// type PlaidTx = any;
// type TinkTx = any;

// export function normalizeTransactions(
//   transactions: (GoCardlessTx | PlaidTx | TinkTx)[],
//   source: "gocardless" | "plaid" | "tink"
// ): NormalizedTransaction[] {
//   return transactions.map((tx) => {
//     switch (source) {
//       case "gocardless":
//         return {
//           date: tx.bookingDate || tx.valueDate,
//           amount: parseFloat(tx.transactionAmount.amount),
//           currency: tx.transactionAmount.currency,
//           type:
//             parseFloat(tx.transactionAmount.amount) < 0 ? "expense" : "income",
//           description:
//             tx.remittanceInformationUnstructured ||
//             tx.creditorName ||
//             tx.debtorName ||
//             "",
//           category: tx.proprietaryBankTransactionCode || tx.bankTransactionCode,
//           source,
//           raw: tx,
//         };

//       case "plaid":
//         return {
//           date: tx.date,
//           amount: tx.amount,
//           currency: tx.iso_currency_code,
//           type: tx.amount < 0 ? "expense" : "income",
//           description: tx.name || tx.merchant_name || "",
//           category: tx.personal_finance_category?.primary || tx.category?.[0],
//           source,
//           raw: tx,
//         };

//       case "tink":
//         return {
//           date: tx.dates?.booked || tx.dates?.value,
//           amount:
//             parseFloat(tx.amount?.value?.unscaledValue) /
//             Math.pow(10, parseInt(tx.amount?.value?.scale || "0")),
//           currency: tx.amount?.currencyCode,
//           type:
//             parseFloat(tx.amount?.value?.unscaledValue) < 0
//               ? "expense"
//               : "income",
//           description:
//             tx.descriptions?.display || tx.descriptions?.original || "",
//           category: tx.categories?.pfm?.name || tx.types?.type,
//           source,
//           raw: tx,
//         };

//       default:
//         throw new Error(`Unknown source: ${source}`);
//     }
//   });
// }

interface SimplifiedTransaction {
  tId: string;
  date: string;
  amount: number;
  currency: string;
  counterparty?: string;
  description?: string;
  type: "income" | "expense";
  bookedOrPending: "booked" | "pending";
}

export async function simplifyTransactions(data: {
  booked: any[];
  pending: any[];
}) {
  const mapTx = (
    tx: any,
    status: "booked" | "pending"
  ): SimplifiedTransaction => ({
    tId: tx.transactionId,
    date: tx.bookingDate,
    amount: parseFloat(tx.transactionAmount.amount),
    currency: tx.transactionAmount.currency,
    counterparty: tx.creditorName || tx.remittanceInformationUnstructured || "",
    description: tx.remittanceInformationUnstructured || "",
    type: parseFloat(tx.transactionAmount.amount) >= 0 ? "income" : "expense",
    bookedOrPending: status,
  });

  return [
    ...data.booked.map((tx) => mapTx(tx, "booked")),
    ...data.pending.map((tx) => mapTx(tx, "pending")),
  ];
}
