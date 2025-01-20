const axios = require('axios');

const coinbaseClient = axios.create({
    baseURL: 'https://api.commerce.coinbase.com',
    headers: {
        'X-CC_API_KEY': process.env.NEXT_PUBLIC_COINBASE_API_KEY,
    },
})

export const createCoinbasePaymentCharge =  async (amount, currency)=>{
    try {
        const response = await coinbaseClient.post(`/charges`, {
             local_price: {
                 amount,
                 currency,
             },
             description: "Payment for a product",
             pricing_type: "fixed_price",
        });    
        return {
            success: true, 
            message: 'Payment successful',
            data: response.data
        }
    } catch (error) {
        console.log('Func Error createCoinbasePaymentCharge: ', error);
        return {
            success: false,
            message: error.message, 
        }
    }
}