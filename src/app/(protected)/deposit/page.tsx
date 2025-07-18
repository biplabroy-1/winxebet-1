/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useGetCurrentUser from "@/hook/useCurrentUser";
import {
  useGetDepositPaymentDataQuery,
  useMakeDepositeMutation,
} from "@/lib/features/depositApiSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineSupportAgent, MdHistory } from "react-icons/md";
import { CiWallet } from "react-icons/ci";
import { formatBDT } from "@/lib/utils";
import { CiGift } from "react-icons/ci";
import { PulseLoader } from "react-spinners";
import PageLoader from "@/components/loader/PageLoader";

import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR } from "@/error";
import SiteHeader from "@/components/SiteHeader";
import PaymentMethod from "@/components/PaymentMethod";

const App: React.FC = () => {
  const { data, isLoading } = useGetDepositPaymentDataQuery();
  const wallets = data?.wallets;
  const bonus = data?.bonus;

  const user: any = useGetCurrentUser();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>();
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [walletNumber, setWalletNumber] = useState("");
  const [selectedBonus, setSelectedBonus] = useState<{
    id: string;
    label: string;
    value: number;
    disable: boolean;
  }>({ id: "none", label: "No Bonus", value: 0, disable: false });

  const [selectedAmountButton, setSelectedAmountButton] = useState<
    number | null
  >();
  const quickAmounts = [400, 500, 800, 1000, 1500, 2000, 5000, 10000, 25000];

  const [error, setError] = useState("");
  const [pending, setTrasition] = useState(false);

  const [bonusOptions, setBonusOptions] = useState<
    {
      id: string;
      label: string;
      value: number;
      disable: boolean;
    }[]
  >([
    {
      id: "signinBonus",
      label: "First Deposit Bonus",
      value: 0,
      disable: true,
    },
    {
      id: "referralBonus",
      label: "Refer Bonus",
      disable: true,
      value: 0,
    },
    {
      id: "none",
      label: "No Bonus",
      value: 0,
      disable: false,
    },
  ]);
  const handleAmountButtonClick = (amount: number) => {
    setSelectedAmountButton(amount);
    setDepositAmount(amount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
    setSelectedAmountButton(null);
  };

  const handleWalletNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletNumber(e.target.value);
  };

  const calculateBonus = (amount: number) => {
    if (!selectedBonus) {
      return 0;
    }
    return Math.round((amount * selectedBonus!.value) / 100);
  };

  const [makeDeposit] = useMakeDepositeMutation();

  const handleSubmitt = () => {
    setTrasition(true);
    if (!depositAmount || +depositAmount < 0) {
      setError("Please Enter a amount");
      setTrasition(false);
      return 0;
    }

    if (+depositAmount < +selectedPaymentMethod.min_deposit) {
      setError(`Minimum Deposit ${selectedPaymentMethod.min_deposit}`);
      setTrasition(false);
      return 0;
    }
    if (+depositAmount > +selectedPaymentMethod.max_deposit) {
      setError(`Maximum Deposit ${selectedPaymentMethod.max_deposit}`);
      setTrasition(false);
      return 0;
    }
    if (!walletNumber) {
      setError("Please Enter wallet number");
      setTrasition(false);
      return 0;
    }

    makeDeposit({
      amount: +depositAmount + +bonusAmount,
      account_number: walletNumber,
      ps: selectedPaymentMethod,
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          console.log({ res });
          setTrasition(false);
          window.location.href = res.payload.data.paymentpage_url;
        }
      })
      .catch((error: any) => {
        console.log({ error });
        if (error?.data?.error) {
          toast.error(error.data.error);
        } else {
          toast.error(INTERNAL_SERVER_ERROR);
        }
        setTrasition(false);
      });
  };

  const totalAmount = parseFloat(depositAmount) || 0;
  const bonusAmount = calculateBonus(totalAmount);
  const grandTotal = totalAmount + bonusAmount;

  const isValidAmount = totalAmount >= 100 && totalAmount <= 50000;

  useEffect(() => {
    if (wallets) {
      setSelectedPaymentMethod(wallets[0]);
    }
  }, [wallets]);

  useEffect(() => {
    if (bonus && user) {
      let isSignBonusActive = false;
      let isReferBonusActive = false;
      if (bonus.signinBonus > 0 && user.wallet?.signinBonus) {
        isSignBonusActive = true;
      }
      if (bonus.referralBonus > 0 && user.wallet?.referralBonus) {
        isReferBonusActive = true;
      }

      setBonusOptions((state) => {
        let newState = [...state];
        if (isSignBonusActive) {
          const index = newState.findIndex((s) => s.id == "signinBonus");
          newState[index].disable = false;
        }
        if (isReferBonusActive) {
          const index = newState.findIndex((s) => s.id == "referralBonus");
          newState[index].disable = false;
        }
        newState = newState.map((state) => {
          if (state.id == "signinBonus") {
            return { ...state, value: bonus.signinBonus };
          } else if (state.id == "referralBonus") {
            return { ...state, value: bonus.referralBonus };
          } else {
            return state;
          }
        });
        return newState;
      });
    }
  }, [user, bonus]);

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [depositAmount]);

  useEffect(() => {
    if (quickAmounts.find((a) => a == +depositAmount)) {
      setSelectedAmountButton(+depositAmount);
    }
  }, [depositAmount]);

  useEffect(() => {
    console.log({ selectedPaymentMethod });
  }, [selectedPaymentMethod]);

  return (
    <>
      {data && !isLoading && user && (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}

          <SiteHeader title="Deposit">
            <Link
              href="/support"
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <MdOutlineSupportAgent className="text-lg" />
            </Link>
            <Link
              href="/history"
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <MdHistory className="text-lg" />
            </Link>
          </SiteHeader>
          <main className=" w-full px-4 py-6 space-y-6">
            {/* Payment Methods */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Payment Method
              </h2>
              <div className="flex overflow-x-auto pb-2 -mx-1 hide-scrollbar">
                <div
                  className={`flex-shrink-0 mx-1 cursor-pointer whitespace-nowrap`}
                >
                  <div
                    className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center p-3 transition-all ${"border-gray-200 "}`}
                  >
                    <CiWallet className="text-2xl text-gray-600" />
                    <span
                      className={`mt-2 text-sm font-medium ${"text-gray-700"}`}
                    >
                      e-Wallet
                    </span>
                  </div>
                </div>

                {wallets?.map((pw, i) => (
                  <PaymentMethod
                    key={i}
                    method={pw}
                    selectedPaymentMethod={selectedPaymentMethod!}
                    onClick={() => setSelectedPaymentMethod(pw)}
                  />
                ))}
              </div>
            </section>

            {/* Guide Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-yellow-500"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      • Deposits are typically processed within 5-30 minutes
                    </p>
                    <p>
                      • Make sure to use an account registered under your name
                    </p>
                    <p>• Contact customer support if you face any issues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Deposit Amount
              </h2>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">BDT</span>
                </div>
                <input
                  disabled={pending}
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Deposit amount"
                  value={depositAmount}
                  onChange={handleAmountChange}
                />
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+88</span>
                </div>
                <input
                  disabled={pending}
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Wallet Number"
                  value={walletNumber}
                  onChange={handleWalletNumberChange}
                />
              </div>

              {error && <span className="text-sm text-red-700 ">{error}</span>}
              <div className="text-sm text-gray-600 mb-4 flex justify-between">
                <span>
                  Min:
                  {formatBDT(
                    selectedPaymentMethod
                      ? +selectedPaymentMethod.min_deposit
                      : 0
                  )}
                </span>
                <span>
                  Max:{" "}
                  {formatBDT(
                    selectedPaymentMethod
                      ? +selectedPaymentMethod!.max_deposit
                      : 0
                  )}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
                {quickAmounts.map((item) => (
                  <button
                    disabled={pending}
                    key={item}
                    onClick={() => handleAmountButtonClick(item)}
                    className={`relative py-1 px-3 border rounded-lg text-center cursor-pointer whitespace-nowrap !rounded-button ${
                      selectedAmountButton === item
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">{item} BDT</div>
                    {selectedBonus.value > 0 && (
                      <div className="text-xs text-white font-medium absolute flex items-center -top-[25%] -right-2 bg-blue-700 rounded-md">
                        + {(item * selectedBonus.value) / 100}{" "}
                        <CiGift className="text-xs" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Bonus Selection */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Select Bonus
              </h2>

              <div className="space-y-3">
                {bonusOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer whitespace-nowrap !rounded-button ${
                      option.disable
                        ? "opacity-50 cursor-not-allowed"
                        : selectedBonus!.id === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      !option.disable && !pending && setSelectedBonus(option)
                    }
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedBonus!.id === option.id
                            ? "border-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedBonus!.id === option.id && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.id == "signinBonus" &&
                          `Get ${option.value}% extra on your first deposit`}
                        {option.id == "referralBonus" &&
                          `${option.value}% Bonus from referral`}
                        {option.id == "none" && `Proceed without any bonus`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Summary
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Amount:</span>
                  <span className="font-medium">
                    {totalAmount.toLocaleString()} BDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus Amount:</span>
                  <span className="font-medium text-green-600">
                    +{bonusAmount.toLocaleString()} BDT
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Total:</span>
                    <span className="font-bold text-lg">
                      {grandTotal.toLocaleString()} BDT
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Button */}
            <button
              className={`w-full py-4 px-6 rounded-lg font-medium text-white text-lg shadow-sm cursor-pointer whitespace-nowrap !rounded-button ${
                isValidAmount
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isValidAmount || pending}
              onClick={handleSubmitt}
            >
              {pending ? (
                <PulseLoader size={12} color="#fff" />
              ) : (
                "Process Deposit"
              )}
            </button>
          </main>
        </div>
      )}

      {(!data || isLoading || !user) && <PageLoader />}
    </>
  );
};

export default App;
