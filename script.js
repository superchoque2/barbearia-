/* ===================================================
   BARBERKING - JAVASCRIPT
   Arquivo: script.js
   Descrição: Funcionalidades interativas do site
   =================================================== */

/* ===== AGUARDA O DOM CARREGAR ===== */
/* Isso garante que todo o HTML foi carregado antes de executar o JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===== VARIÁVEIS GLOBAIS ===== */
    /* Aqui guardamos referências aos elementos que vamos manipular */
    
    // Elementos do menu de navegação
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Botão de voltar ao topo
    const backToTop = document.getElementById('back-to-top');
    
    // Elementos que terão animação ao aparecer na tela
    const animatedElements = document.querySelectorAll('[data-animate]');

    /* ===== MENU MOBILE ===== */
    /* Essa função abre e fecha o menu em dispositivos móveis */
    
    // Quando clica no botão hamburguer
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            // Adiciona ou remove a classe 'active' do botão (transforma em X)
            navToggle.classList.toggle('active');
            // Adiciona ou remove a classe 'active' do menu (mostra/esconde)
            navMenu.classList.toggle('active');
            // Impede o scroll do body quando o menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Quando clica em um link do menu, fecha o menu mobile
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Remove a classe active do botão e do menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            // Libera o scroll do body
            document.body.style.overflow = '';
        });
    });
    
    // Fecha o menu se clicar fora dele
    document.addEventListener('click', function(event) {
        // Verifica se clicou fora do menu e do botão
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ===== HEADER COM SCROLL ===== */
    /* Muda o estilo do header quando rola a página */
    
    function handleScroll() {
        // Se rolou mais de 100 pixels, adiciona a classe 'scrolled'
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Mostra/esconde o botão de voltar ao topo
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Executa a função quando rolar a página
    window.addEventListener('scroll', handleScroll);
    
    // Executa uma vez ao carregar para verificar a posição inicial
    handleScroll();

    /* ===== BOTÃO VOLTAR AO TOPO ===== */
    /* Quando clica, volta suavemente ao início da página */
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ===== ANIMAÇÕES AO SCROLL ===== */
    /* Adiciona as classes do Animate.css quando o elemento aparece na tela */
    
    // Configuração do Intersection Observer
    // Ele "observa" quando elementos entram na área visível da tela
    const observerOptions = {
        root: null, // Usa a viewport como referência
        rootMargin: '0px', // Sem margem extra
        threshold: 0.1 // Dispara quando 10% do elemento está visível
    };
    
    // Função que será executada quando um elemento entrar na tela
    function handleIntersection(entries, observer) {
        entries.forEach(function(entry) {
            // Se o elemento está visível na tela
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                const delay = element.dataset.delay;
                
                // Se tem um delay definido, aplica ele
                if (delay) {
                    element.style.animationDelay = delay + 'ms';
                }
                
                // Adiciona as classes do Animate.css
                element.classList.add('animate__animated', 'animate__' + animationType);
                
                // Para de observar o elemento (a animação só acontece uma vez)
                observer.unobserve(element);
            }
        });
    }
    
    // Cria o observador com as configurações definidas
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Começa a observar cada elemento que tem o atributo data-animate
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });

    /* ===== SCROLL SUAVE PARA LINKS INTERNOS ===== */
    /* Quando clica em um link com #, rola suavemente até a seção */
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            // Pega o valor do href (ex: #servicos)
            const targetId = this.getAttribute('href');
            
            // Se não for apenas "#", procura o elemento alvo
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calcula a posição considerando a altura do header
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Rola suavemente até a posição
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* ===== HIGHLIGHT DO MENU ATIVO ===== */
    /* Destaca o link do menu da seção que está visível */
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Verifica se a posição atual está dentro desta seção
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove a classe active de todos os links
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                });
                
                // Adiciona a classe active no link correspondente
                const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Executa quando rolar a página
    window.addEventListener('scroll', highlightNavLink);

    /* ===== EFEITO PARALLAX SUAVE NA HERO ===== */
    /* Cria um efeito de profundidade ao rolar */
    
    const heroSection = document.querySelector('.hero');
    
    function handleParallax() {
        // Só aplica o efeito em telas maiores (melhor performance)
        if (window.innerWidth > 1024) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            
            if (heroSection) {
                heroSection.style.backgroundPositionY = rate + 'px';
            }
        }
    }
    
    // Usa requestAnimationFrame para melhor performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    /* ===== LAZY LOADING DE IMAGENS ===== */
    /* Carrega as imagens apenas quando ficam próximas da área visível */
    
    // Verifica se o navegador suporta lazy loading nativo
    if ('loading' in HTMLImageElement.prototype) {
        // Se suporta, adiciona o atributo loading="lazy" nas imagens
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    /* ===== PREVINE SPAM NO BOTÃO DE WHATSAPP ===== */
    /* Adiciona um pequeno delay para evitar cliques acidentais */
    
    const whatsappButton = document.querySelector('.whatsapp-float');
    let canClick = true;
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            if (!canClick) {
                e.preventDefault();
                return;
            }
            
            canClick = false;
            
            // Permite clicar novamente após 2 segundos
            setTimeout(function() {
                canClick = true;
            }, 2000);
        });
    }

    /* ===== FECHA MENU AO PRESSIONAR ESC ===== */
    /* Melhora a acessibilidade permitindo fechar o menu com o teclado */
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ===== MENSAGEM NO CONSOLE ===== */
    /* Uma mensagem simpática para desenvolvedores curiosos */
    
    console.log('%c✂ BarberKing - Barbearia Premium', 'color: #ff6b00; font-size: 20px; font-weight: bold;');
    console.log('%cDesenvolvido com 💛 para homens de estilo', 'color: #999; font-size: 12px;');

});

/* ===== PRELOADER (OPCIONAL) ===== */
/* Se quiser adicionar um preloader, descomente o código abaixo */

/*
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
        setTimeout(function() {
            preloader.remove();
        }, 500);
    }
});
*/
