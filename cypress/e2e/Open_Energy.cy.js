describe('Open Energy Tests', () => {
  const defaultPhoneNumber = '0450000000';        //defaultPhoneNumber: A fallback phone number if the file is unavailable.
  const phoneNumberFilePath = 'phoneNumber.json';    //phoneNumberFilePath: Path to store the phone number for persistence between test runs.
  let phoneNumber;    //phoneNumber: Stores the current phone number being used in the test.

  before(() => {
    // Read the phone number file, fallback to default if the file doesn't exist
    cy.readFile(phoneNumberFilePath, { timeout: 5000, failOnNonExisting: false })
      .then((data) => {
        phoneNumber = data?.lastPhoneNumber || defaultPhoneNumber;
      });
  });

  after(() => {
    // Save the updated phone number back to the file
    cy.writeFile(phoneNumberFilePath, { lastPhoneNumber: phoneNumber });
  });

  it('Basic Open Energy Journey', () => {
    const expectedUrl = 'https://hipages-csapp-qa01.cimet.io/open-energy/v2/register';     

    cy.visit(expectedUrl);     //Visit the URL

    // Verify the current URL
    cy.url().should('eq', expectedUrl);
    cy.log('Success: The URL is correct');

    // Increment the phone number
    const numericPhone = parseInt(phoneNumber, 10) + 1;
    phoneNumber = `0${numericPhone}`;

    // Visit the registration page
    //cy.visit('/register'); // Replace with your actual registration page URL

    // Fill in the registration form
    cy.get("input[placeholder='John']").type('Ankit Cypress');    //Type first Name
    cy.get("input[placeholder='Doe']").type('Test');              //Type Last Name
    cy.get("input[placeholder='example@gmail.com']").type(`testuser${numericPhone}@yopmail.com`);    //Type Email
    cy.get("input[placeholder='04xx xxx xxx']").type(phoneNumber);        //Type Phone Number

    cy.wait(2000);

    // Submit the form
    cy.get("button[type='submit']").click();                     //Click on Registration

// Type otp
    cy.get("input[aria-label='Please enter verification code. Digit 1']").type('5');  
cy.get("input[aria-label='Digit 2']").type('7');
cy.get("input[aria-label='Digit 3']").type('7');
cy.get("input[aria-label='Digit 4']").type('5');

//Submit otp
cy.get("button[type='submit']").click();

cy.wait(3000);


//CDR page Popup
// cy.get("button[class='sc-6392884d-0 sc-6392884d-1 exNNAT ckOEOs']").click();
cy.get('button:contains("Let’s start now")').click();       //Procced to fiskl Journey


//proceed to CDR consent button
cy.get("button[class='sc-6392884d-0 sc-6392884d-1 sc-ace91e74-1 exNNAT ckOEOs eKPPXU']").click();

cy.wait(5000);

//Allow share your data permission

cy.get("#btn-allow").click();
cy.wait(5000);

//Select your retailer
//cy.get(".MuiTypography-root.MuiTypography-body2.mui-style-31mhg0").click();
cy.get(".mui-style-41qv6o > .MuiTypography-root").click();
cy.wait(5000); 

//Enter your email
cy.get("input[placeholder='Enter your email']").type("ankittesting@yopmail.com");
cy.wait(5000);

//Get code button
cy.get("button[type='submit']").click();
cy.wait(5000);



// Check OTP content via Yopmail
cy.window().then((win) => {
  const yopmailUrl = 'https://yopmail.com/en/';
  const newTab = win.open(yopmailUrl, '_blank');
  cy.wrap(newTab).then((tab) => {
    cy.wait(5000); // Wait for the new tab to load

    cy.visit(yopmailUrl);
    cy.get('#login').type('ankittesting@yopmail.com'); // Type the email address
    cy.wait(5000);
    cy.get('.material-icons-outlined.f36').click(); // Click on the check email button
    cy.wait(10000);
    // Extract the OTP from the email body

    
   // Use the XPath selector to locate the element

// Wait for the iframe to be visible
cy.get('#ifmail').should('be.visible');

cy.wait(10000);
// Access the iframe content
cy.get('#ifmail')
  .its('0.contentDocument.body') // Access the iframe's body
  .should('not.be.empty') // Ensure the iframe has loaded
  .then(cy.wrap) // Wrap the body for further Cypress commands
  .within(() => {
    // Locate the OTP element and log its content
    cy.get('p[style*="color: rgba(55, 55, 55, 1);"][style*="font-size: 48px;"]')
      .invoke('text')
      .then((otp) => {
        const trimmedOtp = otp.trim(); // Trim any extra spaces
        cy.log('Extracted OTP:', trimmedOtp); // Log the OTP
        if (trimmedOtp) {
        // Use OTP in further actions if needed
        Cypress.env('otp', trimmedOtp); 
        }
        else {
          cy.log('OTP extraction failed: OTP is empty or undefined');
        }
      });
  });

  cy.wait(3000);

 
// Step 2: Visit the target URL where the OTP needs to be entered
cy.visit('https://auth.sandbox.cdr.dataholder.fiskil.com/verify-otp/?email=ankittesting%40yopmail.com');


// Step 3: Wait for the page to load (optional, adjust timing as needed)
cy.wait(5000); // You can adjust this wait time depending on your page's load time
// Step 4: Ensure OTP is available in Cypress.env
cy.then(() => {
  const otp = Cypress.env('otp');
  if (otp) {
    expect(otp).to.exist; // Ensure OTP exists
    cy.log('OTP is available:', otp); // Log the OTP
    // Step 5: Paste OTP into the input field (assuming it's in 6 separate input boxes)
    cy.get('[aria-label="Please enter OTP character 1"]').clear().type(otp, { delay: 0 }); // Type OTP into the first input box
  } else {
    cy.log('OTP is not available, cannot type into input field');
  }
});

})

})
cy.wait(5000);
//Select meter one
cy.get('[data-cy="accounts-container"] > :nth-child(1)').click();
cy.wait(3000);

//Select meter two 
cy.get('[data-cy="accounts-container"] > :nth-child(2)').click();
//Click to continue

cy.get('[data-cy="confirm"]').click();
cy.wait(5000);
//Review and submit fiskl page
 cy.get('[data-cy="confirm-consent"]').click();

 cy.wait(10000);
// cy.wait(20000);
cy.reload();
cy.wait(20000);

//cy.get("button[type='submit']").click();
cy.get(':nth-child(2) > .sc-f6926cfa-0 > .sc-53066297-0 > :nth-child(1) > .sc-c5525174-1 > .bfridt > :nth-child(3)').click(); //Check title Mr

//CheckDOB
cy.get('input[name="dateOfBirth"]')  // Select input by name attribute
  .clear()                           // Clear any prefilled value
  .type('15/08/1995');               // Type the date in DD/MM/YYYY format


cy.get(':nth-child(3) > .sc-f6926cfa-0 > .sc-53066297-0 > .sc-c5525174-1 > .bfridt > :nth-child(2)').click(); //Life Support No
cy.get('.sc-29e3e510-3 > .sc-c5525174-1 > .bfridt > :nth-child(2)').click(); //Click AP
cy.get('.sc-29e3e510-3 > .sc-5f2589e-0 > :nth-child(1) > .sc-c2fffe2d-4 > .sc-c2fffe2d-0 > .sc-c2fffe2d-1 > .sc-6e8c36d4-9').type("121212"); //Type AP NO. 
//AP Expiry Date
cy.get('input[name="primary.passport_expiry_date"]')  // Select input by name attribute
  .clear()                                           // Clear any existing value
  .type('31/12/2030{enter}');                        // Type the date and press Enter
                        
  cy.wait(3000);

  cy.get('div.concession label:last-child').click();   //Concession NO 



//Concession Details No
cy.get(':nth-child(6) > .sc-f6926cfa-0 > .sc-53066297-0 > .sc-c5525174-1 > .bfridt > :nth-child(2)').click(); //Business Details No
cy.get('.sc-6392884d-0').click();  //To final step CTA

//cy.get('.sc-b5924bec-1 > .sc-6e8c36d4-9 > p').click();  //check agreement 
cy.contains('I have read, understood and accept the terms and conditions').parent().find('input[type="checkbox"]').check();

cy.get('.sc-6392884d-0').click();  //agree and continue 
cy.wait(5000);
cy.contains('button', 'Access dashboard').click();
cy.wait(20000);
cy.reload();





  });
});
