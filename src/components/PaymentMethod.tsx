/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React from "react";

interface PaymentMethodsPros {
  methods: any;
  selectedPaymentMethod: any;
  onClick: () => void;
}

const PaymentMethod = ({
  methods,
  selectedPaymentMethod,
  onClick,
}: PaymentMethodsPros) => {

  return (
    <button
      className={`flex-shrink-0 mx-1 cursor-pointer whitespace-nowrap`}
      onClick={() => onClick()}
    >
      <div
        className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center p-3 transition-all ${
          selectedPaymentMethod?.paymentSystem === methods.paymentSystem
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Image
          src={methods.image}
          width={40}
          height={30}
          unoptimized
          alt={methods.label}
          className="w-[40px] h-auto"
        />
        <span
          className={`mt-2 text-sm font-medium ${
            selectedPaymentMethod?.name === methods.name
              ? "text-blue-600"
              : "text-gray-700"
          }`}
        >
          {methods.label}
        </span>
      </div>
    </button>
  );
};

export default React.memo(PaymentMethod);
