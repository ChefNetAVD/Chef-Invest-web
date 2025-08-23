import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '../../services/payment/paymentService';
import { BlockchainService } from '../../services/blockchain/blockchainService';
import { NetworkType, PaymentStatus } from '../../types/usdtPayment';
import { PAYMENT_CONSTANTS } from '../../config/blockchain';

// Инициализируем сервисы
const blockchainService = new BlockchainService();
const paymentService = new PaymentService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, network } = body;

    // Валидация входных данных
    if (!userId || !amount || !network) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, network' },
        { status: 400 }
      );
    }

    if (!blockchainService.isNetworkSupported(network)) {
      return NextResponse.json(
        { error: `Unsupported network: ${network}` },
        { status: 400 }
      );
    }

    if (amount < PAYMENT_CONSTANTS.MIN_AMOUNT || amount > PAYMENT_CONSTANTS.MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Amount must be between ${PAYMENT_CONSTANTS.MIN_AMOUNT} and ${PAYMENT_CONSTANTS.MAX_AMOUNT} USDT` },
        { status: 400 }
      );
    }

    // Создаем платежный запрос
    const paymentRequest = paymentService.createPaymentRequest(userId, amount, network);

    return NextResponse.json({
      success: true,
      payment: paymentRequest
    });

  } catch (error) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const paymentId = searchParams.get('paymentId');
    const network = searchParams.get('network') as NetworkType;
    const status = searchParams.get('status') as PaymentStatus;

    // Получаем конкретный платеж
    if (paymentId) {
      const payment = paymentService.getPaymentRequest(paymentId);
      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ payment });
    }

    // Получаем платежи пользователя
    if (userId) {
      const payments = paymentService.getUserPaymentRequests(userId);
      return NextResponse.json({ payments });
    }

    // Получаем статистику
    if (searchParams.get('stats') === 'true') {
      const stats = paymentService.getPaymentStats();
      return NextResponse.json({ stats });
    }

    // Получаем балансы сетей
    if (searchParams.get('balances') === 'true') {
      const balances = await blockchainService.getAllNetworkBalances();
      return NextResponse.json({ balances });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, transactionHash } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentId, status' },
        { status: 400 }
      );
    }

    // Обновляем статус платежа
    const success = paymentService.updatePaymentStatus(paymentId, status, {
      transactionHash,
      updatedAt: new Date()
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 