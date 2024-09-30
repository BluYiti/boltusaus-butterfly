import SignUpForm from "@/components/forms/SignUpForm";
import Image from "next/image";

export default function SignUp() {
  return (
    <div className="flex h-screen max-h-screen justify-center items-center">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[496px]">
          <div className="flex-center">
            <Image
              src="/assets/icons/butterfly-logo-round.svg"
              alt="client"
              height={250}
              width={250}
            />
          </div>

          <SignUpForm />

          <div className="text-14-regular mt-20 flex justify-center">
            <p className="text-dark-600">&copy; 2024 Butterfly</p>
          </div>
        </div>
      </section>
    </div>
  );
}
