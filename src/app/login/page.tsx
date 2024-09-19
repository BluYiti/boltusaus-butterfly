import React from "react";
import Image from "next/image";
import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x relative overflow-hidden flex items-center justify-center">
      <section className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <div className="w-1/2">
            <Image
              src="/assets/images/butterfly-logo.svg"
              alt="Butterfly Logo"
              width={200}
              height={200}
              className="mx-auto mt-8"
            />
            <br />
            <h1 className="header text-center text-light-200">A.M. Peralta</h1>
            <h4 className="header text-center text-light-200">
              Psychological Services
            </h4>
            <br />
            <p className="text-white mt-4 mb-10 text-center">
              This is the start of your self-care journey.
            </p>
          </div>
          <div className="w-1/2">
            <LoginForm />
            <div className="flex justify-center mt-4">
              <Link href="/forgot-password" className="text-light-200">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="bubble-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
      </div>
    </div>
  );
};

export default Login;
