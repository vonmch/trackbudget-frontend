// src/pages/IncomeTrackerPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './TrackerPage.css';
import Modal from '../components/common/Modal';
import IncomeForm from '../components/forms/IncomeForm';
import LineGraph from '../components/common/LineGraph';
import { authFetch } from '../utils/api';

const incomeGraphLines = [
  { dataKey: 'Income', color: '#2ed47a' }
];

// 1. Accept 'isPremium' prop
function IncomeTrackerPage({ isPremium }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [income, setIncome] = useState([]);
  const [incomeToEdit, setIncomeToEdit] = useState(null);

  const fetchIncome = async () => {
    try {
      const response = await authFetch('/income');
      const data = await response.json();
      setIncome(data);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const processedGraphData = useMemo(() => {
    const dailyTotals = {};
    income.forEach(item => {
      const date = item.date;
      const currentTotal = dailyTotals[date] || 0;
      dailyTotals[date] = currentTotal + item.amount;
    });
    const dataArray = Object.keys(dailyTotals).map(date => ({
      date: date,
      amount: dailyTotals[date]
    }));
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dataArray.map(item => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
      Income: item.amount
    }));
  }, [income]);

  const openCreateModal = () => {
    setIncomeToEdit(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (incomeItem) => {
    setIncomeToEdit(incomeItem);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIncomeToEdit(null);
  };

  const handleSave = () => {
    closeModal();
    fetchIncome();
  };

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm('Are you sure you want to delete this income item?')) {
      try {
        await authFetch(`/income/${incomeId}`, {
          method: 'DELETE',
        });
        fetchIncome();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  // 2. Helper to handle the lock
  const handleAddClick = () => {
    if (isPremium) {
      openCreateModal();
    } else {
      alert("Please upgrade to Premium to add new income entries!");
    }
  };

  return (
    <>
      <div className="data-container">
        <h3>Income</h3>
        {/* 3. Use the helper and apply style */}
        <button 
          className="add-new-btn" 
          onClick={handleAddClick}
          style={{ opacity: isPremium ? 1 : 0.5, cursor: isPremium ? 'pointer' : 'not-allowed' }}
        >
          {isPremium ? '+ New' : '🔒 Locked'}
        </button>
        
        <div className="data-table-scrollable">
          <div className="data-table">
            <table>
              <thead>
                <tr><th>Name</th><th>Amount</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {income.length === 0 ? (
                  <tr><td colSpan="4">No data available in table</td></tr>
                ) : (
                  income.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.date}</td>
                      <td>
                        <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteIncome(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="stats-container" style={{ marginTop: '24px' }}>
        <h3>Stats</h3>
        <div className="chart-container-line">
          <LineGraph data={processedGraphData} lines={incomeGraphLines} />
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <IncomeForm onCancel={closeModal} onSave={handleSave} existingIncome={incomeToEdit} />
        </Modal>
      )}
    </>
  );
}

export default IncomeTrackerPage;