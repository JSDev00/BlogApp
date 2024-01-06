import React from 'react'
import "./verify-email.css";
import { Link,useParams } from "react-router-dom";
const VerifyEmail = () => {
    const isEmailVerified = true;
  return (
    <section className="verfiy-email">
    {isEmailVerified ? (
      <>
        <i className="bi bi-patch-check verify-email-icon"></i>
        <h1 className="verfiy-email-title">
          Your email address has been successfully verified
        </h1>
        <Link to="/login" className="verify-email-link">
          Go To Login Page
        </Link>
      </>
    ) : (
      <>
        <h1 className="verify-email-not-found">Not Found</h1>
      </>
    )}
  </section>
  )
}

export default VerifyEmail