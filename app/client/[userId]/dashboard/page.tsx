import Image from "next/image";
import Link from "next/link";
import Menu from "@/../components/Menu";
import NavBar from "@/../components/NavBar";
import ClientPage from "@/../components/client/ClientPage";

const ClientDashboard = () => {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/assets/icons/butterfly-logo-round.svg"
            alt="Butterfly Logo"
            height={32}
            width={32}
          />
          <span className="hidden lg:block">Butterfly</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
        <NavBar />
        <ClientPage />
      </div>
    </div>
  );
};

export default ClientDashboard;
