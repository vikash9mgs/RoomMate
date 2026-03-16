import React from 'react';
import NavbarComponent from '../components/NavbarComponent';
import Footer from '../components/Footer';

// Define the new color palette
const colors = {
  background: '#f4f7f6', // Soft light grey background
  contentBox: '#ffffff', // White content box
  text: '#3c4043', // Dark grey text for readability
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', // Soft shadow
};

// Define the updated styles object
const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '100px',
    marginBottom: '25px'
  },
  contentBox: {
    maxWidth: '1100px',
    width: '100%',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: colors.boxShadow,
    lineHeight: '1.7',
    fontSize: '16px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  subHeading: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  list: {
    paddingLeft: '20px',
  },
  contactParagraph: {
    marginTop: '30px',
  },
};

const TermsOfUse = () => {
  return (
    <>
      <NavbarComponent
        colorScheme={{
          backgroundColor: '#003366',
          textColor: '#ffffff',
        }}
      />

      <div style={styles.container}>
        <div style={styles.contentBox}>
          <h2 style={styles.heading}>Terms of Use</h2>

          <section>
            <p>
              Welcome to RoomMate. These Terms of Use ("Terms") govern your
              access to and use of our website, services, and applications
              (collectively, the "Service"). Please read them carefully before
              using the Service.
            </p>

            <p>
              These terms and conditions (the "Terms") constitute a legally
              binding contract between you, the user, and us. Please take the
              time to read these Terms carefully as they explain the legal
              relationship between you and us and will govern your use of the
              Platform and the services made available through it. By accessing
              or using the Platform and/or any content, materials or services
              made available through it you are agreeing to be legally bound by
              these Terms.
            </p>

            <p>
              We reserve the right to change these Terms from time to time in
              our sole discretion. Your use of the Platform will be subject to
              the most recent version of the Terms posted on the Platform at the
              time of such use.
            </p>

            <h4 style={styles.subHeading}>Registration</h4>
            <p>
              You do not need to register to browse some sections of the Site,
              but registration is required to access all features or post
              listings. Registered users are considered "Users", while
              non-registered visitors are "Guests".
            </p>
            <p>
              You’ll need to provide a valid email address and password to
              register. Additional personal information may also be required.
            </p>

            <h4 style={styles.subHeading}>Access and Use of the Platform</h4>
            <p>
              1. We do not charge fees to register an account.
              <br />
              2. Basic use like browsing and standard posting is free.
              <br />
              3. Premium features may require account upgrades.
            </p>

            <h4 style={styles.subHeading}>Account Registration</h4>
            <p>
              You are responsible for maintaining your login credentials and for
              all activity under your account.
            </p>

            <h4 style={styles.subHeading}>User Conduct</h4>
            <ul style={styles.list}>
              <li>No spamming, harassment, or abuse.</li>
              <li>No posting of false or misleading content.</li>
              <li>No illegal activity or violation of laws.</li>
            </ul>

            <h4 style={styles.subHeading}>Termination</h4>
            <p>
              We reserve the right to suspend or terminate your account for any
              violation of these Terms without prior notice.
            </p>

            <h4 style={styles.subHeading}>Changes to Terms</h4>
            <p>
              Terms may be updated periodically. Continued use of the service
              implies acceptance of any changes.
            </p>

            <h4 style={styles.subHeading}>Data Protection and Privacy</h4>
            <p>
              We will handle your data in accordance with our Privacy Policy.
              By using our service, you consent to this policy.
            </p>

            <h4 style={styles.subHeading}>General</h4>
            <p>
              1. These Terms and our Privacy Policy represent the entire
              agreement between you and us.
              <br />
              2. You may not transfer your rights under these Terms to others.
              <br />
              3. If any part of these Terms is deemed unenforceable, the
              remaining provisions will continue in effect.
            </p>

            <p style={styles.contactParagraph}>
              If you have any questions regarding these Terms, please contact us
              via our contact page.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsOfUse;
