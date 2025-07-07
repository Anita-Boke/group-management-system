import Link from 'next/link';
import { useRouter } from 'next/router';
import { loadFromLocalStorage } from '../../utils/storage';

export default function GroupsIndex() {
  const router = useRouter();
  const groups = loadFromLocalStorage('groups') || [];

  return (
    <div>
      <header className="header">
        <div className="container flex-between">
          <h1>All Groups</h1>
          <Link href="/" legacyBehavior>
            <a className="btn btn-primary">Back to Home</a>
          </Link>
        </div>
      </header>

      <main className="container">
        {groups.length === 0 ? (
          <div className="card">
            <p>No groups found. Create your first group!</p>
            <Link href="/" legacyBehavior>
              <a className="btn btn-primary mt-20">Create Group</a>
            </Link>
          </div>
        ) : (
          <div className="card">
            <h2>Select a Group</h2>
            <ul>
              {groups.map(group => (
                <li key={group.id} style={{ marginBottom: '10px' }}>
                  <Link href={`/groups/${group.id}`} legacyBehavior>
                    <a style={{ fontSize: '18px' }}>{group.name}</a>
                  </Link>
                  <p>{group.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}