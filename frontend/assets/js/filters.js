// Function to set up redirection click handlers on buttons
window.selectCar = function(carId, model, dailyPrice, color, year, description, image) {
    localStorage.setItem('selectedCarId', carId);
    localStorage.setItem('selectedCarModel', model);
    localStorage.setItem('selectedCarPrice', dailyPrice);
    localStorage.setItem('selectedCarColor', color);
    localStorage.setItem('selectedCarYear', year);
    if (description) {
        localStorage.setItem('selectedCarDesc', description);
    } else {
        localStorage.removeItem('selectedCarDesc');
    }
    if (image) {
        localStorage.setItem('selectedCarImg', image);
    } else {
        localStorage.removeItem('selectedCarImg');
    }
    window.location.href = 'carDetails.html';
};

document.addEventListener('DOMContentLoaded', () => {
    // State to hold current filters
    const filterState = {
        type: 'all',
        maxPrice: 1000,
        color: null,
        searchQuery: ''
    };

    // DOM Elements
    let carCards = [];
    const typeButtons = document.querySelectorAll('#filter-type .filter-btn');
    const priceRange = document.getElementById('filter-price');
    const colorButtons = document.querySelectorAll('#filter-color .filter-color-btn');
    const carListingsContainer = document.getElementById('car-listings');
    
    // Search elements
    const searchInput = document.querySelector('input[placeholder="Search by car model"]');
    const buttons = document.querySelectorAll('button');
    let searchBtn = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('Search Cars')) {
            searchBtn = btn;
        }
    });

    // Render custom cars from localStorage
    function renderCustomCars() {
        const customCars = JSON.parse(localStorage.getItem('velocifyCustomCars') || '[]');
        customCars.forEach(car => {
            // Check if card with this ID already exists (to avoid duplicate rendering)
            if (document.getElementById(`car-card-${car.carId}`)) return;
            
            const card = document.createElement('div');
            card.id = `car-card-${car.carId}`;
            card.className = "car-card bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group hover:shadow-[0px_8px_32px_rgba(33,150,243,0.12)] transition-all duration-300";
            card.setAttribute('data-type', car.type.toLowerCase());
            card.setAttribute('data-price', car.dailyPrice);
            card.setAttribute('data-color', car.color.toLowerCase());
            card.setAttribute('data-name', car.model.toLowerCase());

            const statusClass = car.status === 'AVAILABLE' ? 'text-green-600' : 'text-yellow-600';
            const statusText = car.status === 'AVAILABLE' ? 'Available' : 'Booked';

            card.innerHTML = `
                <div class="aspect-[16/13] bg-slate-50 p-lg relative overflow-hidden">
                    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${car.image}" />
                    <div class="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-sm">
                        <span class="material-symbols-outlined ${statusClass} text-sm">check_circle</span>
                        <span class="font-label-sm text-[10px] uppercase font-bold text-on-surface">${statusText}</span>
                    </div>
                </div>
                <div class="p-sm space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-h3 text-h3 text-on-surface">${car.model}</h4>
                            <p class="font-label-sm text-label-sm text-secondary">Year: 2026 • Color: ${car.color}</p>
                        </div>
                        <div class="text-right">
                            <span class="font-h3 text-h3 text-primary">$${parseInt(car.dailyPrice)}</span>
                            <span class="font-label-sm text-label-sm text-outline block">/ day</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <span class="px-2 py-1 bg-surface-container text-on-secondary-container rounded font-label-sm text-[12px]">${car.type.toUpperCase()}</span>
                    </div>
                    <button class="w-full py-3 bg-primary-container text-white font-button text-button rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98] btn-rent-custom" 
                            data-id="${car.carId}">Rent Now</button>
                </div>
            `;
            // Add it at the beginning of the container
            if (carListingsContainer) {
                carListingsContainer.insertBefore(card, carListingsContainer.firstChild);
            }
        });

        // Add event listeners for custom rent buttons
        document.querySelectorAll('.btn-rent-custom').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = btn.getAttribute('data-id');
                const customCars = JSON.parse(localStorage.getItem('velocifyCustomCars') || '[]');
                const car = customCars.find(c => c.carId === carId);
                if (car) {
                    selectCar(car.carId, car.model, car.dailyPrice, car.color, 2026, car.description, car.image);
                }
            });
        });
    }

    // Fetch and Render from Backend
    async function loadCars() {
        try {
            const res = await fetch('http://localhost:8080/api/cars');
            if (!res.ok) throw new Error('Backend offline or error');
            const data = await res.json();
            const cars = data.content || [];

            if (cars.length > 0) {
                carListingsContainer.innerHTML = ''; // clear mock cars
                cars.forEach(car => {
                    const typeAttr = car.model.toLowerCase().includes('porsche') || car.model.toLowerCase().includes('ferrari') ? 'luxury' :
                                     car.model.toLowerCase().includes('tesla') ? 'electric' : 'suv';

                    // Map beautiful pre-loaded image URLs to seed cars
                    const images = {
                        'porsche': 'https://lh3.googleusercontent.com/aida-public/AB6AXuACgL9WWB_mSSE5nQ5nMKaDzShcVKejxaQgDVMzPVRAR1UpOo3hQrq122C23Ut-AorUYtoYshsxkkidiU3YmCNlSEsbvEklesXbWy754jKs3gCa9WOwvPirnjmE9vAVV6f94fzA3436qHWVgoOD8v3-TAz9iP-ri6nVZfq2JxSUt35jdcNCUnq8vxghsMhOhqJbXrCXvFsTq-Tyy9iyVDRviH_H0irlChcOkRRJCc0dhwLYNz8shzo7GdT_MOuIC6aw-7b5iZuuj2s',
                        'tesla': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAns72IbzUrzLYrSNn71Y4g2WahZmFAU3DK5JArvSLCHaxSchYOtw5wTwwo0oi-0a0SQa8FIQSjseE0yuyb8t1YQmlMh8ZYKugnW6U0z9BLIOPhJ_S6E2nUjOvJJ0oj8v-Ji-q1tNKCmziMti0AO4fXaDMqKv82In7oYxIL8zDqINoA4DdjvUZFsJ_qCPvTBuYwHfEbt46x-sDthfJuG4UC7-6kKku_W1hDiPDe3rRuR3chJD6zf1mgChKaLsBSI0z_uWrWFMuIW7M',
                        'audi': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJQ6B9idWkrHKGtDe-qQNkZJ-272y_6JyNe4aCZjM2McmvzwKrR5Tv7EsTi9_OKLvW1kHPxNWksiCWC8Bo4HefX2vGB0IxdIcQFP_umHtzEZhfemlM16B4A2uF__rwm9B0TABzZgM7qDsUpHWe_UV1kuZRrUGJIVeZhXlyCu-2IAHA2aAcbzdbupvg867qGSxf7yjLhwf0YJjrowToYQdf87VGt6aJV1ZuHO0--A9FgNj-gW0cFPE0nveEP_uSHIzJ0UzxqEQEF8',
                        'ferrari': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY3-mu5bRXt_0SmB4wotXzSr6XiUlroI_6i_Csv5Plif7t5boivzM5qkWsg42GrlB1xpctAEHmu6LvuAO3OJ6bWf7qeo3Gp16h3DTAQxO1YzT3UDOM-h8WxBdeh1oqjV0s2swFrWuIkggsW8HA4xG5jFpd2n3WTSB5890kJUGx90s8ie-0FYYvC9KIN18Th32f5smqzRAxd32pfnJei6mbtLjFA5ifqbHCkW_teGG3gecv91BQV_i3NZL0YGWkDUbRsC-W_1AF76Y'
                    };

                    let imgUrl = images.porsche;
                    for (const key in images) {
                        if (car.model.toLowerCase().includes(key)) {
                            imgUrl = images[key];
                            break;
                        }
                    }

                    const card = document.createElement('div');
                    card.className = "car-card bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group hover:shadow-[0px_8px_32px_rgba(33,150,243,0.12)] transition-all duration-300";
                    card.setAttribute('data-type', typeAttr);
                    card.setAttribute('data-price', car.dailyPrice);
                    card.setAttribute('data-color', car.color.toLowerCase());
                    card.setAttribute('data-name', car.model.toLowerCase());

                    card.innerHTML = `
                        <div class="aspect-[16/13] bg-slate-50 p-lg relative overflow-hidden">
                            <img class="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" src="${imgUrl}" />
                            <div class="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-sm">
                                <span class="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                                <span class="font-label-sm text-[10px] uppercase font-bold text-on-surface">${car.status}</span>
                            </div>
                        </div>
                        <div class="p-sm space-y-3">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-h3 text-h3 text-on-surface">${car.model}</h4>
                                    <p class="font-label-sm text-label-sm text-secondary">Year: ${car.year} • Color: ${car.color}</p>
                                </div>
                                <div class="text-right">
                                    <span class="font-h3 text-h3 text-primary">$${parseInt(car.dailyPrice)}</span>
                                    <span class="font-label-sm text-label-sm text-outline block">/ day</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <span class="px-2 py-1 bg-surface-container text-on-secondary-container rounded font-label-sm text-[12px]">${car.licensePlate}</span>
                            </div>
                            <button class="w-full py-3 bg-primary-container text-white font-button text-button rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]" 
                                    onclick="selectCar(${car.carId}, '${car.model}', ${car.dailyPrice}, '${car.color}', ${car.year})">Rent Now</button>
                        </div>
                    `;
                    carListingsContainer.appendChild(card);
                });
            }
        } catch (err) {
            console.warn("Could not fetch cars from backend. Falling back to static data.", err);
            // Re-bind mock card buttons for seamless flow even if offline
            document.querySelectorAll('.car-card button').forEach((btn, idx) => {
                const card = btn.closest('.car-card');
                const model = card.querySelector('h4').textContent;
                const price = card.getAttribute('data-price');
                const color = card.getAttribute('data-color');
                const year = 2023;
                btn.removeAttribute('onclick');
                btn.addEventListener('click', () => {
                    selectCar(idx + 1, model, price, color, year);
                });
            });
        } finally {
            // Render custom cars
            renderCustomCars();
            // Update reference list of elements to filter
            carCards = document.querySelectorAll('.car-card');
            applyFilters();
        }
    }

    // 1. Car Type Filter
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterState.type = e.target.getAttribute('data-value');
            typeButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-white');
                b.classList.add('bg-surface-container', 'text-on-surface-variant');
            });
            e.target.classList.remove('bg-surface-container', 'text-on-surface-variant');
            e.target.classList.add('bg-primary-container', 'text-white');
            applyFilters();
        });
    });

    // 2. Price Range Filter
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            filterState.maxPrice = parseInt(e.target.value);
            applyFilters();
        });
    }

    // 3. Color Filter
    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            if (filterState.color === color) {
                filterState.color = null;
                e.target.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            } else {
                filterState.color = color;
                colorButtons.forEach(b => b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'));
                e.target.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            }
            applyFilters();
        });
    });

    // 4. Search Filter
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            filterState.searchQuery = searchInput.value.toLowerCase().trim();
            applyFilters();
        });
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterState.searchQuery = searchInput.value.toLowerCase().trim();
                applyFilters();
            }
        });
    }

    // Core Filtering Logic
    function applyFilters() {
        carCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardColor = card.getAttribute('data-color');
            const cardName = card.getAttribute('data-name');

            let matchesType = false;
            if (filterState.type === 'all') {
                matchesType = true;
            } else {
                matchesType = cardType.includes(filterState.type);
            }

            const matchesPrice = cardPrice <= filterState.maxPrice;
            const matchesColor = !filterState.color || cardColor === filterState.color;
            const matchesSearch = !filterState.searchQuery || cardName.includes(filterState.searchQuery);

            if (matchesType && matchesPrice && matchesColor && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Load initial cars
    loadCars();
});

