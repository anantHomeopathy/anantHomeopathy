/* ============================================
   ANANT HOMOEOPATHY CLINIC - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

            if (!name || !phone) {
                alert('કૃપા કરીને તમારું નામ અને મોબાઈલ નંબર દાખલ કરો.');
                return;
            }

            let text = `નમસ્તે ડૉ. જીગ્નેશ,\n\n`;
            text += `મારે એપોઇન્ટમેન્ટ બુક કરવી છે.\n\n`;
            text += `*નામ:* ${name}\n`;
            text += `*ફોન:* ${phone}\n`;
            if (email) text += `*ઈમેઈલ:* ${email}\n`;
            if (message) text += `*તકલીફ:* ${message}\n`;
            text += `\nઆભાર.`;

            const encoded = encodeURIComponent(text);
            window.open(`https://wa.me/919773273169?text=${encoded}`, '_blank');
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
async function loadBlogPosts() {
    const grid = document.getElementById('blogGrid');
    const empty = document.getElementById('blogEmpty');

    try {
        const response = await fetch('blog/posts.json');
        if (!response.ok) throw new Error('No posts file');

        const posts = await response.json();

        if (!posts || posts.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        grid.innerHTML = '';

        posts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'blog-card reveal';

            const imgSrc = post.image || 'assets/images/logo.jpeg';
            const date = post.date || '';
            const hasContent = post.content && post.content.length > 0;

            card.innerHTML = `
                <img src="${imgSrc}" alt="${post.title}" class="blog-card-img" loading="lazy">
                <div class="blog-card-body">
                    <p class="blog-card-date">${date}</p>
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                    <a href="#" class="blog-read-more" data-index="${index}">વધુ વાંચો &rarr;</a>
                </div>
            `;

            // Add click handler for Read More
            card.querySelector('.blog-read-more').addEventListener('click', (e) => {
                e.preventDefault();
                openBlogModal(post);
            });

            grid.appendChild(card);
        });

        observeRevealElements('.blog-card.reveal');

    } catch {
        grid.innerHTML = `
            <div class="blog-card reveal active">
                <img src="assets/images/logo.jpeg" alt="Blog" class="blog-card-img" loading="lazy">
                <div class="blog-card-body">
                    <p class="blog-card-date">ટૂંક સમયમાં</p>
                    <h4>હોમિયોપેથી: કુદરતી ઉપચારનો માર્ગ</h4>
                    <p>હોમિયોપેથીના સિદ્ધાંતો વિશે જાણો અને કેવી રીતે તે ક્રોનિક રોગોની કુદરતી સારવાર કરે છે.</p>
                    <span class="blog-read-more">ટૂંક સમયમાં &rarr;</span>
                </div>
            </div>
        `;
    }
}

// Open blog modal with full content
function openBlogModal(post) {
    const modal = document.getElementById('blogModal');
    const img = document.getElementById('blogModalImg');
    const date = document.getElementById('blogModalDate');
    const title = document.getElementById('blogModalTitle');
    const text = document.getElementById('blogModalText');

    img.src = post.image || 'assets/images/logo.jpeg';
    img.alt = post.title;
    date.textContent = post.date || '';
    title.textContent = post.title;
    text.textContent = post.content || post.excerpt;

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
        grid.innerHTML = `
            <div class="video-card reveal active">
                <div style="width:100%;aspect-ratio:16/9;background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1rem;">
                    વિડિયો ટૂંક સમયમાં
                </div>
                <div class="video-card-body">
                    <h4>આરોગ્ય ટિપ્સ માટે અમારી YouTube ચેનલ સબ્સ્ક્રાઇબ કરો</h4>
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
        grid.innerHTML = `
            <div class="reel-card reveal active" style="text-align:center;padding:40px;">
                <p style="color:var(--text-muted);">રીલ્સ ટૂંક સમયમાં આવશે!</p>
                <a href="https://www.instagram.com/anant_homoeopathy" target="_blank" rel="noopener" class="btn btn-primary" style="margin-top:16px;">Instagram પર ફૉલો કરો</a>
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
