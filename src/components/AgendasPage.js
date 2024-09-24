import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAgenda = ({ agendaId, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (agendaId) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setApiError('Authentication token is missing. Please log in again.');
                return;
            }

            const config = {
                headers: { Authorization: `Token ${token}` }
            };

            axios.get(`http://127.0.0.1:8000/routers/Newagendas/${agendaId}/`, config)
                .then(response => {
                    const data = response.data;
                    setName(data.name);
                    setDescription(data.description);
                    setStartDate(data.start_date);
                    setEndDate(data.end_date);
                    setOptions(data.options || []);
                })
                .catch(error => {
                    console.error('Error fetching agenda:', error);
                    setApiError('Error fetching agenda. Please try again later.');
                });
        }
    }, [agendaId]);
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const validOptions = options.filter(option => option.name.trim() !== '' && (option.id || option.name));
      const agendaData = { name, description, start_date: startDate, end_date: endDate, options: validOptions };
      const token = localStorage.getItem('authToken');
  
      if (!token) {
          setApiError('Authentication token is missing. Please log in again.');
          return;
      }
  
      const config = {
          headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' }
      };
  
      setErrors({});
      setApiError(null);
      setSuccessMessage('');
  
      // Client-side validation
      let hasErrors = false;
      const newErrors = {};
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // Setting time to 00:00:00 to compare only the date part
  
      if (!name) {
          newErrors.name = 'Name is required.';
          hasErrors = true;
      }
      if (!description) {
          newErrors.description = 'Description is required.';
          hasErrors = true;
      }
      if (!startDate) {
          newErrors.startDate = 'Start date is required.';
          hasErrors = true;
      } else if (new Date(startDate) < today) {
          newErrors.startDate = 'Start date cannot be in the past.';
          hasErrors = true;
      }
  
      if (!endDate) {
          newErrors.endDate = 'End date is required.';
          hasErrors = true;
      } else if (new Date(startDate) > new Date(endDate)) {
          newErrors.endDate = 'End date must be after the start date.';
          hasErrors = true;
      }
  
      if (validOptions.length < 2) {
          newErrors.options = 'At least two options are required.';
          hasErrors = true;
      }
  
      if (hasErrors) {
          setErrors(newErrors);
          return;
      }
  
      const request = agendaId
          ? axios.put(`http://127.0.0.1:8000/routers/Newagendas/${agendaId}/`, agendaData, config)
          : axios.post('http://127.0.0.1:8000/routers/Newagendas/', agendaData, config);
  
      request
          .then(response => {
              setSuccessMessage('Created Successfully');
              setName('');
              setDescription('');
              setStartDate('');
              setEndDate('');
              setOptions([]);
              onSave(response.data);
          })
          .catch(error => {
              if (error.response) {
                  if (error.response.status === 400 && error.response.data) {
                      setErrors(error.response.data);
                  } else {
                      setApiError('Error creating/updating agenda. Please try again later.');
                  }
              } else {
                  setApiError('A network error occurred. Please check your connection.');
              }
          });
  };
  

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const validOptions = options.filter(option => option.name.trim() !== '' && (option.id || option.name));
    //     const agendaData = { name, description, start_date: startDate, end_date: endDate, options: validOptions };
    //     const token = localStorage.getItem('authToken');

    //     if (!token) {
    //         setApiError('Authentication token is missing. Please log in again.');
    //         return;
    //     }

    //     const config = {
    //         headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' }
    //     };

    //     setErrors({});
    //     setApiError(null);
    //     setSuccessMessage('');

    //     // Client-side validation
    //     let hasErrors = false;
    //     const newErrors = {};

    //     if (!name) {
    //         newErrors.name = 'Name is required.';
    //         hasErrors = true;
    //     }
    //     if (!description) {
    //         newErrors.description = 'Description is required.';
    //         hasErrors = true;
    //     }
    //     if (!startDate) {
    //         newErrors.startDate = 'Start date is required.';
    //         hasErrors = true;
    //     }
    //     if (!endDate) {
    //         newErrors.endDate = 'End date is required.';
    //         hasErrors = true;
    //     } else if (new Date(startDate) > new Date(endDate)) {
    //         newErrors.endDate = 'End date must be after the start date.';
    //         hasErrors = true;
    //     }
    //     if (validOptions.length < 2) {
    //         newErrors.options = 'At least two options are required.';
    //         hasErrors = true;
    //     }

    //     if (hasErrors) {
    //         setErrors(newErrors);
    //         return;
    //     }

    //     const request = agendaId
    //         ? axios.put(`http://127.0.0.1:8000/routers/Newagendas/${agendaId}/`, agendaData, config)
    //         : axios.post('http://127.0.0.1:8000/routers/Newagendas/', agendaData, config);

    //     request
    //         .then(response => {
    //             setSuccessMessage('Created Successfully');
    //             setName('');
    //             setDescription('');
    //             setStartDate('');
    //             setEndDate('');
    //             setOptions([]);
    //             onSave(response.data);
    //         })
    //         .catch(error => {
    //             if (error.response) {
    //                 // Handling server-side validation errors
    //                 if (error.response.status === 400 && error.response.data) {
    //                     setErrors(error.response.data);
    //                 } else {
    //                     // Generic API errors
    //                     setApiError('Error creating/updating agenda. Please try again later.');
    //                 }
    //             } else {
    //                 // Network or other unknown errors
    //                 setApiError('A network error occurred. Please check your connection.');
    //             }
    //         });
    // };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].name = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            {apiError && <div style={apiErrorStyle}>{apiError}</div>}
            {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
            <div style={formGroupStyle}>
                <label style={labelStyle}>Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={textareaStyle} />
                {errors.description && <div style={errorStyle}>{errors.description}</div>}
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Start Date:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
                {errors.startDate && <div style={errorStyle}>{errors.startDate}</div>}
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>End Date:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
                {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Options:</label>
                {options.map((option, index) => (
                    <div key={index} style={optionGroupStyle}>
                        <input
                            type="text"
                            value={option.name}
                            onChange={e => handleOptionChange(index, e.target.value)}
                            style={inputStyle}
                        />
                        <button type="button" onClick={() => handleRemoveOption(index)} style={btnRemoveOptionStyle}>
                            ✖
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setOptions([...options, { name: '' }])} style={btnAddOptionStyle}>
                    Add Option
                </button>
                {errors.options && <div style={errorStyle}>{errors.options}</div>}
            </div>
            <div style={formButtonsStyle}>
                <button type="submit" style={btnSaveStyle}>Save</button>
                <button type="button" onClick={onCancel} style={btnCancelStyle}>Cancel</button>
            </div>
        </form>
    );
};

// Inline styling for better presentation
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
};

const formGroupStyle = {
    marginBottom: '15px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};

const textareaStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};

const optionGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
};

const btnAddOptionStyle = {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '5px'
};

const btnRemoveOptionStyle = {
    marginLeft: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    fontSize: '16px'
};

const btnSaveStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
};

const btnCancelStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px'
};

const formButtonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
};

const errorStyle = {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '5px'
};

const apiErrorStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px'
};

const successMessageStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px'
};

export default CreateAgenda;
