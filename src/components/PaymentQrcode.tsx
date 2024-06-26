"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { doPaymentQuery, doPrepay } from "@/payment/alipay-prepay";
import { trpcClient } from "@/trpc-config/client";
import useUser from "@/user/use-user";
import { Commodity, Order } from "@prisma/client";
import { Loader2, ShoppingCart } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast as stoast } from "sonner";

export const PaymentQrcode = ({ commodity }: { commodity: Commodity }) => {
  const totalPaymentCountDown = 1800;
  const { Canvas } = useQRCode();
  const [order, setOrder] = useState<Order | null>(null);
  const [prepayQrCode, setPrepayQrcode] = useState<string | null>(null);
  const hideDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const [paymentCountDown, setPaymentCountDown] = useState<number>(
    totalPaymentCountDown,
  );
  const [paySuccess, setPaySuccess] = useState<boolean>(false);
  const { mutate: finishOrder } =
    trpcClient.orderRouter.finishOrder.useMutation();
  const { getUserinfo } = useUser();
  const { mutate: createOrder } = trpcClient.orderRouter.create.useMutation({
    onSuccess: async (data) => {
      if (data.code === "success") {
        const currentOrder = data.order;
        setOrder(currentOrder);

        const prepay = await doPrepay({
          id: currentOrder.uid,
          pay_fee: commodity.price,
          pay_method: "ALIPAY_F2F",
        });
        if (prepay.code === "success") {
          setPrepayQrcode(prepay.data.data.qrcode_url!);
          let checkOrderTimer = setInterval(async () => {
            const status = await doPaymentQuery({
              id: prepay.data.data.trade_id,
            });
            if (status.code === "success") {
              const isPaySuccess = status.data.data.is_pay_success;
              if (isPaySuccess) {
                stoast.success("支付已成功，从[我的订单]页查看下载链接");
                clearInterval(checkOrderTimer);
                setPaySuccess(true);
                finishOrder({
                  orderId: currentOrder.uid,
                });
                let timer: any;
                timer = setTimeout(() => {
                  hideDialogButtonRef.current?.click();
                  setPrepayQrcode(null);
                  setPaySuccess(false);
                  setPaymentCountDown(totalPaymentCountDown);
                  setOrder(null);
                  if (timer) {
                    clearTimeout(timer);
                  }
                }, 200);
              }
            }
          }, 5000);
        }
      }
    },
  });

  useEffect(() => {
    let timer: any;
    if (order !== null && paymentCountDown > 0) {
      timer = setTimeout(() => {
        setPaymentCountDown((prev) => prev - 1);
      }, 1000);
    } else {
      setPaymentCountDown(totalPaymentCountDown);
      setOrder(null);
      hideDialogButtonRef.current?.click();
    }
    return () => clearTimeout(timer);
  }, [paymentCountDown, order]);

  return (
    <Dialog>
      <DialogTrigger>
        <ShoppingCart
          onClick={(e) => {
            const userinfo = getUserinfo();
            if (userinfo === null || userinfo.token === "") {
              stoast.error("请先登陆");
              e.stopPropagation();
            }
            if (!order) {
              createOrder({
                commodityId: commodity.id,
                token: userinfo!.token,
              });
            }
          }}
        />
      </DialogTrigger>
      <DialogClose></DialogClose>
      <DialogContent className="w-1/6">
        <div className="flex flex-col items-center justify-center">
          {paymentCountDown > 0 && !paySuccess ? (
            <div className="mb-5">
              剩余支付时间: {Math.floor(paymentCountDown / 60)}分{" "}
              {paymentCountDown % 60}秒
            </div>
          ) : null}
          <div>
            {prepayQrCode === null ? (
              <div className="items-center justify-center w-full h-full">
                <Loader2 />
              </div>
            ) : paySuccess ? (
              <div className="text-4xl text-orange-500">支付成功</div>
            ) : (
              <Canvas
                text={prepayQrCode!}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 200,
                }}
              />
            )}
          </div>
          <div className="flex justify-start">
            <svg
              viewBox="0 0 854.9970000000001 299.99699999999996"
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="87"
            >
              <path
                d="M48.508 0C21.694 0 0 21.511 0 48.068v203.87c0 26.536 21.694 48.059 48.508 48.059h205.81c26.793 0 48.496-21.522 48.496-48.059v-2.086c-.902-.372-78.698-32.52-118.24-51.357-26.677 32.524-61.086 52.256-96.812 52.256-60.412 0-80.927-52.38-52.322-86.86 6.237-7.517 16.847-14.698 33.314-18.718 25.76-6.27 66.756 3.915 105.18 16.477 6.912-12.614 12.726-26.506 17.057-41.297H72.581v-11.88h61.057V87.168H59.687V75.28h73.951v-30.39s0-5.119 5.236-5.119h29.848v35.508h73.107v11.891h-73.107v21.303h59.674c-5.71 23.176-14.38 44.509-25.264 63.236 18.111 6.49 34.368 12.646 46.484 16.666 40.413 13.397 51.74 15.034 53.201 15.205V48.069c0-26.557-21.704-48.068-48.496-48.068H48.511zm33.207 162.54c-2.593.03-5.198.17-7.822.426-7.565.753-21.768 4.06-29.533 10.865-23.274 20.109-9.344 56.87 37.762 56.87 27.383 0 54.743-17.343 76.236-45.114-27.71-13.395-51.576-23.335-76.643-23.047z"
                fill="#00a1e9"
              />
              <path
                d="M829.48 208.55l-13.517 29.164-13.718-29.164h-13.402l20.871 40.322v28.127h12.295v-28.127l.074-.157 20.787-40.165zm-98.969 17.644l9.535 28.389h-19.407zm12.464 37.015l4.594 13.786h12.885l-25.37-68.45h-9.851l-25.286 68.45h12.896l4.793-13.786zm-96.164-21.937h-13.686v-23.417h13.686c6.88 0 10.989 5.977 10.989 11.755 0 5.653-3.846 11.661-10.989 11.661m.695-32.723h-26.772v68.45h12.39v-26.316h14.381c13.36 0 22.694-8.667 22.694-21.072s-9.334-21.061-22.694-21.061m-89.406 68.45H570.5v-68.45h-12.4zm-87.163-68.449V277h41.711v-9.327h-29.32V208.55zm-70.587 17.644l9.525 28.389h-19.396zm12.464 37.015l4.594 13.786h12.875l-25.37-68.45h-9.84l-25.287 68.45h12.885l4.794-13.786zm87.23-188.47H446.89V55.813h61.635V44.026H446.89V20.044h-27.477c-3.013 0-5.447 2.512-5.447 5.6v18.382h-61.203v11.787h61.203V74.74H362.31v11.776H465.2s-5.7 22.12-33.925 45.891c-25.286-19.02-33.736-34.167-33.736-34.167h-27.604c11.168 19.23 27.035 34.628 44.124 46.844-15.698 10.133-36.054 19.9-62.372 27.72v14.11s40.605-7.61 79.851-30.587c39.31 22.8 78.787 30.587 78.787 30.587v-13.357c-25.265-9.138-45.283-19.188-61.002-28.88 22.768-16.76 42.723-39.507 50.72-69.937m172.66-52.334h-27.668V51.13h-68.198v11.567h68.198v103.27c-.242 2.366-2.117 4.208-4.467 4.334h-14.065v11.965h35.864c5.679-.23 10.21-4.91 10.336-10.709V62.696h11.231V51.129h-11.23zm-58.349 59.777c-1.011-2.051-3.076-3.465-5.478-3.486h-23.052l17.964 56.192h27.267zm-68.092-61.137L514.527 95.63h24.348v88.747H565.5V66.656h-9.65l20.05-45.609zm308.73 159.26l-9.724-32.639c-.653-2.083-2.55-3.59-4.805-3.59h-25.78l7.48 25.07H791.85v-48.57h59.517v-11.557H791.85V86.157h59.517V74.6h-148.52v11.557h59.506v22.862h-59.506v11.557h59.506v48.57h-59.506v11.558h152.15l-.127-.398zm-121.2-133.28h86.678v17.052h30.965V43.874c-.01-.042-.01-.063-.01-.115 0-4.543-3.582-8.217-8.018-8.29h-50.108V19.568H760.9v15.9h-58.063v28.61h30.954z"
                fill="#3f3b3a"
              />
            </svg>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild className="hidden">
            <Button type="button" variant="secondary" ref={hideDialogButtonRef}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
