import { NextResponse } from 'next/server';
import { createErpNextLead } from '@/lib/erpnext';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createErpNextLead({
      lead_name: body.name || body.organisation || 'Website contact enquiry',
      company_name: body.organisation,
      email_id: body.email,
      mobile_no: body.phone,
      source: 'Website',
      status: 'Lead',
      custom_enquiry_type: body.enquiry_type,
      notes: body.message,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Could not submit contact enquiry' }, { status: 500 });
  }
}
