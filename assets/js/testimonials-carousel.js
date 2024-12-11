document.addEventListener('DOMContentLoaded', function() {
    // Función para ajustar el contenido según la altura del texto
    function adjustContentHeight() {
        const slides = document.querySelectorAll('.c57 .splide__slide');
        
        slides.forEach(slide => {
            const content = slide.querySelector('.content-container');
            const opacityCover = slide.querySelector('.opacity-cover');
            
            // Asegurarnos que el contenido tenga su altura natural
            content.style.height = 'auto';
            
            // Obtener la altura real del contenido
            const contentHeight = content.getBoundingClientRect().height;
            
            // El degradado siempre cubre el contenido exactamente
            opacityCover.style.height = `${contentHeight}px`;
        });
    }

    // Inicializar todos los carruseles c57
    const carouselsC57 = document.querySelectorAll('.c57 .splide');
    
    carouselsC57.forEach(carousel => {
        new Splide(carousel, {
            type: 'slide',
            perPage: 3,
            perMove: 1,
            gap: '20px',
            pagination: true,
            arrows: true,
            autoplay: false,
            breakpoints: {
                992: {
                    perPage: 2,
                },
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    });

    // Ajustar altura inicial
    adjustContentHeight();

    // Ajustar altura cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustContentHeight);

    // Ajustar altura cuando el carrusel cambie de slide
    carouselsC57.forEach(carousel => {
        carousel.addEventListener('moved', adjustContentHeight);
    });

    // Funcionalidad de los botones de navegación
    const prevButtons = document.querySelectorAll('.c57 .splide__arrow--prev');
    const nextButtons = document.querySelectorAll('.c57 .splide__arrow--next');

    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const carousel = this.closest('.splide').splide;
            carousel.go('<');
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const carousel = this.closest('.splide').splide;
            carousel.go('>');
        });
    });

    // Prevenir comportamiento por defecto en los enlaces dentro del carrusel
    const carouselLinks = document.querySelectorAll('.c57 .cta-link-parent');
    carouselLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href')) {
                return true;
            }
            e.preventDefault();
        });
    });
}); 