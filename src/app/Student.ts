export class Student {

  id: number
  name: string
  email: string
  mobile: string
  student_number: string
  nationality: string
  college: string

  constructor(id: number, name: string, email: string, mobile: string, student_number: string, nationality: string
    , college: string
  ) {
    this.college = college
    this.email = email
    this.id = id
    this.mobile = mobile
    this.name = name
    this.nationality = nationality
    this.student_number = student_number
  }

}
