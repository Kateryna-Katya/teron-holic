/**
 * TERON-HOLIC.BLOG - ОФИЦИАЛЬНЫЙ СКРИПТ ПЛАТФОРМЫ (2026)
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
  // Используем Lucide для современных минималистичных иконок
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeNav = document.querySelector('.mobile-nav__close');
  const navLinks = document.querySelectorAll('.header__link, .mobile-nav__link');
  const phoneInput = document.getElementById('phoneInput');
  const contactForm = document.getElementById('contactForm');
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookies = document.getElementById('acceptCookies');

  // 3. ЛОГИКА МОБИЛЬНОГО МЕНЮ
  const toggleMenu = () => {
      mobileNav.classList.toggle('mobile-nav--active');
      document.body.style.overflow = mobileNav.classList.contains('mobile-nav--active') ? 'hidden' : '';
  };

  if (burger) burger.addEventListener('click', toggleMenu);
  if (closeNav) closeNav.addEventListener('click', toggleMenu);

  // Закрытие при клике на ссылку (для якорной навигации)
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (mobileNav.classList.contains('mobile-nav--active')) {
              toggleMenu();
          }
      });
  });

  // 4. ЭФФЕКТЫ ПРИ СКРОЛЛЕ (HEADER)
  window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
          header.classList.add('header--scrolled');
      } else {
          header.classList.remove('header--scrolled');
      }
  });

  // 5. ПРОДВИНУТЫЕ АНИМАЦИИ (GSAP + ScrollTrigger)
  if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Фикс разрыва слов: используем SplitType с группировкой по словам и символам
      const heroTitle = new SplitType('.hero__title', {
          types: 'words,chars',
          tagName: 'span'
      });

      // Анимация появления заголовка Hero
      gsap.from(heroTitle.chars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.02,
          duration: 1.2,
          ease: "expo.out"
      });

      // Анимация контента Hero (текст и кнопки)
      gsap.from('.hero__badge, .hero__text, .hero__btns', {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.5,
          stagger: 0.2,
          ease: "power3.out"
      });

      // Появление секций при скролле (Scroll Reveal)
      const revealElements = document.querySelectorAll('.benefit-card, .innovation-item, .blog-card, .section-header');

      revealElements.forEach((el) => {
          gsap.from(el, {
              scrollTrigger: {
                  trigger: el,
                  start: "top 85%", // Анимация начнется, когда элемент на 85% в поле видимости
                  toggleActions: "play none none none"
              },
              opacity: 0,
              y: 40,
              duration: 0.8,
              ease: "power2.out"
          });
      });

      // Интерактивный параллакс для декоративного круга в Hero
      gsap.to('.hero__circle', {
          scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
          },
          y: 200,
          scale: 1.2,
          opacity: 0.5
      });
  }

  // 6. ВАЛИДАЦИЯ ФОРМЫ И КАПЧА
  if (phoneInput) {
      // Разрешаем только цифры в поле телефона
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
  }

  // Генерация математической капчи
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const captchaQuestion = document.getElementById('captchaQuestion');
  const correctSum = num1 + num2;

  if (captchaQuestion) {
      captchaQuestion.innerText = `${num1} + ${num2} = ?`;
  }

  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const userAnswer = document.getElementById('captchaAnswer').value;
          const formMessage = document.getElementById('formMessage');

          if (parseInt(userAnswer) !== correctSum) {
              alert("Ошибка: Неверный ответ на математический пример.");
              return;
          }

          // Имитация AJAX-запроса
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          submitBtn.disabled = true;
          submitBtn.innerText = "Отправка...";

          setTimeout(() => {
              formMessage.style.display = 'block';
              formMessage.innerHTML = `<div style="color: #4ade80; background: rgba(74, 222, 128, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px;">
                  ⚡ Спасибо! Ваш запрос принят. Мы свяжемся с вами в ближайшее время.
              </div>`;

              contactForm.reset();
              submitBtn.disabled = false;
              submitBtn.innerText = "Отправить запрос";

              // Убираем сообщение через 7 секунд
              setTimeout(() => { formMessage.innerHTML = ""; }, 7000);
          }, 1500);
      });
  }

  // 7. ЛОГИКА COOKIE POPUP
  const COOKIE_KEY = 'teron_holic_cookies_accepted';

  if (cookiePopup && !localStorage.getItem(COOKIE_KEY)) {
      // Показываем плавно через 3 секунды после загрузки
      setTimeout(() => {
          cookiePopup.style.display = 'block';
          gsap.fromTo(cookiePopup, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6 });
      }, 3000);
  }

  if (acceptCookies) {
      acceptCookies.addEventListener('click', () => {
          localStorage.setItem(COOKIE_KEY, 'true');
          gsap.to(cookiePopup, {
              opacity: 0,
              y: 50,
              duration: 0.4,
              onComplete: () => cookiePopup.style.display = 'none'
          });
      });
  }

  // 8. ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          e.preventDefault();
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
              const headerOffset = 80;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
              });
          }
      });
  });
});