import { Fragment, useEffect, useState } from "react";
import { API } from "../config/api";
import "../Style/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Subscription() {
  const [status, setStatus] = useState<string>("free");
  const [expiry, setExpiry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch(`${API.auth}/auth/subscription`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStatus(data.subscriptionStatus);
          setExpiry(data.subscriptionExpiry);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = () => {
    if (!token) return;
    setLoading(true);
    fetch(`${API.auth}/auth/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.subscriptionStatus);
        setExpiry(data.subscriptionExpiry);
        alert("Subscription activated! You are now a Premium member.");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const formatExpiry = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Fragment>
      <div className="widt">
        <div className="row justify-content-center" style={{ marginTop: "60px" }}>
          <div className="col-lg-6">
            <div className="main-profile" style={{ textAlign: "center", padding: "40px" }}>
              <h2 style={{ marginBottom: "10px" }}>
                {status === "premium" ? "Premium Member" : "Free Plan"}
              </h2>

              {status === "premium" ? (
                <div>
                  <p style={{ fontSize: "1.1rem", color: "#28a745" }}>
                    Active until {formatExpiry(expiry)}
                  </p>
                  <p>Enjoy unlimited access to all premium manga content!</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "1.1rem", color: "#888" }}>
                    You are on the Free Plan.
                  </p>
                  <p>Upgrade to Premium for ₨999/month and unlock exclusive content.</p>
                  <button
                    className="searchButton"
                    onClick={handleSubscribe}
                    disabled={loading}
                    style={{ marginTop: "20px", padding: "12px 32px", fontSize: "1rem" }}
                  >
                    {loading ? "Processing..." : "Subscribe Now"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Subscription;
