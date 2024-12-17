describe('Open Energy Tests', () => {
   
  
    it('Basic Open Energy Journey', () => {
      const expectedUrl = 'https://hipages-csapp-qa01.cimet.io/open-energy/v2/register';     
  
      cy.visit(expectedUrl);     //Visit the URL
  
      // Verify the current URL
      cy.url().should('eq', expectedUrl);
      cy.log('Success: The URL is correct');
  
      
  
    });
  });
  