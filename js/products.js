'use strict';

// Function to fetch products from an API
const fetchProduct = async function (apiURL) {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error.message);
  }
};

// Function to handle navigation links
const handleNavigationLinks = async function () {
  const navigationLinks = Array.from(document.querySelectorAll('a'));

  navigationLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (link.dataset.category) {
        const linkDataCategory = link.dataset.category;
        localStorage.setItem('selectedProductCategory', linkDataCategory);
        window.location.href = 'productList.html';
      }
    });
  });
};
handleNavigationLinks();

// Render Loader HTML
const Loader = function () {
  return `<div class="dot-spinner">
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
  <div class="dot-spinner__dot"></div>
</div>`;
};

// Function to render product list HTML
const renderProductListHTML = function (products, productsLength) {

  const productCount = document.querySelector('.product-count-num');
  const searchField = document.querySelector('#product-count-and-sort');
  if (productsLength === 0) {
    const selectField = searchField.querySelector("select");
    const productCountZero = searchField.querySelector(".woocommerce-result-count");
    selectField.style.display = "none";
    productCountZero.style.fontSize = "28px";
  }
  searchField.style.display = 'flex';
  productCount.textContent = productsLength;

  return `
    <div class="row">
      ${products.map(product => `
        <div class="col-lg-4 co-md-6 col-sm-6 first">
          <div class="product-item">
            <div class="product-media" style="max-width: 345px; min-width: 210px !important; max-height: 345px; min-height: 210px !important;">
              <a class="evro-a" data-id="${product._id}">
                ${product.hasDiscount ? `<span class="onsale">Sale!</span>` : ''}
                <img src="${product.cardImage}" class="" alt="evrovagonka item image" />
              </a>
              <div class="wrapper-add-to-cart">
                <div class="add-to-cart-inner">
                  <a data-id="${product._id}" class="button wp-element-button product_type_simple add_to_cart_button ajax_add_to_cart octf-btn octf-btn-second evro-a">სრულად</a>
                </div>
              </div>
            </div>
            <h2 class="woocommerce-loop-product__title">
              <a class="evro-a" data-id="${product._id}">${product.title}</a>
            </h2>
            <span class="price">
              ${product.hasDiscount ?
      `<del aria-hidden="true">
                  <span class="woocommerce-Price-amount amount">
                    <bdi>
                      <span class="woocommerce-Price-currencySymbol">₾</span>
                      ${product.price}
                    </bdi>
                  </span>
                </del>
                <ins>
                  <span class="woocommerce-Price-amount amount">
                    <bdi>
                      <span class="woocommerce-Price-currencySymbol">₾</span>
                      ${product.discountedPrice}
                    </bdi>
                  </span>
                </ins>` :
      `<span class="woocommerce-Price-amount amount">
                  <bdi>
                    <span class="woocommerce-Price-currencySymbol">₾</span>
                    ${product.price}
                  </bdi>
                </span>`
    }
            </span>
          </div>
        </div>`).join('')}
    </div>`;
};

// Function to handle active links in navigation
const activeLinkHandler = function (selectedCategory) {
  const selectedProductCategory = selectedCategory;
  const activeClass = localStorage.getItem('activeClass');
  const categoryLi = document.querySelector(`a[data-category="${selectedProductCategory}"]`);
  if (categoryLi) {
    categoryLi.classList.add(activeClass);
  }
};

// Function to update page title and breadcrumbs
const pageTitleAndBreadcrumbsHandler = function (selectedCategory) {
  const selectedProductCategory = selectedCategory;
  document.title = `RayWood | ${selectedProductCategory}`;
};

// Function to add event listeners to product links
const linkEventListeners = function (renderContainer, products) {
  const linkItems = Array.from(renderContainer.querySelectorAll('[data-id]'));
  products.map(product => {
    linkItems.forEach(linkItem => {
      linkItem.addEventListener('click', function () {
        const linkDataID = linkItem.dataset.id;
        if (linkDataID === product._id) {
          localStorage.setItem('selectedProductId', product._id);
        }
        window.location.href = 'productDetails.html';
      });
    });
  });
};

// Function to populate the product list
const populateProductList = async function () {
  const selectedProductCategory = localStorage.getItem('selectedProductCategory');
  const productListEl = document.querySelector('.products');


  const productCountAndSort = document.querySelector('#product-count-and-sort');
  productCountAndSort.style.display = "none";


  // Step 1: Create a loader element
  const loader = document.createElement('div');
  loader.innerHTML = Loader(); // Use the Loader function to create the loader HTML
  loader.classList.add('loader');

  try {
    // Step 2: Append the loader to the container
    productListEl.appendChild(loader);

    if (selectedProductCategory === 'კატალოგი') {
      // productCountAndSort.style.display = "flex";
      const apiUrlProduct = 'https://raywood-admin.vercel.app/api/products';
      const dataProducts = await fetchProduct(apiUrlProduct);
      const allProductsLength = dataProducts.length;
      productListEl.innerHTML = renderProductListHTML(dataProducts, allProductsLength);
      linkEventListeners(productListEl, dataProducts);
    } else {
      // productCountAndSort.style.display = "flex";
      const apiProductsCategory = `https://raywood-admin.vercel.app/api/products?category=${selectedProductCategory}`;
      const productByCategory = await fetchProduct(apiProductsCategory);
      const productByCategoryLength = productByCategory.length;
      productListEl.innerHTML = renderProductListHTML(productByCategory, productByCategoryLength);
      linkEventListeners(productListEl, productByCategory);
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    // Step 3: Remove the loader after the data is fetched
    productCountAndSort.style.display = "flex";
    const loaderElement = productListEl.querySelector('.loader');
    if (loaderElement) {
      productListEl.removeChild(loaderElement);
    }
  }
};


//პროდუქტების ძებნა და დალაგება ფასის მიხედვით
const searchAndSortProducts = async function (sortOption, searchTerm) {
  const productListEl = document.querySelector(".products");

  try {
    const apiUrlProduct = "https://raywood-admin.vercel.app/api/products";
    const data = await fetchProduct(apiUrlProduct);

    // გაფილტვრა საძებნი სიტყვით და კატეგორიით
    const relevantProducts = data.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );

    // დალაგება ფასის მიხედვით
    if (sortOption === 'price-low-to-high') {
      relevantProducts.sort((a, b) => {
        const priceA = +a.discountedPrice ? +a.discountedPrice : +a.price;
        const priceB = +b.discountedPrice ? +b.discountedPrice : +b.price;
        return priceA - priceB;
      });
    } else if (sortOption === 'price-high-to-low') {
      relevantProducts.sort((a, b) => {
        const priceA = +a.discountedPrice ? +a.discountedPrice : +a.price;
        const priceB = +b.discountedPrice ? +b.discountedPrice : +b.price;
        return priceB - priceA;
      });
    }

    // გამოიტანე შესაბამისი პროდუქტები ან "მოიძებნა 0 პროდუქტი"
    if (relevantProducts.length > 0) {
      const productListHTML = renderProductListHTML(relevantProducts, relevantProducts.length);
      productListEl.innerHTML = productListHTML;
    }

  } catch (error) {
    console.error(error.message);
  }
};

// Attach event listener to the sorting select element and the search form
const sortSelect = document.querySelector('#sortSelect');
const form = document.querySelector('#search-form');
const category = localStorage.getItem("selectedProductCategory");

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the search input value
    const searchInput = form.querySelector('.search-field');
    const searchTerm = searchInput.value.toLowerCase();

    // Get the selected sort option
    const sortOption = sortSelect.value;

    // Call the combined search and sort function
    searchAndSortProducts(sortOption, searchTerm);
  });

  // Call the combined function on sorting select change as well
  sortSelect.addEventListener('change', function () {
    const sortOption = sortSelect.value;

    // Get the current search input value
    const searchInput = form.querySelector('.search-field');
    const searchTerm = searchInput.value.toLowerCase();

    // Call the combined search and sort function
    searchAndSortProducts(sortOption, searchTerm, category);
  });
}


// Function to populate product details
const populateProductDetails = async function () {
  const selectedProductID = localStorage.getItem('selectedProductId');
  const productDetailsContainer = document.querySelector('#productDetailsContainer');
  try {
    const apiUrlProduct = 'https://raywood-admin.vercel.app/api/products';
    const data = await fetchProduct(apiUrlProduct);
    const selectedProduct = data.find(product => product._id === selectedProductID);
    const similarProducts = data.filter(product => product._id !== selectedProduct.id);
    if (selectedProduct) {
      productDetailsContainer.innerHTML = `
      <section class="shop-single my-5 py-3">
         <div class="container">
           <div class="row">
           <div class="col-lg-6 mb-4 mb-lg-0 text-center align-self-center mb-5 mb-lg-0">
           <div class="product-slide">
             ${selectedProduct.discountedPrice ? `<span class="onsale">Sale!</span>` : ""}
             <div class="single-product owl-carousel owl-theme ">
               ${selectedProduct.images.map((image, index) => `
                 <div class="item" data-hash="img-${index}">
                   <img src="${image}" alt="" />
                   <a href="${image}" class="link-image-action">
                     <i class="ot-flaticon-loupe"></i>
                   </a>
                 </div>`).join("")}
             </div>
             <div class="nav-img">
               ${selectedProduct.images.map((image, index) => `
                 <div class="item">
                   <div>
                     <a class="" href="#img-${index}">
                       <img src="${image}" alt="" />
                     </a>
                   </div>
                 </div>`).join("")}
             </div>
           </div>
         </div>
      
             <div class="col-lg-6">
               <div class="summary entry-summary">
               <h1 class="mb-0" style="font-size:24px; line-height:normal;">
               ${selectedProduct.title}
               </h1>
               <p class="price my-2 mt-3">
                 ${selectedProduct.hasDiCount ? `
                 <span aria-hidden="true">
                   <span class="woocommerce-Price-amount amount">
                     <bdi>
                       <span class="woocommerce-Price-currencySymbol">₾</span>
                       ${selectedProduct.price}
                     </bdi>
                   </span>
                 </span>
                 <ins>
                   <span class="woocommerce-Price-amount amount">
                     <bdi><span class="woocommerce-Price-currencySymbol">₾</span>
                       ${selectedProduct.discountedPrice}
                     </bdi>
                   </span>
                 </ins>
               `: `
             <ins>
               <span class="woocommerce-Price-amount amount">
                 <bdi><span class="woocommerce-Price-currencySymbol">₾</span>
                   ${selectedProduct.price}
                 </bdi>
               </span>
             </ins>`}
               </p>
                 <div class="woocommerce-product-details__short-description">
                   <p>
                     ${selectedProduct.shortDescription}
                   </p>
                 </div>
                 <div>
                   <div class="py-4 single-product-details-table">
                     <table class="woocommerce-product-attributes shop_attributes w-100 mb-0">
                       <tbody>
                         <tr
                           class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_country">
                           <th class="woocommerce-product-attributes-item__label">
                             ქვეყანა
                           </th>
                           <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                             <p class="mb-0">${selectedProduct.country}</p>
                           </td>
                         </tr>
                         <tr class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_size">
                           <th class="woocommerce-product-attributes-item__label">
                             ზომა
                           </th>
                           <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                             <p class="mb-0">${selectedProduct.size}</p>
                           </td>
                         </tr>
                         <tr
                           class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_year-of-issue">
                           <th class="woocommerce-product-attributes-item__label">
                             გამოშვების წელი
                           </th>
                           <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                             <p class="mb-0">${selectedProduct.yearCreated}</p>
                           </td>
                         </tr>
                         <tr class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_2019">
                         <th class="woocommerce-product-attributes-item__label">
                           მასალა
                         </th>
                         <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                           <p class="mb-0">${selectedProduct.material}</p>
                         </td>
                       </tr>
                         <tr class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_2019">
                           <th class="woocommerce-product-attributes-item__label">
                             გამოყენება
                           </th>
                           <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                             <p class="mb-0">${selectedProduct.usage}</p>
                           </td>
                         </tr>
                         <tr class="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_2019">
                         <th class="woocommerce-product-attributes-item__label">
                           დანიშნულება
                         </th>
                         <td class="woocommerce-product-attributes-item__value" style="display: table-cell">
                           <p class="mb-0">${selectedProduct.purpose}</p>
                         </td>
                       </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
                 <div class="product_meta">
                   <span class="posted_in">Category: ${selectedProduct.categories.map(category => `<a data-category="${category.name}" href="../productList.html">${category.name}</a>`)}</span>
                 </div>
               </div>
             </div>
           </div >
           <div class="row mt-5">
             <div class="col-md-12">
               <div class="ot-tabs tab-single-product">
                 <ul class="ot-tabs__heading unstyle d-inline-block" style="overflow: visible;">
                   <li class="tab-link is-line current" data-tab="tab-1">
                     პროდუქტის აღწერა
                   </li>
                 </ul>
                 <div id="tab-1" class="ot-tabs__content current text-left pt-3">
                  ${selectedProduct.fullDescription}
                 </div>
               </div>
             </div>
           </div>
           <div class="products">
             <div class="row">
           ${similarProducts.length <= 0 ? "" : `<div class="col-md-12">
           <div class="related products">
             <h2 class="relate-product-title">მსგავსი პროდუქცია</h2>
           </div>
         </div>`}
            ${similarProducts.map(similarProduct => {
        if (similarProduct._id !== selectedProduct._id) {
          return `<div class="col-lg-3 col-md-6 col-sm-6">
                 <div class="product-item">
                 <div class="product-media" style="max-width: 345px; min-width:210px !important; max-height:345px; min-height:210px !important;">
                   <a class="evro-a" data-id="${similarProduct._id}">
                     ${similarProduct.hasDiscount ?
              `<span class="onsale">Sale!</span>` : ""
            }
                     <img src="${similarProduct.cardImage}" class="" alt="evrovagonka item image" />
                   </a>
                   <div class="wrapper-add-to-cart">
                     <div class="add-to-cart-inner">
                       <a data-id="${similarProduct._id}"
                         class="button wp-element-button product_type_simple add_to_cart_button ajax_add_to_cart octf-btn octf-btn-second evro-a">სრულად
                       </a>
                     </div>
                   </div>
                 </div>
                 <h2 class="woocommerce-loop-product__title">
                   <a class="evro-a" data-id="${similarProduct._id}">${similarProduct.title}</a>
                 </h2>
                 <span class="price">
                   ${similarProduct.hasDiscount ?
              `<del aria-hidden="true">
                     <span class="woocommerce-Price-amount amount">
                       <bdi>
                         <span class="woocommerce-Price-currencySymbol">₾</span>
                         ${similarProduct.price}
                       </bdi>
                     </span>
                   </del>
      
                   <ins>
                     <span class="woocommerce-Price-amount amount">
                       <bdi>
                         <span class="woocommerce-Price-currencySymbol">₾</span>
                         ${similarProduct.discountedPrice}
                       </bdi>
                     </span>
                   </ins>
                   ` : `
                   <span class="woocommerce-Price-amount amount">
                     <bdi>
                       <span class="woocommerce-Price-currencySymbol">₾</span>
                       ${similarProduct.price}
                     </bdi>
                   </span>`
            }
                 </span>
               </div>
             </div > `;
        }
      }).join("")}
             </div>
           </div>
         </div >
       </section > 
      `;
      $(".single-product").owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        callbacks: true,
        URLhashListener: true,
        autoplay: true,
        mouseDrag: true,
        touchDrag: true,
        autoplayHoverPause: true,
        startPosition: 'URLHash',
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Function to initialize the page
const initializePage = async function () {
  const selectedProductCategory = localStorage.getItem('selectedProductCategory');

  if (selectedProductCategory) {
    activeLinkHandler(selectedProductCategory);
    pageTitleAndBreadcrumbsHandler(selectedProductCategory);
    searchAndSortProducts();

    if (window.location.pathname.includes('productList.html')) {
      populateProductList();
    } else if (window.location.pathname.includes('productDetails.html')) {
      populateProductDetails();
    }
  }
};
initializePage();
