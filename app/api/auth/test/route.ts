import { NextRequest, NextResponse } from 'next/server';
import { runAuthSystemTests } from '../../../utils/testAuthSystem';
import { runEmailSystemTests } from '../../../utils/testEmailSystem';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Running complete authentication system tests...');
    
    // Тестируем основную систему аутентификации
    await runAuthSystemTests();
    
    // Тестируем email систему
    await runEmailSystemTests();
    
    return NextResponse.json({
      success: true,
      message: 'All authentication and email system tests passed successfully!',
      tests: [
        'Authentication system',
        'Email verification',
        'Password reset',
        'Token validation',
        'Rate limiting'
      ]
    });

  } catch (error) {
    console.error('❌ Authentication tests failed:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Authentication tests failed'
      },
      { status: 500 }
    );
  }
}
