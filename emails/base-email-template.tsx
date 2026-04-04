import {
  Body,
  Head,
  Html,
  pixelBasedPreset,
  Preview,
  Tailwind,
} from '@react-email/components';

export default function BaseEmailTemplate({
  previewText,
  emailTitle,
  children
}: {
  previewText: string,
  emailTitle: string,
  children: React.ReactNode
}) {

  return (
    <Html className='p-0 m-0'>
      <Head>
        <title>{emailTitle}</title>
      </Head>
      <Tailwind config={{
        presets: [pixelBasedPreset]
      }}>
        <Body className='bg-[#deb887] font-sans m-0 p-0'>
          <Preview>{previewText}</Preview>
          {children}
        </Body>
      </Tailwind>
    </Html>
  )

}