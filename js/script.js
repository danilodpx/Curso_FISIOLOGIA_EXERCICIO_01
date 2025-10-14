/*
  Arquivo: js/script.js
  Descrição: Contém toda a lógica de interatividade da página,
             incluindo o carrossel de vídeos, a criação do acordeão
             e as animações de scroll.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * ===================================================================
     * LÓGICA DO CARROSSEL DE VÍDEOS DE FUNDO
     * ===================================================================
     */
    const initVideoCarousel = () => {
        const videos = document.querySelectorAll('#video-carousel .video-player');
        if (videos.length <= 1) return;

        let currentVideoIndex = 0;
        const slideInterval = 7000;

        setInterval(() => {
            const nextVideoIndex = (currentVideoIndex + 1) % videos.length;
            
            videos[currentVideoIndex].style.opacity = '0';
            videos[nextVideoIndex].style.opacity = '1';
            
            videos[nextVideoIndex].play().catch(error => console.log("A reprodução automática foi bloqueada pelo navegador."));

            currentVideoIndex = nextVideoIndex;
        }, slideInterval);
    };

    /**
     * ===================================================================
     * LAZY LOADING DOS VÍDEOS SECUNDÁRIOS
     * ===================================================================
     */
    const lazyLoadVideos = () => {
        const lazyVideos = document.querySelectorAll('video[data-src]');
        lazyVideos.forEach(video => {
            video.src = video.dataset.src;
            video.removeAttribute('data-src');
            video.load(); // Adicionado para garantir que o navegador carregue a nova fonte
        });
    };

    /**
     * ===================================================================
     * LÓGICA PARA CRIAÇÃO DO ACORDEÃO DINÂMICO
     * ===================================================================
     */
    const createAccordion = () => {
        const courseModules = [
            { title: "Fundamentos da Fisiologia do Exercício", icon: "🔬", content: ["Sistemas Energéticos: ATP-CP, Glicolítico e Oxidativo", "Bioenergética Aplicada", "Metabolismo em Repouso e Exercício", "Zona de Queima de Gordura: Mito ou Realidade?"] },
            { title: "Sistema Cardiovascular e Respiratório", icon: "❤️", content: ["Respostas Agudas Cardiovasculares", "Adaptações Crônicas ao Treinamento", "VO2 Máximo: Avaliação e Interpretação", "Zonas de Frequência Cardíaca"] },
            { title: "Sistema Neuromuscular e Controle Motor", icon: "💪", content: ["Tipos de Fibras Musculares", "Unidades Motoras e Recrutamento", "Mecanismos de Produção de Força", "Fadiga Muscular e Propriocepção"] },
            { title: "Adaptações ao Treinamento de Força", icon: "🏋️", content: ["Hipertrofia Muscular: Mecanismos", "Ganhos de Força Neural vs. Estrutural", "Recuperação Muscular e Síntese Proteica"] },
            { title: "Adaptações ao Treinamento Aeróbico", icon: "🏃", content: ["Adaptações Mitocondriais", "Capilarização e Perfusão Muscular", "Limiar Anaeróbico e de Lactato", "HIIT: Fisiologia e Aplicação"] },
            { title: "Sistema Endócrino e Exercício", icon: "🧬", content: ["Testosterona, GH e Hipertrofia", "Cortisol e Catabolismo", "Insulina e Captação de Glicose", "Hormônios Tireoidianos e Metabolismo"] },
            { title: "Termorregulação e Exercício", icon: "🌡️", content: ["Regulação da Temperatura Corporal", "Exercício em Ambientes Quentes e Frios", "Desidratação e Performance"] }
        ];

        const accordionContainer = document.getElementById('accordion-container');
        if (!accordionContainer) return;

        accordionContainer.innerHTML = courseModules.map((module, index) => {
            const contentId = `accordion-content-${index}`;
            const headerId = `accordion-header-${index}`;
            const topicsList = module.content.map(topic => `<li>${topic}</li>`).join('');

            return `
                <div class="border border-gray-700 rounded-lg bg-gray-900 shadow-sm overflow-hidden">
                    <h3 class="text-md md:text-lg font-semibold text-gray-50 m-0">
                        <button id="${headerId}" aria-expanded="false" aria-controls="${contentId}" class="w-full flex justify-between items-center text-left p-4 md:p-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300 hover:bg-gray-800">
                            <span class="flex items-center pointer-events-none"><span class="text-2xl mr-4">${module.icon}</span>${module.title}</span>
                            <svg class="accordion-icon w-6 h-6 text-cyan-400 transform transition-transform duration-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </button>
                    </h3>
                    <div id="${contentId}" role="region" aria-labelledby="${headerId}" class="accordion-content">
                        <ul class="list-disc list-inside space-y-2 pb-5 text-gray-400">${topicsList}</ul>
                    </div>
                </div>`;
        }).join('');

        accordionContainer.addEventListener('click', (event) => {
            const header = event.target.closest('button');
            if (!header) return;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            accordionContainer.querySelectorAll('button').forEach(btn => {
                if (btn !== header) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.parentElement.nextElementSibling.style.maxHeight = null;
                    btn.querySelector('.accordion-icon').classList.remove('rotate-45');
                }
            });
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                header.parentElement.nextElementSibling.style.maxHeight = header.parentElement.nextElementSibling.scrollHeight + "px";
                header.querySelector('.accordion-icon').classList.add('rotate-45');
            }
        });
    };
    
    /**
     * ===================================================================
     * LÓGICA PARA ANIMAÇÃO DE ENTRADA AO ROLAR A PÁGINA
     * ===================================================================
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.swoosh-enter');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('swoosh-enter-active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    };

    // ===================================================================
    // INICIALIZAÇÃO DAS FUNÇÕES
    // ===================================================================
    // Funções que só precisam da estrutura HTML (DOM) para rodar.
    createAccordion();
    initScrollAnimations();

    // Funções que precisam que todo o conteúdo (imagens, etc) esteja carregado.
    // **AQUI ESTÁ A CORREÇÃO PRINCIPAL**
    window.addEventListener('load', () => {
        lazyLoadVideos();
        initVideoCarousel(); // Agora o carrossel inicia depois que os vídeos são carregados.
    });
});

