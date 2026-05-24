document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('car-posting-form');
    const imageInput = document.getElementById('car-image-input');
    const uploadContainer = document.getElementById('upload-container');

    let uploadedImageDataUrl = '';

    const fallbackImages = {
        'sedan': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJQ6B9idWkrHKGtDe-qQNkZJ-272y_6JyNe4aCZjM2McmvzwKrR5Tv7EsTi9_OKLvW1kHPxNWksiCWC8Bo4HefX2vGB0IxdIcQFP_umHtzEZhfemlM16B4A2uF__rwm9B0TABzZgM7qDsUpHWe_UV1kuZRrUGJIVeZhXlyCu-2IAHA2aAcbzdbupvg867qGSxf7yjLhwf0YJjrowToYQdf87VGt6aJV1ZuHO0--A9FgNj-gW0cFPE0nveEP_uSHIzJ0UzxqEQEF8',
        'suv': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTWFfzWdugHJO6xEEMd-_V95LqK3qMx0bsSECHfIo9h6LO_v9jXNA5Jdly3_94_HQbUkdhl7nOZbp35Vh17Cpa3itXGJsqTwWLrj6JkUm8JMWreqpJWsJj70Miyhd5QsVEruvfvydvsU6T5SSKLGMPRc3JGha5iQmJOT_TYAfJxBqW5BOP2W1mlqYxGVPhLooJIqKlNIXIo9QLSmtlbs3So9ts0jV1eoL-wNYkgIfo7pLc-L-aVtz_JlucWAOiLfCi3eZ-gJdxOSs',
        'electric': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAns72IbzUrzLYrSNn71Y4g2WahZmFAU3DK5JArvSLCHaxSchYOtw5wTwwo0oi-0a0SQa8FIQSjseE0yuyb8t1YQmlMh8ZYKugnW6U0z9BLIOPhJ_S6E2nUjOvJJ0oj8v-Ji-q1tNKCmziMti0AO4fXaDMqKv82In7oYxIL8zDqINoA4DdjvUZFsJ_qCPvTBuYwHfEbt46x-sDthfJuG4UC7-6kKku_W1hDiPDe3rRuR3chJD6zf1mgChKaLsBSI0z_uWrWFMuIW7M',
        'luxury': 'https://lh3.googleusercontent.com/aida-public/AB6AXuACgL9WWB_mSSE5nQ5nMKaDzShcVKejxaQgDVMzPVRAR1UpOo3hQrq122C23Ut-AorUYtoYshsxkkidiU3YmCNlSEsbvEklesXbWy754jKs3gCa9WOwvPirnjmE9vAVV6f94fzA3436qHWVgoOD8v3-TAz9iP-ri6nVZfq2JxSUt35jdcNCUnq8vxghsMhOhqJbXrCXvFsTq-Tyy9iyVDRviH_H0irlChcOkRRJCc0dhwLYNz8shzo7GdT_MOuIC6aw-7b5iZuuj2s',
        'compact': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJQ6B9idWkrHKGtDe-qQNkZJ-272y_6JyNe4aCZjM2McmvzwKrR5Tv7EsTi9_OKLvW1kHPxNWksiCWC8Bo4HefX2vGB0IxdIcQFP_umHtzEZhfemlM16B4A2uF__rwm9B0TABzZgM7qDsUpHWe_UV1kuZRrUGJIVeZhXlyCu-2IAHA2aAcbzdbupvg867qGSxf7yjLhwf0YJjrowToYQdf87VGt6aJV1ZuHO0--A9FgNj-gW0cFPE0nveEP_uSHIzJ0UzxqEQEF8'
    };

    // Handle Image Selection and Preview with Canvas Compression
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        // Max dimensions for compression
                        const maxDim = 600;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > maxDim) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            }
                        } else {
                            if (height > maxDim) {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Compress to JPEG with 0.7 quality to save storage space
                        uploadedImageDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                        // Create/Update UI preview overlay inside the drag-and-drop container
                        let previewImg = uploadContainer.querySelector('.preview-img');
                        if (!previewImg) {
                            previewImg = document.createElement('img');
                            previewImg.className = 'preview-img absolute inset-0 w-full h-full object-cover rounded-xl z-10';
                            uploadContainer.appendChild(previewImg);

                            // Optional: overlay a hover overlay or indicator
                            const overlay = document.createElement('div');
                            overlay.className = 'absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none font-bold';
                            overlay.innerHTML = '<span class="material-symbols-outlined mr-2">change_circle</span> Change Photo';
                            uploadContainer.appendChild(overlay);
                        }
                        previewImg.src = uploadedImageDataUrl;
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle Form Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract Values
            const model = document.getElementById('car-model-input').value.trim();
            const type = document.getElementById('car-type-select').value;
            const color = document.getElementById('car-color-input').value.trim();
            const priceStr = document.getElementById('car-price-input').value;
            const isAvailable = document.getElementById('car-availability-input').checked;
            const description = document.getElementById('car-description-textarea').value.trim();

            if (!model || !type || !color || !priceStr || !description) {
                alert('Please fill out all required fields.');
                return;
            }

            const dailyPrice = parseFloat(priceStr);
            if (isNaN(dailyPrice) || dailyPrice <= 0) {
                alert('Please enter a valid price.');
                return;
            }

            // Fallback Image if user did not upload one
            const finalImage = uploadedImageDataUrl || fallbackImages[type.toLowerCase()] || fallbackImages['sedan'];

            // Construct Car Object
            const customCar = {
                carId: 'custom-' + Date.now(),
                model: model,
                type: type,
                color: color,
                dailyPrice: dailyPrice,
                status: isAvailable ? 'AVAILABLE' : 'BOOKED',
                description: description,
                image: finalImage,
                licensePlate: 'CUSTOM-' + Math.floor(1000 + Math.random() * 9000),
                year: 2026
            };

            // Save to LocalStorage
            try {
                const existingCars = JSON.parse(localStorage.getItem('velocifyCustomCars') || '[]');
                existingCars.push(customCar);
                localStorage.setItem('velocifyCustomCars', JSON.stringify(existingCars));

                alert('Car listed successfully! Redirecting to Home...');
                window.location.href = 'home.html';
            } catch (err) {
                console.error('Error saving car to local storage:', err);
                alert('Storage quota exceeded. Try uploading a smaller image or clear some storage.');
            }
        });
    }
});
