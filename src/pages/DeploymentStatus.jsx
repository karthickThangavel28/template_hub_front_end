import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function DeploymentStatus() {
  const { deploymentId } = useParams();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const res = await fetch(`/api/deploy/history`);
        const data = await res.json();
        if (data.success) setDeployment(data.deployment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployment();
  }, [deploymentId]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading deployment...</p>;
  }

  if (!deployment) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Deployment not found ❌</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>🎉 Website Deployed!</h1>
      <p>
        <a href={deployment.deployedUrl} target="_blank" rel="noreferrer">
          {deployment.deployedUrl}
        </a>
      </p>
    </div>
  );
}

export default DeploymentStatus;
