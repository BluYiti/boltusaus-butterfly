import SignUpForm from "@/components/forms/SignUpForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="flex-center">
            <Image
              src="/assets/icons/butterfly-logo-round.svg"
              alt="client"
              height={200}
              width={200}
            />
          </div>
          
          <SignUpForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Butterfly
            </p>
            <Link href="/?admin=true" className="text-blue-400">
              Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
