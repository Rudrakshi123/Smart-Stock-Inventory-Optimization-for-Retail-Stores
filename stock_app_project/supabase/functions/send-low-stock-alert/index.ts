import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LowStockItem {
  productName: string;
  sku: string;
  storeName: string;
  currentStock: number;
  minStock: number;
  suggestedReorder: number;
  daysUntilStockout: number;
}

interface AlertEmailRequest {
  recipientEmail: string;
  recipientName: string;
  alerts: LowStockItem[];
}

const getSeverityColor = (days: number) => {
  if (days <= 2) return "#ef4444"; // red
  if (days <= 5) return "#f59e0b"; // amber
  return "#6b7280"; // gray
};

const getSeverityLabel = (days: number) => {
  if (days <= 2) return "CRITICAL";
  if (days <= 5) return "WARNING";
  return "LOW";
};

const generateEmailHtml = (recipientName: string, alerts: LowStockItem[]) => {
  const criticalCount = alerts.filter(a => a.daysUntilStockout <= 2).length;
  const warningCount = alerts.filter(a => a.daysUntilStockout > 2 && a.daysUntilStockout <= 5).length;

  const alertRows = alerts.map(alert => {
    const color = getSeverityColor(alert.daysUntilStockout);
    const label = getSeverityLabel(alert.daysUntilStockout);
    
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 2px 8px; background-color: ${color}20; color: ${color}; font-size: 10px; font-weight: 600; border-radius: 4px; margin-right: 8px;">
            ${label}
          </span>
          <strong>${alert.productName}</strong>
          <br><span style="color: #6b7280; font-size: 12px;">${alert.sku}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
          ${alert.storeName}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="font-weight: 600; color: ${alert.currentStock < alert.minStock ? '#ef4444' : '#111827'};">
            ${alert.currentStock}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          ${alert.minStock}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="font-weight: 600; color: #0d9488;">${alert.suggestedReorder}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="font-weight: 600; color: ${color};">${alert.daysUntilStockout} days</span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
              ⚠️ Low Stock Alert
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">
              SmartStock Inventory System
            </p>
          </div>

          <!-- Summary -->
          <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; color: #374151;">
              Hi <strong>${recipientName}</strong>,
            </p>
            <p style="margin: 0 0 16px 0; color: #374151;">
              The following products require immediate attention due to low stock levels:
            </p>
            
            <div style="display: flex; gap: 16px;">
              ${criticalCount > 0 ? `
                <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; text-align: center;">
                  <div style="font-size: 28px; font-weight: 700; color: #ef4444;">${criticalCount}</div>
                  <div style="font-size: 12px; color: #991b1b; text-transform: uppercase; font-weight: 600;">Critical</div>
                </div>
              ` : ''}
              ${warningCount > 0 ? `
                <div style="flex: 1; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; text-align: center;">
                  <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">${warningCount}</div>
                  <div style="font-size: 12px; color: #92400e; text-transform: uppercase; font-weight: 600;">Warning</div>
                </div>
              ` : ''}
              <div style="flex: 1; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #374151;">${alerts.length}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Total Alerts</div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Product</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Store</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Current</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Min</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Order Qty</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Days Left</th>
                </tr>
              </thead>
              <tbody>
                ${alertRows}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              Take action now to prevent stockouts and lost sales.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              This is an automated alert from SmartStock Inventory System.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, alerts }: AlertEmailRequest = await req.json();

    console.log(`Sending low stock alert email to ${recipientEmail}`);
    console.log(`Number of alerts: ${alerts.length}`);

    if (!recipientEmail || !alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: recipientEmail and alerts" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const criticalCount = alerts.filter(a => a.daysUntilStockout <= 2).length;
    const subject = criticalCount > 0 
      ? `🚨 URGENT: ${criticalCount} Critical Low Stock Alert${criticalCount > 1 ? 's' : ''}`
      : `⚠️ Low Stock Alert: ${alerts.length} product${alerts.length > 1 ? 's' : ''} need attention`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SmartStock <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: subject,
        html: generateEmailHtml(recipientName || "Manager", alerts),
      }),
    });

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending low stock alert email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
