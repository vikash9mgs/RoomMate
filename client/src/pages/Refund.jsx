import React from "react";
import Navbar from '../components/NavbarComponent';
import Footer from '../components/Footer';

const Refund = () => {
  return (
    <>
    <Navbar/>
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg w-100" style={{ maxWidth: "900px", marginTop:"70px" }}>
        <div className="card-body p-5">
          <h1 className="card-title text-center mb-4">Refund Policy</h1>

          <p className="text-muted text-end mb-4">
            Last Updated Date: October 3, 2022
          </p>

          <h5>1. GENERAL</h5>

          <p className="mb-2">
            A. This website with the URL of{" "}
            <a href="https://roommate.in">https://roommate.in</a>{" "}
            ("Website/Site") is operated by GenTech Technologies ("We/Our/Us").
          </p>

          <p className="mb-2">
            B. We are committed to providing our customers with the highest
            quality services. However, on rare occasions, services may be found
            to be deficient. In such cases, we offer refund in accordance with
            this Refund Policy ("Policy").
          </p>

          <p className="mb-2">
            C. You are advised to read our Terms and Conditions along with this
            Policy at the following webpage:{" "}
            <a href="https://roommate.in/terms-of-use">
              https://roommate.in/terms-of-use
            </a>
            .
          </p>

          <p className="mb-2">
            D. By using this website, you agree to be bound by the terms
            contained in this Policy without modification. If you do not agree
            to the terms contained in this Policy, you are advised not to
            transact on this website.
          </p>

          <p className="mb-2">
            E. We offer a 3 days refund policy for the eligible services.
          </p>

          <p className="mb-4">
            F. Please read this Policy before availing service on this website,
            so that you understand your rights as well as what you can expect
            from us if you are not happy with your purchase.
          </p>

          <h5>2. DEFINITIONS</h5>
          <p>
            A. "Business Days" - means a day that is not a Saturday, Sunday,
            public holiday, or bank holiday in India or in the state where our
            office is located.
          </p>
          <p>
            B. "Customer" - means a person who avails services for consideration
            and does not include commercial purchases.
          </p>
          <p>
            C. "Date of Transaction" - means the date of invoice of the service,
            which includes the date of renewal processed in accordance with the
            terms and conditions of the applicable service agreement.
          </p>
          <p>
            D. "Website" - means this website with the URL: https://roommate.in.
          </p>
          <h5>3. REFUNDS RULES</h5>
          <p>A. Every effort is made so as to service the orders placed, as per the specifications and timelines mentioned with respect to a Services. If due to any unforeseen circumstances or limitations from Our side, the service is not provided then such order stands cancelled and the amount paid by You is refunded.</p>
          <p>B. We will not process a refund if You have placed the order for the wrong service.</p>
          <p>C. When you make a qualifying refund request. We may refund the full amount, less any additional cost incurred by Us in providing such Services.</p>
          <p>D. Refund shall only be considered once the Customer concerned produces relevant documents and proof.</p>
          <p>E. Once qualified, the refunds are applied to the original payment option.</p>
          <p>F. The request for a refund of Services can be made in the following manner:</p>
          <p>If you want to remove your listing or placed the listing by mistake, you can email us on contact@roommate.in</p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Refund;
