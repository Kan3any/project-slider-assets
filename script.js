
      document.addEventListener("DOMContentLoaded", function () {
        const container = document.querySelector(
          ".naqqar-swiper-container[data-swiper-options]",
        );
        if (!container) return;

        try {
          const optionsString = container.getAttribute("data-swiper-options");
          const swiperOptions = JSON.parse(optionsString);

          const swiper = new Swiper(container, {
            ...swiperOptions,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            updateOnWindowResize: true,
            touchMoveStopPropagation: false,
            grabCursor: true,
          });

          const prevBtns = document.querySelectorAll(".nav-prev, .mobile-prev");
          const nextBtns = document.querySelectorAll(".nav-next, .mobile-next");
          const paginationDots = document.querySelectorAll(".pagination-dot");
          const progressBar = document.querySelector(".progress-fill");

          let progressInterval;

          prevBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
              swiper.slidePrev();
              resetProgress();
            });
          });

          nextBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
              swiper.slideNext();
              resetProgress();
            });
          });

          paginationDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
              swiper.slideTo(index);
              updatePagination(index);
              resetProgress();
            });
          });

          function updatePagination(activeIndex) {
            paginationDots.forEach((dot, index) => {
              dot.classList.toggle("active", index === activeIndex);
            });
          }

          function startProgress() {
            if (!progressBar || !swiperOptions.autoplay) return;

            let progress = 0;
            const delay = swiperOptions.autoplay.delay || 40000;
            const step = 100 / (delay / 100);

            progressInterval = setInterval(() => {
              progress += step;
              progressBar.style.width = progress + "%";

              if (progress >= 100) {
                progress = 0;
                progressBar.style.width = "0%";
              }
            }, 100);
          }

          function resetProgress() {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            if (progressBar) {
              progressBar.style.width = "0%";
            }
            startProgress();
          }

          if (swiperOptions.autoplay) {
            startProgress();

            swiper.on("slideChange", () => {
              const realIndex = swiper.realIndex;
              updatePagination(realIndex);
              resetProgress();
            });

            if (window.innerWidth > 768) {
              container.addEventListener("mouseenter", () => {
                swiper.autoplay.stop();
                if (progressInterval) {
                  clearInterval(progressInterval);
                }
              });

              container.addEventListener("mouseleave", () => {
                swiper.autoplay.start();
                resetProgress();
              });
            }
          }

          if (window.innerWidth <= 768) {
            setTimeout(() => {
              swiper.update();
              swiper.updateSize();
              swiper.updateSlides();
            }, 100);
          }

          updatePagination(0);

          if (window.innerWidth <= 768) {
            const mobileNav = document.querySelector(".mobile-navigation");
            const mobilePagination =
              document.querySelector(".mobile-pagination");

            if (mobileNav) {
              mobileNav.style.display = "flex";
              mobileNav.style.visibility = "visible";
            }

            if (mobilePagination) {
              mobilePagination.style.display = "flex";
              mobilePagination.style.visibility = "visible";
            }
          }
        } catch (error) {
          console.error("Swiper initialization error:", error);
        }
      });
