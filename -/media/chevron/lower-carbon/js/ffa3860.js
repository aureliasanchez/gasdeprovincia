const ffa = (function (w, d, $) {
    //gsap.registerPlugin(ScrollToPlugin);
    //gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable, InertiaPlugin);
     
    //const container = document.getElementById("pinContainer");
    const bodyElement = document.body;
    const panelContainer = bodyElement.querySelector("#pinContainer");
    const horizontalIndicator = bodyElement.querySelector(".horizontal-position-indicator .indicator-active");
    const landingPanel = panelContainer.querySelector(".landing-panel");
    const parallaxPanels = panelContainer.querySelectorAll(".parallax-panel");
    const manifestoIcons = bodyElement.querySelectorAll(".manifesto-icon .icon");
    const modals = bodyElement.querySelectorAll(".modal");
    const headerHeight = parseInt(getComputedStyle(bodyElement.querySelector(".ffa")).getPropertyValue("--navbar-height"), 10);
    let panels = gsap.utils.toArray(".ffa-slide-container .panel-item");
    let openingTimeline = gsap.timeline();
    let currentStory;
    let lastmedia;
    let proxy;
    let trigger;
    let draggable;


    const openingCompleteSet = () => {
        $(".ffa").addClass("opening-animation-complete");
        $(".ffa .navbar-ffa .horizontal-position-indicator").fadeIn();
    }
    const openingCompleteReset = () => {
        $(".ffa .navbar-ffa .horizontal-position-indicator").hide();
        $(".ffa").removeClass("opening-animation-complete");
    }

    const createProxy = function () {
        proxy = document.createElement("div");
        proxy.classList.add("ffa-draggable");
        draggable = Draggable.create(proxy, {
            trigger: panelContainer, 
            type: "x",
            onDrag: function () {
                //console.log("type trigger.scroll():" + -this.x);
                //gsap.to(panelContainer, { x: this.x });
                trigger.scroll(-this.x);
            },
            inertia: true
        })[0];
    }

    const createScroller = function() {
        scrollWidth = panelContainer.scrollWidth;
        //console.log("scrollWidth:" + scrollWidth);
        draggable.applyBounds({ minX: -scrollWidth, maxX: 0 });
        ScrollTrigger.addEventListener("refreshInit", () => {
            scrollWidth = panelContainer.scrollWidth;
            //console.log("scrollWidth:" + scrollWidth);
            //gsap.set(document.body, { height: scrollWidth + innerHeight });
        });
    }

    const updateProxy = function() {
        // move the handler to the corresponding ratio according to the page's scroll position.
        //console.log("trigger.scroll():" + trigger.scroll());
        gsap.set(proxy, { x: -trigger.scroll() });
    }

    const initScene = function () {

        let timeline;
        const parallaxTimeline = gsap.timeline();
        ScrollTrigger.matchMedia({
            // desktop
            "(min-width: 992px)": function () {
                if (!window.matchMedia("(hover: hover)").matches) {
                    createProxy();
                    createScroller();
                    draggable?.enable();
                }

                timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: panelContainer,
                        id: "horizontalScroll",
                        pin: true,
                        start: "top " + headerHeight + "px",
                        end: () => panelContainer.scrollWidth,
                        scrub: 0.5,
                        onUpdate: trigger => {
                            horizontalIndicator.style.width = trigger.progress * 100 + "%";
                            updateProxy();
                        },
                        invalidateOnRefresh: true,
                        overwrite: "auto"
                    }
                });
                trigger = ScrollTrigger.getById("horizontalScroll");

                timeline
                    .addLabel("start")
                    .fromTo(landingPanel.querySelector(".ffa-landing"), { padding: "124px 124px" }, {
                        padding: "0 0",
                        ease: 'ease-out',
                        duration: () => landingPanel.scrollWidth,
                        onStart: () => {
                            landingAnimation.pauseAnimations();
                        },
                        onComplete: () => {
                            openingCompleteSet();
                        }
                    }, "start")
                    .fromTo(bodyElement.querySelector(".navbar-ffa .hallmark-container"), { x: 0, y: 64 }, {
                        x: 0,
                        y: 0,
                        ease: 'ease-out',
                        duration: () => landingPanel.scrollWidth,
                    }, "start")
                    .fromTo(bodyElement.querySelector(".navbar-ffa .navbar-button"), { x: 104, y: 64 }, {
                        x: 0,
                        y: 0,
                        ease: 'ease-out',
                        duration: () => landingPanel.scrollWidth,
                    }, "start")
                    .addLabel("scroll")
                    .to(panels, {
                        x: () => -(panelContainer.scrollWidth - bodyElement.offsetWidth) + "px",
                        ease: 'none',
                        duration: () => panelContainer.scrollWidth - landingPanel.scrollWidth,
                        onReverseComplete: () => {
                            openingCompleteReset();
                        },
                    }, "scroll");

                parallaxPanels.forEach((parallaxPanel, i) => {
                    parallaxTimeline.to(parallaxPanel.querySelector(".background"), {
                        backgroundPosition: `0% 50%`,
                        ease: "none",
                        scrollTrigger: {
                            trigger: parallaxPanel,
                            id: "parallaxScroll-" + i,
                            start: () => "top top-=" + (parallaxPanel.offsetLeft + landingPanel.scrollWidth - window.innerWidth - headerHeight),
                            //markers: true,
                            scrub: 0.5,
                            end: () => '+=' + (parallaxPanel.offsetWidth + landingPanel.scrollWidth + window.innerWidth - headerHeight),
                            invalidateOnRefresh: true,
                            overwrite: true,
                        }
                    });
                });

            },

            // mobile
            "(max-width: 991px)": function () {
                draggable?.disable();
                const duration = .6;
                timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: landingPanel,
                        id: "verticalScroll",
                        pin: true,
                        start: "top " + headerHeight +"px",
                        end: "+=100%",
                        scrub: .5,
                        invalidateOnRefresh: true,
                        overwrite: true,
                        //markers: false
                    }
                });
                timeline
                    .addLabel("start")
                    .fromTo(landingPanel.querySelector(".ffa-landing"), { padding: "45px 20px" }, {
                        padding: "0px 0px",
                        ease: 'ease-out',
                        duration: () => duration,
                        onStart: () => {
                            landingAnimation.pauseAnimations();
                        },
                        onComplete: () => {
                            openingCompleteSet();
                        },
                        onReverseComplete: () => {
                            openingCompleteReset();
                        }
                    }, "start")
                    .fromTo(bodyElement.querySelector(".navbar-ffa .hallmark-container"), { x: 0, y: 20 }, {
                        x: 0,
                        y: 0,
                        ease: 'ease-out',
                        duration: () => duration,
                    }, "start")
                    .fromTo(bodyElement.querySelector(".navbar-ffa .navbar-button"), { x: 20, y: 20 }, {
                        x: 0,
                        y: 0,
                        ease: 'ease-out',
                        duration: () => duration,
                    }, "start");
                parallaxPanels.forEach((parallaxPanel, i) => {
                    parallaxTimeline.to(parallaxPanel.querySelector(".background"), {
                        backgroundPosition: `50% 0%`,
                        ease: "none",
                        scrollTrigger: {
                            trigger: parallaxPanel,
                            id: "parallaxScroll-" + i,
                            start: "top bottom",
                            scrub: 0.5,
                            invalidateOnRefresh: true,
                            overwrite: true,
                            //end: '+=' + (parallaxPanel.offsetWidth + window.innerWidth - headerHeight),
                            //markers: true,
                        }
                    });
                });
            }/*,
            "all": function () {
            }*/
        });
        let ro = new ResizeObserver(function () {
            openingCompleteReset();
            if ($("#storiesModal").hasClass("show")) {
                scrollToId(currentStory.data("parent"));
            }
        });
        ro.observe(document.body);
    }

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    const scrollModal = function (callback) {
        document.querySelectorAll(".modal .story").forEach(function (story) {
            story.scrollTop = 0;
        });
        callback();
    };

    const enableTriggers = function () {
        parallaxPanels.forEach((parallaxPanel, i) => {
            ScrollTrigger.getById("parallaxScroll-" + i)?.enable();
        });
        ScrollTrigger.getById("horizontalScroll")?.enable();
        ScrollTrigger.getById("verticalScroll")?.enable();
    };
    const disableTriggers = function () {
        parallaxPanels.forEach((parallaxPanel, i) => {
            ScrollTrigger.getById("parallaxScroll-" + i)?.disable(false);
        });
        ScrollTrigger.getById("horizontalScroll")?.disable(false);
        ScrollTrigger.getById("verticalScroll")?.disable(false);
    };
    const dispatchStoryEvent = function (eventName, storyId) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: { storyId: storyId } }));
    };

    const openStory = function (storyId, scrollOnOpen = true, scrollTo = null) {
        //const $story = $("#" + storyId);
        const $story = $('.story[data-id=' + storyId + ']');
        const panelId = (scrollTo !== null) ? scrollTo : $story.data("parent");
        const $storiesModal = $("#storiesModal");
        currentStory = $story;
        const handleModals = () => {
            if ($storiesModal.hasClass("show")) {
                scrollModal(function () {
                    $(".story").hide();
                    $story.fadeIn(500);
                    dispatchStoryEvent("storyOpened", storyId);
                });
            } else {
                $story.show();
                $storiesModal.modal("show");
                dispatchStoryEvent("storyOpened", storyId);
            }
        }
        if (scrollOnOpen) {
            handleModals();
            scrollToId(panelId, function () {
                //disableTriggers();
            });
        } else {
            handleModals();
            //disableTriggers();
        }
    };

    const closeStory = function (scrollToEnabled = true) {
        const chapterId = currentStory?.data("parent");
        const handleModals = function () {
            scrollModal(() => { return });
            $(".modal").modal("hide");
            $(".story").each(function () {
                $(this).hide();
                dispatchStoryEvent("storyClosed", $(this).data("id"));
            });
        };
        //enableTriggers();
        if (scrollToEnabled) {
            scrollToId(chapterId, function () {
                handleModals();
            });
        } else {
            handleModals();
        }

    };
    const scrollToId = function (elemId, callback = () => { }) {
        let element = panelContainer.querySelector('[data-id=' + elemId + ']');
        let scrollPosition = element.offsetTop - headerHeight;
        if (bodyElement.offsetWidth > 991) {
            if (element.classList.contains("story-panel")) {
                scrollPosition = element.offsetLeft + bodyElement.offsetWidth;
            } else {
                scrollPosition = element.offsetLeft + (element.offsetWidth + bodyElement.offsetWidth) / 2;
            }
        }
        $(window).animate({
            scrollTop: scrollPosition
        }, 400, function () {
            callback();
        });
    }; 
    const checkForStoryInUrlHash = function (hash, story) {
        if (hash) {
            try {
                const hashReferenceElementInStory = document.querySelector('.story[data-id=' + hash.replace("#", "") + ']');
                if (hashReferenceElementInStory && hashReferenceElementInStory.dataset.parent) {
                    openingTimeline.play();
                    //scrollToId(hashReferenceElementInStory.dataset.parent, function () {
                    //});
                    openStory(hash.replace("#", ""));
                } else {
                    const hashReferenceElementInScroll = document.querySelector('.ffa-horizontal-container [data-id=' + hash.replace("#", "") + ']');
                    if (hashReferenceElementInScroll) {
                        closeModalsIfIn();
                        scrollToId(hash.replace("#", ""));
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        setTimeout(function () {
            document.querySelector(".ffa-scroll-cover").classList.remove("active");
        }, 1500);

    };

    const checkElementIsInView = function (elem, callbackIn, callbackOut) {
        if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
            const observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting === true && !elem.classList.contains("animation-paused")) {
                    callbackIn();
                } else {
                    callbackOut();
                }
            }, { threshold: [1] });
            observer.observe(elem);
        }
    };
    const positionHallmark = function () {
        const hallmarkContainer = bodyElement.querySelector(".navbar-ffa .hallmark-container");
        let fixedNavWidth = bodyElement.offsetWidth;
        if (bodyElement.scrollWidth > 0) {
            fixedNavWidth = Math.min(fixedNavWidth, bodyElement.scrollWidth);
        }
        modals.forEach(modal => {
            if (modal.scrollWidth > 0) {
                fixedNavWidth = Math.min(fixedNavWidth, modal.scrollWidth);
            }
        });
        hallmarkContainer.style.left = ((fixedNavWidth / 2) - (hallmarkContainer.querySelector(".hallmark-img").offsetWidth / 2)) + "px";
    };
    const landingAnimation = (function () {
        const landing = bodyElement.querySelector(".ffa-landing");
        const backgroundsList = landing.querySelectorAll(".background");
        const textList = landing.querySelectorAll(".text-group");
        let backgroundInterval;
        let textInterval;
        function backgroundIntervalFunction() {
            const index = [...backgroundsList].findIndex(background => background.classList.contains('active'));
            const indexNext = [...backgroundsList].findIndex(background => background.classList.contains('next-active'));
            backgroundsList[index].classList.remove("active");
            if (index < backgroundsList.length - 1) {
                backgroundsList[index + 1].classList.add("active");
            } else {
                backgroundsList[0].classList.add("active");
            }
            backgroundsList[indexNext].classList.remove("next-active");
            if (indexNext < backgroundsList.length - 1) {
                backgroundsList[indexNext + 1].classList.add("next-active");
            } else {
                backgroundsList[0].classList.add("next-active");
            }
        }
        function textIntervalFunction() {
            const index = [...textList].findIndex(text => text.classList.contains('active'));
            textList.forEach(text => text.classList.remove("active-out"));
            textList[index].classList.add("active-out");
            textList[index].classList.remove("active");
            if (index < textList.length - 1) {
                textList[index + 1].classList.add("active");
            } else {
                textList[0].classList.add("active");
            }
        }
        const initAnimations = function () {
            textIntervalFunction();
            setTimeout(backgroundIntervalFunction, 500);
            textInterval = setInterval(textIntervalFunction, 4000);
            setTimeout(function () {
                backgroundInterval = setInterval(backgroundIntervalFunction, 4000);
            }, 500);
        };
        const pauseAnimations = function () {
            landing.querySelector(".landing-pause").text = "play";
            landing.classList.add("paused");
            clearInterval(backgroundInterval);
            clearInterval(textInterval);
        };
        const playAnimations = function () {
            landing.querySelector(".landing-pause").text = "pause";
            landing.classList.remove("paused");
            initAnimations();
        };
        return {
            pauseAnimations: pauseAnimations,
            playAnimations: playAnimations
        }
    })();

    const closeModalsIfIn = function() {
        if ($(".stories-modal").hasClass("show")) {
            closeStory(false);
        } else if ($(".modal").hasClass("show")) {
            $(".modal").modal("hide");
        }
    };
    $(document).ready(function () {
        //set panel widths
        landingAnimation.playAnimations();
        $(".ffa .ffa-landing .landing-pause").on("click", function (e) {
            if ($(this).closest(".ffa-landing").hasClass("paused")) {
                landingAnimation.playAnimations();
                return;
            }
            landingAnimation.pauseAnimations();
        });

        $(".ffa .social-popup").on("click", function (e) {
            SocialService.showPopup($(this).data("social"), $(this));
            e.preventDefault();
        });

        $(".ffa .social-email").on("click", function (e) {
            SocialService.showEmail();
            e.preventDefault();
        });

        (function() {
            let hasHash = false;
            $(".ffa #navModal").on("show.bs.modal", function (e) {
                hasHash = window.location.hash ? true : false;
                $(this).closest(".navbar-ffa").addClass("open");
            }).on("hide.bs.modal", function (e) {
                $(this).closest(".navbar-ffa").removeClass("open");
            }).on("hidden.bs.modal", function (e) {
                //if there was hash, then go back to hash location after close of navModal
                if (hasHash) {
                    checkForStoryInUrlHash(window.location.hash, true);
                };
            }).on("shown.bs.modal", function (e) {
                const $this = $(this);
                $this.find(".col-left .fade-container").fadeIn(150, function () {
                    $this.find(".col-right").animate({ right: 0 }, 250);
                });
            });
        })();

        $("#storiesModal").on("hide.bs.modal", function (e) {
            scrollModal(() => { return });
        }).on("hidden.bs.modal", function (e) {
            //enableTriggers();
            $(".story").hide();
        });
        $(".ffa .manifesto-modal, .ffa .stories-modal").on("show.bs.modal", function (e) {
            $(this).closest(".ffa").find(".navbar-ffa .horizontal-position-indicator").fadeOut();
        }).on("hide.bs.modal", function (e) {
            $(this).closest(".ffa").find(".navbar-ffa .horizontal-position-indicator").fadeIn();
        });
        $(".ffa .manifesto .animation-toggle").on("click", function (e) {
            e.preventDefault();
            manifestoIcons.forEach(manifestoIcon => {
                if ($(this).hasClass("animation-paused")) {
                    manifestoIcon.src = manifestoIcon.dataset.srcAnimated;
                    manifestoIcon.classList.remove("animation-paused");
                } else {
                    manifestoIcon.src = manifestoIcon.dataset.srcStatic;
                    manifestoIcon.classList.add("animation-paused");
                }
            });
            $(this).toggleClass("animation-paused");

        });
        manifestoIcons.forEach((manifestoIcon, i) => {
            checkElementIsInView(manifestoIcon, function inView() {
                manifestoIcon.src = manifestoIcon.dataset.srcAnimated;
            }, function outView() {
                manifestoIcon.src = manifestoIcon.dataset.srcStatic;
            });
        });
        $(".ffa .navbar-ffa .close-button").on("click", function (e) {
            e.preventDefault();
            const $modal = $(this).closest(".modal");
            $modal.find(".col-right").animate({ right: "-100%" }, 250, function () {
                $modal.find(".col-left .fade-container").fadeOut(150, function () {
                    $modal.modal("hide");
                });
            });
        });
        $(".ffa .nav-open-story").on("click", function (e) {
            const $target = $(e.currentTarget);
            const storiesModalIsIn = $(".stories-modal").hasClass("show");
            $(".nav-modal").modal("hide");
            //can't use hidden.bs.modal because it triggers all the time
            window.setTimeout(function () {
                if (storiesModalIsIn) { bodyElement.classList.add("modal-open"); };
                //openStory($target.attr("href").replace("#", ""), $target.data("scroll-on-open") ? $target.data("scroll-on-open") : true, $target.data("scroll-to"));
            }, 1500);
        });
        $(".ffa .scroll-button").on("click", function (e) {
            e.preventDefault();
            const scrollTo = $(e.currentTarget).data("scroll-to");
            //scrollToId(scrollTo);
            window.location.href = "#" + scrollTo;
        });
        $(".ffa .close-story").on("click", function (e) {
            e.preventDefault();
            //closeStory();
            window.location.href = "#" + $(this).closest(".story").data("parent");
        });
        window.addEventListener("popstate", function (e) {
            const hash = window.location.hash;
            if (!hash) {
                closeModalsIfIn();
                $(window).animate({
                    scrollTop: 0
                }, 400);
                return;
            }
            checkForStoryInUrlHash(window.location.hash, true);
        }, false);
        $(window).on("load", function () {
            window.requestAnimationFrame(function () {
                initScene();
                positionHallmark();
                checkForStoryInUrlHash(window.location.hash);
                $(window).on("resize", function () {
                    //ScrollTrigger.refresh(true);
                    positionHallmark();
                });
            });
        });
    });
    return {
        checkElementIsInView: checkElementIsInView,
        /*enableTriggers: enableTriggers,
        disableTriggers: disableTriggers*/
    }
})(window, document, jQuery);