// components/FlutterwaveInlineButton.jsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button"

export default function FlutterwaveInlineButton({
  amount,
  email,
  name,
  onSuccess = () => {},
  onClose = () => {},
}) {
  const handleClick = () => {
    if (!window.FlutterwaveCheckout) {
      console.error('Flutterwave script not loaded');
      return;
    }

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: `tx_${Date.now()}`,
      amount,
      currency: 'NGN',
      customer: { email, name },
      customizations: {
        title: 'My Store',
        description: 'Payment for items in cart',
        logo: `${window.location.origin}/logo.png`,
      },
      callback: (response) => {
        // called on successful payment
        console.log('Payment response:', response);
        onSuccess(response);
      },
      onclose: onClose,
    });
  };

  return (
     <Button className="w-full mt-4" onClick={handleClick}>
            Proceed to Checkout
          </Button>
  );
}
