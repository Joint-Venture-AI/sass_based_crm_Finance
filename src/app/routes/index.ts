import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserProfileRoute } from "../modules/users/userProfile/userProfile.route";
import { FormRoute } from "../modules/test_form/formCreate/form.route";
import { BankRoute } from "../modules/bank/bank.route";
import { FormResponseRoute } from "../modules/test_form/formResponse/formResponse.route";
import { FinanceRoute } from "../modules/income_expanse/finance/finance.route";
import { UserSubscriptionRoute } from "../modules/user_subscription/user_subscription.route";
import { ExpenseRoute } from "../modules/income_expanse/expense/expense.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/user", route: UserProfileRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/form", route: FormRoute },
  { path: "/form", route: FormResponseRoute },
  { path: "/bank", route: BankRoute },
  { path: "/finance", route: FinanceRoute },
  { path: "/user-subscription", route: UserSubscriptionRoute },
  { path: "/expense", route: ExpenseRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
