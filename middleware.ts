import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/conta',
  },
})

export const config = {
  matcher: ['/admin'],
}
