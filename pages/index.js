import { useState } from 'react';
import Link from 'next/link';
import GroupForm from '../components/GroupForm';
import GroupList from '../components/Grouplist';
import { loadFromLocalStorage } from '../utils/storage';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [groups, setGroups] = useState([]);

  const loadGroups = () => {
    const storedGroups = loadFromLocalStorage('groups') || [];
    setGroups(storedGroups);
  };

  const handleEditGroup = (group) => {
    setGroupToEdit(group);
    setShowForm(true);
  };

  const handleSaveGroup = () => {
    setShowForm(false);
    setGroupToEdit(null);
    loadGroups();
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setGroupToEdit(null);
  };

  return (
    <div>
      <header className="header">
        <div className="container flex-between">
          <h1>Group Management System</h1>
          <Link href="/" legacyBehavior>
            <a className="btn btn-primary">Home</a>
          </Link>
        </div>
      </header>

      <main className="container">
        {showForm ? (
          <GroupForm 
            groupToEdit={groupToEdit} 
            onSave={handleSaveGroup} 
            onCancel={handleCancelEdit}
          />
        ) : (
          <button 
            className="btn btn-primary mb-20" 
            onClick={() => setShowForm(true)}
          >
            Create New Group
          </button>
        )}

        <GroupList 
          onGroupSelect={(group) => console.log('Selected:', group)}
          onEditGroup={handleEditGroup}
        />
      </main>
    </div>
  );
}