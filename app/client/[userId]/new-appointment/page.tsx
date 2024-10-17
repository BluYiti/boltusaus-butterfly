import Image from "next/image";
import Link from "next/link";
import AppointmentForm from "@/components/forms/AppointmentForm";
import NavBar from "@/components/NavBar";
import Menu from "@/components/Menu";
import { getClient } from "@/lib/actions/client.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const client = await getClient(userId);

  return (
    <div className="h-screen flex">
      <div className="w-[14%] md:w[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/assets/icons/butterfly-blue.svg"
            alt="Butterfly Logo"
            height={32}
            width={32}
          />
          <span className="hidden lg:block">Butterfly</span>
        </Link>
        <Menu userId={userId} clientId={client?.$id} />
      </div>
      <div className="w-[80%] md:[92%] lg:w-[84%] xl:w-[86%] bg-[#f2f3f5] overflow-scroll">
        <NavBar />
        <div className="p-4 flex gap-4 flex-col md:flex-row">
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="rounded-2xl bg-light-200 p-6 md:p-8 lg:p-12">
              <AppointmentForm
                userId={userId}
                clientId={client?.$id}
                type="create"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
