import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const GroupForm = ({ groupToEdit, onSave, onCancel }) => {
  const [group, setGroup] = useState({
    id: '',
    name: '',
    description: '',
    createdAt: new Date().toISOString(),
    members: []
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    savings: 0
  });

  useEffect(() => {
    if (groupToEdit) {
      setGroup(groupToEdit);
    } else {
      setGroup({
        id: '',
        name: '',
        description: '',
        createdAt: new Date().toISOString(),
        members: []
      });
    }
  }, [groupToEdit]);

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: name === 'savings' ? parseFloat(value) || 0 : value
    }));
  };

  const addMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    setGroup(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          ...newMember,
          id: Date.now().toString()
        }
      ]
    }));

    setNewMember({
      name: '',
      email: '',
      phone: '',
      savings: 0
    });
  };

  const removeMember = (memberId) => {
    setGroup(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const groups = loadFromLocalStorage('groups') || [];
    
    if (groupToEdit) {
      // Update existing group
      const updatedGroups = groups.map(g => 
        g.id === groupToEdit.id ? group : g
      );
      saveToLocalStorage('groups', updatedGroups);
    } else {
      // Create new group
      const newGroup = {
        ...group,
        id: Date.now().toString()
      };
      saveToLocalStorage('groups', [...groups, newGroup]);
    }
    
    onSave();
  };

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        {groupToEdit ? 'Edit Group' : 'Create New Group'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Group Name *</label>
          <input
            type="text"
            name="name"
            value={group.name}
            onChange={handleGroupChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={group.description}
            onChange={handleGroupChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Add Members</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm">Name *</label>
              <input
                type="text"
                name="name"
                value={newMember.name}
                onChange={handleMemberChange}
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={newMember.email}
                onChange={handleMemberChange}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm">Phone</label>
              <input
                type="tel"
                name="phone"
                value={newMember.phone}
                onChange={handleMemberChange}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm">Savings</label>
              <input
                type="number"
                name="savings"
                value={newMember.savings}
                onChange={handleMemberChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addMember}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
          >
            Add Member
          </button>
        </div>

        {group.members.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Current Members ({group.members.length})</h4>
            <div className="border rounded divide-y">
              {group.members.map(member => (
                <div key={member.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">Savings: ${member.savings.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {groupToEdit ? 'Update Group' : 'Create Group'}
          </button>
          
          {groupToEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GroupForm;