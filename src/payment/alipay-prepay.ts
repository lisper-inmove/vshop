import { requestHandler } from "@/lib/requestHandler";
import {
  PrepayRequest,
  PrepayResponse,
  TradeQueryRequest,
  TradeQueryResponse,
} from "@/proto/api/api_payment";
import axios from "axios";

interface PrepayResponseWrapper {
  code: number;
  msg: string;
  data: PrepayResponse;
}

export const doPrepay = requestHandler<PrepayRequest, PrepayResponseWrapper>(
  (params) =>
    axios.post(
      `${process.env.NEXT_PUBLIC_PAYMENT_HOST}/payment/prepay`,
      params,
    ),
);

interface TradeQueryResponseWrapper {
  code: number;
  msg: string;
  data: TradeQueryResponse;
}

export const doPaymentQuery = requestHandler<
  TradeQueryRequest,
  TradeQueryResponseWrapper
>((params) =>
  axios.post(
    `${process.env.NEXT_PUBLIC_PAYMENT_HOST}/payment/trade-query`,
    params,
  ),
);
