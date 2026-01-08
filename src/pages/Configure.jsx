import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
    color: '#e5e7eb',
  },
  card: {
    background: '#0f172a',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.75rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#020617',
    color: '#e5e7eb',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.65rem 0.75rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#020617',
    color: '#e5e7eb',
    outline: 'none',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: 'white',
  },
  error: {
    background: '#7f1d1d',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    marginBottom: '1rem',
  },
  muted: {
    color: '#94a3b8',
    marginBottom: '1.5rem',
  },
};

function Configure() {
  const { id: templateId } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    repoName: '',
    personal: {
      name: '',
      title: '',
      email: '',
      bio: '',
    },
    hero: {
      description: '',
    },
    about: {
      description: [''],
      skills: [],
    },
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/templates/${templateId}`)
      .then(res => setTemplate(res.data))
      .catch(() => setError('Template not found'))
      .finally(() => setPageLoading(false));
  }, [templateId]);

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/deploy',
        {
          templateId,
          repoName: formData.repoName,
          configData: formData,
        },
        { withCredentials: true }
      );

      navigate(`/deploy/${res.data.deploymentId}`);
    } catch {
      setError('Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading template...</div>;
  }

  if (!template) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Template not found</div>;
  }

  return (
    <div style={styles.container}>
      <h2>
        Configure <span style={{ color: '#60a5fa' }}>{template.name}</span>
      </h2>
      <p style={styles.muted}>{template.description}</p>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>🚀 Deploying your website…</h3>
          <p style={styles.muted}>This may take 1–2 minutes</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Repo */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Repository</h3>
            <input
              style={styles.input}
              required
              placeholder="Repository name (my-portfolio)"
              value={formData.repoName}
              onChange={e =>
                setFormData(prev => ({ ...prev, repoName: e.target.value }))
              }
            />
          </div>

          {/* Personal */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>

            <input
              style={styles.input}
              placeholder="Full Name"
              value={formData.personal.name}
              onChange={e => handleNestedChange('personal', 'name', e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Title"
              value={formData.personal.title}
              onChange={e => handleNestedChange('personal', 'title', e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Email"
              value={formData.personal.email}
              onChange={e => handleNestedChange('personal', 'email', e.target.value)}
            />

            <textarea
              style={styles.textarea}
              rows="3"
              placeholder="Short bio"
              value={formData.personal.bio}
              onChange={e => handleNestedChange('personal', 'bio', e.target.value)}
            />
          </div>

          {/* Hero */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Hero Section</h3>
            <textarea
              style={styles.textarea}
              rows="3"
              placeholder="Hero description"
              value={formData.hero.description}
              onChange={e => handleNestedChange('hero', 'description', e.target.value)}
            />
          </div>

          {/* About */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>About Section</h3>

            <textarea
              style={styles.textarea}
              rows="4"
              placeholder="About paragraphs (one per line)"
              value={formData.about.description.join('\n')}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  about: {
                    ...prev.about,
                    description: e.target.value.split('\n'),
                  },
                }))
              }
            />

            <input
              style={styles.input}
              placeholder="Skills (comma separated)"
              value={formData.about.skills.join(', ')}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  about: {
                    ...prev.about,
                    skills: e.target.value.split(',').map(s => s.trim()),
                  },
                }))
              }
            />
          </div>

          <button type="submit" style={styles.button}>
            Deploy Website
          </button>
        </form>
      )}
    </div>
  );
}

export default Configure;
