import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x relative overflow-hidden flex items-center justify-center">
      <section className="mb-12">
        <div>
          <br />
          <h1 className="header text-center text-light-200">A.M. Peralta</h1>
          <h4 className="header text-center text-light-200">
            Psychological Services
          </h4>
          <Image
            src="/assets/images/butterfly-logo.svg"
            alt="Butterfly Logo"
            width={200}
            height={200}
            className="mx-auto mt-8"
          />
          <br />
          <p className="text-white mt-4 mb-10 text-center">
            This is the start of your self-care journey.
          </p>
          <Button
            className="bg-white text-blue-300 w-full rounded-full hover:bg-white hover:text-blue-400"
            asChild
          >
            <Link href="/client/sign-up">Get Started</Link>
          </Button>
          <div className="text-center mt-6">
            <Link href="/login" className="text-light-200">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
