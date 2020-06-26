var cart = {};
window.onload = function() {
    loadProducts();
    $('#cartModal').on('shown.bs.modal', function(e) {
        loadCart();
    });
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
        htmlString += "<div class='card' style='width: 18rem;'>";
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
    setTimeout(function() {
        document.getElementById('prodAlert').classList.add("show");
    }, 100);
    setTimeout(function() {
        document.getElementById('prodAlert').classList.remove("show");
    }, 3000);
    setTimeout(function() {
        document.getElementById('prodAlert').parentNode.removeChild(document.getElementById('prodAlert'));
    }, 2200);
    // alert("Product " + data.find(o => o.id === index).name + " will be added to cart");
    return false;
}



function loadCart() {
    var cartData = document.getElementById('cartData');
    cartData.innerHTML = "";
    var cartCountEle = document.getElementById('cartCount');
    var htmlString = "<div class='row p-5' style='text-align:center;width:100%;'><div class='col-sm-12'>";
    if (cartCountEle.attributes.value.value > 0) {
        document.getElementById('placeOrder').removeAttribute("disabled");
        htmlString += "<table class=\"table\">";
        htmlString += "<tr><th></th><th>Product Name</th><th>Quantity</th><th></th>";
        var i = 1;
        for (var key in cart) {
            var prodDeatils = data.find(o => o.id === key);
            htmlString += "<tr row-identifier='" + key + "'>";
            htmlString += "<td>" + i + "</td>";
            htmlString += "<td>" + prodDeatils.name + "</td>";
            htmlString += "<td><input type=\"number\" onchange=\"changeQunatity('" + key + "',this.value," + prodDeatils.quantity + ")\" value = \"" + cart[key] + "\" style=\"width:3rem;\" min='1' max='" + prodDeatils.quantity + "'></td>";
            htmlString += "<td><a href=\"javascript:void(0);\" onclick=\"deleteFromCart('" + key + "')\" class=\"btn btn-primary\"> Delete From Cart</a> </td>";
            htmlString += "</tr>";
            i += 1
        }
        htmlString += "</table>";

    } else {
        htmlString += "<p class=\"h1\"> Please Add Something to Cart </p>";
        document.getElementById('placeOrder').setAttribute("disabled", "disabled");
    }

    htmlString += "</div></div>"
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
    cart[index] = parseInt(value);
    curEle.querySelector('input').setAttribute('value', value);
    if (value >= max) {
        document.querySelectorAll('[row-identifier=\'' + index + '\']')[0].parentElement.innerHTML += "<tr><td colspan=\"4\"><p class='text-danger errorQunat'> This is all the qunaitity we have for this product</p></td></tr>";
    } else {
        if (document.getElementsByClassName('errorQunat').length) {
            document.getElementsByClassName('errorQunat')[0].remove();
        }

    }
    updateCartCount();
}