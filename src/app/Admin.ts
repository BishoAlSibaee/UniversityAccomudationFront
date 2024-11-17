export class Admin {
  id: number
  name: string
  mobile: string
  email: string
  is_admin: number
  is_active: number

  constructor(id: number, name: string, mobile: string, email: string, is_admin: number, is_active: number) {
    this.id = id
    this.name = name
    this.mobile = mobile
    this.email = email
    this.is_admin = is_admin
    this.is_active = is_active
  }
}
