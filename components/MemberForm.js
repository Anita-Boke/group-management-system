import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const MemberForm = ({ groupId, memberToEdit, onSave, onCancel }) => {
  const [member, setMember] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    savings: 0
  });

  const [error, setError] = useState('');

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    if (memberToEdit) {
      setMember(memberToEdit);
    } else {
      setMember({
        id: '',
        name: '',
        email: '',
        phone: '',
        savings: 0
      });
    }
  }, [memberToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: name === 'savings' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!member.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const groups = loadFromLocalStorage('groups') || [];
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        setError('Group not found');
        return;
      }

      const updatedGroup = { ...groups[groupIndex] };
      const updatedMembers = updatedGroup.members ? [...updatedGroup.members] : [];

      if (memberToEdit) {
        // Update existing member
        const memberIndex = updatedMembers.findIndex(m => m.id === memberToEdit.id);
        if (memberIndex !== -1) {
          updatedMembers[memberIndex] = {
            ...member,
            savings: parseFloat(member.savings) || 0
          };
        }
      } else {
        // Add new member
        updatedMembers.push({
          ...member,
          id: Date.now().toString(),
          savings: parseFloat(member.savings) || 0
        });
      }

      updatedGroup.members = updatedMembers;
      groups[groupIndex] = updatedGroup;
      saveToLocalStorage('groups', groups);
      onSave();
    } catch (err) {
      console.error('Error saving member:', err);
      setError('Failed to save member. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2>{memberToEdit ? 'Edit Member' : 'Add New Member'}</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleChange}
            className="input"
          />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={member.phone}
            onChange={handleChange}
            className="input"
          />
        </div>
        
        <div className="form-group">
          <label>Initial Savings</label>
          <input
            type="number"
            name="savings"
            value={member.savings}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
          />
        </div>
        
        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            {memberToEdit ? 'Update Member' : 'Add Member'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;