import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserProfileRoute } from "../modules/users/userProfile/userProfile.route";
import { FormRoute } from "../modules/FormData/formCreate/form.route";
import { BankRoute } from "../modules/bank/bank.route";
import { FormResponseRoute } from "../modules/FormData/formResponse/formResponse.route";
import { SubscriptionRoute } from "../modules/subscription/subscription.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/user", route: UserProfileRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/form", route: FormRoute },
  { path: "/form", route: FormResponseRoute },
  { path: "/bank", route: BankRoute },
  { path: "/subscription", route: SubscriptionRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
