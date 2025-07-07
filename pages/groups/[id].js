import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MemberForm from '../../components/MemberForm';
import MemberList from '../../components/MemberList';
import SavingsUpdateForm from '../../components/SavingsUpdateForm'; 
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/storage';

export default function GroupDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (id) {
      const groups = loadFromLocalStorage('groups') || [];
      const foundGroup = groups.find(g => g.id === id);
      setGroup(foundGroup);
    }
  }, [id]);

  const refreshGroup = () => {
    const groups = loadFromLocalStorage('groups') || [];
    const foundGroup = groups.find(g => g.id === id);
    setGroup(foundGroup);
  };

  const handleEditMember = (member) => {
    setMemberToEdit(member);
    setShowMemberForm(true);
  };

  const handleSaveMember = () => {
    setShowMemberForm(false);
    setMemberToEdit(null);
    refreshGroup();
  };

  const handleCancelEdit = () => {
    setShowMemberForm(false);
    setMemberToEdit(null);
  };

  const handleUpdateSavings = (member) => {
    setSelectedMember(member);
    setShowSavingsForm(true);
  };

  const handleSaveSavings = () => {
    setShowSavingsForm(false);
    setSelectedMember(null);
    refreshGroup();
  };

  if (!group) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="container flex-between">
          <h1>{group.name}</h1>
          <div className="flex">
            <Link href="/groups" legacyBehavior>
              <a className="btn btn-primary">Back to Groups</a>
            </Link>
            <Link href="/" legacyBehavior>
              <a className="btn btn-primary">Home</a>
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="card">
          <h2>Group Details</h2>
          <p><strong>Name:</strong> {group.name}</p>
          <p><strong>Description:</strong> {group.description}</p>
          <p><strong>Created:</strong> {new Date(group.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Members:</strong> {group.members.length}</p>
          <p><strong>Total Savings:</strong> ${group.members.reduce((sum, member) => sum + parseFloat(member.savings || 0), 0).toFixed(2)}</p>
        </div>

        {showMemberForm ? (
          <MemberForm
            groupId={group.id}
            memberToEdit={memberToEdit}
            onSave={handleSaveMember}
            onCancel={handleCancelEdit}
          />
        ) : (
          <button 
            className="btn btn-primary mb-20" 
            onClick={() => setShowMemberForm(true)}
          >
            Add New Member
          </button>
        )}

        <MemberList
          groupId={group.id}
          members={group.members}
          onEditMember={handleEditMember}
          refreshMembers={refreshGroup}
        />

        {showSavingsForm && selectedMember && (
          <SavingsUpdateForm
            member={selectedMember}
            groupId={group.id}
            onSave={handleSaveSavings}
            onCancel={() => setShowSavingsForm(false)}
          />
        )}
      </main>
    </div>
  );
}