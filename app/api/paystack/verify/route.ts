import prisma from "@/lib/prisma";
import { PaystackVerifyResponse } from "@/types";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return Response.json(
        {
          status: false,
          message: "Transaction reference is required",
        },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("PSK missing");
      return Response.json(
        {
          status: false,
          message: "Payment service configuration error",
        },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data: PaystackVerifyResponse = await response.json();

    if (!response.ok) {
      console.error("Paystack Verification Error:", data);
      return Response.json(
        {
          status: false,
          message: data.message || "Transaction verification failed",
        },
        { status: response.status },
      );
    }

    if (data.status && data.data?.status === "success") {
      try {
        const existing = await prisma.transaction.findFirst({
          where: { reference: data.data.reference },
          select: { reference: true },
        });

        if (existing?.reference) {
          return Response.json({
            status: true,
            message: "Transaction already recorded",
            data: existing,
          });
        }

        await prisma.transaction.create({
          data: {
            amount: data.data.amount / 100,
            reference: data.data.reference,
            feeId: parseInt(data.data.metadata.fee_id),
            studentId: data.data.metadata.student_id,
            type: data.data.metadata.type,
            extraDescription: data.data.metadata.extraDescription,
          },
        });

        return Response.json({
          status: true,
          message: "Transaction verified and recorded",
          data: data.data,
        });
      } catch (error) {
        console.error("Database save error:", error);
        return Response.json(
          { status: false, message: "Transaction verified, but saving failed" },
          { status: 500 },
        );
      }
    } else {
      return Response.json({
        status: false,
        message: "Transaction verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    return Response.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
