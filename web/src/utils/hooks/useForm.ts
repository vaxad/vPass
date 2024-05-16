import React, { useState } from "react";

type UseFormReturn<T> = [T, (event: React.ChangeEvent<HTMLInputElement>) => void];

export function useForm<T>(initialState: T): UseFormReturn<T> {
    const [values, setValues] = useState(initialState);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setValues({
        ...values,
        [name]: value
      });
    };
  
    return [values, handleChange];
  }
  
  