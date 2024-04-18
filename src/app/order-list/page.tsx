"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/date-util";
import { trpcClient } from "@/trpc-config/client";
import { Copy } from "lucide-react";

export default function OrderList() {
  const { data, isLoading, error } = trpcClient.orderRouter.userOrders.useQuery(
    {
      page: 1,
      size: 10,
    },
  );

  const { toast } = useToast();

  const copyLink = (link: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast({
            description: "复制成功",
          });
          console.log("Copy Success");
        })
        .catch((error) => {
          toast({
            description: "复制失败",
          });
          console.log("Copy Failed");
        });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="text-3xl text-slate-500 mb-10">用户订单列表</div>
        {isLoading || error ? (
          <div>
            <p className="text-xl text-slate-300">没有订单</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">序号</TableHead>
                <TableHead className="w-[200px] text-center">订单ID</TableHead>
                <TableHead className="w-[100px] text-center">
                  订单状态
                </TableHead>
                <TableHead className="w-[200px] text-center">
                  创建时间
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  金额(元)
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  下载链接
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.orders.map((order, index) => (
                <TableRow key={order.uid}>
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-ellipsis line-clamp-1 text-center">
                    {order.uid}
                  </TableCell>
                  <TableCell className="text-center">{order.status}</TableCell>
                  <TableCell className="text-center">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.payFee! / 100}
                  </TableCell>
                  <TableCell className="flex items-center justify-center text-center gap-4">
                    <p>{order.downloadLink}</p>
                    <Copy onClick={() => copyLink(order.downloadLink!)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
