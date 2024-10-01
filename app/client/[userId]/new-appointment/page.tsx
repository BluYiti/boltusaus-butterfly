import AppointmentForm from "@/../components/forms/AppointmentForm";
import { getClient } from "@/../lib/actions/client.actions";
import Image from "next/image";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const client = await getClient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/butterfly-logo-full.svg"
            height={1000}
            width={1000}
            alt="client"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            userId={userId}
            clientId={client?.$id}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 Butterfly</p>
        </div>
      </section>
    </div>
  );
}
