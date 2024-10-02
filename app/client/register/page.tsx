import RegisterForm from "@/../components/forms/RegisterForm";
import { getUser } from "@/../lib/actions/client.actions";
import Image from "next/image";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col">
          <Image
            src="/assets/icons/butterfly-logo-full.svg"
            height={1000}
            width={1000}
            alt="client"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">
            © 2024 Butterfly
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;
