import React, { useEffect } from "react";
import { Link, Sections, Section, TableOfContents } from "components/articles";

const PrivacyPolicy = () => {
    useEffect(() => {document.title = "Privacy Policy - OneMark"}, []);

    return (
        <div className="privacy-policy light">
            <div className="title">
                <h1 className="header">Privacy Notice</h1>
                <h3>Last updated March 23, 2020</h3>
            </div>
            <p>Thank you for choosing to be part of our community at OneMark (“Company”, “we”, “us”, or “our”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our notice, or our practices with regards to your personal information, please contact us at mohamed.sihly@gmail.com.</p>
            <p>When you visit our website <Link href="onemark.herokuapp.com" isNewTab>onemark.herokuapp.com</Link>, and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Sites and our services.</p>
            <p>This privacy notice applies to all information collected through our website (such as <Link href="onemark.herokuapp.com" isNewTab>onemark.herokuapp.com</Link>), and/or any related services, sales, marketing or events (we refer to them collectively in this privacy notice as the "Services").</p>
            <p>Please read this privacy notice carefully as it will help you make informed decisions about sharing your personal information with us.</p>

            <TableOfContents hashPrefix="section">
                <li>What information do we collect?</li>
                <li>How do we use your information?</li>
                <li>Will your information be shared with anyone?</li>
                <li>Do we use cookies and other tracking technologies?</li>
                <li>How long do we keep your information?</li>
                <li>How do we keep your information safe?</li>
                <li>Do we collect information from minors?</li>
                <li>Controls for do-not-track features</li>
                <li>Do california residents have specific privacy rights?</li>
                <li>Do we make updates to this policy?</li>
                <li>How can you contact us about this policy?</li>
                <li>How can you review, update, or delete the data we collect from you?</li>
            </TableOfContents>

            <Sections hashPrefix="section">
                <Section header="What information do we collect?" subheading="Information automatically collected"
                    summary="Some information — such as IP address and/or browser and device characteristics — is collected automatically when you visit our Services.">
                    <p>We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact
                        information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring
                        URLs, device name, country, location, information about how and when you use our Services and other technical information. This information is primarily needed to maintain
                        the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
                    <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
                </Section>

                <Section header="How do we use your information?"
                    summary="We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.">
                    <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance
                        on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate
                        the specific processing grounds we rely on next to each purpose listed below.</p>
                    <p>We use the information we collect or receive:</p>
                    <ul>
                        <li>To facilitate account creation and logon process. If you choose to link your account with us to a third party account (such as your Google or Facebook account), we use
                            the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.</li>
                        <li>To send administrative information to you. We may use your personal information to send you product, service and new feature information and/or information about changes
                            to our terms, conditions, and policies.</li>
                        <li>To protect our Services. We may use your information as part of our efforts to keep our Services safe and secure (for example, for fraud monitoring and prevention).</li>
                        <li>To manage user accounts. We may use your information for the purposes of managing our account and keeping it in working order.</li>
                        <li>To deliver services to the user. We may use your information to provide you with the requested service.</li>
                    </ul>
                </Section>

                <Section header="Will your information be shared with anyone?"
                    summary="We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.">
                    <p>We may process or share data based on the following legal basis:</p>
                    <ul>
                        <li><b>Consent:</b> We may process your data if you have given us specific consent to use your personal information in a specific purpose.</li>
                        <li><b>Legitimate Interests:</b> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                        <li><b>Performance of a Contract:</b> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
                        <li><b>Legal Obligations:</b> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial
                            proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law
                            enforcement requirements).</li>
                        <li><b>Vital Interests:</b> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our
                            policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
                    </ul>
                    <p>More specifically, we may need to process your data or share your personal information in the following situations:</p>
                    <ul>
                        <li><b>Vendors, Consultants and Other Third-Party Service Providers:</b> We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service and marketing efforts. We may allow selected third parties to use tracking technology on the Services, which will enable them to collect data about how you interact with the Services over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information with third parties for their promotional purposes.</li>
                        <li><b>Business Transfers:</b> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                        <li><b>Third-Party Advertisers:</b> We may use third-party advertising companies to serve ads when you visit the Services. These companies may use information about your visits to our Website(s) and other websites that are contained in web cookies and other tracking technologies in order to provide advertisements about goods and services of interest to you.</li>
                        <li><b>Legal Obligations:</b> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).</li>
                        <li><b>Vital Interests:</b> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
                    </ul>
                </Section>

                <Section header="Do we use cookies and other tracking technologies?" summary="We may use cookies and other tracking technologies to collect and store your information.">
                    <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
                </Section>

                <Section header="How long do we keep your information?" summary="We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.">
                    <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>
                    <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
                </Section>

                <Section header="How do we keep your information safe?" summary="We aim to protect your personal information through a system of organizational and technical security measures.">
                    <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the services within a secure environment.</p>
                </Section>

                <Section header="Do we collect information from minors?" summary="We do not knowingly collect data from or market to children under 18 years of age.">
                    <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under age 18, please contact us at mohamed.sihly@gmail.com.</p>
                </Section>

                <Section header="What are your privacy rights?" summary="You may review, change, or terminate your account at any time.">
                    <p>If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: <Link href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" isNewTab>
                        http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</Link>.</p>
                    <p>If you have questions or comments about your privacy rights, you may email us at mohamed.sihly@gmail.com.</p>
                    <h3>Account Information</h3>
                        <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
                            <ul><li>Log into your account settings and update your user account.</li></ul>
                        <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.</p>
                        <p>Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt-out of interest-based advertising by advertisers on our Services visit <Link href="http://www.aboutads.info/choices/" isNewTab>http://www.aboutads.info/choices/</Link>.</p>
                        <p>Opting out of email marketing: You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list – however, we will still need to send you service-related emails that are necessary for the administration and use of your account. To otherwise opt-out, you may:</p>
                            <ul><li>Access your account settings and update preferences.</li></ul>
                </Section>

                <Section header="Controls for do-not-track features">
                    <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</p>
                </Section>

                <Section header="Do california residents have specific privacy rights?" summary="Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.">
                    <p>California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>
                    <p>If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from our systems.</p>
                </Section>

                <Section header="Do we make updates to this policy?" summary="Yes, we will update this policy as necessary to stay compliant with relevant laws.">
                    <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
                </Section>

                <Section header="How can you contact us about this policy?">
                    <p>If you have questions or comments about this policy, you may email us at mohamed.sihly@gmail.com or by post to:</p>
                    <p>OneMark</p>
                    <p>__________</p>
                    <p>__________, NY</p>
                    <p>United States</p>
                </Section>

                <Section header="How can you review, update, or delete the data we collect from you?">
                    <p>Based on the laws of some countries, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please submit a request form by clicking here. We will respond to your request within 30 days.</p>
                </Section>
            </Sections>
        </div>
    );
};

export default PrivacyPolicy;