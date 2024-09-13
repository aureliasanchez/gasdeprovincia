(function (w, d, $) {

    var tl = undefined;
    const storyId = "the-power-of-the-seedling";
    let inited = false;

    gsap.registerPlugin(ScrollTrigger);
    const initScene = function () {
        //if (tl != undefined) return;
        //if (inited) return;
        if (tl != undefined) {
            resetAnimation();
            //tl.pause(0).kill(true);
            tl.pause(0);
            ScrollTrigger.getById("circle-animation").kill(true);
        }
        var scrollTrigger = null;
        var media = null;
        var itemStagger = .2;
        var duration = .8;
        var count = 8;
        var offsetY = 60;

        function transition(i, j) {
            if (scrollTrigger == null || scrollTrigger == undefined) return;
            if (i > 0 && j == 0) {
                if (scrollTrigger.direction === 1) {
                    gsap.fromTo(".circle-clear div:nth-child(" + i + ") .content-item", { y: 0, opacity: 1 }, { y: -scrollTrigger.direction * offsetY, opacity: 0, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                } else {
                    gsap.fromTo(".circle-clear div:nth-child(" + i + ") .content-item", { y: scrollTrigger.direction * offsetY, opacity: 0 }, { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                }
            } else if (j > 0 && i == 0) {
                if (scrollTrigger.direction === 1) {
                    gsap.fromTo(".circle-clear div:nth-child(" + j + ") .content-item", { y: scrollTrigger.direction * offsetY, opacity: 1 }, { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                } else {
                    gsap.fromTo(".circle-clear div:nth-child(" + j + ") .content-item", { y: 0, opacity: 1 }, { y: -scrollTrigger.direction * offsetY, opacity: 0, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                }
            } else if (i > 0 && i == j) {
                if (scrollTrigger.direction === 1) {
                    gsap.to(".circle-clear div:nth-child(" + i + ") .content-item", { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                } else {
                    gsap.to(".circle-clear div:nth-child(" + i + ") .content-item", { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                }
            } else {
                if (scrollTrigger.direction === 1) {
                    gsap.fromTo(".circle-clear div:nth-child(" + i + ") .content-item", { y: 0, opacity: 1 }, { y: -scrollTrigger.direction * offsetY, opacity: 0, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                    gsap.fromTo(".circle-clear div:nth-child(" + j + ") .content-item", { y: scrollTrigger.direction * offsetY, opacity: 0 }, { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                } else {
                    gsap.fromTo(".circle-clear div:nth-child(" + i + ") .content-item", { y: scrollTrigger.direction * offsetY, opacity: 0 }, { y: 0, opacity: 1, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                    gsap.fromTo(".circle-clear div:nth-child(" + j + ") .content-item", { y: 0, opacity: 1 }, { y: -scrollTrigger.direction * offsetY, opacity: 0, stagger: itemStagger, ease: Expo.easeOut, duration: duration });
                }
            }
        }

        function resetAnimation() { 
            const container = document.body.querySelector(".ffa .circle-animation");
            if (container == undefined) return;
            gsap.to(".circle-clear .content-item", { y: 0, opacity: 0, stagger: itemStagger, ease: Expo.easeOut, duration: 0.01 });
            gsap.to(".circle-clear", { translateX: getComputedStyle(container).getPropertyValue('--circle-clear-init-x'), translateY: getComputedStyle(container).getPropertyValue('--circle-clear-init-y'), duration: .5 });
            gsap.to(".circle-solid", { translateX: getComputedStyle(container).getPropertyValue('--circle-solid-init-x'), translateY: getComputedStyle(container).getPropertyValue('--circle-solid-init-y'), duration: .5 });
            gsap.to(".circle-empty", { translateX: getComputedStyle(container).getPropertyValue('--circle-empty-init-x'), translateY: getComputedStyle(container).getPropertyValue('--circle-empty-init-y'), duration: .5 });
        }

        ScrollTrigger.matchMedia({
            // desktop
            "(min-width: 992px)": function () {
                //console.log("desktop");
                tl = gsap.timeline({
                    scrollTrigger: {
                        id: "circle-animation",
                        trigger: ".circle-wrapper",
                        scrub: 0.5,
                        start: "top top",
                        end: "+=400%",
                        pin: true,
                        markers: false,
                        onEnter: (self) => {
                            scrollTrigger = self;
                            //console.log("start pinning");
                        },
                        onLeave: (self) => {
                            //console.log("stop pinning");
                        },
                        onEnterBack: (self) => {
                            scrollTrigger = self;
                            //console.log("start pinning Back");
                        },
                        onLeaveBack: (self) => {
                            //console.log("stop pinning Back");
                        },
                        invalidateOnRefresh: true,
                        scroller: "#storiesModal .bean",
                        anticipatePin: 1
                    }
                });

                tl.addLabel("start")
                    .to(".circle-clear", { duration: .01 })
                    .call(transition, [1, 1])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [1, 2])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [2, 3])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [3, 4])
                    //.to(".circle-clear", { duration: 1 })
                    //.call(transition, [4, 0])
                    .to(".circle-clear", { duration: .01 })

            },
             
            // mobile
            "(max-width: 991px)": function () {
                //console.log("mobile");
                resetAnimation();
                tl = gsap.timeline({
                    scrollTrigger: {
                        id: "circle-animation",
                        trigger: ".circle-wrapper",
                        scrub: 1,
                        start: "top top",
                        end: "+=500%",
                        pin: true,
                        anticipatePin: 1,
                        onEnter: (self) => {
                            scrollTrigger = self;
                            //console.log("start pinning");
                        },
                        onLeave: (self) => {
                            //console.log("stop pinning");
                        },
                        onEnterBack: (self) => {
                            scrollTrigger = self;
                            //console.log("start pinning Back");
                        },
                        onLeaveBack: (self) => {
                            //console.log("stop pinning Back");
                        },
                        invalidateOnRefresh: true,
                        scroller: "#storiesModal .bean"
                    }
                });

                tl.addLabel("start")
                    .to(".circle-clear", { duration: .01 })
                    .call(transition, [1, 1])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [1, 2])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [2, 3])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [3, 4])
                    .to(".circle-clear", { duration: 1 })
                    .call(transition, [4, 0])
                    .to(".circle-clear", { duration: .01 })

            }
        });

        let ro = new ResizeObserver(function () {
            resetAnimation();
            //ScrollTrigger.getById("circle-animation")?.refresh();
        });
        ro.observe(document.body);
        inited = true;
    };

    $(document).ready(function () {
        $(window).on("load", function () {
            document.addEventListener("storyOpened", function (e) {
                if (e.detail.storyId === storyId) {
                    //ffa.disableTriggers();
                    initScene();
                    //ScrollTrigger.getById("circle-animation")?.enable();
                }
            });
            /*document.addEventListener("storyClosed", function (e) {
                //console.log("storyClosed:" + e.detail.storyId);
                if (e.detail.storyId === storyId) {
                    //ScrollTrigger.getById("circle-animation")?.disable();
                    //ffa.enableTriggers();
                }
            });
            window.requestAnimationFrame(function () {
                //console.log("circle animation ready");
            });*/


        });
    });
})(window, document, jQuery);