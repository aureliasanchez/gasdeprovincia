//initialize search with search engine id and language
//check query string parameters to execute first search
//perform new search on button clieck
//append results on show more click
//perform new search on sort change relevance/date


function GoogleSearch(eId, cont, lang) {
    const $ = jQuery;

    this.engineId = eId;
    this.language = lang || "en";
    this.containerId = cont;
    this.resultsTemplate = "";
    this.searchInfo = null;
    this.sort = "";
    this.num = 10;
    this.start = 1;
    this.query = "";
    this.queryParameter = "q";
    this.resultsTemplate = $("#SearchResultsTemplate").html();
    this.templateMatcher = /\{\{(\w+)\}\}/g;
    this.wired = false;
    this.clearOnLoad = false; //when set to true the results are cleared before appending new results
    this.searchUrl = window.location.host + window.location.pathname;

    this.dictionary = {};
    this.dictionary[this.language] = {};
    this.dictionary["en"] = {};
    this.dictionary["en"]["result-stats"] = "Your search for '<b>{0}</b>' returned <b>{1}</b> results";
    this.dictionary["en"]["sort-by"] = "Sort by";
    this.dictionary["en"]["relevance"] = "Relevance";
    this.dictionary["en"]["date"] = "Date";
    this.dictionary["en"]["show-more"] = "show more";

    window.searchResponseHandler = this.responseHandler;
    window.GoogleSearch = this;
    const GS = this;

    $(document).ready(function () {
        GS.init();
    });
}


GoogleSearch.prototype = {
    constructor: GoogleSearch,
    init: function () {
        const GS = this;

        this.update();

        if (!this.wired) {
            this.showSortOrder();
            this.changeSortOrder();
            this.clearSearchLink();

            $("#" + GS.containerId + " .search-button").on("click", function () {
                const q = $(this).closest(".search-bar").find(".search-input").val();
                GS.clearOnLoad = true;
                GS.newsearch(q, GS.sort);
            });

            $("#" + GS.containerId + " .search-input").on("keydown", function (ev) {
                const keys = { UP: 38, DOWN: 40, ENTER: 13, ESC: 27, TAB: 9 };
                const keynum = ev.keyCode || ev.which;

                if (keynum === keys.ENTER) {
                    const q = $(this).val();
                    GS.clearOnLoad = true;
                    GS.newsearch(q, GS.sort);
                    return false;
                }
            });

            $("#" + GS.containerId + " .show-more ").hide();
            $("#" + GS.containerId + " .sorter").hide();

            $("#" + GS.containerId + " .show-more a").on("click", function () {
                GS.clearOnLoad = false;
                GS.execute();
            });
            window.onpopstate = function (e) {
                if (e.state && e.state.query && e.state.query !== window.GoogleSearch.query) {
                    window.GoogleSearch.newsearch(e.state.query);
                }
            };
            this.wired = true;
        }

        if (this.wired) {
            const q = this.getParameter(this.queryParameter);
            if (q !== "") {
                $("#" + GS.containerId + " .search-input").val(q);
                $("#" + GS.containerId + " .search-query-clear").show();
                this.newsearch(q);
            }
        }
    },
    showSortOrder: function() {
        //show sort drop-down
        const GS = this;
        $("#" + GS.containerId + " .sorter-value-button").on("click", function (e) {
            e.preventDefault();
            $("#" + GS.containerId + " .sorter-options").toggle().closest(".search-filters").attr("aria-expanded", function (attr) {
                return attr === 'true' ? 'false' : 'true';
            });
        });
    },
    changeSortOrder: function () {
        const GS = this;
        //change sort order
        $("#" + GS.containerId + " .sorter-option").on("keydown", function (e) {
            const keyCode = e.keyCode || e.which,
                $target = $(e.target);
            // Handle Spacebar even - keyCode=32
            if (keyCode === 32) {
                e.preventDefault();
                $target.click();
            }
        }).on("click", function (e) {
            e.preventDefault();
            $("#" + GS.containerId + " .sorter-options").toggle().closest(".search-filters").attr("aria-expanded", function (attr) {
                return attr === 'true' ? 'false' : 'true';
            });
            $("#" + GS.containerId + " .sorter-value").text($(this).text());
            const s = $(this).hasClass("sorter-option-date") ? "date" : "";
            GS.clearOnLoad = true;
            GS.newsearch(GS.query, s);
        });
    },
    clearSearchLink: function () {
        const GS = this;
        $("#" + GS.containerId + " .clear-search-link").on("click", function () {
            $("#" + GS.containerId + " .search-results ul").empty();
            $("#" + GS.containerId + " .sorter").hide();
            $("#" + GS.containerId + " .show-more").hide();
            $("#" + GS.containerId + " .search-stats").empty();
            $(".ews-languages a").each(function () {
                const href = $(this).attr("href");
                $(this).attr("href", href.replace(/\?q=[^&]*/, "?q="));
            });
        });
    },
    update: function (dict) {
        if (dict) { 
            if (!dict[this.language]) {
                console.log("invalid dictionary");
                return;
            }
            for (let key in dict[this.language]) {
                const val = dict[this.language][key];
                if (val !== key && val !== "") {
                    this.dictionary[this.language][key] = val;
                }
            }
        }
        $("#" + this.containerId + " .sorter-label").html(this.lookupTerm("sort-by") + ":");
        $("#" + this.containerId + " .sorter-option-relevance").html(this.lookupTerm("relevance"));
        $("#" + this.containerId + " .sorter-option-date").html(this.lookupTerm("date"));
        $("#" + this.containerId + " .sorter-value").html($("#" + this.containerId + " .sorter-option-relevance").text());
        $("#" + this.containerId + " .show-more a:first").html(this.lookupTerm("show-more"));
    },
    newsearch: function (q, s) {

        if (q === "" || (q === this.query && this.sort === s)) return;
        if (s === null) s = "";
        $("#" + this.containerId + " .search-input").val(q);
        this.query = q;
        this.sort = s;
        this.start = 1;
        this.execute();
    },
    execute: function () {
        const GS = this;
        if (GS.query !== null) {
            let url = "https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyAdesRu-cbwfpHX8DGa9O4Xg4F7Cck1LUg";
            url += "&cx=" + this.engineId;
            if (this.language !== "th") url += "&lr=lang_" + this.language;
            url += "&start=" + this.start;
            url += "&num=" + this.num;
            url += "&prettyPrint=false";
            if (this.sort === "date") url += "&sort=date";
            url += "&fields=kind%2Citems(htmlTitle%2Clink%2Ctitle%2ChtmlSnippet)%2CsearchInformation%2Cqueries";
            url += "&callback=searchResponseHandler";
            url += "&q=" + encodeURI(GS.query);
            $.ajax({
                type: 'GET',
                url: url,
                dataType: "script",
                success: function (response) {
                    if (response) console.log(response);
                },
                error: function () {
                    GS.showError('Error occured');
                }
            });
        
            const qs = "?q=" + GS.query;
            $(".ews-languages a").each(function () {
                const href = $(this).attr("href");
                $(this).attr("href", href.replace(/\?q=[^&]*/, qs));
            });
            window.history.pushState({ query: GS.query, sort: GS.sort }, "", location.pathname + qs);
        }
        $('.dropdown-large.search .dropdown-toggle.show').dropdown('toggle');
   },

    responseHandler: function (response) {
        const GS = window.GoogleSearch;

        //display stats
        if (response.searchInformation) {
            let format = GS.lookupTerm("result-stats");
            format = format.replace("{0}", response.queries.request[0].searchTerms).replace("{1}", response.searchInformation.totalResults);
            $("#" + GS.containerId + " .search-stats").html(format);
        }

        //report to Google Analytics
        try {
            if (typeof dataLayer !== 'undefined') {
                if (response.searchInformation.totalResults === 0) {
                    window.dataLayer.push({
                        event: 'Search - no results',
                        searchterm: GS.query
                    });
                }
                window.dataLayer.push({
                    event: 'Search',
                    searchterm: GS.query
                });
            }
        } catch (e) {
            console.log(e);
        }

        if (GS.clearOnLoad) {
            $("#" + GS.containerId + " .search-results ul").empty();
        }

        if (!response.items) {
            GS.showError("no results found.");
            $("#" + GS.containerId + " .show-more").hide();
            $("#" + GS.containerId + " .sorter").hide();
           return;
        } 
        $("#" + GS.containerId + " .sorter").show();

        //append items
        let firstItem = null;
        for (let i = 0; i < response.items.length; i++) {
            let item = response.items[i];
            item.htmlSnippet = item.htmlSnippet.replace(/(<br>)/g, " ");
            const liItem = $(GS.templateFormatter(GS.resultsTemplate, item)).appendTo("#" + GS.containerId + " .search-results ul");
            if (i === 0) firstItem = liItem;
        }

        //scroll to first item
        if (firstItem && response.queries && response.queries.request && response.queries.request[0] && !isNaN(response.queries.request[0].startIndex) && response.queries.request[0].startIndex > 1) {
            $([document.documentElement, document.body]).animate({ scrollTop: $(firstItem).offset().top }, 500);
        }

        //enable show more
        if (response.queries && response.queries.nextPage && response.queries.nextPage[0] && !isNaN(response.queries.nextPage[0].startIndex)) {
            GS.start = response.queries.nextPage[0].startIndex;
            $("#" + GS.containerId + " .show-more").show();
        } else {
            $("#" + GS.containerId + " .show-more").hide();
        }

    },

    lookupTerm: function (key) {
        if (this.dictionary[this.language][key]) return this.dictionary[this.language][key];
        return this.dictionary["en"][key];
    },

    showError: function (message) {
        console.log(message);
    },

    templateFormatter: function (template, objectValues) {
        return template.replace(this.templateMatcher, function templateReplacer(_fullMatch, firstGroup) {
            return objectValues[firstGroup];
        });
    },

    getParameter: function (param) {
        const url = window.location.search.substring(1);
        const vars = url.split('&');
        for (const i in vars) {
            const name = vars[i].split('=');
            if (name[0] === param) {
                return decodeURIComponent(name[1]).replace(/\+/gi, ' ');
            }
        }
        return null;
    }
};

(function (d, $) {
    function handleSorter($sorter) {
        $sorter.on('shown.bs.sorter', function () {
            $(this).attr("aria-expanded", true);
        }).on('hidden.bs.sorter', function () {
            $(this).attr("aria-expanded", false);
        });
    }
    function handleSorterButton($sorterButton) {
        $sorterButton.on("keydown", function (e) {
            const keyCode = e.keyCode || e.which,
                $target = $(e.target);
            if (keyCode === 32 || keyCode === 13) {
                // spacebar or enter 
                e.preventDefault();
                $target.click();
                $target.siblings(".sorter-options").css("display", "block");
                $target.siblings(".sorter-options").find("ul li:first-child .sorter-option").focus();
            }
            if (keyCode === 40) {
                // down arrow
                e.preventDefault();
                $target.click();
                $target.siblings(".sorter-options").css("display", "block");
                $target.siblings(".sorter-options").find("ul li:first-child .sorter-option").focus();
            }
            if (keyCode === 27) {
                // escape
                e.preventDefault();
                $target.click();
                $target.siblings(".sorter-options").css("display", "none");
                $target.siblings(".sorter-options").find("ul li:first-child .sorter-option").focus();
            }
        });
    }
    function handleSorterOption($sorterOption) {
        $sorterOption.on("keydown", function (e) {
            const keyCode = e.keyCode || e.which,
                $target = $(e.target);
            switch (keyCode) {
                case 38:
                    // up arrow
                    e.preventDefault();
                    if ($target.closest("li").is(":first-child")) {
                        //first child go to last child
                        $target.closest(".list-unstyled").find("li").next().find(".sorter-option").focus();
                    } else {
                        //not first child go to previous
                        $target.closest(".list-unstyled").find("li").prev().find(".sorter-option").focus();
                    }
                    break;
                case 40:
                    // down arrow
                    e.preventDefault();
                    if ($target.closest("li").is(":last-child")) {
                        //last child go to first child
                        $target.closest(".list-unstyled").find("li").first().find(".sorter-option").focus();
                    } else {
                        //not last child go to next
                        $target.closest("li").next().find(".sorter-option").focus();
                    }
                    break;
                case 9:    // tabbing out
                    if ($target.closest(".sorter-option").is("ul li:last-child .sorter-option")) {
                        $(".sorter-options").hide();
                    }
                    break;
                case 27:
                case 46:
                    // escape and delete
                    $(".sorter-options").hide();                
                    break;
            }
        });
    }
    $(d).ready(function () {
        // fix to allow enter, spacebar, arrowkeys, and escape keyboard navigation
        $(".search").each(function () {
            $(this).find('.sorter').each(function () {
                handleSorter($(this));
            });
            handleSorterButton($(this).find(".sorter > .btn"));
            handleSorterOption($(this).find(".sorter-options .sorter-option"));
            
        });
    });
})(document, jQuery);
