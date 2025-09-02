import { NextRequest, NextResponse } from 'next/server';
import { TradingSystem } from '../../utils/tradingSystem';
import { 
  generateReferralLink, 
  extractReferrerId, 
  validateReferrerId,
  processReferralRegistration,
  getReferralStats,
  getReferralList,
  isActivePartner
} from '../../utils/referral';
import { requireAuth, getUserFromRequest } from '../../middleware/auth';

// Инициализируем торговую систему
const tradingSystem = new TradingSystem();

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const user = getUserFromRequest(request);
    const action = searchParams.get('action');

    // Получение реферальной статистики
    if (action === 'stats') {
      const stats = getReferralStats(user.userId, tradingSystem);
      if (!stats) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ stats });
    }

    // Получение списка рефералов
    if (action === 'list') {
      const referralList = getReferralList(user.userId, tradingSystem);
      return NextResponse.json({ referralList });
    }

    // Генерация реферальной ссылки
    if (action === 'link') {
      const referralLink = generateReferralLink(user.userId);
      return NextResponse.json({ referralLink });
    }

    // Проверка активности партнера
    if (action === 'active') {
      const isActive = isActivePartner(user.userId, tradingSystem);
      return NextResponse.json({ isActive });
    }

    // Получение полной информации о рефералах
    const stats = getReferralStats(user.userId, tradingSystem);
    const referralList = getReferralList(user.userId, tradingSystem);
    const referralLink = generateReferralLink(user.userId);
    const isActive = isActivePartner(user.userId, tradingSystem);

    return NextResponse.json({
      stats,
      referralList,
      referralLink,
      isActive
    });

  } catch (error) {
    console.error('Error in referrals API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action, newUserId, referrerId, url } = body;

    // Обработка регистрации с рефералом
    if (action === 'register') {
      if (!newUserId || !referrerId) {
        return NextResponse.json(
          { error: 'Missing required parameters: newUserId, referrerId' },
          { status: 400 }
        );
      }

      const success = processReferralRegistration(newUserId, referrerId, tradingSystem);
      
      if (success) {
        return NextResponse.json({ 
          success: true,
          message: 'Referral registration successful'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to process referral registration' },
          { status: 400 }
        );
      }
    }

    // Извлечение реферера из URL
    if (action === 'extract') {
      if (!url) {
        return NextResponse.json(
          { error: 'Missing required parameter: url' },
          { status: 400 }
        );
      }

      const referrerId = extractReferrerId(url);
      
      if (referrerId) {
        const isValid = validateReferrerId(referrerId, tradingSystem);
        return NextResponse.json({
          referrerId,
          isValid,
          referralLink: generateReferralLink(referrerId)
        });
      } else {
        return NextResponse.json({
          referrerId: null,
          isValid: false,
          error: 'No referrer ID found in URL'
        });
      }
    }

    // Валидация реферального ID
    if (action === 'validate') {
      if (!referrerId) {
        return NextResponse.json(
          { error: 'Missing required parameter: referrerId' },
          { status: 400 }
        );
      }

      const isValid = validateReferrerId(referrerId, tradingSystem);
      const referralLink = isValid ? generateReferralLink(referrerId) : null;

      return NextResponse.json({
        referrerId,
        isValid,
        referralLink
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in referrals API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}); 