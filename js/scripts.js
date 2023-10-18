(function ($) {
  "use strict";

  /* rtl check */
  function rtl_owl() {
    if ($("body").hasClass("rtl")) {
      return true;
    } else {
      return false;
    }
  }



  /* --------------------------------------------------
   * preloader
   * --------------------------------------------------*/
  if ($("#royal_preloader").length) {
    var $selector = $("#royal_preloader"),
      $width = $selector.data("width"),
      $height = $selector.data("height"),
      $color = $selector.data("color"),
      $bgcolor = $selector.data("bgcolor"),
      $logourl = $selector.data("url");

    Royal_Preloader.config({
      mode: "logo",
      logo: $logourl,
      logo_size: [$width, $height],
      showProgress: true,
      showPercentage: true,
      text_colour: $color,
      background: $bgcolor,
    });
  }

  $(".octf-search").each(function () {
    var selector = $(this);
    selector.find(".toggle_search").on("click", function () {
      $(this).toggleClass("active");
      selector.find(".h-search-form-field").toggleClass("show");
      if ($(this).find("i").hasClass("ot-flaticon-loupe")) {
        $(this)
          .find("i")
          .removeClass("ot-flaticon-loupe")
          .addClass("ot-flaticon-close");
      } else {
        $(this)
          .find("i")
          .removeClass("ot-flaticon-close")
          .addClass("ot-flaticon-loupe");
      }
    });
  });

  /* --------------------------------------------------
   * Function header bottom begin
   * --------------------------------------------------*/
  var headerBottom = $(".header-bottom").parents("header");

  function otHeaderBottomLoad() {
    var mq = window.matchMedia("(min-width: 1025px)"),
      $document = $(document),
      header_height = parseInt(headerBottom.height(), 10),
      screen_height = parseInt($(window).height(), 10),
      header_mt = screen_height - header_height;

    window.addEventListener("scroll", function (e) {
      if (mq.matches) {
        var $document = $(document),
          header_height = parseInt(headerBottom.height(), 10),
          screen_height = parseInt($(window).height(), 10),
          header_mt = screen_height - header_height;

        headerBottom.css("position", "fixed");
        headerBottom.css("top", "0");
      }
    });
  }


  /* Function header bottom close */

  $(window).on("load", function () {
    if (headerBottom.length > 0) {
      otHeaderBottomLoad();
    }
  });

  $(".ot-accordions-wrapper").each(function () {
    var selector = $(this),
      content = selector.find(".ot-acc-item__content"),
      header = selector.find(".ot-acc-item__title");

    header.off("click");

    header.each(function () {
      if ($(this).data("default") == "yes") {
        $(this).next().addClass("active").slideDown(300);
        $(this).parent().addClass("current");
      }
    });

    header.on("click", function (e) {
      e.preventDefault();
      var $this = $(this);

      $this.next().toggleClass("active").slideToggle(300);
      $this.parent().toggleClass("current");
      content.not($this.next()).slideUp(300);
      header.not($this).parent().removeClass("current");
    });
  });

  $($(".ot-cpt-heading")[0]).addClass("active");
  $("ul").on("click", "li", function () {
    var pos = $(this).index() + 2;
    $("tr").find("td:not(:eq(0))").hide();
    $("td:nth-child(" + pos + ")").css("display", "table-cell");
    $("tr").find("th:not(:eq(0))").hide();
    $("li").removeClass("active");
    $(this).addClass("active");
  });

  $(document).ready(function () {
    /* --------------------------------------------------
     * mobile menu
     * --------------------------------------------------*/
    $(".mmenu_wrapper li:has(ul)").prepend(
      '<span class="arrow"><i class="ot-flaticon-arrow-point-to-right"></i></span>'
    );
    $(".mmenu_wrapper .mobile_mainmenu > li span.arrow").on(
      "click",
      function () {
        $(this).parent().find("> ul").stop(true, true).slideToggle();
        $(this).toggleClass("active");
      }
    );

    $("#mmenu_toggle").on("click", function () {
      $(this).toggleClass("active");
      $(this).parents(".header_mobile").toggleClass("open");
      if ($(this).hasClass("active")) {
        $(".mobile_nav").stop(true, true).slideDown(300);
      } else {
        $(".mobile_nav").stop(true, true).slideUp(300);
      }
    });

    var element = $("#mmenu-toggle"),
      mmenu = $("#mmenu-wrapper");

    function mmenu_handler() {
      var isActive = !element.hasClass("active");

      element.toggleClass("active", isActive);
      mmenu.toggleClass("mmenu-open", isActive);
      $("body").toggleClass("mmenu-active", isActive);
      return false;
    }

    $("#mmenu-toggle, .mmenu-close, .mmenu-overlay").on("click", mmenu_handler);

    $(".mmenu-wrapper li:has(ul)").prepend(
      '<span class="arrow"><i class="ot-flaticon-arrow-point-to-right"></i></span>'
    );
    $(".mmenu-wrapper .mobile_mainmenu > li span.arrow").on(
      "click",
      function () {
        $(this).parent().find("> ul").stop(true, true).slideToggle();
        $(this).toggleClass("active");
      }
    );

    /* --------------------------------------------------
     * sticky header
     * --------------------------------------------------*/
    $(".header-static .is-fixed")
      .parent()
      .append('<div class="header-clone"></div>');
    $(".header-clone").height($("#site-header .is-fixed").outerHeight());
    $(".header-static .header-clone").hide();
    $(window).on("scroll", function () {
      var site_header = $("#site-header").outerHeight() + 1;

      if ($(window).scrollTop() >= site_header) {
        $(".site-header .is-fixed").addClass("is-stuck");
        $(".header-static .header-clone").show();
      } else {
        $(".site-header .is-fixed").removeClass("is-stuck");
        $(".header-static .header-clone").hide();
      }
    });

    $("a.scroll-target").on("click", function (e) {
      var $anchor = $(this);
      $("html, body").animate({
        scrollTop: $($anchor.attr("href")).offset().top - 0,
      });
      e.preventDefault();
    });
  });

  /* --------------------------------------------------
   * back to top
   * --------------------------------------------------*/
  if ($("#back-to-top").length) {
    var scrollTrigger = $(".hero-video").height() - 80 /* px*/,
      backToTop = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
          $("#back-to-top").addClass("show");
          $(".transparent-header").addClass("white-header");
        } else {
          $("#back-to-top").removeClass("show");
          $(".transparent-header").removeClass("white-header");
        }
      };
    backToTop();
    $(window).on("scroll", function () {
      backToTop();
    });
    $("#back-to-top").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        700
      );
    });
  }

  function updateFilter() {
    $(window).load(function () {
      $(".project_filters a").each(function () {
        var data_filter = this.getAttribute("data-filter");
        var num = $(this)
          .closest(".project-filter-wrapper")
          .find(".project-item")
          .filter(data_filter).length;
        $(this).find(".filter-count").text(num);
        if (num != 0 && $(this).hasClass("empty")) {
          $(this).removeClass("empty");
        }
      });
    });
  }

  /* Filter Portfolio */
  $(window).load(function () {
    $(".project-filter-wrapper").each(function () {
      var $container = $(this).find(".projects-grid");
      $container.isotope({
        itemSelector: ".project-item",
        animationEngine: "css",
        masonry: {
          columnWidth: ".grid-sizer",
          fitWidth: true
        },
      });

      var $optionSets = $(this).find(".project_filters"),
        $optionLinks = $optionSets.find("a");

      $optionLinks.on("click", function () {
        var $this = $(this);

        if ($this.hasClass("selected")) {
          return false;
        }
        var $optionSet = $this.parents(".project_filters");
        $optionSet.find(".selected").removeClass("selected");
        $this.addClass("selected");

        var selector = $(this).attr("data-filter");
        $container.isotope({
          filter: selector,
        });
        return false;
      });
      /* popup gallery */
      if ($container.hasClass("img-popup")) {
        $(".img-popup").lightGallery({
          selector: ".projects-thumbnail",
          share: false,
          pager: false,
          thumbnail: false,
        });
      }
      /* count filters */
      updateFilter();
    });
  });

})(jQuery);


const autoplayVideo = function () {
  if (window.location.pathname === "/productList.html" || window.location.pathname === "/productDetails.html") return;
  const videoEl = document.querySelector(".video-box video");
  videoEl.muted = true;
  if (typeof videoEl.loop == 'boolean') { // loop supported
    videoEl.loop = true;
  } else {
    // loop property not supported
    videoEl.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  videoEl.play();
};
autoplayVideo();

const accordionHandler = function () {
  if (window.location.pathname === "/productList.html") {
    const accordionEl = document.querySelector(".accordion");
    accordionEl.addEventListener("click", function (e) {
      const clickTrigger = e.target.closest(".accordion-trigger");
      clickTrigger.classList.toggle("trigger-active");
      if (!clickTrigger) return;
      const triggerClosestAccordionItem = clickTrigger.closest(".accordion-item");
      triggerClosestAccordionItem.querySelector(".accordion-content").classList.toggle("accordion-active");
    });
  }
};
accordionHandler();

const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;