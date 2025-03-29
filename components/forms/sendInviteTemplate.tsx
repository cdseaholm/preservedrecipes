import mjml2html from 'mjml';

export function generateInviteEmail({ 
  firstName, 
  senderName, 
  familyName, 
  inviteLink 
}: { 
  firstName: string, 
  senderName: string, 
  familyName: string, 
  inviteLink: string 
}) {
  // Create MJML directly as a string template
  const mjmlTemplate = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all padding="0px" />
          <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px" />
          <mj-section background-color="#ffffff" />
          <mj-class name="preheader" color="#000000" font-size="11px" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#deb887">
        <mj-section padding-bottom="20px" padding-top="10px">
          <mj-column width="100%">
            <mj-text align="center" padding="10px 25px" font-size="20px" color="#512d0b"><strong>${firstName}</strong></mj-text>
            <mj-text align="center" font-size="18px" font-family="Arial">${senderName} has invited you to join their family ${familyName} on Preserved Recipes</mj-text>
            <mj-button background-color="#8bb420" color="#FFFFFF" href="${inviteLink}" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px">Join now</mj-button>
            <mj-text align="center" color="#000000" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">Best, <br /> The Preserved Recipes Team</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  // Convert MJML to HTML
  const { html, errors } = mjml2html(mjmlTemplate);
  
  if (errors && errors.length > 0) {
    console.error("MJML conversion errors:", errors);
  }
  
  return html;
}