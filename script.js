/**
 * PORTFÓLIO — Guilherme Gonçalves
 * script.js — Versão 1.0
 *
 * Funcionalidades:
 *  1. Header scroll (classe .scrolled + link ativo)
 *  2. Menu mobile (hamburguer)
 *  3. Animações de reveal no scroll (Intersection Observer)
 *  4. Animação das barras de skill (Intersection Observer)
 *  5. Formulário de contato (validação + feedback simulado)
 *  6. Botão "Voltar ao topo"
 *  7. Scroll suave ao clicar em links de âncora
 */

/* ============================================================
   UTILITÁRIO: DOM Query simplificado
   (sem jQuery, mas mais legível)
   ============================================================ */

/**
 * Seleciona um único elemento. Retorna null se não existir.
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element|null}
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Seleciona múltiplos elementos como Array.
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element[]}
 */
function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/* ============================================================
   1. HEADER: adicionar classe .scrolled e destacar link ativo
   ============================================================ */

function initHeader() {
  const header     = $('#header');
  const navLinks   = $$('.nav__link');
  const sections   = $$('main section[id]'); // Seções com ID

  if (!header) return;

  // Threshold de scroll para ativar o estilo "scrolled"
  const SCROLL_THRESHOLD = 50;

  /**
   * Atualiza a classe .scrolled e o link ativo no nav
   * conforme a posição de scroll.
   */
  function onScroll() {
    // Classe scrolled no header
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Link ativo: encontra qual seção está na viewport
    let currentSection = '';

    sections.forEach(function(section) {
      // Se o topo da seção já passou do header, ela está "ativa"
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    // Remove/adiciona .active nos links do nav
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Escuta o evento de scroll (passive = melhor performance)
  window.addEventListener('scroll', onScroll, { passive: true });

  // Roda uma vez ao carregar para estado inicial
  onScroll();
}

/* ============================================================
   2. MENU MOBILE (hamburguer)
   ============================================================ */

function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-menu__link');

  if (!hamburger || !mobileMenu) return;

  /**
   * Alterna (abre/fecha) o menu mobile.
   */
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);

    // Atualiza atributos ARIA para acessibilidade
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);

    // Bloqueia scroll do body quando menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /**
   * Fecha o menu.
   */
  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Clique no hamburguer
  hamburger.addEventListener('click', toggleMenu);

  // Fecha o menu ao clicar em um link
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

/* ============================================================
   3. ANIMAÇÕES DE REVEAL (Intersection Observer)
      Mais performático que escutar scroll para cada elemento.
   ============================================================ */

function initRevealAnimations() {
  const revealElements = $$('.reveal');

  if (!revealElements.length) return;

  // Configuração do observador:
  // - threshold 0.12 = elemento aparece quando 12% está visível
  // - rootMargin -60px = margem interna para disparar um pouco antes do fim
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Para de observar após revelar (otimização)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos marcados com .reveal
  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ============================================================
   4. ANIMAÇÃO DAS BARRAS DE SKILL
      Animação da barra de progresso só quando o card fica visível.
   ============================================================ */

function initSkillBars() {
  const skillCards = $$('.skill-card');

  if (!skillCards.length) return;

  const observerOptions = {
    threshold: 0.5, // 50% do card visível para animar
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bar  = $('.skill-card__bar', card);

        if (bar) {
          // Pega o valor do atributo data-width definido no HTML
          const targetWidth = bar.getAttribute('data-width');

          // Pequeno delay antes de iniciar a animação
          setTimeout(function() {
            bar.style.width = targetWidth + '%';
          }, 200);
        }

        observer.unobserve(card);
      }
    });
  }, observerOptions);

  skillCards.forEach(function(card) {
    observer.observe(card);
  });
}

/* ============================================================
   5. FORMULÁRIO DE CONTATO
      Validação em tempo real + feedback simulado
      (sem back-end real, mas mostra o padrão correto)
   ============================================================ */

function initContactForm() {
  const form        = $('#contactForm');
  const submitBtn   = $('#submitBtn');
  const feedback    = $('#formFeedback');

  if (!form) return;

  // Referências dos campos e erros
  const campos = {
    nome: {
      input: $('#nome'),
      error: $('#nomeError'),
    },
    email: {
      input: $('#email'),
      error: $('#emailError'),
    },
    mensagem: {
      input: $('#mensagem'),
      error: $('#mensagemError'),
    },
  };

  /* ---- Funções de validação ---- */

  /**
   * Valida se o campo não está vazio.
   * @param {string} value
   * @returns {boolean}
   */
  function isNotEmpty(value) {
    return value.trim().length > 0;
  }

  /**
   * Valida o formato do e-mail com regex simples.
   * @param {string} value
   * @returns {boolean}
   */
  function isValidEmail(value) {
    // Regex básica mas funcional para e-mails comuns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  /**
   * Valida um campo individual e atualiza a UI.
   * @param {HTMLInputElement|HTMLTextAreaElement} input
   * @param {HTMLElement} errorEl
   * @param {string} errorMessage
   * @param {Function} validationFn
   * @returns {boolean} - true se válido
   */
  function validateField(input, errorEl, errorMessage, validationFn) {
    const isValid = validationFn(input.value);

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      errorEl.textContent = '';
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      errorEl.textContent = errorMessage;
    }

    return isValid;
  }

  /* ---- Validação em tempo real (ao sair do campo) ---- */

  campos.nome.input.addEventListener('blur', function() {
    validateField(
      campos.nome.input,
      campos.nome.error,
      'Por favor, informe seu nome.',
      isNotEmpty
    );
  });

  campos.email.input.addEventListener('blur', function() {
    validateField(
      campos.email.input,
      campos.email.error,
      'Informe um e-mail válido.',
      isValidEmail
    );
  });

  campos.mensagem.input.addEventListener('blur', function() {
    validateField(
      campos.mensagem.input,
      campos.mensagem.error,
      'Escreva sua mensagem antes de enviar.',
      isNotEmpty
    );
  });

  /* ---- Limpa o estado ao digitar novamente ---- */

  [campos.nome.input, campos.email.input, campos.mensagem.input].forEach(function(input) {
    input.addEventListener('input', function() {
      // Remove o estado de erro ao digitar
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
        // Encontra o erro correspondente e limpa
        const errorId = input.id + 'Error';
        const errorEl = $('#' + errorId);
        if (errorEl) errorEl.textContent = '';
      }
    });
  });

  /* ---- Submissão do formulário ---- */

  form.addEventListener('submit', function(event) {
    // Previne o comportamento padrão de reload
    event.preventDefault();

    // Esconde feedback anterior
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    // Valida todos os campos e coleta resultados
    const isNomeOk = validateField(
      campos.nome.input,
      campos.nome.error,
      'Por favor, informe seu nome.',
      isNotEmpty
    );

    const isEmailOk = validateField(
      campos.email.input,
      campos.email.error,
      'Informe um e-mail válido.',
      isValidEmail
    );

    const isMensagemOk = validateField(
      campos.mensagem.input,
      campos.mensagem.error,
      'Escreva sua mensagem antes de enviar.',
      isNotEmpty
    );

    // Se algum campo falhou, interrompe
    if (!isNomeOk || !isEmailOk || !isMensagemOk) {
      // Foca no primeiro campo inválido
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* ---- Simula envio (substitua por fetch() real com back-end) ---- */

    // Estado: carregando
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Simula latência de rede (1.5 segundos)
    setTimeout(function() {
      // Remove estado de loading
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Exibe mensagem de sucesso
      feedback.textContent = '✓ Mensagem enviada! Responderei em breve.';
      feedback.className = 'form__feedback success';

      // Reseta o formulário
      form.reset();

      // Remove estados de validação dos campos
      [campos.nome.input, campos.email.input, campos.mensagem.input].forEach(function(input) {
        input.classList.remove('is-valid', 'is-invalid');
      });

      // Scroll suave até o feedback para o usuário ver
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Esconde o feedback após 6 segundos
      setTimeout(function() {
        feedback.className = 'form__feedback';
        feedback.textContent = '';
      }, 6000);

    }, 1500);
  });
}

/* ============================================================
   6. BOTÃO VOLTAR AO TOPO
   ============================================================ */

function initBackToTop() {
  const btn = $('#backToTop');

  if (!btn) return;

  const SHOW_THRESHOLD = 400; // Pixels de scroll para mostrar o botão

  // Mostra/esconde conforme scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  // Ao clicar, rola suavemente ao topo
  btn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ============================================================
   7. SCROLL SUAVE — Links de âncora internos
      (garante compatibilidade além do CSS scroll-behavior)
   ============================================================ */

function initSmoothScroll() {
  // Seleciona todos os links internos (href começa com #)
  const anchorLinks = $$('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      const href = link.getAttribute('href');

      // Ignora links que são apenas "#" (sem alvo)
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();

        // Calcula posição descontando o header fixo
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height'),
          10
        ) || 70;

        const targetPosition = target.getBoundingClientRect().top
          + window.pageYOffset
          - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ============================================================
   INICIALIZAÇÃO
   Só roda após o HTML estar completamente carregado
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileMenu();
  initRevealAnimations();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initSmoothScroll();

  // Log de boas-vindas no console (toque de desenvolvedor)
  console.log(
    '%c Guilherme Gonçalves — Dev Front-End ',
    'background: #4f8ef7; color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
  );
  console.log(
    '%c Código limpo, organizado e sem frameworks 🚀',
    'color: #56d9c8; font-size: 12px; padding: 4px 0;'
  );
});