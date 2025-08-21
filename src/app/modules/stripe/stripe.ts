import Stripe from "stripe";
import { appConfig } from "../../config";

export const stripe = new Stripe(appConfig.payment.stripe.secret_key!);
