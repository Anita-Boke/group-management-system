import Link from 'next/link';
import { useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

const GroupList = ({ onGroupSelect, onEditGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedGroups = loadFromLocalStorage('groups') || [];
    setGroups(storedGroups);
    setLoading(false);
  }, []);

  const handleDelete = (groupId) => {
    const updatedGroups = groups.filter(group => group.id !== groupId);
    saveToLocalStorage('groups', updatedGroups);
    setGroups(updatedGroups);
    setSuccessMessage('Group deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="card">
      <h2>Groups</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {groups.length === 0 ? (
        <p>No groups found. Create your first group!</p>
      ) : (
        <table className="table-transparent w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td>
                  <Link href={`/groups/${group.id}`} legacyBehavior>
                    <a>{group.name}</a>
                  </Link>
                </td>
                <td>{group.description}</td>
                <td>{group.members.length}</td>
                <td>
                  <div className="flex">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onEditGroup(group)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(group.id)}
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

export default GroupList;