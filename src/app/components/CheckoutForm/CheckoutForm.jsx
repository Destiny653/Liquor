import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
console.log(stripePromise);


const CheckoutForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { clientSecret } = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 1000,  
            }),
        }).then((res) => res.json());

        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement('cardNumber'), 
            },
        });
        if (result.error) {
            console.error('Payment failed:', result.error);
        } else if (result.paymentIntent.status === 'succeeded') {
            // Handle the successful payment
            console.log('Payment succeeded!');
        }
    setLoading(false);
};

return (
    <form onSubmit={handleSubmit}>
        <CardElement /> 
        <button type="submit" disabled={!stripe || loading}>
            {loading ? 'Loading...' : 'Pay'}
        </button>
    </form>
);
};


const StripeCheckout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

// export default StripeCheckout;