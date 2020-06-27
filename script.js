var cart = {};
window.onload = function() {
    loadProducts();
    $('#cartModal').on('shown.bs.modal', function(e) {
        loadCart();
    });
    $('#placeOrder').on('click', function() {
        $('#cartModal').modal('hide');
        placeOrder();
    })
    updateCartCount();
};

function loadProducts() {
    var rowLength = data.length > 4 ? Math.ceil(data.length / 4) : data.length; //assuming max 4 elements in a row
    var productData = document.getElementById('productData');
    var htmlString = "<div class='row p-5'>";
    var colSmValue = Math.floor(12 / rowLength);
    for (var key in data) {
        if (key % rowLength == 0 && rowLength > 1) {
            htmlString += "</div><div class='row p-5'>";
        }
        htmlString += "<div class='col-sm-" + colSmValue + "'>"; //total 12 col in a row and for 4 elements in a row leaves 12/4 = 3 col for each object
        htmlString += "<div class='card' style='width: 18rem;' id='" + data[key].id + "'>";
        htmlString += "<img src=" + data[key].product_img + " class='card-img-top' alt=''>";
        htmlString += "<div class='card-body'>";
        htmlString += "<h5 class=\"card-title\">" + data[key].name + "</h5>";
        htmlString += "<p class=\"card-text\">" + data[key].description + "</p>";
        htmlString += "<a href=\"javascript:void(0);\" onclick=\"addToCart('" + data[key].id + "')\" class=\"btn btn-primary\">Add to Cart</a> ";
        // htmlString += "";
        htmlString += "</div></div></div>";

    }
    htmlString += "</div>";
    productData.innerHTML = htmlString;

}

function updateCartCount() {
    var sum = 0;
    var cartEle = document.getElementById('cartCount');
    for (var key in cart) {
        sum += cart[key];
    }
    cartEle.setAttribute("value", sum);
}

function addToCart(index) {
    var flag = false;
    if (cart.hasOwnProperty(index)) {
        if (cart[index] >= data.find(o => o.id === index).quantity) {
            flag = true
        } else {
            cart[index] += 1
        }
    } else {
        cart[index] = 1;
    }
    updateCartCount();
    if (flag) {
        htmlString = "<div class=\"alert alert-danger alert-dismissible fade\" id=\"prodAlert\" role=\"alert\" style=\"position:absolute;width:100%;left:0;text-align:center;\">";
        htmlString += "<strong>" + data.find(o => o.id === index).name + "</strong> can not be added to cart as it is not available</div>";
    } else {
        htmlString = "<div class=\"alert alert-success alert-dismissible fade\" id=\"prodAlert\" role=\"alert\" style=\"position:absolute;width:100%;left:0;text-align:center;\">";
        htmlString += "<strong>" + data.find(o => o.id === index).name + "</strong> will be added to cart </div>";
    }
    var productData = document.getElementById('productData').innerHTML;
    document.getElementById('productData').innerHTML = htmlString + productData
    generateEffect(document.getElementById('prodAlert'), document.getElementById('prodAlert'), 2000);
    return false;
}



function loadCart() {
    var cartData = document.getElementById('cartData');
    cartData.innerHTML = "";
    var cartCountEle = document.getElementById('cartCount');
    var htmlString = "<div class='col-sm-12 p-4 overflow-auto' style='text-align:center;width:100%;height:20rem;'>";
    if (cartCountEle.attributes.value.value > 0) {
        document.getElementById('placeOrder').removeAttribute("disabled");
        htmlString += "<table class=\"table\" style='margin-bottom:0px;'>";
        htmlString += "<tr><th></th><th>Product Name</th><th>Quantity</th><th>Price</th><th></th>";
        var i = 1;
        var cartTotal = 0;
        for (var key in cart) {
            var prodDeatils = data.find(o => o.id === key);
            htmlString += "<tr row-identifier='" + key + "'>";
            htmlString += "<td>" + i + "</td>";
            htmlString += "<td class='cart-title'>" + prodDeatils.name + "</td>";
            htmlString += "<td class='price' price-per-ele='" + prodDeatils.price + "'><b>$" + parseInt(prodDeatils.price) * cart[key] + "</b></td>";
            htmlString += "<td><input type=\"number\" onclick=\"changeQunatity('" + key + "',this.value," + prodDeatils.quantity + ")\" onchange=\"changeQunatity('" + key + "',this.value," + prodDeatils.quantity + ")\" value = \"" + cart[key] + "\" style=\"width:3rem;\" min='1' max='" + prodDeatils.quantity + "'></td>";
            htmlString += "<td><a href=\"javascript:void(0);\" onclick=\"deleteFromCart('" + key + "')\" class=\"btn btn-primary\"><i class='fa fa-trash text-white'></i></a> </td>";
            htmlString += "</tr>";
            i += 1
            cartTotal += parseInt(prodDeatils.price) * cart[key];
        }
        htmlString += "<tr><td colspan='5' class='cartTotal'> <b>Total Sum : $" + cartTotal + "</b></td></tr>";
        htmlString += "</table>";

    } else {
        htmlString += "<p class=\"h1\"> Please Add Something to Cart </p>";
        document.getElementById('placeOrder').setAttribute("disabled", "disabled");
    }

    htmlString += "</div>";
    cartData.innerHTML = htmlString;


}

function deleteFromCart(index) {
    delete cart[index];
    document.querySelectorAll('[row-identifier=\'' + index + '\']')[0].remove();
    updateCartCount();
    loadCart();
    return false;
}

function changeQunatity(index, value, max) {
    var curEle = document.querySelectorAll('[row-identifier=\'' + index + '\']')[0];
    var oldQunat = cart[index];
    cart[index] = parseInt(value);
    curEle.querySelector('input').setAttribute('value', value);

    var priceChange = curEle.getElementsByClassName('price')[0];
    var singlePrice = parseInt(priceChange.attributes['price-per-ele'].value);
    priceChange.innerHTML = "<b>$" + singlePrice * value + "</b>";

    var currentTotalEle = curEle.parentNode.getElementsByClassName('cartTotal')[0];
    var cntTotal = parseInt(currentTotalEle.innerText.split("$").slice(-1).pop())
    var newPrice = cntTotal - (oldQunat * singlePrice) + (singlePrice * parseInt(value));
    currentTotalEle.innerHTML = "<b>Total Sum : $" + newPrice + "</b>";


    if (value >= max && !document.getElementsByClassName('errorQunat').length) {
        document.querySelectorAll('[row-identifier=\'' + index + '\']')[0].parentElement.innerHTML += "<tr><td colspan=\"5\"><p class='text-danger errorQunat fade'> No more quantity is available than : " + value + "</p></td></tr>";
        generateEffect(document.getElementsByClassName('errorQunat')[0], document.getElementsByClassName('errorQunat')[0].parentElement.parentElement, 2000);
    } else {
        if (document.getElementsByClassName('errorQunat').length) {
            document.getElementsByClassName('errorQunat')[0].parentElement.parentElement.remove();
        }

    }
    updateCartCount();
}

function placeOrder() {
    var htmlString = "";
    if (!Object.keys(cart).length) {
        htmlString += "<div class=\"alert alert-danger alert-dismissible fade\" id=\"orderAlert\" role=\"alert\" style=\"position:absolute;width:100%;left:0;text-align:center;\">";
        htmlString += "<strong> Order can not be placed because Cart is empty </strong></div>";
    } else {
        htmlString += "<div class=\"alert alert-success alert-dismissible fade\" id=\"orderAlert\" role=\"alert\" style=\"position:absolute;width:100%;left:0;text-align:center;\">";
        htmlString += "<strong> Order Placed Sucessfully! We are not storing the order as this is a one page pure frontend based application</strong></div>";
        writeInFile();
        cart = {};
        updateCartCount();
    }
    var productData = document.getElementById('productData').innerHTML;
    document.getElementById('productData').innerHTML = htmlString + productData
    generateEffect(document.getElementById('orderAlert'), document.getElementById('orderAlert'), 5000);
}

function generateEffect(eleEffect, eleRemove, timeout) {

    setTimeout(function() {
        eleEffect.classList.add("show");
    }, 100);
    setTimeout(function() {
        eleEffect.classList.remove("show");
    }, timeout);
    setTimeout(function() {
        eleRemove.remove();
    }, timeout + 700);

}

function writeInFile() {
    //server side code to store cart information goes here!!
}

function search(string) {
    if (document.getElementById('searchUL')) {
        document.getElementById('searchUL').remove();
    }
    if (string) {
        searchData = data.filter(o => o.name.match("[" + string.toLowerCase() + string.toUpperCase() + "]+"));
        if (searchData.length) {
            htmlString = "<ul class=\"list-group\" id=\'searchUL\'>";
            for (ds in searchData) {
                htmlString += "<li class=\'list-group-item\'> <a style='cursor:pointer;'" +
                    "prod-id=\"" + searchData[ds].id + "\" onclick=\"highlightEle('" + searchData[ds].id + "')\">" +
                    searchData[ds].name.substring(0, 15) + "... </a> </li>";
            }
            htmlString += "</ul>";
            document.getElementById('searchInput').parentNode.innerHTML += htmlString;
            document.getElementById('searchInput').value = string;
        }

    }

}

function highlightEle(id) {
    var classLst = document.getElementById(id).classList;
    if (document.getElementsByClassName("card-border").length) {
        var cb = document.getElementsByClassName("card-border");
        while (cb.length != 0) {
            if (cb[0].classList.contains('card-border')) {
                cb[0].classList.remove("card-border");
            }
        }
    }
    classLst.add('card-border');
    if (document.getElementById('searchUL')) {
        document.getElementById('searchUL').remove();
        document.getElementById('searchInput').value = "";
    }

    setTimeout(function() {
        classLst.remove('card-border');
    }, 2500);

}