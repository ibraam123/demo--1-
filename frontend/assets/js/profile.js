import { auth } from "./firebase.js";
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-profile-name").textContent =
      user.displayName || "No Name";
    document.getElementById("edit-name-input").value =
      user.displayName || "No Name";
    document.getElementById("modal-email").value = user.email;
    loadUserBookings(user);
  } else {
    window.location.href = "../../login&register.html";
  }
});

async function loadUserBookings(user) {
  const tableBody = document.getElementById("past-rentals-table-body");
  const activeRentalContainer = document.getElementById("active-rental-container");

  // Load custom bookings from localStorage
  const customBookings = JSON.parse(localStorage.getItem('velocifyCustomBookings') || '[]');
  let apiBookings = [];

  try {
    const token = await user.getIdToken();
    const res = await fetch('http://localhost:8080/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      apiBookings = await res.json();
    } else {
      console.warn("Failed to fetch bookings from server.");
    }
  } catch (err) {
    console.error("Error loading user bookings from API:", err);
  }

  // Merge custom and API bookings
  const bookings = [...customBookings, ...apiBookings];

  // Sort bookings (latest first) based on numeric digits in bookingId
  bookings.sort((a, b) => {
    const idA = parseInt(a.bookingId.toString().replace(/\D/g, '')) || 0;
    const idB = parseInt(b.bookingId.toString().replace(/\D/g, '')) || 0;
    return idB - idA;
  });

  // Populate Active Rental (Latest booking)
  if (activeRentalContainer) {
    if (bookings.length > 0) {
      populateActiveRental(bookings[0]);
    } else {
      showEmptyActiveRental();
    }
  }

  // Populate Past Rentals Table (All other bookings)
  if (tableBody) {
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-md py-8 text-center text-on-surface-variant font-medium">
            No past rentals found. Head to the <a href="home.html" class="text-primary underline font-bold">fleet catalog</a> to book your first ride!
          </td>
        </tr>
      `;
      return;
    }

    const images = {
      'porsche': 'https://lh3.googleusercontent.com/aida-public/AB6AXuACgL9WWB_mSSE5nQ5nMKaDzShcVKejxaQgDVMzPVRAR1UpOo3hQrq122C23Ut-AorUYtoYshsxkkidiU3YmCNlSEsbvEklesXbWy754jKs3gCa9WOwvPirnjmE9vAVV6f94fzA3436qHWVgoOD8v3-TAz9iP-ri6nVZfq2JxSUt35jdcNCUnq8vxghsMhOhqJbXrCXvFsTq-Tyy9iyVDRviH_H0irlChcOkRRJCc0dhwLYNz8shzo7GdT_MOuIC6aw-7b5iZuuj2s',
      'tesla': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAns72IbzUrzLYrSNn71Y4g2WahZmFAU3DK5JArvSLCHaxSchYOtw5wTwwo0oi-0a0SQa8FIQSjseE0yuyb8t1YQmlMh8ZYKugnW6U0z9BLIOPhJ_S6E2nUjOvJJ0oj8v-Ji-q1tNKCmziMti0AO4fXaDMqKv82In7oYxIL8zDqINoA4DdjvUZFsJ_qCPvTBuYwHfEbt46x-sDthfJuG4UC7-6kKku_W1hDiPDe3rRuR3chJD6zf1mgChKaLsBSI0z_uWrWFMuIW7M',
      'audi': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJQ6B9idWkrHKGtDe-qQNkZJ-272y_6JyNe4aCZjM2McmvzwKrR5Tv7EsTi9_OKLvW1kHPxNWksiCWC8Bo4HefX2vGB0IxdIcQFP_umHtzEZhfemlM16B4A2uF__rwm9B0TABzZgM7qDsUpHWe_UV1kuZRrUGJIVeZhXlyCu-2IAHA2aAcbzdbupvg867qGSxf7yjLhwf0YJjrowToYQdf87VGt6aJV1ZuHO0--A9FgNj-gW0cFPE0nveEP_uSHIzJ0UzxqEQEF8',
      'ferrari': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY3-mu5bRXt_0SmB4wotXzSr6XiUlroI_6i_Csv5Plif7t5boivzM5qkWsg42GrlB1xpctAEHmu6LvuAO3OJ6bWf7qeo3Gp16h3DTAQxO1YzT3UDOM-h8WxBdeh1oqjV0s2swFrWuIkggsW8HA4xG5jFpd2n3WTSB5890kJUGx90s8ie-0FYYvC9KIN18Th32f5smqzRAxd32pfnJei6mbtLjFA5ifqbHCkW_teGG3gecv91BQV_i3NZL0YGWkDUbRsC-W_1AF76Y'
    };

    bookings.forEach(booking => {
      const model = booking.carModel || 'Premium Fleet Vehicle';
      let imgUrl = booking.carImage || images.porsche;
      if (!booking.carImage) {
        for (const key in images) {
          if (model.toLowerCase().includes(key)) {
            imgUrl = images[key];
            break;
          }
        }
      }

      let category = 'Premium Luxury';
      if (model.toLowerCase().includes('tesla')) category = 'Electric SUV';
      else if (model.toLowerCase().includes('audi')) category = 'Executive Sedan';
      else if (model.toLowerCase().includes('porsche')) category = 'Performance Elite';

      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      const optionsShort = { month: 'short', day: '2-digit' };
      const optionsYear = { year: 'numeric' };

      const startStr = start.toLocaleDateString('en-US', optionsShort);
      const endStr = end.toLocaleDateString('en-US', optionsShort);
      const yearStr = end.toLocaleDateString('en-US', optionsYear);
      
      const formattedDates = `${startStr} - ${endStr}, ${yearStr}`;

      const durationTime = Math.abs(end - start);
      let durationDays = Math.ceil(durationTime / (1000 * 60 * 60 * 24));
      if (durationDays === 0) durationDays = 1;

      const totalPrice = parseFloat(booking.totalPrice).toFixed(2);
      
      let statusClass = 'bg-surface-container text-secondary';
      if (booking.status === 'CONFIRMED' || booking.status === 'APPROVED') {
        statusClass = 'bg-green-100 text-green-800';
      }

      const row = document.createElement('tr');
      row.className = "hover:bg-surface-container-lowest transition-colors";
      row.innerHTML = `
        <td class="px-md py-md">
          <div class="flex items-center gap-sm">
            <div class="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
              <img alt="${model}" class="w-full h-full object-cover" src="${imgUrl}" />
            </div>
            <div>
              <p class="font-body-md font-semibold text-on-surface">${model}</p>
              <p class="text-xs text-on-surface-variant">${category}</p>
            </div>
          </div>
        </td>
        <td class="px-md py-md">
          <p class="font-body-md text-on-surface">${formattedDates}</p>
          <p class="text-xs text-on-surface-variant">${durationDays} ${durationDays === 1 ? 'Day' : 'Days'}</p>
        </td>
        <td class="px-md py-md">
          <p class="font-body-md font-semibold text-on-surface">$${totalPrice}</p>
        </td>
        <td class="px-md py-md">
          <span class="px-3 py-1 ${statusClass} text-xs font-semibold rounded-full">${booking.status}</span>
        </td>
        
      `;
      tableBody.appendChild(row);
    });
  }
}

function populateActiveRental(booking) {
  const container = document.getElementById("active-rental-container");
  if (!container) return;

  const model = booking.carModel || 'Premium Fleet Vehicle';
  
  const images = {
    'porsche': 'https://lh3.googleusercontent.com/aida-public/AB6AXuACgL9WWB_mSSE5nQ5nMKaDzShcVKejxaQgDVMzPVRAR1UpOo3hQrq122C23Ut-AorUYtoYshsxkkidiU3YmCNlSEsbvEklesXbWy754jKs3gCa9WOwvPirnjmE9vAVV6f94fzA3436qHWVgoOD8v3-TAz9iP-ri6nVZfq2JxSUt35jdcNCUnq8vxghsMhOhqJbXrCXvFsTq-Tyy9iyVDRviH_H0irlChcOkRRJCc0dhwLYNz8shzo7GdT_MOuIC6aw-7b5iZuuj2s',
    'tesla': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAns72IbzUrzLYrSNn71Y4g2WahZmFAU3DK5JArvSLCHaxSchYOtw5wTwwo0oi-0a0SQa8FIQSjseE0yuyb8t1YQmlMh8ZYKugnW6U0z9BLIOPhJ_S6E2nUjOvJJ0oj8v-Ji-q1tNKCmziMti0AO4fXaDMqKv82In7oYxIL8zDqINoA4DdjvUZFsJ_qCPvTBuYwHfEbt46x-sDthfJuG4UC7-6kKku_W1hDiPDe3rRuR3chJD6zf1mgChKaLsBSI0z_uWrWFMuIW7M',
    'audi': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJQ6B9idWkrHKGtDe-qQNkZJ-272y_6JyNe4aCZjM2McmvzwKrR5Tv7EsTi9_OKLvW1kHPxNWksiCWC8Bo4HefX2vGB0IxdIcQFP_umHtzEZhfemlM16B4A2uF__rwm9B0TABzZgM7qDsUpHWe_UV1kuZRrUGJIVeZhXlyCu-2IAHA2aAcbzdbupvg867qGSxf7yjLhwf0YJjrowToYQdf87VGt6aJV1ZuHO0--A9FgNj-gW0cFPE0nveEP_uSHIzJ0UzxqEQEF8',
    'ferrari': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY3-mu5bRXt_0SmB4wotXzSr6XiUlroI_6i_Csv5Plif7t5boivzM5qkWsg42GrlB1xpctAEHmu6LvuAO3OJ6bWf7qeo3Gp16h3DTAQxO1YzT3UDOM-h8WxBdeh1oqjV0s2swFrWuIkggsW8HA4xG5jFpd2n3WTSB5890kJUGx90s8ie-0FYYvC9KIN18Th32f5smqzRAxd32pfnJei6mbtLjFA5ifqbHCkW_teGG3gecv91BQV_i3NZL0YGWkDUbRsC-W_1AF76Y'
  };

  let imgUrl = booking.carImage || images.porsche;
  if (!booking.carImage) {
    for (const key in images) {
      if (model.toLowerCase().includes(key)) {
        imgUrl = images[key];
        break;
      }
    }
  }

  let category = 'Premium Luxury';
  if (model.toLowerCase().includes('tesla')) category = 'Electric SUV';
  else if (model.toLowerCase().includes('audi')) category = 'Executive Sedan';
  else if (model.toLowerCase().includes('porsche')) category = 'Performance Elite';

  let licensePlate = 'VEL-' + (booking.carId || '911');

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  const optionsShort = { month: 'short', day: '2-digit', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', optionsShort);
  const endStr = end.toLocaleDateString('en-US', optionsShort);

  const totalPrice = parseFloat(booking.totalPrice).toFixed(2);

  window.activeBookingData = booking;

  container.innerHTML = `
    <div class="w-full lg:w-1/3 h-48 sm:h-64 lg:h-auto relative bg-surface-container-low group overflow-hidden">
        <img alt="${model}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="${imgUrl}" />
        <div
            class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border border-outline-variant shadow-sm text-label-sm font-label-sm">
            License: ${licensePlate}
        </div>
    </div>
    <div class="w-full lg:w-2/3 p-lg flex flex-col justify-between">
        <div>
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-primary font-label-sm uppercase tracking-widest mb-1">${category}</p>
                    <h3 class="font-h3 text-h3 text-on-surface mb-2">${model}</h3>
                </div>
                <div class="text-right">
                    <p class="font-label-sm text-on-surface-variant">Total Cost</p>
                    <p class="font-h3 text-h3 text-primary">$${totalPrice}</p>
                </div>
            </div>
            <div class="mt-md grid grid-cols-2 gap-md border-y border-outline-variant py-md">
                <div>
                    <p class="font-label-sm text-on-surface-variant mb-1">Pickup Date</p>
                    <p class="font-body-md font-semibold text-on-surface">${startStr}</p>
                    <p class="text-xs text-on-surface-variant">LAX Terminal 1</p>
                </div>
                <div>
                    <p class="font-label-sm text-on-surface-variant mb-1">Drop-off Date</p>
                    <p class="font-body-md font-semibold text-on-surface">${endStr}</p>
                    <p class="text-xs text-on-surface-variant">LAX Terminal 1</p>
                </div>
            </div>
        </div>
        <div class="mt-md flex flex-col sm:flex-row gap-sm pt-2">
            <button onclick="window.openContractModal(window.activeBookingData)"
                class="flex-1 bg-primary-container text-white font-button text-button py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-xs shadow-md shadow-primary/20">
                <span class="material-symbols-outlined" data-weight="fill">description</span>
                View Digital Contract
            </button>
        </div>
    </div>
  `;
}

function showEmptyActiveRental() {
  const container = document.getElementById("active-rental-container");
  if (!container) return;

  container.innerHTML = `
    <div class="w-full p-lg flex flex-col items-center justify-center text-center py-12">
        <span class="material-symbols-outlined text-[64px] text-slate-300 mb-4">directions_car</span>
        <h3 class="font-h3 text-h3 text-on-surface font-semibold mb-2">No Active Rentals</h3>
        <p class="text-on-surface-variant font-body-md max-w-md mb-6">You don't have any current rental bookings. Head to the fleet catalog to find your next premium ride!</p>
        <a href="home.html" class="bg-primary text-white px-md py-3 rounded-xl font-button text-button hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 inline-flex items-center gap-xs">
            <span class="material-symbols-outlined text-sm">explore</span>
            Browse Fleet
        </a>
    </div>
  `;
}

// Global modal bindings
window.openContractModal = function(booking) {
  if (!booking) return;

  const model = booking.carModel || 'Premium Fleet Vehicle';
  let licensePlate = 'VEL-' + (booking.carId || '911');
  
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  
  const optionsShort = { month: 'short', day: '2-digit', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', optionsShort);
  const endStr = end.toLocaleDateString('en-US', optionsShort);

  document.getElementById("contract-booking-id").textContent = `#BK-${booking.bookingId}`;
  document.getElementById("contract-user-name").textContent = auth.currentUser.displayName || "Velocify Member";
  document.getElementById("contract-user-email").textContent = auth.currentUser.email;
  document.getElementById("contract-car-model").textContent = model;
  document.getElementById("contract-car-license").textContent = `License: ${licensePlate}`;
  document.getElementById("contract-pickup-date").textContent = `${startStr} - 10:00 AM`;
  document.getElementById("contract-dropoff-date").textContent = `${endStr} - 04:00 PM`;
  document.getElementById("contract-total-cost").textContent = `$${parseFloat(booking.totalPrice).toFixed(2)}`;

  document.getElementById('digital-contract-modal').classList.remove('hidden');
}

window.closeContractModal = function() {
  document.getElementById('digital-contract-modal').classList.add('hidden');
}

document.getElementById("profile-edit-btn").addEventListener("click", async () => {
  const user = auth.currentUser
  const newName = document.getElementById("edit-name-input").value.trim()

  if (!user || !newName) return;

  try {
    await updateProfile(user, {
      displayName: newName
    });

    document.getElementById("user-profile-name").textContent = newName;
    alert("Profile updated successfully!");
  } catch (error) {
    alert(error.message);
  }
})