(function(window, $){
  'use strict';
  var API_BASE = '/api';

  function post(url, data){
    return $.ajax({url: url, method: 'POST', data: data, dataType: 'json'});
  }
  function get(url){
    return $.ajax({url: url, method: 'GET', dataType: 'json'});
  }

  var cart = {
    add: function(productId, quantity){
      quantity = quantity || 1;
      return post(API_BASE + '/cart.php?action=add', {product_id: productId, quantity: quantity})
        .done(function(){
          cart.refreshMini();
        })
        .fail(function(xhr){
          alert('خطا در افزودن به سبد: ' + (xhr.responseJSON && xhr.responseJSON.error));
        });
    },
    update: function(productId, quantity){
      return post(API_BASE + '/cart.php?action=update', {product_id: productId, quantity: quantity})
        .done(function(){ cart.refreshMini(); })
        .fail(function(){ alert('خطا در بروزرسانی سبد'); });
    },
    get: function(){
      return get(API_BASE + '/cart.php?action=get');
    },
    refreshMini: function(){
      // Optional: update #cart-total if exists
      cart.get().done(function(data){
        var totalItems = 0;
        data.items.forEach(function(it){ totalItems += it.quantity; });
        if ($('#cart-total').length){
          $('#cart-total').text(totalItems + ' آیتم - ' + data.total + ' تومان');
        }
      });
    }
  };

  function renderCartTable($tbody, items){
    $tbody.empty();
    if (!items || items.length === 0){
      $tbody.append('<tr><td class="text-center" colspan="6">سبد خرید خالی است</td></tr>');
      return;
    }
    items.forEach(function(it){
      var row = '\n<tr>' +
        '<td class="text-center">' + (it.image ? '<img src="' + it.image + '" class="img-thumbnail"/>' : '') + '</td>' +
        '<td class="text-left">' + it.name + '</td>' +
        '<td class="text-left">' + it.product_id + '</td>' +
        '<td class="text-left"><div class="input-group btn-block quantity">' +
           '<input type="number" min="0" value="' + it.quantity + '" class="form-control qty-input" data-product-id="' + it.product_id + '" />' +
           '<span class="input-group-btn">' +
             '<button type="button" class="btn btn-primary btn-update" data-product-id="' + it.product_id + '"><i class="fa fa-refresh"></i></button>' +
             '<button type="button" class="btn btn-danger btn-remove" data-product-id="' + it.product_id + '"><i class="fa fa-times-circle"></i></button>' +
           '</span></div></td>' +
        '<td class="text-right">' + it.price + ' تومان</td>' +
        '<td class="text-right">' + it.line_total + ' تومان</td>' +
      '</tr>';
      $tbody.append(row);
    });
  }

  function initCartPage(){
    var $cartTableBody = $('#cart-table-body');
    if (!$cartTableBody.length) return;
    cart.get().done(function(data){
      renderCartTable($cartTableBody, data.items);
      $('#cart-total-sum').text(data.total + ' تومان');
    });
    $(document).on('click', '.btn-update', function(){
      var pid = $(this).data('product-id');
      var qty = $(this).closest('tr').find('.qty-input').val();
      cart.update(pid, qty).done(function(){ initCartPage(); });
    });
    $(document).on('click', '.btn-remove', function(){
      var pid = $(this).data('product-id');
      cart.update(pid, 0).done(function(){ initCartPage(); });
    });
  }

  function initCheckoutPage(){
    var $button = $('#button-confirm');
    if (!$button.length) return;
    cart.get().done(function(data){
      // Optionally render summary totals
    });
    $button.on('click', function(){
      var payload = {
        firstname: $('#input-payment-firstname').val(),
        lastname: $('#input-payment-lastname').val(),
        email: $('#input-payment-email').val(),
        telephone: $('#input-payment-telephone').val(),
        address1: $('#input-payment-address-1').val(),
        address2: $('#input-payment-address-2').val(),
        city: $('#input-payment-city').val(),
        postcode: $('#input-payment-postcode').val(),
        payment_method: $('input[name="paymentMethod"]:checked').val() || 'Cash On Delivery',
        comment: $('#confirm_comment').val()
      };
      post(API_BASE + '/checkout.php', payload).done(function(res){
        alert('سفارش ثبت شد. کد سفارش: ' + res.order_code);
        window.location.href = 'index.html';
      }).fail(function(xhr){
        var msg = (xhr.responseJSON && xhr.responseJSON.error) || 'خطای سرور';
        alert('عدم موفقیت در ثبت سفارش: ' + msg);
      });
    });
  }

  $(function(){
    initCartPage();
    initCheckoutPage();
    cart.refreshMini();
  });

  // expose
  window.cart = cart;
})(window, jQuery);


