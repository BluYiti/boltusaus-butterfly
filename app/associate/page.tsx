import Link from "next/link";
import Image from "next/image";
import React from "react";
import StatCard from "@/components/associate/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

const Associate = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="assoc-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/butterfly-logo-full.svg"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Associate Dashboard</p>
      </header>

      <main className="assoc-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 🦋</h1>
          <p className="text-dark-700">
            Start the day with managing appointments
          </p>
        </section>

        <section className="assoc-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Associate;
