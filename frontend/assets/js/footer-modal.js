(function () {
    // Inject Custom Keyframe Animations
    const styleId = 'footer-modal-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes velocifyFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes velocifyScaleUp {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .velocify-fade-in {
                animation: velocifyFadeIn 0.2s ease-out forwards;
            }
            .velocify-scale-up {
                animation: velocifyScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            /* Toast Animation */
            @keyframes velocifyToastIn {
                0% { transform: translateY(100px) scale(0.9); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            .velocify-toast {
                animation: velocifyToastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `;
        document.head.appendChild(style);
    }

    // Modal Template Setup
    let backdrop = null;
    let modalContainer = null;
    let modalTitle = null;
    let modalBody = null;

    function initModal() {
        if (backdrop) return;

        backdrop = document.createElement('div');
        backdrop.className = 'fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300';
        
        backdrop.innerHTML = `
            <div id="velocify-modal" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-all duration-300 flex flex-col max-h-[85vh]">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 id="velocify-modal-title" class="text-lg font-bold text-slate-900 dark:text-white font-['Inter']"></h3>
                    <button id="velocify-modal-close" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                <!-- Modal Body -->
                <div id="velocify-modal-body" class="px-6 py-5 overflow-y-auto font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4 flex-1">
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        modalContainer = backdrop.querySelector('#velocify-modal');
        modalTitle = backdrop.querySelector('#velocify-modal-title');
        modalBody = backdrop.querySelector('#velocify-modal-body');

        // Close handlers
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        backdrop.querySelector('#velocify-modal-close').addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !backdrop.classList.contains('pointer-events-none')) {
                closeModal();
            }
        });
    }

    function openModal(title, contentHTML) {
        initModal();
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        
        // Remove class restrictions for scrolling & classes
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('velocify-fade-in');
        modalContainer.classList.remove('scale-95');
        modalContainer.classList.add('velocify-scale-up');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!backdrop) return;
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('velocify-fade-in');
        modalContainer.classList.add('scale-95');
        modalContainer.classList.remove('velocify-scale-up');
        document.body.style.overflow = '';
    }

    // Success Toast Notification
    function showToast(message) {
        let toastContainer = document.getElementById('velocify-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'velocify-toast-container';
            toastContainer.className = 'fixed bottom-5 right-5 z-[10000] flex flex-col gap-2';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'velocify-toast bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold font-[\'Inter\']';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-green-400 dark:text-green-600 text-[20px]" data-icon="check_circle">check_circle</span>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Dummy Content Database
    const contentTemplates = {
        terms: () => `
            <div class="space-y-4">
                <p>Welcome to Velocify! These terms and conditions govern your use of our premium car rental services.</p>
                <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                        1. Rental Eligibility
                    </h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">All drivers must be at least 21 years of age and possess a valid driver's license and credit card. International drivers must present a passport and valid international driving permit.</p>
                </div>
                <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-primary text-[18px]">directions_car</span>
                        2. Vehicle Utilization
                    </h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Vehicles must not be used off-road, for towing, racing, commercial transport, or in violation of traffic regulations. Smoking is strictly prohibited in all vehicles.</p>
                </div>
                <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-primary text-[18px]">local_gas_station</span>
                        3. Fuel & Toll Policies
                    </h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Vehicles must be returned with the same level of fuel as at pickup. Renters are responsible for all tolls and traffic offenses incurred during the rental term.</p>
                </div>
            </div>
        `,
        privacy: () => `
            <div class="space-y-4">
                <p>At Velocify, we hold your privacy in the highest regard. This Privacy Policy details how we collect, process, and protect your data.</p>
                <div class="space-y-3">
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">database</span>
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Information We Collect</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Personal details (name, email, phone), driver's license records, payment card information, and GPS telemetry data from active vehicle rentals.</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">security</span>
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Data Protection</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">We utilize modern encryption standards (SSL/TLS) to secure all databases, payment gateways, and data in transit.</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">share</span>
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Third-Party Sharing</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">We only share information with payment processors, identity validation vendors, and insurance partners, never with advertising networks.</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        cookies: () => `
            <div class="space-y-4">
                <p>We use cookies to optimize web performance, analyze traffic, and provide personalized services.</p>
                <form id="velocify-cookies-form" class="space-y-4 pt-2">
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Essential Cookies</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400">Necessary for website operation, user login, and booking flows.</p>
                        </div>
                        <span class="text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Required</span>
                    </div>
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Performance & Analytics</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400">Helps us gather anonymous statistics to improve vehicle booking speeds.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cookie-perf" checked class="sr-only peer">
                            <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between pb-3">
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">Personalization & Marketing</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400">Used to remember your vehicle type preference and show deals.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cookie-marketing" class="sr-only peer">
                            <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
                        </label>
                    </div>
                    <div class="pt-2 flex justify-end">
                        <button type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-primary-container text-white font-semibold text-xs rounded-xl shadow hover:opacity-90 active:scale-95 transition-all">
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        `,
        support: () => `
            <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    <span class="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                    <div>
                        <p class="text-xs font-bold text-slate-800 dark:text-white">Active Concierge Support</p>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400">Our customer support specialists are online. Avg response time: 5 mins.</p>
                    </div>
                </div>
                <form id="velocify-support-form" class="space-y-3 pt-2">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                        <input type="email" id="support-email" required placeholder="yourname@domain.com" class="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs outline-none focus:border-primary-container transition-all">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Subject</label>
                        <select id="support-subject" class="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs outline-none focus:border-primary-container transition-all">
                            <option>General Rental Inquiry</option>
                            <option>Booking Modification</option>
                            <option>Billing & Payment Help</option>
                            <option>Vehicle Troubleshooting</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Message</label>
                        <textarea id="support-msg" required rows="3" placeholder="Tell us how we can help..." class="w-full p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs outline-none focus:border-primary-container transition-all resize-none"></textarea>
                    </div>
                    <button type="submit" id="support-submit-btn" class="w-full py-2.5 bg-primary-container text-white font-semibold text-xs rounded-xl shadow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Submit Support Ticket
                    </button>
                </form>
            </div>
        `
    };

    // Attach listeners on load
    function setupFooterModalListeners() {
        // Query footer links matching text content
        const links = document.querySelectorAll('footer a, footer button');
        links.forEach(link => {
            const text = (link.textContent || '').trim().toLowerCase();
            if (text.includes('terms of service')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal('Terms of Service', contentTemplates.terms());
                });
            } else if (text.includes('privacy policy')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal('Privacy Policy', contentTemplates.privacy());
                });
            } else if (text.includes('cookie settings')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal('Cookie Preferences', contentTemplates.cookies());
                    setupCookieFormListener();
                });
            } else if (text.includes('contact support')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal('Contact Concierge Support', contentTemplates.support());
                    setupSupportFormListener();
                });
            }
        });
    }

    // Cookie Preference Form Action handler
    function setupCookieFormListener() {
        const form = document.getElementById('velocify-cookies-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal();
            showToast('Cookie preferences updated successfully!');
        });
    }

    // Support Form Action handler
    function setupSupportFormListener() {
        const form = document.getElementById('velocify-support-form');
        const submitBtn = document.getElementById('support-submit-btn');
        if (!form || !submitBtn) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Request...
            `;

            setTimeout(() => {
                closeModal();
                showToast('Concierge support ticket submitted! Check email for updates.');
            }, 1000);
        });
    }

    // Run setup on load or DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFooterModalListeners);
    } else {
        setupFooterModalListeners();
    }
})();
