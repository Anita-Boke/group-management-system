import { useState } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const SavingsUpdateForm = ({ member, groupId, onSave, onCancel }) => {
  const [savings, setSavings] = useState(member?.savings || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const groups = loadFromLocalStorage('groups') || [];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) return;

    const updatedGroup = { ...groups[groupIndex] };
    const memberIndex = updatedGroup.members.findIndex(m => m.id === member.id);
    
    if (memberIndex === -1) return;

    updatedGroup.members[memberIndex].savings = parseFloat(savings);
    groups[groupIndex] = updatedGroup;
    saveToLocalStorage('groups', groups);
    onSave();
  };

  return (
    <div className="card">
      <h2>Update Savings for {member?.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="flex">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <button type="button" className="btn btn-danger" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SavingsUpdateForm;