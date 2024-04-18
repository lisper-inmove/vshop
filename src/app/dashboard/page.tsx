"use client";
import { AddCommodity } from "@/components/AddCommodity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, PlusIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LTR_ADD_COMMODITY_NAME,
  LTR_CREATE_TIME,
  LTR_PRICE,
  LTR_STATUS,
  LTR_UPDATE_TIME,
} from "@/constants/literals";
import { Button } from "@/components/ui/button";
import { trpcClient } from "@/trpc-config/client";
import { useEffect, useState } from "react";
import { Commodity } from "@prisma/client";
import { formatDate } from "@/lib/date-util";

export default function Dashboard() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const { data, isLoading, error } =
    trpcClient.commodityRouter.listCommoditiesDashboard.useQuery({
      size: 10,
    });

  useEffect(() => {
    if (data) {
      setCommodities(data.commodities);
    }
  }, [data]);

  return isLoading ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader2 />
    </div>
  ) : (
    <div className="flex flex-col w-[100%] h-[100%] mt-10">
      <div className="flex gap-4 mb-5 ml-5">
        <AddCommodity />
        <Button variant="outline">删除选中</Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox></Checkbox>
              </TableHead>
              <TableHead className="w-[100px]">
                {LTR_ADD_COMMODITY_NAME}
              </TableHead>
              <TableHead>{LTR_STATUS}</TableHead>
              <TableHead>{LTR_PRICE}</TableHead>
              <TableHead className="text-right">{LTR_CREATE_TIME}</TableHead>
              <TableHead className="text-right">{LTR_UPDATE_TIME}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commodities.map((commodity) => (
              <TableRow key={commodity.uid}>
                <TableCell className="w-12">
                  <Checkbox></Checkbox>
                </TableCell>
                <TableCell className="font-medium">
                  <AddCommodity commodity={commodity}></AddCommodity>
                </TableCell>
                <TableCell>{commodity.status}</TableCell>
                <TableCell>{commodity.price / 100}</TableCell>
                <TableCell className="text-right">
                  {formatDate(commodity.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(commodity.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
