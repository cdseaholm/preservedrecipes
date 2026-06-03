import { Section, Column, Link, Text, Row, Container, Heading } from "@react-email/components";
import BaseEmailTemplate from "./base-email-template";

export default function CommunityInviteTemplate({
    senderName,
    communityName,
    profileLink,
    firstName,
}: {
    senderName: string;
    communityName: string;
    profileLink: string;
    firstName: string;
}) {
    const previewText = `${senderName} has invited you to join ${communityName} on Preserved Recipes`;

    return (
        <BaseEmailTemplate
            previewText={previewText}
            emailTitle={`Join ${communityName} on Preserved Recipes`}
        >
            <Container className="mx-auto" width={'100%'} style={{ minHeight: '100vh' }}>
                <Section className="bg-[#ffedd9] rounded-[8px] p-[60px_40px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                    <Row>
                        <Column className="text-center">
                            <Heading className="text-[32px] font-bold text-[#000000] mb-[10px]">
                                {`${firstName || 'Friend'}, You're Invited!`}
                            </Heading>
                            <Text className="text-[18px] font-[Arial] text-[#333333] mb-[30px] leading-[1.6]">
                                {senderName || 'Someone'} has invited you to join <strong>{communityName}</strong> and share recipes, posts, and cooking ideas with the community.
                            </Text>
                            <Link
                                href={profileLink}
                                className='bg-[#57de9a] text-black py-[16px] px-[40px] font-bold text-[16px] rounded-[6px] no-underline inline-block mb-[40px] cursor-pointer'
                                title="View Invitation"
                            >
                                View your invite
                            </Link>
                            <Text className="text-[14px] font-[Arial] text-[#666666] mt-0">
                                Best,<br />
                                The Preserved Recipes Team
                            </Text>
                        </Column>
                    </Row>
                </Section>
            </Container>
        </BaseEmailTemplate>
    );
}
