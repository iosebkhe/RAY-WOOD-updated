"use strict";


const apiUrlCategory = "https://ecommerce-admin-master-tau.vercel.app/api/categories";

//ფუნქციები

//წამოვიღოთ პროდუქტები API-დან
const fetchProduct = async function (apiURL) {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error.message);
  }
};



const handleNAvigationLinks = async function () {
  const navigationLinks = Array.from(document.querySelectorAll("a"));
  localStorage.setItem("activeClass", "current-menu-item");
  try {
    navigationLinks.forEach(link => {
      link.addEventListener("click", function () {
        if (link.dataset.hasOwnProperty("category")) {
          const linkDataCategory = this.dataset.category;
          localStorage.setItem("selectedProductCategory", linkDataCategory);
          window.location.href = "productList.html";
        }
      });
    });
  } catch (error) {
    console.error(error.message);
  }
};
handleNAvigationLinks();

//პროდუქტების გამოსატანად საჭირო HTML კოდი 
const renderProductListHTML = function (products, productsLength) {
  const productCount = document.querySelector(".product-count-num");
  const searchField = document.querySelector("#product-count-and-sort");
  searchField.style.display = "flex";
  productCount.textContent = productsLength;
  return `
  <div class="row">
    ${products.map(function (product) {
    return `<div class="col-lg-4 co-md-6 col-sm-6 first">
<div class="product-item">
  <div class="product-media" style="max-width: 345px; min-width:210px !important; max-height:345px; min-height:210px !important;">
    <a class="evro-a" data-id="${product._id}">
      ${product.hasDiCount ?
        `<span class="onsale">Sale!</span>` : ""
      }
      <img src="${product.cardImage}" class="" alt="evrovagonka item image" />
    </a>
    <div class="wrapper-add-to-cart">
      <div class="add-to-cart-inner">
        <a data-id="${product._id}"
          class="button wp-element-button product_type_simple add_to_cart_button ajax_add_to_cart octf-btn octf-btn-second evro-a">სრულად
        </a>
      </div>
    </div>
  </div>
  <h2 class="woocommerce-loop-product__title">
    <a class="evro-a" data-id="${product._id}">${product.title}</a>
  </h2>
  <span class="price">
    ${product.hasDisCount ?
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
    </ins>
    ` : `
    <span class="woocommerce-Price-amount amount">
      <bdi>
        <span class="woocommerce-Price-currencySymbol">₾</span>
        ${product.price}
      </bdi>
    </span>`
      }
  </span>
</div>
</div>`;
  }).join("")}
  </div>
`;
};

const renderNoProductHTML = function () {
  const searchField = document.querySelector("#product-count-and-sort");
  searchField.style.display = "none";

  return `<div class="row">
  <div class="col-12 mb-4">
    <p class="woocommerce-result-count w-100" style="font-size:28px">მოიძებნა 0 პროდუქტი</p>
  </div>
</div>`;
};

//მივანიჭოთ active სტილი შესაბამის ლინკს ნავიგაციაში
const activeLinkHandler = function (selectedCategory) {
  //ამოვიღოთ დამახსოვრებული პროდუქტის კატეგორია რომელსაც დავაკლიკეთ ნავიგაციაში;
  const selectedProductCategory = selectedCategory;

  //ამოვიღოთ დამახსოვრებული active კლასი ნავიგაციისთვის
  const activeClass = localStorage.getItem("activeClass");

  //კატეგორიის ლინკი
  const categoryLi = document.querySelector(`.sub-menu a[data-category="${selectedProductCategory}"]`)?.parentElement;

  const activeLi = categoryLi;

  if (activeLi) {
    activeLi.classList.add(activeClass);
  }
};

//შევცვალოთ გვერდის სათაური და active breadcrumb-სი
const pageTitleAndBreadcrumbsHandler = function (selectedCategory) {
  //ამოვიღოთ დამახსოვრებული პროდუქტის კატეგორია რომელსაც დავაკლიკეთ ნავიგაციაში
  const selectedProductCategory = selectedCategory;

  //გვერდის სათაური - შეიცვალოს კატეგორიის მიხედვით
  const pageTitle = document.querySelector(".productDetails-title");
  pageTitle.textContent = selectedProductCategory;

  //ბრაუზერის ტაბის სათაური
  document.title = `RayWood | ${selectedCategory}`;

};


//ლინკებს დავამატოთ click ივენთები და შევცვალოთ location
const linkEventListeners = function (renderContainer, products) {
  const linkItems = Array.from(renderContainer.querySelectorAll("[data-id]"));
  products.map(product => {
    linkItems.forEach(linkItem => {
      linkItem.addEventListener("click", function () {
        const linkDataID = this.dataset.id;
        if (linkDataID === product._id) {
          localStorage.setItem("selectedProductId", product._id);
        };
        window.location.href = "productDetails.html";
      });
    });
  });
};


//გამოვიტნაოთ პროდუქტები productList.html ფაილში
const populateProductList = async function () {
  const apiUrlProduct = "https://ecommerce-admin-master-tau.vercel.app/api/products";
  //ამოვიღოთ დამახსოვრებული პროდუქტის კატეგორია რომელსაც დავაკლიკეთ ნავიგაციაში
  const selectedProductCategory = localStorage.getItem("selectedProductCategory");
  const selectedCategoryLink = `${apiUrlProduct}?category=${selectedProductCategory}`;

  // pageTitleAndBreadcrumbsHandler(selectedProductCategory);
  activeLinkHandler(selectedProductCategory);

  //კონტეინერი რომლის HTMl-იც უნდა შევცვალოთ
  const productListEl = document.querySelector(".products");

  try {
    if (selectedProductCategory === "კატალოგი") {
      const dataProducts = await fetchProduct(apiUrlProduct);
      console.log(dataProducts);
      //ყველა პროდუქტი
      const allProductsLength = dataProducts.length;
      productListEl.innerHTML = renderProductListHTML(dataProducts, allProductsLength);
      linkEventListeners(productListEl, dataProducts);
    } else {
      // გავფილტროთ კატეგორიით
      const productByCategory = await fetchProduct(selectedCategoryLink);
      console.log(productByCategory);
      const productByCategoryLength = productByCategory.length;
      productListEl.innerHTML = renderProductListHTML(productByCategory, productByCategoryLength);
      linkEventListeners(productListEl, productByCategory);
      // if (!productByCategoryLength) {
      //   productListEl.innerHTML = renderNoProductHTML(productByCategoryLength);
      //   return;
      // }
    }

  } catch (error) {
    console.error(error.message);
  }
};


//გამოვიტანოთ ის პროდუქტი productDetails.html ფაილში რომელსაც მომხმარებელმა დააკლიკა
const populateProductDetails = async function () {
  const selectedProductID = localStorage.getItem("selectedProductId");
  const productDetailsContainer = document.querySelector("#productDetailsContainer");
  console.log(selectedProductID, "selected product id");

  try {
    const data = await fetchProduct();
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
        <p class="price">
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
          <ul class="ot-tabs__heading unstyle d-inline-block">
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
</section > `;

      $(".single-product").owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        callbacks: true,
        URLhashListener: true,
        autoplayHoverPause: true,
        startPosition: "zero",
      });

      $(".single-product").lightGallery({
        selector: ".link-image-action",
        share: false,
        pager: false,
        thumbnail: false,
        autoplay: false,
        autoplayControls: false
      });


      linkEventListeners(productDetailsContainer, similarProducts);
    }
  } catch (error) { console.error(error.message); }
};

//პროდუქტების ძებნა და დალაგება ფასის მიხედვით
const searchAndSortProducts = async function (sortOption, searchTerm) {
  const productListEl = document.querySelector(".products");

  try {
    const apiUrlProduct = "https://ecommerce-admin-master-tau.vercel.app/api/products";
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
    } else {
      const noProductHTML = renderNoProductHTML();
      productListEl.innerHTML = noProductHTML;
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








if (window.location.pathname === "/productList.html") {
  window.addEventListener("load", () => {
    populateProductList();
    searchAndSortProducts();
  });
} else if (window.location.pathname === "/productDetails.html") {
  window.addEventListener("load", populateProductDetails);
};

