import { Section, Column, Link, Text, Row, Container, Heading, } from "@react-email/components";
import BaseEmailTemplate from "./base-email-template";

export default function InviteTemplate({ senderName, familyName, inviteLink, firstName }: { senderName: string; familyName: string; inviteLink: string; firstName: string }) {
    const previewText = `${senderName} has invited you to join their family ${familyName} on Preserved Recipes`;

    return (
        <BaseEmailTemplate
            previewText={previewText}
            emailTitle={`Join ${familyName} on Preserved Recipes`}
        >
            <Container className="mx-auto" width={'100%'} style={{ minHeight: '100vh' }}>
                <Section className="bg-[#ffedd9] rounded-[8px] p-[60px_40px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                    <Row>
                        <Column className="text-center">
                            <Heading className="text-[32px] font-bold text-[#000000] mb-[10px]">
                                {`${firstName ? firstName : 'Friend'}, You're Invited!`}
                            </Heading>
                            <Text className="text-[18px] font-[Arial] text-[#333333] mb-[30px] leading-[1.6]">
                                {senderName ? senderName : 'Someone'} has invited you to join their family <strong>{familyName && `${familyName}`}</strong> {familyName && `${' '}`} and begin sharing and preserving recipes with your family!
                            </Text>
                            <Link
                                href={inviteLink}
                                className='bg-[#57de9a] text-black py-[16px] px-[40px] font-bold text-[16px] rounded-[6px] no-underline inline-block mb-[40px] cursor-pointer'
                                title="Accept Invitation"
                            >
                                Click here to begin!
                            </Link>
                            <Text className="text-[14px] font-[Arial] text-[#666666] mt-0">
                                Best,<br />
                                The Preserved Recipes Team
                            </Text>
                            <Text className="text-[12px] font-[Palatino] text-[#857b7b] mt-[20px]">
                                Learn more about{' '}
                                <Link title="Go to Preserved Recipes Homepage" href="https://preservedrecipes.com" className='text-[#6b4423] no-underline font-semibold'>
                                    Preserved Recipes
                                </Link>
                                {' '}or explore our{' '}
                                <Link title="Go to Preserved Recipes Communities" href="https://preservedrecipes.com/communities" className='text-[#6b4423] no-underline font-semibold'>
                                    Communities
                                </Link>
                                {' '}to share recipes and tips with others.
                            </Text>
                        </Column>
                    </Row>
                </Section>
            </Container>
        </BaseEmailTemplate>
    )
}