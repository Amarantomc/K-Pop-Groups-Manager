import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './carousel.css';

interface VisualConceptCarouselProps {
  slides: { name: string; src: string; id: number }[];
  onEdit: (slide: any) => void;
  onDelete?: (id: number) => void;
}

const VisualConceptCarousel: React.FC<VisualConceptCarouselProps> = ({ slides, onEdit, onDelete }) => {
  const slidesCount = slides.length;
  const slidesPerView = slidesCount < 3 ? slidesCount : 3;
  const enableLoop = slidesCount >= 3;
  return (
    <Swiper
      grabCursor
      centeredSlides
      slidesPerView={slidesPerView}
      speed={600}
      effect="coverflow"
      loop={enableLoop}
      //loopAdditionalSlides={slidesCount}
      mousewheel
      pagination={{ clickable: true }}
      navigation={{
        nextEl: '.concept-swiper-next',
        prevEl: '.concept-swiper-prev',
      }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      modules={[EffectCoverflow, Pagination, Navigation, Keyboard]}
      className="concept-swiper"
    >
      {/* Eliminado contador de slides para un look más limpio */}
      {slides.map((slide) => (
        <SwiperSlide
          key={slide.id}
          style={{
            borderRadius: 24,
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            overflow: 'visible',
            background: 'transparent',
            minHeight: 300,
            minWidth: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={slide.src}
            alt={slide.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 24,
              padding: '12px',
              background: '#fff',
              zIndex: 1,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
            onError={e => {
              e.currentTarget.onerror = null;
              //e.currentTarget.src = '/visual-concepts/default.png';
            }}
          />
          <div className="concept-slide-content" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px',
            justifyContent: 'flex-start',
            height: '100%',
            width: '100%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)',
            borderRadius: 24,
            position: 'absolute',
            left: 0,
            top: 0,
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
            zIndex: 2,
            paddingBottom: 24,
          }}>
            {/* <h2 style={{fontSize: '2rem', fontWeight: 700, marginBottom: 12, letterSpacing: 1}}>{slide.name}</h2> */}
            <div className="concept-slide-actions">
              <button
                className="concept-carousel-action-btn edit"
                title="Editar"
                onClick={() => onEdit(slide)}
              >
                <span role="img" aria-label="Editar">✏️</span>
              </button>
              <button
                className="concept-carousel-action-btn delete"
                title="Eliminar"
                onClick={() => onDelete && onDelete(slide.id)}
              >
                <span role="img" aria-label="Eliminar">🗑️</span>
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* Botón anterior */}
      <button className="concept-swiper-prev concept-swiper-nav-btn" aria-label="Anterior">
        &#8592;
      </button>
      {/* Botón siguiente */}
      <button className="concept-swiper-next concept-swiper-nav-btn" aria-label="Siguiente">
        &#8594;
      </button>
    </Swiper>
  );
};

export default VisualConceptCarousel;
