import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgendaForm from './test';  // Ensure this path matches your form component location

const AgendaList = () => {
    const [agendas, setAgendas] = useState([]);
    const [editingAgenda, setEditingAgenda] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAgendas();
    }, []);

    const fetchAgendas = () => {
        axios.get('http://127.0.0.1:8000/agendass/')
            .then(response => {
                setAgendas(response.data);
            })
            .catch(error => {
                console.error('Error fetching agendas:', error);
            });
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('authToken');
        axios.delete(`http://127.0.0.1:8000/agendas/${id}/delete/`, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(() => {
                setAgendas(agendas.filter(agenda => agenda.id !== id));
            })
            .catch(error => {
                console.error('Error deleting agenda:', error);
            });
    };

    const handleSave = () => {
        fetchAgendas();
        setShowForm(false);
        setEditingAgenda(null);
    };

    const handleEdit = (agenda) => {
        setEditingAgenda(agenda);
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingAgenda(null);
        setShowForm(false);
    };

    const today = new Date();  // Get today's date for comparison

    return (
        <div>
            <button onClick={() => setShowForm(true)}>Create New Agenda</button>
            {showForm && (
                <AgendaForm
                    agendaId={editingAgenda ? editingAgenda.id : null}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            <ul>
                {agendas.map(agenda => {
                    const startDate = new Date(agenda.start_date);  // Convert the start_date string to a Date object

                    return (
                        <li key={agenda.id}>
                            {agenda.name} - Election Date: {agenda.start_date}
                            {/* Only show the Edit button if the election has not started yet */}
                            {startDate > today && (
                                <button onClick={() => handleEdit(agenda)}>Edit</button>
                            )}
                            <button onClick={() => handleDelete(agenda.id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AgendaList;
