document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los carruseles alternativos
    const carouselsAlt = document.querySelectorAll('.alt-carousel .splide');
    
    carouselsAlt.forEach(carousel => {
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

    // Funcionalidad de los botones de navegación
    const prevButtons = document.querySelectorAll('.alt-carousel .splide__arrow--prev');
    const nextButtons = document.querySelectorAll('.alt-carousel .splide__arrow--next');

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
    const carouselLinks = document.querySelectorAll('.alt-carousel .cta-link-parent');
    carouselLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href')) {
                return true;
            }
            e.preventDefault();
        });
    });
}); 