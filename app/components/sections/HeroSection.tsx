export function HeroSection() {
  return (
    <div style={{
      /* Frame 1001 */
      /* Auto layout */
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0px 0px 0px 40px',
      gap: '36px',

      position: 'relative',
      width: '528px',
      height: '478px',
      marginTop: '151px',
      marginLeft: '152.59px',
      opacity: 1
    }}>
      {/* Frame 1018 */}
      <div style={{
        /* Frame 1018 */
        /* Auto layout */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '4px',
        isolation: 'isolate',

        width: '488px',
        height: '144px',

        /* Inside auto layout */
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        {/* Rectangle 5 */}
        <div style={{
          /* Rectangle 5 - Плашка под словом "Доход" */
          position: 'absolute',
          width: '181px',
          height: '56px',
          left: '25px',
          top: '0px',
          borderRadius: '12px',
          background: 'linear-gradient(142.53deg, #FB7F43 2.66%, #D93F29 79.41%)',
          opacity: 1,

          /* Inside auto layout */
          flex: 'none',
          order: 0,
          flexGrow: 0,
          zIndex: 0
        }} />

        {/* Заголовок */}
        <h1 style={{
          /* Доход в мире кулинарных инноваций */
          width: '488px',
          height: '144px',

          /* text-5xl/bold */
          fontFamily: 'Arial',
          fontStyle: 'bold',
          fontWeight: 700,
          fontSize: '50px',
          lineHeight: '48px',
          letterSpacing: '0%',

          color: '#FFF7ED',

          /* Inside auto layout */
          flex: 'none',
          order: 2,
          alignSelf: 'stretch',
          flexGrow: 0,
          zIndex: 2,

          margin: 0
        }}>
          Доход в мире кулинарных инноваций
        </h1>
      </div>
      
      {/* Описательный текст */}
      <div style={{
        /* ChefNet — это пространство... */
        width: '488px',
        height: '218px',

        /* Inside auto layout */
        flex: 'none',
        order: 1,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        <p style={{
          /* text-base/normal */
          fontFamily: 'Arial',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0%',
          color: '#FFF7ED',
          margin: 0,
          marginBottom: '36px'
        }}>
          <strong style={{
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '24px',
            letterSpacing: '0%',
            color: '#FFF7ED'
          }}>ChefNet</strong> — это пространство, где гастрономия и технологии создают новые возможности. Умный поиск ресторанов и блюд, интерактивная карта, онлайн-меню, частные шефы и современные способы оплаты — всё в одной экосистеме.
        </p>
        
        <p style={{
          /* text-base/normal */
          fontFamily: 'Arial',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0%',
          color: '#FFF7ED',
          margin: 0
        }}>
          <strong style={{
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '24px',
            letterSpacing: '0%',
            color: '#FFF7ED'
          }}>ChefNet</strong> открывает путь к кулинарным инновациям и инвестициям, позволяя каждому шагу приносить пользу и удовольствие. Мы формируем будущее гастрономии — и делим его преимущества.
        </p>
      </div>
      
      {/* Frame 1000 - Кнопки */}
      <div style={{
        /* Frame 1000 */
        /* Auto layout */
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '8px',

        width: '395px',
        height: '44px',

        /* Inside auto layout */
        flex: 'none',
        order: 2,
        flexGrow: 0
      }}>
        {/* Component 26 - Купить долю */}
        <div style={{
          /* Component 26 */
          /* Auto layout */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',

          width: '167px',
          height: '44px',

          /* orange/1 */
          boxShadow: '0px 6px 14px -12px rgba(156, 86, 63, 0.4)',

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
            padding: '10px 20px',
            gap: '10px',

            width: '167px',
            height: '44px',

            /* main-orange */
            background: '#D93F29',
            borderRadius: '24px',
            opacity: 1,

            /* Inside auto layout */
            flex: 'none',
            order: 0,
            flexGrow: 0,

            border: 'none',
            cursor: 'pointer'
          }}>
            {/* Контейнер с текстом и иконкой */}
            <div style={{
              width: '95px',
              height: '24px',
              opacity: 1,
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                /* Text */
                width: '95px',
                height: '24px',
                opacity: 1,

                /* text-base/normal */
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0%',
                textAlign: 'center',

                color: '#FFF7ED',

                /* Inside auto layout */
                flex: 'none',
                order: 0,
                flexGrow: 0
              }}>
                Купить долю
              </span>
              
              {/* Иконка стрелки вправо */}
              <svg style={{
                width: '24px',
                height: '24px',
                opacity: 1,
                flex: 'none',
                order: 1,
                flexGrow: 0
              }} viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#FFF7ED" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Component 27 - Запросить презентацию */}
        <div style={{
          /* Component 27 */
          /* Auto layout */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',

          width: '220px',
          height: '44px',

          /* Inside auto layout */
          flex: 'none',
          order: 1,
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
            padding: '10px 20px',
            gap: '8px',

            width: '220px',
            height: '44px',

            border: '1px solid #D6D3D1',
            borderRadius: '24px',

            /* Inside auto layout */
            flex: 'none',
            order: 0,
            flexGrow: 0,

            background: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{
              /* Text */
              width: '180px',
              height: '24px',

              /* text-base/normal */
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',

              color: '#FFF7ED',

              /* Inside auto layout */
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              Запросить презентацию
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 