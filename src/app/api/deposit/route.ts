/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import axios from "axios";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { generateTrxId } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
  try {
    const { amount, ps } = await req.json();

    if (!amount || !ps?.paymentSystem) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    const user: any = await findCurrentUser();
    if (!user) {
      return Response.json({ message: "Authentication failed" }, { status: 401 });
    }

    const trx_id = generateTrxId();

    // Axios request
    const { data: paymentData } = await axios.post(
      `${process.env.DURANTA_API_URL}/ps/transaction/create`,
      {
        invoice_no: trx_id,
        amount: amount.toString(),
        paymentType: ps.paymentSystem,
      },
      {
        headers: {
          Accept: "application/json",
          "App-Key": process.env.DURANTA_APP_KEY || "",
          "APP-Secret": process.env.DURANTA_APP_SERECT || "",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(paymentData);


    if (!paymentData.success) {
      return Response.json({ message: "Deposit Failed" }, { status: 500 });
    }
    
    // const { data } = paymentData
    // await db.aPayDeposit.create({
    //   data: {
    //     orderId: String(data.dp_transaction_id),
    //     trxId: trx_id,
    //     ps: ps.paymentSystem,
    //     user: {
    //       connect: { id: user.id },
    //     },
    //   },
    // });

    return Response.json({ payload: paymentData, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ message: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
