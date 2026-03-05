document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. THEME TOGGLE (Dark Mode / Light Mode)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check if the user already chose a theme in a previous visit
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.checked = true;
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = false;
    }

    // Listen for clicks on the switch
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light'); // Save preference
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // Save preference
        }
    });


    // ==========================================
    // 2. HERO SECTION BUTTONS (Smooth Scrolling)
    // ==========================================
    
    // The arrow button in the Hero section goes to "About Us"
    const nextSectionBtn = document.querySelector('.hero .next-section-btn');
    if (nextSectionBtn) {
        nextSectionBtn.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // The "ORDER NOW" button scrolls directly down to the "Menu"
    const orderBtn = document.querySelector('.order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    }


    // ==========================================
    // 3. ABOUT US TEAM SLIDER
    // ==========================================
    const teamCards = document.querySelectorAll('.team-card');
    const prevBtn = document.querySelector('.about-nav .prev-btn');
    const nextBtn = document.querySelector('.about-nav .next-btn');
    
    // Start with the 4th card active (Index 3, because counting starts at 0)
    let currentIndex = 3; 

    // Function to change which card is highlighted
    function updateActiveCard(newIndex) {
        // Remove the blue border (active class) from all cards first
        teamCards.forEach(card => card.classList.remove('active'));
        
        // Make sure the index loops back around if it goes past the ends
        if (newIndex < 0) {
            currentIndex = teamCards.length - 1; // Go to the last card
        } else if (newIndex >= teamCards.length) {
            currentIndex = 0; // Go back to the first card
        } else {
            currentIndex = newIndex; // Keep the valid index
        }
        
        // Add the active class to the new target
        teamCards[currentIndex].classList.add('active');
    }

    // Button click events for Left and Right arrows
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            updateActiveCard(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            updateActiveCard(currentIndex + 1);
        });
    }

    // Optional: Let users click a specific card to highlight it instantly
    teamCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            updateActiveCard(index);
        });
    });

});

// ==========================================
    // 4. MENU CATEGORY TABS & SLIDER ARROWS
    // ==========================================
    const categoryItems = document.querySelectorAll('.category-item');
    const menuRows = document.querySelectorAll('.menu-row');
    const menuPrevBtn = document.querySelector('.menu-sidebar .prev-btn');
    const menuNextBtn = document.querySelector('.menu-sidebar .next-btn');
    
    let currentCategoryIndex = 0; // Tracks which category is currently active

    if (categoryItems.length > 0 && menuRows.length > 0) {
        
        // Function to handle changing the active category
        function activateCategory(index) {
            // Update tracking index
            currentCategoryIndex = index;

            // 1. Remove 'active' class from all categories
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // 2. Add 'active' class to the target category
            categoryItems[index].classList.add('active');
            
            // 3. Hide all menu rows on the right
            menuRows.forEach(row => {
                row.style.display = 'none';
                row.style.opacity = '0'; 
            });
            
            // 4. Show only the row that matches the clicked category
            if (menuRows[index]) {
                menuRows[index].style.display = 'flex';
                
                setTimeout(() => {
                    menuRows[index].style.opacity = '1';
                    menuRows[index].style.transition = 'opacity 0.4s ease';
                }, 50);
            }
        }

        // Allow clicking directly on the tabs
        categoryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                activateCategory(index);
            });
        });

        // Make the Left/Right Arrows work
        if (menuPrevBtn && menuNextBtn) {
            menuPrevBtn.addEventListener('click', () => {
                let newIndex = currentCategoryIndex - 1;
                if (newIndex < 0) newIndex = categoryItems.length - 1; // Loop to end
                activateCategory(newIndex);
            });

            menuNextBtn.addEventListener('click', () => {
                let newIndex = currentCategoryIndex + 1;
                if (newIndex >= categoryItems.length) newIndex = 0; // Loop to start
                activateCategory(newIndex);
            });
        }

        // Trigger the first category (Hot Coffee) on page load
        activateCategory(0);
    }
    
    // ==========================================
    // INTERACTIVE ORDERING SYSTEM
    // ==========================================
    let cart = [];
    let currentItem = { name: '', price: 0, qty: 1 };

    const menuItemsIcons = document.querySelectorAll('.menu-img-container');
    const itemModal = document.getElementById('item-modal');
    const cartModal = document.getElementById('cart-modal');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const toast = document.getElementById('order-toast');

    const modalItemName = document.getElementById('modal-item-name');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemQty = document.getElementById('modal-item-qty');
    const modalTotalPrice = document.getElementById('modal-total-price');
    
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');
    const btnAddToOrder = document.getElementById('add-to-order-btn');
    const btnSubmitOrder = document.getElementById('submit-order-btn');

    menuItemsIcons.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            const price = parseFloat(item.getAttribute('data-price'));

            if(name && price) {
                currentItem = { name, price, qty: 1 };
                
                modalItemName.innerText = name;
                modalItemPrice.innerText = price.toFixed(2);
                modalItemQty.innerText = currentItem.qty;
                modalTotalPrice.innerText = (price * currentItem.qty).toFixed(2);
                
                itemModal.classList.add('show');
            }
        });
    });

    btnMinus.addEventListener('click', () => {
        if (currentItem.qty > 1) {
            currentItem.qty--;
            modalItemQty.innerText = currentItem.qty;
            modalTotalPrice.innerText = (currentItem.price * currentItem.qty).toFixed(2);
        }
    });

    btnPlus.addEventListener('click', () => {
        currentItem.qty++;
        modalItemQty.innerText = currentItem.qty;
        modalTotalPrice.innerText = (currentItem.price * currentItem.qty).toFixed(2);
    });

    btnAddToOrder.addEventListener('click', () => {
        const existingItem = cart.find(i => i.name === currentItem.name);
        if (existingItem) {
            existingItem.qty += currentItem.qty;
        } else {
            cart.push({...currentItem});
        }
        
        itemModal.classList.remove('show');
        updateCartUI();
    });

    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartList = document.getElementById('cart-items-list');
        const cartTotalDisplay = document.getElementById('cart-total-price');
        
        let totalItems = 0;
        let totalPrice = 0;
        cartList.innerHTML = '';

        cart.forEach(item => {
            totalItems += item.qty;
            let itemTotal = item.price * item.qty;
            totalPrice += itemTotal;
            
            cartList.innerHTML += `
                <div class="cart-item">
                    <span>${item.qty}x ${item.name}</span>
                    <span>₱${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        cartCount.innerText = totalItems;
        cartTotalDisplay.innerText = totalPrice.toFixed(2);

        if (totalItems > 0) {
            viewCartBtn.style.display = 'block';
        } else {
            viewCartBtn.style.display = 'none';
        }
    }

    viewCartBtn.addEventListener('click', () => cartModal.classList.add('show'));
    document.getElementById('close-item-modal').addEventListener('click', () => itemModal.classList.remove('show'));
    document.getElementById('close-cart-modal').addEventListener('click', () => cartModal.classList.remove('show'));

    btnSubmitOrder.addEventListener('click', () => {
        if (cart.length === 0) return;

        cartModal.classList.remove('show');
        cart = [];
        updateCartUI();

        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    });