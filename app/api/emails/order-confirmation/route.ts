import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, orderNumber, orderDate, items, total } = body;

    if (!customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Pattern Pioneer <orders@patternpioneerstudio.com>',
      to: [customerEmail],
      subject: `Order Confirmation - ${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName,
        orderNumber,
        orderDate,
        items,
        total,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
