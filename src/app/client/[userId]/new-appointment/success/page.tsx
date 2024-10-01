import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Psychotherapists } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const psychotherapist = Psychotherapists.find(
    (psychotherapist) => psychotherapist.name === appointment.primaryPsychotherapist
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/butterfly-logo-full.svg"
            height={900}
            width={9000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-blue-400">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={psychotherapist?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">{psychotherapist?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button className="shad-primary-alt-btn" asChild>
          <Link href={`/clients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright mt-10 py-12">© 2024 Butterfly</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
