

export function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            console.log('Failed to load script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
}
export const displayRazorpay = async (props) => {
    
    // razorpay payment gateway
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    // error handling
    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
    }
    // console.log(props);

    // creating a new order
    
    const orderResponse = await fetch('https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Order/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            
            "userId": props.user.Id,
            "cartId": props.cartId,
            "deliveryAddress": props.address,
            "isPickup": props.isPickup,
        }),
    });

    const orderData = await orderResponse.json();
    props.setPayLoading(false);
    if(!orderResponse.ok){
        alert(orderData.errorMessage || orderData.title || "Something went wrong");
        return;
    }

    const {rorderID,orderId, total}= orderData;

    const options = {
        key : 'rzp_test_Wdjw0UYgMSS5xq',
        amount : (1255* 100).toString(),
        currency : 'INR',
        name : 'Pizza Paradise',
        description : 'Payment for pizza',
        image : '/logo512.png',
        order_id : rorderID,
        handler: async function (response){
            // console.log(response);
            const data = {
                orderId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                amount: total,
                cartId: props.cartId, 
            };
            // verifyPayment(data);
            const paymentResponse = await fetch('https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Payment/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (paymentResponse.ok) {
                alert('Payment successful !! Order placed successfully');
                props.setIsOrderPlaced(true);
                props.navigate('/order', { replace: true });
                
            }else{
                alert('Payment Verification failed !! Order not placed  !! If money is deducted it will be refunded in 3 days'); 
            }
        },
        theme: {
            color: "#fbbf24",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}
            
