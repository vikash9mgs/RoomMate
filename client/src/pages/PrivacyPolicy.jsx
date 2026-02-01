import React from "react";
import Navbar from "../components/NavbarComponent";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow-lg w-100" style={{ maxWidth: "900px", marginTop:"70px"  }}>
          <div className="card-body p-5">
            <h1 className="card-title text-center  mb-4">Privacy Policy</h1>

            <p className="card-text mb-4">
              This Privacy Policy sets out the basis on which we’ll process any
              personal information (as defined below) we collect from you, or
              which you provide to us when you register and use our website or
              our mobile application (collectively, the “Platform”), or any
              services provided through the Platform (including when you post
              any adverts on the Platform). Please read the following carefully
              to understand how we use and protect the information you provide
              to us.
            </p>

            <p className="card-text mb-4">
              By browsing and/or using our website and/or our mobile
              application, or any services offered through the Platform, you’re
              consenting to our processing of your personal information in
              accordance with this Privacy Policy as set forth in the{" "}
              <a href="#" className="text-decoration-underline text-purple">
                Terms Of Use
              </a>
              . Terms not otherwise defined in the Privacy Policy have the same
              meaning as set forth in the Terms and Conditions.
            </p>

            <h5 className="mt-4 mb-3">Contacting Us</h5>

            <p className="card-text">
              1. When you provide personal information to us via the Platform,
              RoomMate (“we", "us", "our”), and in certain instances, as further
              explained in paragraph 2.7 below, the applicable third party, will
              be the data controller in respect of any such personal information
              you submit to us or which we collect from you when you use our
              Platform. “Personal Information” means any information relating to
              a living individual by which such individual may be personally
              identified. Personal Information may include first and last name,
              e-mail address, mailing address, telephone number, social security
              number and other identifying information. We are a company based
              out in Lucknow. Registered as GenTech Technologies. Address: 423
              NLIG 4th Block Hazaratganj, Lucknow Phone Number: 9831512165
            </p>
            <h5>Cookies and other tracking technologies</h5>
            <p>
              1. In common with other websites and mobile applications we use
              cookies and other tracking technologies to ensure that you get the
              most out of the site and to improve the service we offer. A cookie
              is a text file containing small amounts of information that are
              downloaded to your device when you access a website. The text file
              is then sent back to the server each time your browser requests a
              page from the server. This enables the web server to identify and
              track the web browser you are using.
              <br />
              2. Some cookies we use are necessary for our website to function
              properly and to enable you to move around the site and use its
              features. In addition we also use so called "functional" cookies,
              which allow our website to remember choices you’ve made in
              relation to the website, so as to provide a more personalized and
              enhanced user experience. Examples of the functional cookies we
              use on the site, and the information we collect through the use of
              those cookies, include those that remember details about your
              account preferences, including your password and login details,
              your search history and adverts you have posted to the site, the
              types of alerts and newsletters you have opted to receive and the
              types of adverts you are interested in hearing about.
              <br />
              3. As mentioned above, we may also use an analytics service
              provider, such as Google Analytics, for website and mobile
              application traffic analysis and reporting. Analytics service
              providers generate statistical and other information about website
              and mobile application use by means of tracking technologies
              including cookies that are stored on users' devices. The
              information generated relating to the Platform may be used to
              create reports about the use of the Platform - the analytics
              service provider will store this information.
              <br />
              4. Using Google AdWords code, we are able to see which pages
              helped lead to registering and, where applicable, upgrading. This
              allows us to make better use of our paid search budget on Google.
              You can also choose to opt-out of AdWords remarketing.
            </p>
            <h5>Changes to our privacy policy</h5>
            <p>
              We reserve the right to make changes to this privacy policy from
              time to time. Any such changes to our privacy policy will be
              posted to our Platform and, if we consider it to be appropriate,
              sent to you by e-mail.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
