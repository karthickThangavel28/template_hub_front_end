import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConfigureStepper.css";


/* ================= STEPS ================= */
const STEPS = [
  "Repository",
  "Personal",
  "Hero",
  "About",
  "Experience",
  "Projects",
  "Contact",
  "Review & Deploy",
];

function ConfigureStepper() {
  const { id: templateId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= DATA STATE ================= */

  const [repoName, setRepoName] = useState("");

  const [userImage, setUserImage] = useState(null);

  const [personal, setPersonal] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    bio: "",
  });

  const [hero, setHero] = useState({
    greeting: "Hi, I'm",
    description: "",
    primaryButton: { text: "View My Work", link: "#projects" },
    secondaryButton: { text: "Get In Touch", link: "#contact" },
  });

  const [about, setAbout] = useState({
    description: [],
    skills: [],
  });

  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);

  const [contact, setContact] = useState({
    title: "Let's Work Together",
    description: "",
    socialLinks: [],
  });

  /* ================= HELPERS ================= */

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* ================= EXPERIENCE ================= */

  const addExperience = () =>
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        duration: "",
        location: "",
        description: "",
        achievements: [],
        technologies: [],
      },
    ]);

  const updateExperience = (i, field, value) => {
    const copy = [...experiences];
    copy[i][field] = value;
    setExperiences(copy);
  };

  /* ================= PROJECTS ================= */

  const addProject = () =>
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        featured: false,
        images: [],
      },
    ]);

  const updateProject = (i, field, value) => {
    const copy = [...projects];
    copy[i][field] = value;
    setProjects(copy);
  };

  const updateProjectImages = (i, files) => {
    const copy = [...projects];
    copy[i].images = Array.from(files);
    setProjects(copy);
  };

  /* ================= SUBMIT ================= */

  const handleDeploy = async () => {
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("templateId", templateId);
      fd.append("repoName", repoName);

      fd.append(
        "configData",
        JSON.stringify({
          personal,
          hero,
          about,
          experience: experiences,
          projects: projects.map((p) => ({ ...p, images: [] })),
          contact,
        })
      );

      if (userImage) fd.append("userImage", userImage);

      projects.forEach((p) =>
        p.images.forEach((img) => fd.append("projectImages", img))
      );

      const res = await axios.post(
        "http://localhost:5000/api/deploy",
        fd,
        { withCredentials: true }
      );

      navigate(`/deploy/${res.data.deploymentId}`);
    } catch {
      setError("Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP UI ================= */

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h2>Configure Portfolio</h2>
      <p>
        Step {step + 1} / {STEPS.length} — <b>{STEPS[step]}</b>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= STEP CONTENT ================= */}

      {step === 0 && (
        <>
          <input
            placeholder="Repository name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
        </>
      )}

      {step === 1 && (
        <>
          <input placeholder="Name" onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
          <input placeholder="Title" onChange={(e) => setPersonal({ ...personal, title: e.target.value })} />
          <input placeholder="Email" onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
          <input placeholder="Phone" onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
          <input placeholder="Location" onChange={(e) => setPersonal({ ...personal, location: e.target.value })} />
          <input placeholder="Website" onChange={(e) => setPersonal({ ...personal, website: e.target.value })} />
          <input placeholder="LinkedIn" onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} />
          <input placeholder="GitHub" onChange={(e) => setPersonal({ ...personal, github: e.target.value })} />
          <textarea placeholder="Bio" onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />

          <input type="file" accept="image/*" onChange={(e) => setUserImage(e.target.files[0])} />
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="Greeting" onChange={(e) => setHero({ ...hero, greeting: e.target.value })} />
          <textarea placeholder="Hero description" onChange={(e) => setHero({ ...hero, description: e.target.value })} />
        </>
      )}

      {step === 3 && (
        <>
          <textarea
            placeholder="About (one paragraph per line)"
            onChange={(e) =>
              setAbout({ ...about, description: e.target.value.split("\n") })
            }
          />
          <input
            placeholder="Skills (comma separated)"
            onChange={(e) =>
              setAbout({
                ...about,
                skills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </>
      )}

      {step === 4 && (
        <>
          {experiences.map((exp, i) => (
            <div key={i}>
              <input placeholder="Company" onChange={(e) => updateExperience(i, "company", e.target.value)} />
              <input placeholder="Position" onChange={(e) => updateExperience(i, "position", e.target.value)} />
              <input placeholder="Duration" onChange={(e) => updateExperience(i, "duration", e.target.value)} />
              <textarea placeholder="Description" onChange={(e) => updateExperience(i, "description", e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={addExperience}>+ Add Experience</button>
        </>
      )}

      {step === 5 && (
        <>
          {projects.map((p, i) => (
            <div key={i}>
              <input placeholder="Title" onChange={(e) => updateProject(i, "title", e.target.value)} />
              <textarea placeholder="Description" onChange={(e) => updateProject(i, "description", e.target.value)} />
              <input placeholder="GitHub URL" onChange={(e) => updateProject(i, "githubUrl", e.target.value)} />
              <input placeholder="Live URL" onChange={(e) => updateProject(i, "liveUrl", e.target.value)} />
              <input type="file" multiple accept="image/*" onChange={(e) => updateProjectImages(i, e.target.files)} />
            </div>
          ))}
          <button type="button" onClick={addProject}>+ Add Project</button>
        </>
      )}

      {step === 6 && (
        <>
          <input placeholder="Contact Title" onChange={(e) => setContact({ ...contact, title: e.target.value })} />
          <textarea placeholder="Contact Description" onChange={(e) => setContact({ ...contact, description: e.target.value })} />
        </>
      )}

      {step === 7 && (
        <>
          <pre style={{ background: "#111", padding: "1rem" }}>
            {JSON.stringify(
              { personal, hero, about, experiences, projects, contact },
              null,
              2
            )}
          </pre>
        </>
      )}

      {/* ================= NAV ================= */}
      <div style={{ marginTop: "1rem" }}>
        {step > 0 && <button onClick={prev}>Back</button>}
        {step < STEPS.length - 1 && <button onClick={next}>Next</button>}
        {step === STEPS.length - 1 && (
          <button onClick={handleDeploy} disabled={loading}>
            {loading ? "Deploying..." : "🚀 Deploy"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ConfigureStepper;
