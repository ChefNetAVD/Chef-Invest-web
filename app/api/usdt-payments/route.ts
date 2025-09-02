import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '../../services/payment/paymentService';
import { BlockchainService } from '../../services/blockchain/blockchainService';
import { NetworkType, PaymentStatus } from '../../types/usdtPayment';
import { PAYMENT_CONSTANTS } from '../../config/blockchain';
import { requireAuth, getUserFromRequest } from '../../middleware/auth';

// Инициализируем сервисы
const blockchainService = new BlockchainService();
const paymentService = new PaymentService();

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { amount, network } = body;
    const user = getUserFromRequest(request);

    // Валидация входных данных
    if (!amount || !network) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, network' },
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
    const paymentRequest = paymentService.createPaymentRequest(user.userId, amount, network);

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
});

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const user = getUserFromRequest(request);
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
    const payments = paymentService.getUserPaymentRequests(user.userId);
    return NextResponse.json({ payments });

    // Получаем статистику (только для админов)
    if (searchParams.get('stats') === 'true' && user.role === 'admin') {
      const stats = paymentService.getPaymentStats();
      return NextResponse.json({ stats });
    }

    // Получаем балансы сетей (только для админов)
    if (searchParams.get('balances') === 'true' && user.role === 'admin') {
      const balances = await blockchainService.getAllNetworkBalances();
      return NextResponse.json({ balances });
    }

  } catch (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { paymentId, status, transactionHash, action } = body;
    const user = getUserFromRequest(request);

    // Обработка подтвержденных платежей (только для админов)
    if (action === 'processConfirmed' && user.role === 'admin') {
      try {
        const processedCount = await paymentService.processAllConfirmedPayments();
        return NextResponse.json({ 
          success: true, 
          processedCount,
          message: `Successfully processed ${processedCount} confirmed payments`
        });
      } catch (error) {
        console.error('Error processing confirmed payments:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to process payments',
            processedCount: 0
          },
          { status: 500 }
        );
      }
    }

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
}); 