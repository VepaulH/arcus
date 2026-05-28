import AuthForm from './AuthForm'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  return <AuthForm initialMode={mode === 'login' ? 'login' : 'signup'} />
}
