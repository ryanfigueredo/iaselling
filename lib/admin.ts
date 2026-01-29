export const ADMIN_EMAILS = ['ryan@dmtn.com.br', 'arthur@dmtn.com.br']

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
