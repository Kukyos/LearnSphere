import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseName: string;
  price: number;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, courseName, price }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!expiry || expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvv.length < 3) {
      setError('Please enter a valid CVV.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name.');
      return;
    }

    // Simulate payment processing
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        // Reset
        setStep('form');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setName('');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-800">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-brand-600" />
            <h3 className="font-bold text-brand-900 dark:text-white">Payment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-200 dark:hover:bg-brand-700 text-brand-500">
            <X size={18} />
          </button>
        </div>

        {step === 'processing' && (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto mb-4 text-brand-600 animate-spin" />
            <h4 className="text-lg font-bold text-brand-900 dark:text-white mb-2">Processing Payment...</h4>
            <p className="text-sm text-brand-500">Please wait while we process your payment.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-brand-900 dark:text-white mb-2">Payment Successful!</h4>
            <p className="text-sm text-brand-500">You now have access to the course.</p>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Course Summary */}
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-800 border border-brand-200 dark:border-brand-700">
              <p className="text-sm text-brand-500 dark:text-brand-400">Course</p>
              <p className="font-semibold text-brand-900 dark:text-white">{courseName}</p>
              <p className="text-2xl font-bold text-brand-600 mt-1">${price.toFixed(2)}</p>
            </div>

            {error && (
              <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Card Number */}
            <div>
              <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full px-4 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-1">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  className="w-full px-4 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-1">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-1">Cardholder Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Lock size={18} /> Pay ${price.toFixed(2)}
            </button>

            <p className="text-xs text-center text-brand-400 flex items-center justify-center gap-1">
              <Lock size={12} /> Secure payment — your data is encrypted
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
