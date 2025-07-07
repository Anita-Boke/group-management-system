import { useState } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const MemberList = ({ groupId, members, onEditMember, refreshMembers }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = (memberId) => {
    const groups = loadFromLocalStorage('groups') || [];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) return;

    const updatedGroup = { ...groups[groupIndex] };
    updatedGroup.members = updatedGroup.members.filter(m => m.id !== memberId);
    
    groups[groupIndex] = updatedGroup;
    saveToLocalStorage('groups', groups);
    setSuccessMessage('Member deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    refreshMembers();
  };

  const handleUpdateSavings = (memberId, newSavings) => {
    const groups = loadFromLocalStorage('groups') || [];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) return;

    const updatedGroup = { ...groups[groupIndex] };
    const memberIndex = updatedGroup.members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) return;

    updatedGroup.members[memberIndex].savings = parseFloat(newSavings);
    groups[groupIndex] = updatedGroup;
    saveToLocalStorage('groups', groups);
    setSuccessMessage('Savings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    refreshMembers();
  };

  return (
    <div className="card">
      <h2>Members</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {members.length === 0 ? (
        <p>No members in this group yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Savings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <input
                    type="number"
                    value={member.savings}
                    onChange={(e) => handleUpdateSavings(member.id, e.target.value)}
                    min="0"
                    step="0.01"
                    style={{ width: '80px' }}
                  />
                </td>
                <td>
                  <div className="flex">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onEditMember(member)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberList;