import { generateTrxId } from "@/lib/utils";
import { findCurrentUser } from "@/data/user";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { INTERNAL_SERVER_ERROR } from "@/error";

export const POST = async (req: NextRequest) => {
  try {
    const { walletNumber, amount, ps, password } = await req.json();
    console.log("Request data:", { walletNumber, amount, ps, password });

    const user: any = await findCurrentUser();
    if (!user)
      return Response.json({ message: "Authentication failed" }, { status: 401 });

    if (!user)
      return Response.json({ message: "Please Set a Withdraw password" }, { status: 400 });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch)
      return Response.json({ message: "Invalid withdraw password" }, { status: 401 });

    const trx_id = generateTrxId();

    const response = await fetch(`${process.env.DURANTA_API_URL}/ps/payout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "App-Key": process.env.DURANTA_APP_KEY || "",
        "APP-Secret": process.env.DURANTA_APP_SERECT || "",
      },
      body: JSON.stringify({
        invoice_no: trx_id,
        pay_type: ps.paymentSystem, // <-- FIXED
        wallet_number: walletNumber,
        amount: String(amount),
      }),
    });
    console.log("Duranta API Response:", response);
    if (!response.ok) {
      const text = await response.text();
      console.error("Duranta API Error:", text);
      return Response.json({ message: "Withdraw Failed from Duranta API" }, { status: 500 });
    }

    const paymentData = await response.json();
    console.log("Duranta Payment Response:", paymentData);

    if (!paymentData.status)
      return Response.json({ message: "Withdraw Failed from Duranta" }, { status: 500 });

    await db.aPayWithdraw.create({
      data: {
        orderId: String(paymentData.data.dp_payout_id),
        trxId: trx_id,
        ps: ps.paymentSystem,
        user: { connect: { id: user.id } },
      },
    });

    await db.wallet.update({
      where: { userId: user.id },
      data: { balance: { decrement: +amount } },
    });

    return Response.json({ payload: paymentData, success: true }, { status: 200 });

  } catch (error) {
    console.error("Withdraw Error:", error);
    return Response.json({ message: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
