import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { requireAuth, getUserFromRequest } from '../../../middleware/auth';

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = getUserFromRequest(request);

    // Только админы могут просматривать статистику токенов
    if (user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Access denied. Admin role required.' 
        },
        { status: 403 }
      );
    }

    // Получаем статистику токенов
    const tokenStats = userService.getTokenStats();
    const userStats = userService.getUserStats();

    return NextResponse.json({
      success: true,
      stats: {
        tokens: tokenStats,
        users: userStats,
      }
    });

  } catch (error) {
    console.error('Token stats error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get token statistics' 
      },
      { status: 500 }
    );
  }
});
