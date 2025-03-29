const mjml2html = require('mjml');

function renderEmail({ firstName, senderName, familyName, inviteLink }) {
    const mjmlTemplate = `
        <mjml>
            <mj-body>
                <mj-section>
                    <mj-column>
                        <mj-text>
                            Hey ${firstName}!
                        </mj-text>
                        <mj-text>
                            ${senderName} has invited you to join their family ${familyName} on Preserved Recipes.
                        </mj-text>
                        <mj-button href="${inviteLink}">
                            Join Now
                        </mj-button>
                    </mj-column>
                </mj-section>
            </mj-body>
        </mjml>
    `;

    const { html, errors } = mjml2html(mjmlTemplate);

    if (errors.length > 0) {
        console.error('MJML Errors:', errors);
        throw new Error('Failed to render MJML template');
    }

    return html;
}

if (require.main === module) {
    let input = '';

    // Read input from stdin
    process.stdin.on('data', (chunk) => {
        input += chunk;
    });

    process.stdin.on('end', () => {
        try {
            const parsedInput = JSON.parse(input);
            console.log('Input received in generateEmailTemplate.js:', parsedInput); // Debugging
            const html = renderEmail(parsedInput);
            process.stdout.write(html);
        } catch (error) {
            console.error('Error parsing input:', error);
            process.exit(1);
        }
    });
}

module.exports = renderEmail;