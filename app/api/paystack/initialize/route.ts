import { type NextRequest, NextResponse } from "next/server";

interface PaystackInitializeRequest {
  email: string;
  amount: string | number;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaystackInitializeRequest = await request.json();

    if (!body.email || !body.amount) {
      return NextResponse.json(
        {
          status: false,
          message: "Email and amount are required",
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid email format",
        },
        { status: 400 },
      );
    }

    // Validate amount (should be in kobo for Paystack)
    const amount =
      typeof body.amount === "string"
        ? Number.parseInt(body.amount)
        : body.amount;
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Amount must be a positive number",
        },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("Secret is missing");
      return NextResponse.json(
        {
          status: false,
          message: "Payment service configuration error",
        },
        { status: 500 },
      );
    }

    const payload = {
      email: body.email,
      amount: amount.toString(),
      ...(body.reference && { reference: body.reference }),
      ...(body.callback_url && { callback_url: body.callback_url }),
      ...(body.metadata && { metadata: body.metadata }),
    };

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data: PaystackResponse = await response.json();

    if (!response.ok) {
      console.error("Paystack API Error:", data);
      return NextResponse.json(
        {
          status: false,
          message: data.message || "Payment initialization failed",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      status: true,
      message: "Transaction initialized successfully",
      data: data.data,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 },
      );
    }

    // Handle network or other errors
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      status: false,
      message: "Method not allowed. Use POST to initialize transactions.",
    },
    { status: 405 },
  );
}
