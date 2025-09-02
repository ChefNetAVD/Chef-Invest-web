import { Logo } from '../ui/Logo';

export function Header() {
  return (
    <header style={{
      /* Frame 1000 */
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      gap: '16px',
      
      position: 'absolute',
      height: '84px',
      left: '0%',
      right: '0%',
      top: '0px',
      width: '100%',
      
      background: 'rgba(57, 16, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      boxSizing: 'border-box'
    }}>
      {/* Logo */}
      <div style={{ 
        flex: 'none',
        order: 0,
        flexGrow: 0
      }}>
        <Logo />
      </div>
      
      {/* Navigation - Frame 1001 */}
      <nav style={{
        /* Frame 1001 */
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        
        height: '32px',
        
        flex: '1 1 auto',
        order: 1,
        minWidth: '900px'
      }}>
        {/* Component 26 */}
        <div style={{
          /* Component 26 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '68px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 0,
          flexGrow: 0,
          margin: '0px 4px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '68px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '44px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Фишки
            </span>
          </button>
        </div>
        
        {/* Component 113 */}
        <div style={{
          /* Component 113 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '62px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 1,
          flexGrow: 0,
          margin: '0px 4px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '62px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '38px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              О нас
            </span>
          </button>
        </div>
        
        {/* Component 114 */}
        <div style={{
          /* Component 114 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '189px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 2,
          flexGrow: 0,
          margin: '0px 4px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '189px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '165px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Реферальная программа
            </span>
          </button>
        </div>
        
        {/* Component 115 */}
        <div style={{
          /* Component 115 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '129px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 3,
          flexGrow: 0,
          margin: '0px 8px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '129px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '105px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Этапы развития
            </span>
          </button>
        </div>
        
        {/* Component 116 */}
        <div style={{
          /* Component 116 */
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px',
          
          width: '137px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 4,
          flexGrow: 0,
          margin: '0px 8px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '137px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transform: 'translateY(-1px)',
            position: 'relative'
          }}>
            <span style={{
              /* Text */
              width: '113px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Почему ChefNet?
            </span>
          </button>
        </div>
        
        {/* Component 117 */}
        <div style={{
          /* Component 117 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '129px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 5,
          flexGrow: 0,
          margin: '0px 8px'
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '129px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '105px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Дорожная карта
            </span>
          </button>
        </div>
        
        {/* Component 118 */}
        <div style={{
          /* Component 118 */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          
          width: '104px',
          height: '32px',
          
          /* Inside auto layout */
          flex: 'none',
          order: 6,
          flexGrow: 0
        }}>
          <button style={{
            /* button-masters */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',
            
            width: '104px',
            height: '32px',
            borderRadius: '30px',
            
            flex: 'none',
            order: 0,
            flexGrow: 0,
            
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '80px',
              height: '20px',
              
              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              
              color: '#FFF7ED',
              
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Инвесторам
            </span>
          </button>
        </div>
      </nav>
      
      {/* Auth Buttons - Frame 1000 */}
      <div style={{
        /* Frame 1000 */
        /* Auto layout */
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0px',
        gap: '8px',

        width: '231px',
        height: '32px',
        minWidth: '231px',

        /* Inside auto layout */
        flex: 'none',
        order: 2,
        flexGrow: 0
      }}>
        {/* Component 28 - RU */}
        <div style={{
          /* Component 28 */
          /* Auto layout */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',

          width: '45px',
          height: '32px',

          /* Inside auto layout */
          flex: 'none',
          order: 0,
          flexGrow: 0
        }}>
          <button style={{
            /* button-masters */
            /* Auto layout */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',

            width: '45px',
            height: '32px',

            borderRadius: '30px',

            /* Inside auto layout */
            flex: 'none',
            order: 0,
            flexGrow: 0,

            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '21px',
              height: '20px',

              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',

              color: '#FFF7ED',

              /* Inside auto layout */
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              RU
            </span>
          </button>
        </div>

        {/* Component 26 - Войти */}
        <div style={{
          /* Component 26 */
          /* Auto layout */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',

          width: '64px',
          height: '32px',

          /* Inside auto layout */
          flex: 'none',
          order: 1,
          flexGrow: 0
        }}>
          <button style={{
            /* button-masters */
            /* Auto layout */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',

            width: '64px',
            height: '32px',

            /* main-orange */
            background: '#D93F29',
            borderRadius: '30px',

            /* Inside auto layout */
            flex: 'none',
            order: 0,
            flexGrow: 0,

            border: 'none',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '40px',
              height: '20px',

              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',

              color: '#FFF7ED',

              /* Inside auto layout */
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Войти
            </span>
          </button>
        </div>

        {/* Component 29 - Регистрация */}
        <div style={{
          /* Component 29 */
          /* Auto layout */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',

          width: '106px',
          height: '32px',

          /* Inside auto layout */
          flex: 'none',
          order: 2,
          flexGrow: 0
        }}>
          <button style={{
            /* button-masters */
            boxSizing: 'border-box',

            /* Auto layout */
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            gap: '8px',

            width: '106px',
            height: '32px',

            border: '1px solid rgba(255, 247, 237, 0.3)',
            borderRadius: '30px',

            /* Inside auto layout */
            flex: 'none',
            order: 0,
            flexGrow: 0,

            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '82px',
              height: '20px',

              /* text-sm/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',

              color: '#FFF7ED',

              /* Inside auto layout */
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Регистрация
            </span>
          </button>
        </div>
      </div>
    </header>
  );
} 