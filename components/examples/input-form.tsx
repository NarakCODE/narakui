'use client';

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

/** Controlled inputs with helper hints laid out in a responsive grid. */
export function InputFormExample() {
  const [formData, setFormData] = useState({
    brand: '',
    domain: '',
    category: '',
    email: '',
  });

  const handleChange =
    (field: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Brand"
          placeholder="Acme"
          value={formData.brand}
          onChange={handleChange('brand')}
        />
        <Input
          label="Domain"
          placeholder="acme.com"
          value={formData.domain}
          onChange={handleChange('domain')}
          iconStart="globe"
        />
      </div>
      <Input
        label="Category"
        placeholder="Project management software"
        value={formData.category}
        onChange={handleChange('category')}
        hint="Answer engines are prompted with questions about this category"
      />
      <Input
        label="Report recipient"
        placeholder="you@acme.com"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        iconStart="mail"
        hint="We send the weekly visibility report to this address"
      />
    </div>
  );
}
