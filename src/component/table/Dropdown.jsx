import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';


export default function CustomDatePicker({month,year,setYear, setMonth}) {
  const [value, setValue] = useState(null);
    console.log("date value: ", month, year);
    useEffect(() => {  
        if(value){
            setYear(value?.year())
            setMonth(value?.month() + 1)
        }
     },[value]);
     useEffect(() => {
        setValue(dayjs().year(year).month(month - 1).date(1));
      }, [year, month]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker    
        views={['year', 'month']}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
          textField: {
            size: 'small',
            sx: {
              width: 150,
              fontSize: 10,
              py: 2,
              '& .MuiInputBase-input': {
                padding: '6px 10px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
