import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/templates')
      .then(res => setTemplates(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || authLoading) return <div>Loading templates...</div>;

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Launch your site in seconds.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Choose a professionally designed template, customize it, and deploy to
          GitHub Pages instantly.
        </p>
      </div>

      {/* Templates */}
      <div className="grid">
        {templates.map(template => (
          <div key={template._id} className="card">
            {template.previewImage && (
              <img
                src={template.previewImage}
                alt={template.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                }}
              />
            )}

            <div style={{ padding: '0.5rem' }}>
              <span className="badge">{template.techStack}</span>

              <h3>{template.name}</h3>
              <p className="muted">{template.description}</p>

              {/* 🔥 Features */}
              {template.features?.length > 0 && (
                <ul style={{ fontSize: '0.85rem', paddingLeft: '1rem' }}>
                  {template.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}

              {/* 🔥 Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {/* Live Preview */}
                {template.previewUrl && (
                  <a
                    href={template.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Live Preview
                  </a>
                )}

                {/* GitHub Repo */}
                {template.sourceRepoUrl && (
                  <a
                    href={template.sourceRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    GitHub
                  </a>
                )}
              </div>

              {/* Use Template */}
              <div style={{ marginTop: '0.75rem' }}>
                {user ? (
                  <Link
                    to={`/configure/${template._id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Use Template
                  </Link>
                ) : (
                  <button
                    className="btn"
                    disabled
                    style={{
                      width: '100%',
                      background: '#334155',
                      cursor: 'not-allowed',
                    }}
                  >
                    Login to Use
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
