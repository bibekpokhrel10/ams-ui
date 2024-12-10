import React from 'react';
import TextField from '@mui/material/TextField';

const CustomDatePicker = ({
  selectedDate,
  onChange,
  maxDate,
  minDate,
  label = 'Select Date'
}) => {
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    onChange(newDate);
  };

  const sx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      height: '45px',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: '#C215AE',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C215AE',
      },
      '& input': {
        paddingLeft: '20px',
        fontSize: '1rem',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'translate(20px, 8px) scale(1)',
      },
      '&.Mui-focused': {
        color: '#C215AE',
      },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -1px) scale(0.7)',
    },
    backgroundColor: 'white',
    borderRadius: '25px',
  };

  return (
    <TextField
      label={label}
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        max: maxDate ? formatDate(maxDate) : undefined,
        min: minDate ? formatDate(minDate) : undefined,
      }}
      value={formatDate(selectedDate)}
      onChange={handleDateChange}
      fullWidth
      sx={sx}
    />
  );
};

export default CustomDatePicker;