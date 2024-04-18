import { router } from "./index";
import { commodityRouter } from "./routers/commodity-router";
import { orderRouter } from "./routers/order-router";
import { userRouter } from "./routers/user-router";

export const appRouter = router({
  userRouter: userRouter,
  commodityRouter: commodityRouter,
  orderRouter: orderRouter,
});

export type AppRouter = typeof appRouter;
