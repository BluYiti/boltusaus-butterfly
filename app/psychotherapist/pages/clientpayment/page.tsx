'use client';

import React from "react";
import { useRouter } from 'next/navigation'; // for handling navigation
import Sidebar from "@/psychotherapist/components/SideBar";

// PaymentHistory Component
const ClientPayment: React.FC = () => {
  const router = useRouter(); // for navigation

  return (
    <div>
      <Sidebar></Sidebar>
    </div>
  );
};

export default ClientPayment;
