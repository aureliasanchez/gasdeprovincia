
(function (w, d, $) {
    $(document).ready(function () {
        $(window).on("load", function () {
            window.requestAnimationFrame(function () {
                $('.ffa-quote').each(function () {
                    var $quote = $(this);
                    var $text = $quote.find(".quote-text");
                    var chars = $text.text();
                    var charIndex = 0;
                    var speed = 50;
                    var quoteInterval = 0;
                    var init = function () {
                        $text.html('<span class="transparent">' + chars + '</span>');
                    };
                    var start = function () {
                        quoteInterval = setInterval(function () {
                            $text.html('<span class="opaque">' + chars.slice(0, charIndex + 1) + '</span><span class="transparent">' + chars.slice(charIndex + 1, chars.length) + '</span>');
                            charIndex++;
                            if (charIndex > chars.length) {
                                clearInterval(quoteInterval);
                                pause();
                                return;
                            }

                        }, speed);
                    };
                    var pause = function (e) {
                        $text.find('span.transparent').removeClass("transparent").addClass("opaque");
                        $quote.find('.stop-animation').hide();
                        $quote.addClass("animation-paused");
                        clearInterval(quoteInterval);
                    };
                    $quote.find('.stop-animation').on('click', function (e) {
                        pause(e);
                    });
                    init();

                    const checkElementIsInView = function (elem) {
                        const observer = new IntersectionObserver(function (entries) {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    start();
                                } 
                            });
                            if (entries[0].isIntersecting === true) {
                            } 
                        }, { rootMargin: "50% 0px 50% 0px", threshold: [.25] });
                        observer.observe(elem);
                    };
                    checkElementIsInView($quote.find("blockquote")[0]);
                });
            });
        });

    });
})(window, document, jQuery);