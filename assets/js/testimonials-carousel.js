(function($) {
    'use strict';

    // Inicialización del carrusel
    function initTestimonialsCarousel() {
        $('#testimonialCarousel').carousel({
            interval: 5000,
            keyboard: true,
            pause: 'hover'
        });

        // Manejo de controles de accesibilidad
        $('.carousel-control-prev, .carousel-control-next').on('keydown', function(e) {
            if (e.which === 32) {
                e.preventDefault();
                $(this).click();
            }
        });
    }

    // Ejecutar cuando el documento esté listo
    $(document).ready(function() {
        initTestimonialsCarousel();
    });

})(jQuery); 