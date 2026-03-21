/* ============================================
   ANANT HOMOEOPATHY CLINIC - MAIN JS
   ============================================ */

// ---------- Language System ----------
let currentLang = localStorage.getItem('lang') || 'gu';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    const t = translations[lang];
    if (!t) return;

    // Update all data-i18n elements (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            el.textContent = t[key];
        }
    });

    // Update all data-i18n-html elements (innerHTML for content with HTML entities/tags)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });

    // Update all data-i18n-placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) {
            el.placeholder = t[key];
        }
    });

    // Update language switch buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Re-render dynamic blog content if posts are loaded
    if (blogPostsData.length > 0) {
        renderBlogPosts();
    }
}

function getCurrentLang() {
    return currentLang;
}

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Language Switch ----------
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn) {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
            }
        });
    }

    // Apply saved language on load
    setLanguage(currentLang);

    // ---------- Mobile Menu Toggle ----------
    const mobileToggle = document.getElementById('mobileToggle');
    const navbar = document.getElementById('navbar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbar.classList.toggle('open');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('open');
        });
    });

    // ---------- Header Scroll Effect ----------
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ---------- Active Nav Link on Scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---------- Scroll To Top ----------
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Appointment Form -> WhatsApp ----------
    const appointmentForm = document.getElementById('appointmentForm');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const email = document.getElementById('patientEmail').value.trim();
            const message = document.getElementById('patientMessage').value.trim();

            const t = translations[getCurrentLang()];

            if (!name || !phone) {
                alert(t.form_validation_alert);
                return;
            }

            let text = `${t.wa_greeting}\n\n`;
            text += `${t.wa_appointment}\n\n`;
            text += `*${t.wa_name}* ${name}\n`;
            text += `*${t.wa_phone}* ${phone}\n`;
            if (email) text += `*${t.wa_email}* ${email}\n`;
            if (message) text += `*${t.wa_problem}* ${message}\n`;
            text += `\n${t.wa_thanks}`;

            const encoded = encodeURIComponent(text);
            window.open(`https://wa.me/919274743169?text=${encoded}`, '_blank');
        });
    }

    // ---------- Blog Modal ----------
    const blogModal = document.getElementById('blogModal');
    const blogModalClose = document.getElementById('blogModalClose');

    if (blogModalClose) {
        blogModalClose.addEventListener('click', () => {
            blogModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (blogModal) {
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) {
                blogModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ---------- Scroll Reveal Animation ----------
    const revealElements = document.querySelectorAll(
        '.service-card, .why-card, .testimonial-card, .blog-card, .video-card, .reel-card, .contact-card, .about-content, .about-img-frame, .appointment-info, .appointment-form-wrapper'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ---------- Load Content ----------
    loadBlogPosts();
    loadVideos();
    loadReels();
});


// ============================================
// BLOG SYSTEM - Loads from blog/posts.json
// ============================================
let blogPostsData = []; // Store globally for language switching

// Get localized blog field based on current language
function getBlogField(post, field) {
    const lang = getCurrentLang();
    if (lang === 'en' && post[field + '_en']) {
        return post[field + '_en'];
    }
    return post[field] || '';
}

async function loadBlogPosts() {
    const grid = document.getElementById('blogGrid');
    const empty = document.getElementById('blogEmpty');

    try {
        const response = await fetch('blog/posts.json');
        if (!response.ok) throw new Error('No posts file');

        const posts = await response.json();
        blogPostsData = posts;

        if (!posts || posts.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        renderBlogPosts();

    } catch {
        const t = translations[getCurrentLang()];
        grid.innerHTML = `
            <div class="blog-card reveal active">
                <img src="assets/images/logo.jpeg" alt="Blog" class="blog-card-img" loading="lazy">
                <div class="blog-card-body">
                    <p class="blog-card-date">${t.blog_coming_soon}</p>
                    <h4>${t.blog_fallback_title}</h4>
                    <p>${t.blog_fallback_desc}</p>
                    <span class="blog-read-more">${t.blog_coming_soon} &rarr;</span>
                </div>
            </div>
        `;
    }
}

function renderBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid || blogPostsData.length === 0) return;

    const t = translations[getCurrentLang()];
    grid.innerHTML = '';

    blogPostsData.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'blog-card reveal';

        const imgSrc = post.image || 'assets/images/logo.jpeg';
        const title = getBlogField(post, 'title');
        const excerpt = getBlogField(post, 'excerpt');
        const date = getBlogField(post, 'date');

        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}" class="blog-card-img" loading="lazy">
            <div class="blog-card-body">
                <p class="blog-card-date">${date}</p>
                <h4>${title}</h4>
                <p>${excerpt}</p>
                <a href="#" class="blog-read-more" data-index="${index}">${t.blog_read_more} &rarr;</a>
            </div>
        `;

        card.querySelector('.blog-read-more').addEventListener('click', (e) => {
            e.preventDefault();
            openBlogModal(post);
        });

        grid.appendChild(card);
    });

    observeRevealElements('.blog-card.reveal');
}

// Open blog modal with full content
function openBlogModal(post) {
    const modal = document.getElementById('blogModal');
    const img = document.getElementById('blogModalImg');
    const date = document.getElementById('blogModalDate');
    const title = document.getElementById('blogModalTitle');
    const text = document.getElementById('blogModalText');

    const postTitle = getBlogField(post, 'title');
    const postDate = getBlogField(post, 'date');
    const postContent = getBlogField(post, 'content') || getBlogField(post, 'excerpt');

    img.src = post.image || 'assets/images/logo.jpeg';
    img.alt = postTitle;
    date.textContent = postDate;
    title.textContent = postTitle;
    text.textContent = postContent;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


// ============================================
// VIDEO SYSTEM - Loads from js/videos.json
// ============================================
async function loadVideos() {
    const grid = document.getElementById('videosGrid');
    const empty = document.getElementById('videosEmpty');

    try {
        const response = await fetch('js/videos.json');
        if (!response.ok) throw new Error('No videos file');

        const videos = await response.json();

        if (!videos || videos.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        grid.innerHTML = '';

        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card reveal';

            const embedUrl = getYouTubeEmbed(video.url);

            card.innerHTML = `
                <iframe
                    src="${embedUrl}"
                    title="${video.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy">
                </iframe>
                <div class="video-card-body">
                    <h4>${video.title}</h4>
                </div>
            `;

            grid.appendChild(card);
        });

        observeRevealElements('.video-card.reveal');

    } catch {
        const t = translations[getCurrentLang()];
        grid.innerHTML = `
            <div class="video-card reveal active">
                <div style="width:100%;aspect-ratio:16/9;background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1rem;">
                    ${t.videos_fallback}
                </div>
                <div class="video-card-body">
                    <h4>${t.videos_fallback_title}</h4>
                </div>
            </div>
        `;
    }
}


// ============================================
// INSTAGRAM REELS - Loads from js/reels.json
// ============================================
async function loadReels() {
    const grid = document.getElementById('reelsGrid');
    const empty = document.getElementById('reelsEmpty');

    try {
        const response = await fetch('js/reels.json');
        if (!response.ok) throw new Error('No reels file');

        const reels = await response.json();

        if (!reels || reels.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        grid.innerHTML = '';

        reels.forEach(reel => {
            const card = document.createElement('div');
            card.className = 'reel-card reveal';

            const embedUrl = getInstagramEmbed(reel.url);

            card.innerHTML = `
                <iframe
                    src="${embedUrl}"
                    title="${reel.title}"
                    allowfullscreen
                    loading="lazy"
                    scrolling="no">
                </iframe>
                <div class="reel-card-body">
                    <h4>${reel.title}</h4>
                </div>
            `;

            grid.appendChild(card);
        });

        observeRevealElements('.reel-card.reveal');

    } catch {
        const t = translations[getCurrentLang()];
        grid.innerHTML = `
            <div class="reel-card reveal active" style="text-align:center;padding:40px;">
                <p style="color:var(--text-muted);">${t.reels_fallback}</p>
                <a href="https://www.instagram.com/anant_homoeopathy" target="_blank" rel="noopener" class="btn btn-primary" style="margin-top:16px;">${t.reels_follow}</a>
            </div>
        `;
    }
}


// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert YouTube URL to embed URL (supports shorts)
function getYouTubeEmbed(url) {
    if (!url) return '';

    // Handle youtube.com/shorts/ID format
    let match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    // Handle youtu.be/ID format
    match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    // Handle youtube.com/watch?v=ID format
    match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    // Handle youtube.com/embed/ID format (already embedded)
    match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match) return url;

    return url;
}

// Convert Instagram reel URL to embed URL
function getInstagramEmbed(url) {
    if (!url) return '';

    // Remove query params and add /embed
    const cleanUrl = url.split('?')[0];
    // Ensure trailing slash
    const base = cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/';
    return base + 'embed';
}

// Observe elements for reveal animation
function observeRevealElements(selector) {
    document.querySelectorAll(selector).forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        observer.observe(el);
    });
}
