import { NextResponse } from 'next/server';
import { getBankConnections, createBankConnection } from '@/services/bank.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function GET() {
  try {
    const connections = await getBankConnections();
    return NextResponse.json(createSuccessResponse(connections));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bank_name, account_number, account_type } = body;

    if (!bank_name || !account_number || !account_type) {
      return NextResponse.json(
        createErrorResponse('Nom de banque, numéro de compte et type requis'),
        { status: 400 }
      );
    }

    const connection = await createBankConnection(
      bank_name,
      account_number,
      account_type
    );

    return NextResponse.json(createSuccessResponse(connection), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
