import React, { useEffect, useState } from "react";

type UseFormReturn<T> = [T, (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, ({ name, value }: {name: keyof T; value: any;}) => void ];

export function useForm<T>(initialState: T): UseFormReturn<T> {
    const [values, setValues] = useState(initialState);
    
    const changeValue = ({name, value} : {name:keyof T, value:any}) => {
      setValues(
        (prev) =>   
        ({
        ...prev,
        [name]: value
        })
    );
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
      const { name, value } = event.target;
      setValues({
        ...values,
        [name]: value
      });
    };
  
    return [values, handleChange, changeValue];
  }
  
  