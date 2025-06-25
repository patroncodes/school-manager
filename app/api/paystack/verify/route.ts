import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
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
      return NextResponse.json(
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
      return NextResponse.json(
        {
          status: false,
          message: data.message || "Transaction verification failed",
        },
        { status: response.status },
      );
    }

    if (data.status && data.data?.status === "success") {
      try {
        const student = await prisma.student.findFirst({
          where: { parentId: data.data.metadata.user_id },
          select: { id: true },
        });

        if (!student)
          return NextResponse.json({
            status: false,
            message: "Student Not Found",
          });

        const existing = await prisma.transaction.findFirst({
          where: { reference: data.data.reference },
          select: { reference: true },
        });

        if (existing?.reference) {
          return NextResponse.json({
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
            studentId: student?.id,
          },
        });

        return NextResponse.json({
          status: true,
          message: "Transaction verified and recorded",
          data: data.data,
        });
      } catch (error) {
        console.error("Database save error:", error);
        return NextResponse.json(
          { status: false, message: "Transaction verified, but saving failed" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json({
        status: false,
        message: "Transaction verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
