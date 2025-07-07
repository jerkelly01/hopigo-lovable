import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  template: string;
  data: Record<string, any>;
}

const emailTemplates = {
  welcome: {
    subject: "Welcome to HopiGo!",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Welcome to HopiGo, ${data.name}!
        </h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for joining HopiGo, Aruba's premier multi-service platform. 
          We're excited to have you on board!
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">What you can do with HopiGo:</h3>
          <ul style="color: #555;">
            <li>Book rides and transportation services</li>
            <li>Access lifestyle and home services</li>
            <li>Purchase event tickets</li>
            <li>Manage your digital wallet</li>
            <li>Earn loyalty points and rewards</li>
          </ul>
        </div>
        <p style="font-size: 16px; color: #555;">
          Get started by exploring our services and completing your profile.
        </p>
        <a href="${data.loginUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Get Started
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #888;">
          Need help? Contact us at <a href="mailto:support@hopigo.com">support@hopigo.com</a>
        </p>
      </div>
    `
  },
  
  booking_confirmation: {
    subject: "Booking Confirmed - HopiGo",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
          Booking Confirmed!
        </h1>
        <p style="font-size: 16px; color: #555;">Hi ${data.customerName},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Your booking has been confirmed. Here are the details:
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Booking Details</h3>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date:</strong> ${data.bookingDate}</p>
          <p><strong>Time:</strong> ${data.bookingTime}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Total Amount:</strong> AWG ${data.totalAmount}</p>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          You will receive a reminder 24 hours before your appointment.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #888;">
          Questions about your booking? Contact us at <a href="mailto:support@hopigo.com">support@hopigo.com</a>
        </p>
      </div>
    `
  },

  password_reset: {
    subject: "Reset Your Password - HopiGo",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
          Password Reset Request
        </h1>
        <p style="font-size: 16px; color: #555;">Hi ${data.name},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We received a request to reset your password for your HopiGo account.
        </p>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-weight: bold; color: #856404;">
            Click the button below to reset your password:
          </p>
        </div>
        <a href="${data.resetUrl}" style="display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #666;">
          This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #888;">
          For security questions, contact us at <a href="mailto:security@hopigo.com">security@hopigo.com</a>
        </p>
      </div>
    `
  },

  payment_receipt: {
    subject: "Payment Receipt - HopiGo",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Payment Receipt
        </h1>
        <p style="font-size: 16px; color: #555;">Hi ${data.customerName},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for your payment. Here's your receipt:
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Payment Details</h3>
          <p><strong>Amount:</strong> AWG ${data.amount}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Date:</strong> ${data.paymentDate}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          Keep this receipt for your records.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #888;">
          Questions about this payment? Contact us at <a href="mailto:billing@hopigo.com">billing@hopigo.com</a>
        </p>
      </div>
    `
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, template, data }: EmailRequest = await req.json();

    if (!to || !template || !emailTemplates[template as keyof typeof emailTemplates]) {
      return new Response(
        JSON.stringify({ error: "Invalid request. Missing to, template, or template not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailTemplate = emailTemplates[template as keyof typeof emailTemplates];
    
    const emailResponse = await resend.emails.send({
      from: "HopiGo <noreply@hopigo.com>",
      to: [to],
      subject: emailTemplate.subject,
      html: emailTemplate.html(data),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);