import { paymentSystemsLogos } from "@/data/paymentWallet";
import { INTERNAL_SERVER_ERROR } from "@/error";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const GET = async () => {
  try {
    const paymentSystemsData = await fetch(
      `${process.env.DURANTA_API_URL}/ps/transaction/method/available`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "App-Key": process.env.DURANTA_APP_KEY || "",
          "APP-Secret": process.env.DURANTA_APP_SERECT || "",
        }
      }
    );

    if (!paymentSystemsData.ok) {
      throw Error;
    }

    let paymentSystemsPayload = await paymentSystemsData.json();

    paymentSystemsPayload = paymentSystemsPayload.data.map(
      (paymentSystem: any) => {
        const logo = paymentSystemsLogos.find(
          (logo) => logo.name == paymentSystem
        );
        return {
          paymentSystem,
          image: logo?.image,
          label: logo?.label,
        };
      }
    );

    console.log(paymentSystemsPayload);

    return Response.json(
      { payload: { wallets: paymentSystemsPayload }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};