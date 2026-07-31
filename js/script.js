(function (global) {
  "use strict";

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var categoriesTitleHtmlUrl = "snippets/categories-title-snippet.html";
  var categoryHtmlUrl = "snippets/category-snippet.html";
  var menuItemsTitleHtmlUrl = "snippets/menu-items-title-snippet.html";
  var menuItemHtmlUrl = "snippets/menu-item-snippet.html";

  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

  var fallbackCategories = [
    { id: 1, short_name: "L", name: "Lunch" },
    { id: 2, short_name: "D", name: "Dinner" },
    { id: 3, short_name: "S", name: "Sushi" },
    { id: 4, short_name: "A", name: "Appetizers" },
    { id: 5, short_name: "C", name: "Chicken" },
    { id: 6, short_name: "F", name: "Seafood" }
  ];

  var fallbackMenus = {
    L: {
      category: { short_name: "L", name: "Lunch", special_instructions: "Served daily until 3:00 PM." },
      menu_items: [
        { short_name: "L1", name: "Orange Chicken", description: "Crispy chicken with a bright citrus glaze.", price_small: 11.95 },
        { short_name: "L2", name: "Beef with Broccoli", description: "Tender beef, broccoli, and savory brown sauce.", price_small: 12.50 },
        { short_name: "L3", name: "Vegetable Lo Mein", description: "Soft noodles tossed with seasonal vegetables.", price_small: 10.75 }
      ]
    },
    D: {
      category: { short_name: "D", name: "Dinner", special_instructions: "House favorites served with steamed rice." },
      menu_items: [
        { short_name: "D1", name: "General Tso's Chicken", description: "Crispy chicken in a sweet and mildly spicy sauce.", price_small: 16.95 },
        { short_name: "D2", name: "Mongolian Beef", description: "Sliced beef, scallions, and rich soy glaze.", price_small: 18.50 },
        { short_name: "D3", name: "Kung Pao Shrimp", description: "Shrimp, peanuts, vegetables, and chili peppers.", price_small: 19.25 }
      ]
    },
    S: {
      category: { short_name: "S", name: "Sushi", special_instructions: "Prepared fresh to order." },
      menu_items: [
        { short_name: "S1", name: "California Roll", description: "Crab, avocado, and cucumber.", price_small: 8.50 },
        { short_name: "S2", name: "Salmon Avocado Roll", description: "Fresh salmon and creamy avocado.", price_small: 9.75 },
        { short_name: "S3", name: "Spicy Tuna Roll", description: "Tuna with a light spicy sauce.", price_small: 10.25 }
      ]
    },
    A: {
      category: { short_name: "A", name: "Appetizers", special_instructions: "Perfect for sharing." },
      menu_items: [
        { short_name: "A1", name: "Vegetable Spring Rolls", description: "Golden rolls filled with crisp vegetables.", price_small: 6.25 },
        { short_name: "A2", name: "Chicken Dumplings", description: "Pan-seared dumplings with dipping sauce.", price_small: 8.50 },
        { short_name: "A3", name: "Crab Wontons", description: "Crispy wontons with a creamy crab filling.", price_small: 8.95 }
      ]
    },
    C: {
      category: { short_name: "C", name: "Chicken", special_instructions: "Chicken entrées served with rice." },
      menu_items: [
        { short_name: "C1", name: "Sesame Chicken", description: "Crispy chicken finished with sesame glaze.", price_small: 15.95 },
        { short_name: "C2", name: "Chicken with Cashews", description: "Chicken, cashews, celery, and carrots.", price_small: 16.25 },
        { short_name: "C3", name: "Moo Goo Gai Pan", description: "Chicken and vegetables in a delicate white sauce.", price_small: 15.50 }
      ]
    },
    F: {
      category: { short_name: "F", name: "Seafood", special_instructions: "Fresh seafood selections." },
      menu_items: [
        { short_name: "F1", name: "Shrimp with Lobster Sauce", description: "Shrimp in a savory egg-based sauce.", price_small: 19.95 },
        { short_name: "F2", name: "Hunan Fish", description: "Fish fillet with vegetables and spicy Hunan sauce.", price_small: 20.50 },
        { short_name: "F3", name: "Scallops with Vegetables", description: "Tender scallops and mixed vegetables.", price_small: 21.25 }
      ]
    }
  };

  function showLoading() {
    document.querySelector("#main-content").innerHTML =
      '<div class="loading"><span class="spinner"></span>Loading…</div>';
  }

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function insertProperty(string, propName, propValue) {
    var propertyToReplace = "{{" + propName + "}}";
    return string.split(propertyToReplace).join(propValue == null ? "" : propValue);
  }

  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  function getCategories(callback) {
    $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {
      callback(Array.isArray(categories) && categories.length ? categories : fallbackCategories);
    });
  }

  dc.loadHome = function () {
    showLoading();

    getCategories(function (categories) {
      $ajaxUtils.sendGetRequest(homeHtmlUrl, function (homeHtml) {
        if (!homeHtml) {
          insertHtml("#main-content", "<p>Unable to load the home page.</p>");
          return;
        }

        // STEP 3: Choose a random category from the categories returned by the server.
        var randomCategory = chooseRandomCategory(categories);

        // STEP 4: Replace the placeholder in home-snippet.html with the random short name.
        var randomCategoryShortName = "'" + randomCategory.short_name + "'";
        var homeHtmlToInsert = insertProperty(
          homeHtml,
          "randomCategoryShortName",
          randomCategoryShortName
        );

        insertHtml("#main-content", homeHtmlToInsert);
      }, false);
    });
  };

  dc.loadRandomCategory = function () {
    getCategories(function (categories) {
      var randomCategory = chooseRandomCategory(categories);
      dc.loadMenuItems(randomCategory.short_name);
    });
  };

  dc.loadMenuCategories = function () {
    showLoading();

    Promise.all([
      fetch(categoriesTitleHtmlUrl).then(function (r) { return r.text(); }),
      fetch(categoryHtmlUrl).then(function (r) { return r.text(); })
    ]).then(function (templates) {
      getCategories(function (categories) {
        var finalHtml = templates[0];
        insertHtml("#main-content", finalHtml);

        var cards = categories.map(function (category) {
          var html = templates[1];
          html = insertProperty(html, "short_name", category.short_name);
          html = insertProperty(html, "name", category.name);
          return html;
        }).join("");

        document.querySelector("#categories-grid").innerHTML = cards;
      });
    }).catch(function () {
      insertHtml("#main-content", "<p>Unable to load menu categories.</p>");
    });
  };

  dc.loadMenuItems = function (categoryShort) {
    categoryShort = String(categoryShort || "").replace(/['"]/g, "");
    showLoading();

    Promise.all([
      fetch(menuItemsTitleHtmlUrl).then(function (r) { return r.text(); }),
      fetch(menuItemHtmlUrl).then(function (r) { return r.text(); })
    ]).then(function (templates) {
      $ajaxUtils.sendGetRequest(
        menuItemsUrl + encodeURIComponent(categoryShort) + ".json",
        function (menuItemsData) {
          var data = menuItemsData && menuItemsData.category
            ? menuItemsData
            : fallbackMenus[categoryShort] || fallbackMenus.L;

          var titleHtml = templates[0];
          titleHtml = insertProperty(titleHtml, "name", data.category.name);
          titleHtml = insertProperty(
            titleHtml,
            "special_instructions",
            data.category.special_instructions || ""
          );

          insertHtml("#main-content", titleHtml);

          var itemsHtml = (data.menu_items || []).map(function (item) {
            var html = templates[1];
            var price = item.price_small || item.price_large;
            html = insertProperty(html, "short_name", item.short_name || "");
            html = insertProperty(html, "name", item.name || "Menu Item");
            html = insertProperty(html, "description", item.description || "");
            html = insertProperty(
              html,
              "price",
              price ? "$" + Number(price).toFixed(2) : ""
            );
            return html;
          }).join("");

          document.querySelector("#menu-items-grid").innerHTML = itemsHtml;
        }
      );
    }).catch(function () {
      insertHtml("#main-content", "<p>Unable to load menu items.</p>");
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    dc.loadHome();
  });

  global.$dc = dc;
})(window);
