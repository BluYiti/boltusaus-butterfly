"use client"

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/../lib/utils";
import { Psychotherapists } from "@/../constants";
import AppointmentModal from "../AppointmentModal";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.client.name}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPsychotherapist",
    header: "Psychotherapist",
    cell: ({ row }) => {
      const psychotherapist = Psychotherapists.find(
        (doc) => doc.name === row.original.primaryPsychotherapist
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={psychotherapist?.image}
            alt={psychotherapist.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">{psychotherapist?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions </div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            clientId={data.client.$id}
            userId={data.userId}
            appointmentId={data}
          />
          <AppointmentModal
            type="cancel "
            clientId={data.client.$id}
            userId={data.userId}
            appointmentId={data}
          />
        </div>
      );
    },
  },
];
