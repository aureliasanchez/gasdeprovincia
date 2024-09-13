(function (w, d, $) {
    $(document).ready(function () {
        $(".ffa .ffa-hover-tiles .tile").on("mouseenter focus", function (e) {
            e.preventDefault();
            const $this = $(this);
            $this.siblings().removeClass("active");
            $this.addClass("active");
        });
        $(".ffa .ffa-hover-tiles .tile .match-height").matchHeight({
            byRow: true
        });

        $(".ffa .c11 .table-responsive").each(function () {
            try {
                const tableResponsive = this;
                const slider = tableResponsive.parentElement.querySelector(".slider");
                tableResponsive.addEventListener("scroll", function (e) {
                    const scrollPos = 100 * tableResponsive.scrollLeft / (tableResponsive.scrollWidth - tableResponsive.offsetWidth);
                    slider.value = scrollPos;
                });
                slider.addEventListener("change", function (e) {
                    tableResponsive.scrollLeft = (tableResponsive.scrollWidth - tableResponsive.offsetWidth) * this.value / 100;
                });
            } catch (e) {
                console.warn(e);
            }
        });

    });
})(window, document, jQuery);