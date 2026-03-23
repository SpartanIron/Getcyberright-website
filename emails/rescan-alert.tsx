// PHASE 2: Re-scan Alert Email Template
//
// Subject: "New exposure detected for your information"
//
// Body:
// "New exposure detected for [name]. Since your last scan,
// your information appeared on [X] new sites.
// Log in to see what changed."
//
// Dynamic variables (all placeholders):
// - [name]: User's first name + last name
// - [X]: Number of new exposure sites found
// - [newSites]: List of newly detected broker names
// - [scanDate]: Date of the re-scan
// - [resultsUrl]: Link to updated results page
//
// Implementation notes:
// - Use Resend API for delivery
// - Plain-text version required alongside HTML
// - Include unsubscribe link (opted_in toggle)
// - HIBP attribution required if breach data is included
